/*
 * api.test.js · testes de integração da API (node:test + supertest, SQLite em memória).
 */
const { test, beforeEach } = require('node:test')
const assert = require('node:assert/strict')
const request = require('supertest')
const { openDatabase } = require('../src/db/connection')
const { createApp } = require('../src/app')

let app

/* Monta atividade, instrutor e turma; devolve os ids. */
async function seedTurma(capacidade = 2) {
    const atividade = await request(app).post('/atividades').send({ nome: 'Pilates' })
    const instrutor = await request(app).post('/instrutores').send({
        rg: '1234567', nome: 'Ana Souza', data_nascimento: '1990-03-10', titulacao: 'Educação Física',
        telefones: ['32999990000', '3232320000']
    })
    const turma = await request(app).post('/turmas').send({
        atividade_id: atividade.body.id, instrutor_id: instrutor.body.id, capacidade_maxima: capacidade,
        horario: '07:30', duracao_minutos: 50, data_inicial: '2026-10-01', data_final: '2026-12-15'
    })
    assert.equal(turma.status, 201, JSON.stringify(turma.body))
    return { turmaId: turma.body.id, instrutor: instrutor.body }
}

/* Cadastra um aluno com o código informado. */
async function createAluno(codigo, nome = 'Aluno ' + codigo) {
    const response = await request(app).post('/alunos').send({
        codigo_matricula: codigo, data_matricula: '2026-09-27', nome, endereco: 'Rua A, 10',
        telefone: '32988887777', data_nascimento: '2000-01-01', altura_m: 1.7, peso_kg: 70
    })
    assert.equal(response.status, 201, JSON.stringify(response.body))
    return response.body.id
}

beforeEach(() => {
    app = createApp(openDatabase(':memory:'))
})

test('GET /categorias devolve o mock do item 7', async () => {
    const response = await request(app).get('/categorias')
    assert.equal(response.status, 200)
    assert.equal(response.body.length, 7)
    assert.deepEqual(Object.keys(response.body[0]).sort(), ['beneficiarios', 'categoria', 'id', 'recorrencia', 'valor', 'valorTotal'])
    assert.equal(response.headers['access-control-allow-origin'], '*')
})

test('CRUD de aluno com validação e código único', async () => {
    const id = await createAluno('A001', 'Bruno Lima')
    assert.equal((await request(app).post('/alunos').send({ nome: 'x' })).status, 400)
    const dup = await request(app).post('/alunos').send({
        codigo_matricula: 'A001', data_matricula: '2026-09-27', nome: 'Outro', endereco: 'Rua B, 1',
        telefone: '32911112222', data_nascimento: '2001-01-01', altura_m: 1.6, peso_kg: 60
    })
    assert.equal(dup.status, 409)
    const patched = await request(app).patch(`/alunos/${id}`).send({ peso_kg: 72.5 })
    assert.equal(patched.body.peso_kg, 72.5)
    assert.equal((await request(app).delete(`/alunos/${id}`)).status, 204)
    assert.equal((await request(app).get(`/alunos/${id}`)).status, 404)
})

test('instrutor guarda todos os telefones (1FN)', async () => {
    const { instrutor } = await seedTurma()
    assert.deepEqual(instrutor.telefones, ['32999990000', '3232320000'])
})

test('turma valida datas e horário', async () => {
    await seedTurma()
    const invalida = await request(app).post('/turmas').send({
        atividade_id: 1, instrutor_id: 1, capacidade_maxima: 5, horario: '25:00', duracao_minutos: 50,
        data_inicial: '2026-10-01', data_final: '2026-09-01'
    })
    assert.equal(invalida.status, 400)
})

test('matrícula respeita a capacidade e não duplica', async () => {
    const { turmaId } = await seedTurma(1)
    const a1 = await createAluno('A1')
    const a2 = await createAluno('A2')
    assert.equal((await request(app).post(`/turmas/${turmaId}/matriculas`).send({ aluno_id: a1 })).status, 201)
    assert.equal((await request(app).post(`/turmas/${turmaId}/matriculas`).send({ aluno_id: a1 })).status, 409)
    const lotada = await request(app).post(`/turmas/${turmaId}/matriculas`).send({ aluno_id: a2 })
    assert.equal(lotada.status, 409)
    assert.match(lotada.body.error, /lotada/)
})

test('monitor precisa ser da turma e só pode monitorar uma turma', async () => {
    const { turmaId } = await seedTurma(5)
    const segunda = await request(app).post('/turmas').send({
        atividade_id: 1, instrutor_id: 1, capacidade_maxima: 5, horario: '18:00', duracao_minutos: 60,
        data_inicial: '2026-10-01', data_final: '2026-12-15'
    })
    const aluno = await createAluno('M1')
    assert.equal((await request(app).patch(`/turmas/${turmaId}`).send({ monitor_aluno_id: aluno })).status, 422)
    await request(app).post(`/turmas/${turmaId}/matriculas`).send({ aluno_id: aluno })
    await request(app).post(`/turmas/${segunda.body.id}/matriculas`).send({ aluno_id: aluno })
    assert.equal((await request(app).patch(`/turmas/${turmaId}`).send({ monitor_aluno_id: aluno })).body.monitor_aluno_id, aluno)
    assert.equal((await request(app).patch(`/turmas/${segunda.body.id}`).send({ monitor_aluno_id: aluno })).status, 409)
})

test('presenças e ausências por matrícula', async () => {
    const { turmaId } = await seedTurma()
    const aluno = await createAluno('P1')
    await request(app).post(`/turmas/${turmaId}/matriculas`).send({ aluno_id: aluno })
    await request(app).put(`/turmas/${turmaId}/matriculas/${aluno}/presencas`).send({ data_aula: '2026-10-02', presente: true })
    await request(app).put(`/turmas/${turmaId}/matriculas/${aluno}/presencas`).send({ data_aula: '2026-10-03', presente: false })
    const turma = await request(app).put(`/turmas/${turmaId}/matriculas/${aluno}/presencas`).send({ data_aula: '2026-10-03', presente: true })
    assert.equal(turma.body.alunos[0].presencas, 2)
    assert.equal(turma.body.alunos[0].ausencias, 0)
    const fora = await request(app).put(`/turmas/${turmaId}/matriculas/${aluno}/presencas`).send({ data_aula: '2027-01-10', presente: true })
    assert.equal(fora.status, 422)
})

test('rota e id inexistentes respondem 404 em JSON', async () => {
    assert.equal((await request(app).get('/nada')).status, 404)
    assert.equal((await request(app).get('/turmas/abc')).status, 404)
})
/* fim de api.test.js */
