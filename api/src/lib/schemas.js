/*
 * schemas.js · contratos de entrada (item 3) validados com zod.
 */
const { z } = require('zod')

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'use o formato AAAA-MM-DD')

const aluno = z.object({
    codigo_matricula: z.string().trim().min(1).max(20),
    data_matricula: date,
    nome: z.string().trim().min(2).max(120),
    endereco: z.string().trim().min(3).max(200),
    telefone: z.string().trim().min(8).max(20),
    data_nascimento: date,
    altura_m: z.number().min(0.5).max(2.6),
    peso_kg: z.number().min(10).max(400)
})

const instrutor = z.object({
    rg: z.string().trim().min(5).max(20),
    nome: z.string().trim().min(2).max(120),
    data_nascimento: date,
    titulacao: z.string().trim().min(2).max(120),
    telefones: z.array(z.string().trim().min(8).max(20)).min(1, 'informe ao menos um telefone')
})

const turma = z.object({
    atividade_id: z.number().int().positive(),
    instrutor_id: z.number().int().positive(),
    monitor_aluno_id: z.number().int().positive().nullable().default(null),
    capacidade_maxima: z.number().int().positive(),
    horario: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'use HH:MM'),
    duracao_minutos: z.number().int().min(10).max(300),
    data_inicial: date,
    data_final: date
}).refine((t) => t.data_final >= t.data_inicial, { message: 'data_final deve ser igual ou posterior a data_inicial', path: ['data_final'] })

module.exports = {
    aluno,
    alunoParcial: aluno.partial(),
    atividade: z.object({ nome: z.string().trim().min(2).max(60) }),
    instrutor,
    turma,
    matricula: z.object({ aluno_id: z.number().int().positive() }),
    presenca: z.object({ data_aula: date, presente: z.boolean() })
}
/* fim de schemas.js */
