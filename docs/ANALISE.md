# Análise do projeto — Niky (teste técnico fullstack)

> Data da análise: 27/09/2026 · Branch analisada: `main` · Grupo: **fullstack**

## 1. Contexto de produto

| Item | Descrição |
|---|---|
| Problema (do avaliador) | Medir, num só projeto, a conversão de layout em tela, lógica no cliente, modelagem relacional, APIs REST, SQL e fila assíncrona. |
| Problema (do produto Niky) | RH precisa ver o custo de cada categoria de benefício (valor × beneficiários × recorrência) e quem gere cada área. |
| Público | Pessoa de RH/gestão de benefícios; avaliador técnico. |
| Proposta de valor da entrega | Tela fiel ao layout, alimentada pela própria API, com as regras pedidas e todos os itens de back-end respondidos e testados. |
| Métrica de sucesso | Itens do enunciado atendidos e verificáveis (11 de 11 com código; o item 11 depende da conta AWS). |

## 2. Especificação (itens do enunciado)

| Item | Pedido | Situação encontrada |
|---|---|---|
| 1 | DER da academia | Entregue (draw.io), com atributos multivalorados (`contato[]`, `titulacao[]`) e sem entidade de matrícula. |
| 2 | Classes, métodos e justificativa | **Não feito** |
| 3 | Contratos REST de alunos e turmas | **Não feito** |
| 4 | Implementar as APIs com banco relacional | **Não feito** |
| 5 | Cinco queries SQL | **Não feito** |
| 6 | Layout em React com grid de 12 colunas | Feito, com CSS do Bootstrap 4 (CDN) e classes do Bootstrap 5 (`form-select` sem estilo). |
| 7 | API mock `GET /categorias` publicada | **Não feito** |
| 8 | Tela consumindo `/categorias` | **Não feito** (dados fixos no componente) |
| 9 | Análise crítica do layout | Feita (12 pontos), nenhum aplicado. |
| 10 | Excluir com confirmação e bloquear "Mensal" | Parcial: o combo tem uma única opção, então a pessoa não consegue mudar a frequência que a regra avalia. |
| 11 | SQS + Lambda | **Não feito** |

### 2.1 Regras de negócio

- RN01 (item 10) — Excluir exige confirmação "Deseja excluir essa categoria?"; se a frequência escolhida no combo for "Mensal", mostrar erro e não excluir.
- RN02 (academia) — Uma turma tem uma atividade, um instrutor, capacidade máxima e período; o aluno monitor pertence à turma e monitora no máximo uma turma.
- RN03 (academia) — Um aluno pode se matricular em várias turmas; presenças e ausências são registradas por matrícula.
- RN04 (dados) — Valor total = valor × beneficiários × ocorrências no mês (Diária = 20 dias úteis). **Achado de produto:** "Saúde" (420 × 70 = 29.400) está como 41.160 na tabela do enunciado — divergência a confirmar com a área de produto; a API devolve o valor do enunciado sem alterar.

## 3. Diagnóstico

| ID | Severidade | Onde | Defeito | Referência |
|---|---|---|---|---|
| D1 | Alta | escopo | 7 de 11 itens não entregues (2, 3, 4, 5, 7, 8, 11). | MVP: núcleo de valor |
| D2 | Alta | `public/index.html` | Bootstrap 4 + jQuery 3.2.1 + Popper via CDN com componentes do Bootstrap 5 no pacote: estilos quebrados e jQuery com CVEs conhecidas (CVE-2019-11358, CVE-2020-11022). | OWASP A06 (componentes vulneráveis) |
| D3 | Média | `App` | `window.confirm`/`alert`, `lang="en"`, `class` em JSX, selects com rótulo "Default select example", botões de lixeira sem nome. | WCAG 2.2 — 3.1.1, 4.1.2 |
| D4 | Média | `App` | Combo de frequência sem opções nem `onChange`: RN01 não é exercitável. | Corretude da regra |
| D5 | Média | `package.json` | MUI, Emotion, styled-components, Font Awesome, `@restart/ui` e `bootstrap-icons` instalados sem uso. | Custo de manutenção e superfície de ataque |
| D6 | Baixa | `src/assets`, `App/assets/photo-1.jpg` | Arquivos não referenciados (106 KB). | Higiene |
| D7 | Baixa | DER | Atributos multivalorados e N:N sem entidade associativa. | 1FN |

## 4. Critérios de MVP e nota atual

Pesos do grupo **fullstack**. Aprovação: média ≥ 7,0 e C1 e C4 ≥ 5.

| # | Critério | Peso | Nota atual | Justificativa |
|---|---|---|---|---|
| C1 | Núcleo de valor | 18% | 4 | D1 e D4. |
| C2 | Estados | 10% | 3 | Diálogos nativos; sem carregando/erro (dados fixos). |
| C3 | Acessibilidade | 8% | 3 | D3. |
| C4 | Segurança | 16% | 5 | D2. |
| C5 | Dados | 12% | 4 | D7; sem banco. |
| C6 | Testes | 10% | 0 | Nenhum. |
| C7 | Qualidade de código | 8% | 3 | Componente único com dados fixos; D5. |
| C8 | Desempenho | 6% | 4 | Três scripts externos bloqueantes; D6. |
| C9 | Operação | 6% | 3 | Nada publicado. |
| C10 | Documentação | 6% | 7 | README detalhado do enunciado e das entregas. |

**Nota atual: 3,62 / 10 — REPROVADO** (C1 = 4, eliminatório).

## 5. Nota depois do ciclo de melhorias (27/09/2026)

| # | Critério | Antes | Depois | O que mudou |
|---|---|---|---|---|
| C1 | Núcleo de valor | 4 | 9 | Itens 2, 3, 4, 5, 7, 8 e 10 completos; 9 aplicado; 11 com código e roteiro (execução na AWS fica com você). |
| C2 | Estados | 3 | 9 | Carregando, erro com "Tentar novamente", vazio da busca, sucesso/erro da exclusão. |
| C3 | Acessibilidade | 3 | 9 | axe-core: 0 violações; diálogo acessível; rótulos em todos os controles. |
| C4 | Segurança | 5 | 8 | Sem jQuery/CDN; API com zod, helmet, SQL parametrizado e limite de corpo. |
| C5 | Dados | 4 | 9 | Academia em 3FN com CHECK, UNIQUE e FKs; transação na matrícula. |
| C6 | Testes | 0 | 8 | 8 testes de API, 6 de interface e as 5 queries conferidas contra os dados. |
| C7 | Qualidade de código | 3 | 8 | Serviços por agregado, cliente HTTP isolado, dependências enxutas. |
| C8 | Desempenho | 4 | 8 | Nenhum script externo; JS de 57,7 kB (gzip). |
| C9 | Operação | 3 | 7 | Scripts de start/test, `/health`, variáveis de ambiente; publicação pendente. |
| C10 | Documentação | 7 | 9 | `docs/` com análise, arquitetura, plano, exercícios e SQL. |

**Nota depois: 8,48 / 10 — APROVADO.**
