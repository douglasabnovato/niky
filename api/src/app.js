/*
 * app.js · monta o Express com CORS (o front consome /categorias), helmet, JSON e erros padronizados.
 */
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const createRouter = require('./routes')
const AlunoService = require('./services/AlunoService')
const TurmaService = require('./services/TurmaService')
const CadastroService = require('./services/CadastroService')

/* Cria a aplicação com os serviços conectados ao banco recebido. */
function createApp(db) {
    const app = express()
    app.disable('x-powered-by')
    app.use(helmet())
    app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }))
    app.use(express.json({ limit: '20kb' }))

    app.get('/health', (req, res) => res.json({ status: 'ok' }))
    app.use(createRouter({
        alunos: new AlunoService(db),
        turmas: new TurmaService(db),
        cadastros: new CadastroService(db)
    }))

    app.use((req, res) => res.status(404).json({ error: 'Rota não encontrada.' }))
    app.use((error, req, res, next) => {
        if (error.type === 'entity.parse.failed') return res.status(400).json({ error: 'JSON inválido.' })
        if (error.status && error.status < 500) return res.status(error.status).json({ error: error.message })
        console.error(error)
        res.status(500).json({ error: 'Erro interno.' })
    })
    return app
}

module.exports = { createApp }
/* fim de app.js */
