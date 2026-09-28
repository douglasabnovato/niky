# Item 3 — Contratos REST (cadastro de alunos e turmas)

Base: `http://localhost:3333` (ou a URL publicada). JSON em UTF-8. Erros sempre como `{ "error": "mensagem" }`.

## Códigos de resposta

| Código | Quando |
|---|---|
| 200 / 201 / 204 | Leitura, criação, exclusão |
| 400 | Corpo inválido (campo, formato ou tipo) |
| 404 | Recurso inexistente |
| 409 | Duplicidade (código de matrícula, matrícula repetida, monitor de outra turma) ou turma lotada |
| 422 | Regra de negócio (monitor fora da turma, capacidade menor que matriculados, data fora do período) |

## Alunos

| Método | Rota | Corpo | Resposta |
|---|---|---|---|
| GET | `/alunos?limit=50&offset=0` | — | `200 [Aluno]` ordenado por nome |
| GET | `/alunos/:id` | — | `200 Aluno + turmas[]` |
| POST | `/alunos` | `AlunoInput` | `201 Aluno` |
| PATCH | `/alunos/:id` | campos parciais de `AlunoInput` | `200 Aluno` |
| DELETE | `/alunos/:id` | — | `204` (matrículas e presenças saem junto) |

```json
{
  "codigo_matricula": "A2026-001",
  "data_matricula": "2026-09-27",
  "nome": "Bruno Lima",
  "endereco": "Rua Halfeld, 100, Juiz de Fora/MG",
  "telefone": "32988887777",
  "data_nascimento": "2000-01-01",
  "altura_m": 1.75,
  "peso_kg": 72.4
}
```

## Pré-cadastros da turma

| Método | Rota | Corpo |
|---|---|---|
| GET / POST | `/atividades` | `{ "nome": "Pilates" }` |
| GET / POST | `/instrutores` | `{ "rg", "nome", "data_nascimento", "titulacao", "telefones": ["…"] }` |
| GET | `/instrutores/:id` | — |

## Turmas

| Método | Rota | Corpo | Resposta |
|---|---|---|---|
| GET | `/turmas` | — | `200 [Turma + atividade, instrutor, matriculados]` |
| GET | `/turmas/:id` | — | `200 Turma + alunos[] com presencas e ausencias` |
| POST | `/turmas` | `TurmaInput` | `201 Turma` |
| PATCH | `/turmas/:id` | campos parciais (inclui `monitor_aluno_id`) | `200 Turma` |
| DELETE | `/turmas/:id` | — | `204` |

```json
{
  "atividade_id": 1,
  "instrutor_id": 1,
  "capacidade_maxima": 20,
  "horario": "07:30",
  "duracao_minutos": 50,
  "data_inicial": "2026-10-01",
  "data_final": "2026-12-15"
}
```

## Matrículas e presenças

| Método | Rota | Corpo | Regra |
|---|---|---|---|
| POST | `/turmas/:id/matriculas` | `{ "aluno_id": 1 }` | 409 se lotada ou já matriculado |
| DELETE | `/turmas/:id/matriculas/:alunoId` | — | Remove também a monitoria, se houver |
| PUT | `/turmas/:id/matriculas/:alunoId/presencas` | `{ "data_aula": "2026-10-02", "presente": true }` | Idempotente por data; 422 fora do período |

## Categorias (item 7)

| Método | Rota | Resposta |
|---|---|---|
| GET | `/categorias` | `200 [{ id, categoria, recorrencia, valor, valorTotal, beneficiarios }]` |
