-- item-05-consultas.sql · respostas do item 5, verificadas no SQLite com os dados de item-05-schema.sql.
-- O operador || concatena texto no SQLite e no PostgreSQL; no MySQL troque por CONCAT().

-- a) Etiquetas de correspondência: nome e endereço completo, só de quem tem endereço.
--    INNER JOIN descarta quem não tem endereço; o CEP traz logradouro, bairro, cidade e UF.
SELECT p.nome,
       c.logradouro || ', ' || COALESCE(e.numero, 'S/N')
         || COALESCE(' - ' || e.complemento, '')
         || ' - ' || c.bairro || ', ' || c.cidade || '/' || c.uf
         || ' - CEP ' || e.cep AS endereco
FROM pessoas p
JOIN enderecos e ON e.id_pessoa = p.id
JOIN cep c ON c.cep = e.cep
ORDER BY p.nome;
-- Resultado esperado: 5 linhas (todas menos Emanuel R. de Sá).

-- b) Pessoas sem endereço (anti-join com NOT EXISTS, que o otimizador resolve pelo índice da FK).
SELECT p.id, p.nome
FROM pessoas p
WHERE NOT EXISTS (SELECT 1 FROM enderecos e WHERE e.id_pessoa = p.id);
-- Resultado esperado: Emanuel R. de Sá.

-- c) Cadastros com erro: algum campo obrigatório da pessoa vazio ou nulo, com o motivo.
SELECT p.id, p.nome,
       TRIM(
         CASE WHEN p.nome IS NULL OR TRIM(p.nome) = '' THEN 'nome ' ELSE '' END ||
         CASE WHEN p.rg IS NULL OR TRIM(p.rg) = '' THEN 'rg ' ELSE '' END ||
         CASE WHEN p.dt_nasc IS NULL THEN 'dt_nasc ' ELSE '' END ||
         CASE WHEN p.sexo IS NULL OR p.sexo NOT IN ('M', 'F') THEN 'sexo ' ELSE '' END
       ) AS campos_pendentes
FROM pessoas p
WHERE p.nome IS NULL OR TRIM(p.nome) = ''
   OR p.rg IS NULL OR TRIM(p.rg) = ''
   OR p.dt_nasc IS NULL
   OR p.sexo IS NULL OR p.sexo NOT IN ('M', 'F');
-- Resultado esperado: Maria J. Gomes (rg).

-- d) Lista telefônica: todas as pessoas, com celular ou fixo quando houver (LEFT JOIN com o filtro no ON).
SELECT p.nome AS "Nome",
       p.sexo AS "Sexo",
       ct.valor AS "Telefone",
       ct.contato AS "Contato"
FROM pessoas p
LEFT JOIN contatos ct ON ct.id_pessoa = p.id AND ct.tipo IN ('Celular', 'Fixo')
ORDER BY p.nome, ct.tipo;
-- Resultado esperado: 8 linhas; Gilson R. Nunes aparece com telefone nulo.
-- Observação: o filtro de tipo fica no ON; se fosse para o WHERE, quem não tem telefone sumiria.

-- e) Pessoas com mais de um filho.
SELECT p.nome, COUNT(*) AS filhos
FROM pessoas p
JOIN dependentes d ON d.id_pessoa = p.id
WHERE d.parentesco = 'Filho(a)'
GROUP BY p.id, p.nome
HAVING COUNT(*) > 1
ORDER BY filhos DESC, p.nome;
-- Resultado esperado: Maria J. Gomes (2) e Gilson R. Nunes (2).
-- fim de item-05-consultas.sql
