/*
 * CadastroService · atividades e instrutores (com todos os telefones), pré-requisitos da turma.
 */
const { HttpError, fromSqlite } = require('../lib/errors')

class CadastroService {
    /* Prepara as consultas uma vez. */
    constructor(db) {
        this.db = db
        this.insertAtividade = db.prepare('INSERT INTO atividades (nome) VALUES (?)')
        this.listAtividades = db.prepare('SELECT * FROM atividades ORDER BY nome')
        this.insertInstrutor = db.prepare('INSERT INTO instrutores (rg, nome, data_nascimento, titulacao) VALUES (@rg, @nome, @data_nascimento, @titulacao)')
        this.insertTelefone = db.prepare('INSERT INTO instrutor_telefones (instrutor_id, numero) VALUES (?, ?)')
        this.getInstrutorStmt = db.prepare('SELECT * FROM instrutores WHERE id = ?')
        this.telefonesStmt = db.prepare('SELECT numero FROM instrutor_telefones WHERE instrutor_id = ? ORDER BY id')
        this.listInstrutores = db.prepare('SELECT * FROM instrutores ORDER BY nome')
    }

    /* Cria atividade (nome único). */
    createAtividade({ nome }) {
        try {
            const { lastInsertRowid } = this.insertAtividade.run(nome)
            return { id: Number(lastInsertRowid), nome }
        } catch (error) {
            throw fromSqlite(error)
        }
    }

    /* Lista atividades. */
    atividades() {
        return this.listAtividades.all()
    }

    /* Cria instrutor e telefones numa transação (tudo ou nada). */
    createInstrutor({ telefones, ...dados }) {
        try {
            const id = this.db.transaction(() => {
                const { lastInsertRowid } = this.insertInstrutor.run(dados)
                for (const numero of new Set(telefones)) this.insertTelefone.run(lastInsertRowid, numero)
                return Number(lastInsertRowid)
            })()
            return this.instrutor(id)
        } catch (error) {
            throw fromSqlite(error)
        }
    }

    /* Busca instrutor com telefones, ou 404. */
    instrutor(id) {
        const instrutor = this.getInstrutorStmt.get(id)
        if (!instrutor) throw new HttpError(404, 'Instrutor não encontrado.')
        return { ...instrutor, telefones: this.telefonesStmt.all(id).map((t) => t.numero) }
    }

    /* Lista instrutores com telefones. */
    instrutores() {
        return this.listInstrutores.all().map((i) => ({ ...i, telefones: this.telefonesStmt.all(i.id).map((t) => t.numero) }))
    }
}

module.exports = CadastroService
/* fim de CadastroService */
