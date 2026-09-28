-- item-05-schema.sql · estrutura e dados do item 5 (cadastro de pessoas), transcritos da imagem do enunciado.
-- Compatível com SQLite, PostgreSQL e MySQL (tipos genéricos). Datas em ISO 8601 (AAAA-MM-DD).

CREATE TABLE pessoas (
  id INTEGER PRIMARY KEY,
  nome VARCHAR(120),
  rg VARCHAR(20),
  dt_nasc DATE,
  sexo CHAR(1)
);

CREATE TABLE cep (
  cep CHAR(9) PRIMARY KEY,
  logradouro VARCHAR(120),
  bairro VARCHAR(80),
  cidade VARCHAR(80),
  uf CHAR(2)
);

CREATE TABLE enderecos (
  id INTEGER PRIMARY KEY,
  id_pessoa INTEGER REFERENCES pessoas(id),
  numero VARCHAR(10),
  complemento VARCHAR(60),
  cep CHAR(9) REFERENCES cep(cep)
);

CREATE TABLE contatos (
  id INTEGER PRIMARY KEY,
  id_pessoa INTEGER REFERENCES pessoas(id),
  tipo VARCHAR(20),
  valor VARCHAR(120),
  contato VARCHAR(60)
);

CREATE TABLE dependentes (
  id INTEGER PRIMARY KEY,
  id_pessoa INTEGER REFERENCES pessoas(id),
  nome VARCHAR(120),
  parentesco VARCHAR(20)
);

INSERT INTO pessoas VALUES
  (1, 'João da Silva', '4333055', '1990-01-15', 'M'),
  (2, 'Emanuel R. de Sá', '2099601', '1970-09-22', 'M'),
  (3, 'Carla J. Dias', '1330123', '2002-04-09', 'F'),
  (4, 'Raquel A. Lopes', '3022011', '1995-06-23', 'F'),
  (5, 'Gilson R. Nunes', '5003561', '2006-11-11', 'M'),
  (6, 'Maria J. Gomes', NULL, '2015-12-01', 'F');

INSERT INTO cep VALUES
  ('20120-001', 'Av. Central', 'Penha', 'Campos', 'RJ'),
  ('29100-215', 'Av. Onze', 'Sta. Luzia', 'Vitória', 'ES'),
  ('29023-400', 'Rua Itacibá', 'Ilha do Frade', 'Vitória', 'ES'),
  ('51056-701', 'Rua Bromélia', 'Jacuí', 'Santo André', 'SP');

INSERT INTO enderecos VALUES
  (1, 1, '100', 'Casa', '20120-001'),
  (2, 3, '120', NULL, '29100-215'),
  (3, 4, NULL, 'Ed. Yung, 201', '29023-400'),
  (4, 5, '4001', NULL, '51056-701'),
  (5, 6, '23', 'Segundo Andar', '20120-001');

INSERT INTO contatos VALUES
  (1, 1, 'Celular', '31 99415-2312', NULL),
  (2, 1, 'E-mail', 'manu@gmail.com', NULL),
  (3, 3, 'Celular', '27 98252-4577', NULL),
  (4, 6, 'Celular', '31 99415-7765', NULL),
  (5, 3, 'E-mail', 'cdias@gmail.com', NULL),
  (6, 4, 'Celular', '27 99302-5787', NULL),
  (7, 2, 'Fixo', '11 3243-8789', 'Eustáquia'),
  (8, 4, 'E-mail', 'rlopes@bol.com', NULL),
  (9, 3, 'Fixo', '27 3243-8789', 'Umberto'),
  (10, 6, 'E-mail', 'Mg15@wnet.com', NULL),
  (11, 2, 'Celular', '11 9612-6645', NULL);

INSERT INTO dependentes VALUES
  (1, 6, 'Gustavo J. Melo', 'Filho(a)'),
  (2, 6, 'Natália J. Melo', 'Filho(a)'),
  (3, 4, 'Roberto A. Silva', 'Cônjuge'),
  (4, 3, 'Caio W. Dias', 'Filho(a)'),
  (5, 5, 'Tatiana B. Nunes', 'Cônjuge'),
  (6, 6, 'Andrade S. Melo', 'Cônjuge'),
  (7, 5, 'Felipe B. Nunes', 'Filho(a)'),
  (8, 5, 'Henrico B. Nunes', 'Filho(a)'),
  (9, 4, 'Isaque L. Franco', 'Filho(a)');
-- fim de item-05-schema.sql
