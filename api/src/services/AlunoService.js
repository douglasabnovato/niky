/*
 * AlunoService · CRUD de alunos (item 4) com SQL parametrizado.
 */
const { HttpError, fromSqlite } = require('../lib/errors')

const FIELDS = ['codigo_matricula', 'data_matricula', 'nome', 'endereco', 'telefone', 'data_nascimento', 'altura_m', 'peso_kg']

class AlunoService {
    /* Prepara as consultas uma vez. */
    constructor(db) {
        this.db = db
        this.listStmt = db.prepare('SELECT * FROM alunos ORDER BY nome LIMIT ? OFFSET ?')
        this.getStmt = db.prepare('SELECT * FROM alunos WHERE id = ?')
        this.insertStmt = db.prepare(`INSERT INTO alunos (${FIELDS.join(', ')}) VALUES (${FIELDS.map((f) => '@' + f).join(', ')})`)
        this.deleteStmt = db.prepare('DELETE FROM alunos WHERE id = ?')
        this.turmasStmt = db.prepare(`
            SELECT t.id, a.nome AS atividade, t.horario, m.data AS data_matricula
            FROM matriculas m JOIN turmas t ON t.id = m.turma_id JOIN atividades a ON a.id = t.atividade_id
            WHERE m.aluno_id = ? ORDER BY t.horario`)
    }

    /* Lista paginada por nome. */
    list({ limit = 50, offset = 0 } = {}) {
        return this.listStmt.all(limit, offset)
    }

    /* Busca o aluno com as turmas em que está matriculado, ou 404. */
    get(id) {
        const aluno = this.getStmt.get(id)
        if (!aluno) throw new HttpError(404, 'Aluno não encontrado.')
        return { ...aluno, turmas: this.turmasStmt.all(id) }
    }

    /* Cadastra; código de matrícula duplicado vira 409. */
    create(data) {
        try {
            const { lastInsertRowid } = this.insertStmt.run(data)
            return this.get(Number(lastInsertRowid))
        } catch (error) {
            throw fromSqlite(error)
        }
    }

    /* Atualiza só os campos enviados (PATCH). */
    update(id, data) {
        this.get(id)
        const keys = Object.keys(data).filter((key) => FIELDS.includes(key))
        if (keys.length === 0) return this.get(id)
        try {
            this.db.prepare(`UPDATE alunos SET ${keys.map((k) => `${k} = @${k}`).join(', ')} WHERE id = @id`).run({ ...data, id })
        } catch (error) {
            throw fromSqlite(error)
        }
        return this.get(id)
    }

    /* Remove o aluno (matrículas e presenças saem em cascata; monitoria vira nula). */
    remove(id) {
        if (this.deleteStmt.run(id).changes === 0) throw new HttpError(404, 'Aluno não encontrado.')
    }
}

module.exports = AlunoService
/* fim de AlunoService */
