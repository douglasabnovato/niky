/*
 * TurmaService · CRUD de turmas, matrículas com limite de vagas, monitor único e presenças.
 */
const { HttpError, fromSqlite } = require('../lib/errors')

const FIELDS = ['atividade_id', 'instrutor_id', 'monitor_aluno_id', 'capacidade_maxima', 'horario', 'duracao_minutos', 'data_inicial', 'data_final']

class TurmaService {
    /* Prepara as consultas uma vez. */
    constructor(db) {
        this.db = db
        this.listStmt = db.prepare(`
            SELECT t.*, a.nome AS atividade, i.nome AS instrutor,
                   (SELECT count(*) FROM matriculas m WHERE m.turma_id = t.id) AS matriculados
            FROM turmas t JOIN atividades a ON a.id = t.atividade_id JOIN instrutores i ON i.id = t.instrutor_id
            ORDER BY t.horario`)
        this.getStmt = db.prepare(`
            SELECT t.*, a.nome AS atividade, i.nome AS instrutor
            FROM turmas t JOIN atividades a ON a.id = t.atividade_id JOIN instrutores i ON i.id = t.instrutor_id
            WHERE t.id = ?`)
        this.alunosStmt = db.prepare(`
            SELECT m.id AS matricula_id, al.id AS aluno_id, al.nome, al.codigo_matricula,
                   sum(p.presente) AS presencas, count(p.id) - coalesce(sum(p.presente), 0) AS ausencias
            FROM matriculas m JOIN alunos al ON al.id = m.aluno_id LEFT JOIN presencas p ON p.matricula_id = m.id
            WHERE m.turma_id = ? GROUP BY m.id ORDER BY al.nome`)
        this.insertStmt = db.prepare(`INSERT INTO turmas (${FIELDS.join(', ')}) VALUES (${FIELDS.map((f) => '@' + f).join(', ')})`)
        this.deleteStmt = db.prepare('DELETE FROM turmas WHERE id = ?')
        this.countStmt = db.prepare('SELECT count(*) AS total FROM matriculas WHERE turma_id = ?')
        this.enrollStmt = db.prepare('INSERT INTO matriculas (aluno_id, turma_id) VALUES (?, ?)')
        this.findEnrollmentStmt = db.prepare('SELECT id FROM matriculas WHERE aluno_id = ? AND turma_id = ?')
        this.unenrollStmt = db.prepare('DELETE FROM matriculas WHERE aluno_id = ? AND turma_id = ?')
        this.presencaStmt = db.prepare(`
            INSERT INTO presencas (matricula_id, data_aula, presente) VALUES (?, ?, ?)
            ON CONFLICT (matricula_id, data_aula) DO UPDATE SET presente = excluded.presente`)
    }

    /* Lista turmas com vagas ocupadas. */
    list() {
        return this.listStmt.all()
    }

    /* Busca a turma com alunos e frequência, ou 404. */
    get(id) {
        const turma = this.getStmt.get(id)
        if (!turma) throw new HttpError(404, 'Turma não encontrada.')
        return { ...turma, alunos: this.alunosStmt.all(id).map((a) => ({ ...a, presencas: a.presencas ?? 0 })) }
    }

    /* Regra: o monitor precisa estar matriculado na própria turma. */
    assertMonitor(turmaId, monitorId) {
        if (monitorId && !this.findEnrollmentStmt.get(monitorId, turmaId)) {
            throw new HttpError(422, 'O monitor precisa ser aluno matriculado nesta turma.')
        }
    }

    /* Cria a turma (sem monitor: ele é definido depois das matrículas). */
    create(data) {
        if (data.monitor_aluno_id) throw new HttpError(422, 'Defina o monitor depois de matricular o aluno na turma.')
        try {
            const { lastInsertRowid } = this.insertStmt.run(data)
            return this.get(Number(lastInsertRowid))
        } catch (error) {
            throw fromSqlite(error)
        }
    }

    /* Atualiza a turma; capacidade não pode ficar menor que o número de matriculados. */
    update(id, data) {
        const current = this.get(id)
        const next = { ...Object.fromEntries(FIELDS.map((f) => [f, current[f]])), ...data }
        if (next.data_final < next.data_inicial) throw new HttpError(422, 'data_final deve ser igual ou posterior a data_inicial.')
        if (next.capacidade_maxima < this.countStmt.get(id).total) throw new HttpError(422, 'Capacidade menor que o número de alunos matriculados.')
        this.assertMonitor(id, next.monitor_aluno_id)
        try {
            this.db.prepare(`UPDATE turmas SET ${FIELDS.map((f) => `${f} = @${f}`).join(', ')} WHERE id = @id`).run({ ...next, id })
        } catch (error) {
            if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') throw new HttpError(409, 'Este aluno já é monitor de outra turma.')
            throw fromSqlite(error)
        }
        return this.get(id)
    }

    /* Remove a turma (matrículas e presenças em cascata). */
    remove(id) {
        if (this.deleteStmt.run(id).changes === 0) throw new HttpError(404, 'Turma não encontrada.')
    }

    /* Matricula respeitando a capacidade, dentro de transação IMMEDIATE (evita duas vagas para o último lugar). */
    enroll(turmaId, alunoId) {
        const run = this.db.transaction(() => {
            const turma = this.get(turmaId)
            if (this.countStmt.get(turmaId).total >= turma.capacidade_maxima) throw new HttpError(409, 'Turma lotada.')
            try {
                this.enrollStmt.run(alunoId, turmaId)
            } catch (error) {
                if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') throw new HttpError(409, 'Aluno já matriculado nesta turma.')
                if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') throw new HttpError(404, 'Aluno não encontrado.')
                throw error
            }
        })
        run.immediate()
        return this.get(turmaId)
    }

    /* Cancela a matrícula; se era o monitor, a turma fica sem monitor. */
    unenroll(turmaId, alunoId) {
        this.db.transaction(() => {
            if (this.unenrollStmt.run(alunoId, turmaId).changes === 0) throw new HttpError(404, 'Matrícula não encontrada.')
            this.db.prepare('UPDATE turmas SET monitor_aluno_id = NULL WHERE id = ? AND monitor_aluno_id = ?').run(turmaId, alunoId)
        })()
    }

    /* Registra presença ou ausência numa data (idempotente por aluno e data). */
    registerAttendance(turmaId, alunoId, { data_aula, presente }) {
        const turma = this.get(turmaId)
        const matricula = this.findEnrollmentStmt.get(alunoId, turmaId)
        if (!matricula) throw new HttpError(404, 'Matrícula não encontrada.')
        if (data_aula < turma.data_inicial || data_aula > turma.data_final) throw new HttpError(422, 'Data fora do período da turma.')
        this.presencaStmt.run(matricula.id, data_aula, presente ? 1 : 0)
        return this.get(turmaId)
    }
}

module.exports = TurmaService
/* fim de TurmaService */
