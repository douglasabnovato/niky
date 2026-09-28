/*
 * routes/index.js · contratos REST (item 3): categorias (mock), alunos, turmas, matrículas e presenças.
 */
const express = require('express')
const schemas = require('../lib/schemas')
const { parse, HttpError } = require('../lib/errors')
const categorias = require('../db/categorias.json')

/* Converte o parâmetro :id em inteiro positivo ou 404. */
function idParam(value) {
    const id = Number(value)
    if (!Number.isInteger(id) || id <= 0) throw new HttpError(404, 'Recurso não encontrado.')
    return id
}

/* Cria o roteador com os serviços injetados. */
function createRouter({ alunos, turmas, cadastros }) {
    const r = express.Router()

    r.get('/categorias', (req, res) => res.json(categorias))

    r.get('/atividades', (req, res) => res.json(cadastros.atividades()))
    r.post('/atividades', (req, res) => res.status(201).json(cadastros.createAtividade(parse(schemas.atividade, req.body))))
    r.get('/instrutores', (req, res) => res.json(cadastros.instrutores()))
    r.get('/instrutores/:id', (req, res) => res.json(cadastros.instrutor(idParam(req.params.id))))
    r.post('/instrutores', (req, res) => res.status(201).json(cadastros.createInstrutor(parse(schemas.instrutor, req.body))))

    r.get('/alunos', (req, res) => {
        const limit = Math.min(Number(req.query.limit) || 50, 100)
        const offset = Math.max(Number(req.query.offset) || 0, 0)
        res.json(alunos.list({ limit, offset }))
    })
    r.get('/alunos/:id', (req, res) => res.json(alunos.get(idParam(req.params.id))))
    r.post('/alunos', (req, res) => res.status(201).json(alunos.create(parse(schemas.aluno, req.body))))
    r.patch('/alunos/:id', (req, res) => res.json(alunos.update(idParam(req.params.id), parse(schemas.alunoParcial, req.body))))
    r.delete('/alunos/:id', (req, res) => {
        alunos.remove(idParam(req.params.id))
        res.status(204).end()
    })

    r.get('/turmas', (req, res) => res.json(turmas.list()))
    r.get('/turmas/:id', (req, res) => res.json(turmas.get(idParam(req.params.id))))
    r.post('/turmas', (req, res) => res.status(201).json(turmas.create(parse(schemas.turma, req.body))))
    r.patch('/turmas/:id', (req, res) => {
        const body = parse(schemas.turma.innerType().partial(), req.body)
        res.json(turmas.update(idParam(req.params.id), body))
    })
    r.delete('/turmas/:id', (req, res) => {
        turmas.remove(idParam(req.params.id))
        res.status(204).end()
    })

    r.post('/turmas/:id/matriculas', (req, res) => {
        const { aluno_id } = parse(schemas.matricula, req.body)
        res.status(201).json(turmas.enroll(idParam(req.params.id), aluno_id))
    })
    r.delete('/turmas/:id/matriculas/:alunoId', (req, res) => {
        turmas.unenroll(idParam(req.params.id), idParam(req.params.alunoId))
        res.status(204).end()
    })
    r.put('/turmas/:id/matriculas/:alunoId/presencas', (req, res) => {
        const body = parse(schemas.presenca, req.body)
        res.json(turmas.registerAttendance(idParam(req.params.id), idParam(req.params.alunoId), body))
    })

    return r
}

module.exports = createRouter
/* fim de routes/index.js */
