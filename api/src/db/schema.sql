-- schema.sql · academia de ginástica em 3FN (item 1 revisado para os itens 3 e 4).
-- Telefones do instrutor em tabela própria (1FN); matrícula como entidade associativa (N:N aluno × turma).

CREATE TABLE IF NOT EXISTS atividades (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL UNIQUE COLLATE NOCASE CHECK (length(nome) BETWEEN 2 AND 60)
);

CREATE TABLE IF NOT EXISTS instrutores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  rg TEXT NOT NULL UNIQUE,
  nome TEXT NOT NULL CHECK (length(nome) BETWEEN 2 AND 120),
  data_nascimento TEXT NOT NULL,
  titulacao TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS instrutor_telefones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  instrutor_id INTEGER NOT NULL REFERENCES instrutores(id) ON DELETE CASCADE,
  numero TEXT NOT NULL,
  UNIQUE (instrutor_id, numero)
);

CREATE TABLE IF NOT EXISTS alunos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo_matricula TEXT NOT NULL UNIQUE,
  data_matricula TEXT NOT NULL,
  nome TEXT NOT NULL CHECK (length(nome) BETWEEN 2 AND 120),
  endereco TEXT NOT NULL,
  telefone TEXT NOT NULL,
  data_nascimento TEXT NOT NULL,
  altura_m REAL NOT NULL CHECK (altura_m BETWEEN 0.5 AND 2.6),
  peso_kg REAL NOT NULL CHECK (peso_kg BETWEEN 10 AND 400)
);

CREATE TABLE IF NOT EXISTS turmas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  atividade_id INTEGER NOT NULL REFERENCES atividades(id) ON DELETE RESTRICT,
  instrutor_id INTEGER NOT NULL REFERENCES instrutores(id) ON DELETE RESTRICT,
  monitor_aluno_id INTEGER UNIQUE REFERENCES alunos(id) ON DELETE SET NULL,
  capacidade_maxima INTEGER NOT NULL CHECK (capacidade_maxima > 0),
  horario TEXT NOT NULL CHECK (horario GLOB '[0-2][0-9]:[0-5][0-9]'),
  duracao_minutos INTEGER NOT NULL CHECK (duracao_minutos BETWEEN 10 AND 300),
  data_inicial TEXT NOT NULL,
  data_final TEXT NOT NULL,
  CHECK (data_final >= data_inicial)
);

CREATE TABLE IF NOT EXISTS matriculas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  aluno_id INTEGER NOT NULL REFERENCES alunos(id) ON DELETE CASCADE,
  turma_id INTEGER NOT NULL REFERENCES turmas(id) ON DELETE CASCADE,
  data TEXT NOT NULL DEFAULT (date('now')),
  UNIQUE (aluno_id, turma_id)
);

CREATE TABLE IF NOT EXISTS presencas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  matricula_id INTEGER NOT NULL REFERENCES matriculas(id) ON DELETE CASCADE,
  data_aula TEXT NOT NULL,
  presente INTEGER NOT NULL CHECK (presente IN (0, 1)),
  UNIQUE (matricula_id, data_aula)
);

CREATE INDEX IF NOT EXISTS idx_turmas_instrutor ON turmas (instrutor_id);
CREATE INDEX IF NOT EXISTS idx_turmas_atividade ON turmas (atividade_id);
CREATE INDEX IF NOT EXISTS idx_matriculas_turma ON matriculas (turma_id);
