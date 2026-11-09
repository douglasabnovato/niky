# Plano de ação — Niky

Priorização por **MoSCoW** e **ganho ÷ esforço** (esforço: 1 = até 15 min, 2 = até 30 min, 3 = até 1 h).

| # | Prioridade | Tarefa | Item | Critério | Esforço | Status |
|---|---|---|---|---|---|---|
| T01 | Must | Trocar CDN (BS4 + jQuery + Popper) por Bootstrap 5 do npm; remover dependências sem uso | D2, D5 | C4, C8 | 1 | ✅ Feito |
| T02 | Must | API mock `GET /categorias` | 7 | C1 | 1 | ✅ Feito |
| T03 | Must | Tela consumindo a API, com carregando e erro | 8 | C1, C2 | 2 | ✅ Feito |
| T04 | Must | Regra de exclusão com combo editável e diálogo acessível | 10 | C1, C3 | 2 | ✅ Feito |
| T05 | Must | Modelo 3FN + API CRUD de alunos e turmas com matrículas e presenças | 3, 4 | C1, C5 | 3 | ✅ Feito |
| T06 | Must | Cinco queries SQL verificadas contra os dados | 5 | C1, C5 | 1 | ✅ Feito |
| T07 | Should | Classes, métodos e justificativas | 2 | C1 | 1 | ✅ Feito |
| T08 | Should | Contratos REST documentados | 3 | C10 | 1 | ✅ Feito |
| T09 | Should | Aplicar a análise crítica (10 de 12 pontos) | 9 | C1, C3 | 2 | ✅ Feito |
| T10 | Should | Código da Lambda + roteiro da AWS | 11 | C1 | 1 | ✅ Feito (execução com você) |
| T11 | Should | Testes: 8 de API e 6 de interface | — | C6 | 2 | ✅ Feito |
| T12 | Should | README com como executar e publicar | — | C10 | 1 | ✅ Feito |
| T13 | Must (usuário) | Publicar a API (Render/alwaysdata) e o front (Pages/Vercel) com `VITE_API_URL` | 7b | C9 | 1 | ⏳ Com você |
| T14 | Must (usuário) | Criar fila e Lambda na AWS e tirar os prints 11.b e 11.d | 11 | C1 | 1 | ⏳ Com você |
| T15 | Could | CRUD de categorias e rotas separadas | 9.5, 9.12 | C1 | 3 | Roadmap |

## Definição de pronto

- `npm test -- --watchAll=false` na raiz (6/6) e `npm test` em `api/` (8/8).
- `npm run build` com `CI=true`.
- axe-core sem violações na tela com a mensagem de erro do item 10.c.

## Ciclo de 03/11/2026

Executado em 06/11/2026, nas branches `feature/2026-11-06` → `developer-sprint-2026-11-12` → `main`.

### Produto

**Problema e público.** Quem gere benefícios de uma empresa precisa ver as categorias (alimentação, combustível etc.), a recorrência e o custo total, e ajustar o resumo sem excluir o que é mensal.

**Hipótese e meta (proposta).** Praticar React com API: filtrar categorias e abrir o cadastro sem ajuda.

**O que a pesquisa trouxe.**

| Ideia | Fonte | Uso aqui |
|---|---|---|
| A Lei 14.442/2022 limita o auxílio-alimentação a refeições e alimentos e proíbe saque e deságio | [Portal da Indústria, Conexão Trabalho](https://conexaotrabalho.portaldaindustria.com.br/publicacoes/detalhe/trabalhista/-geral/novidades-no-auxilio-alimentacao-lei-1444222/) | Categorias de alimentação ficam separadas das demais; fora do escopo validar regras legais |
| O Decreto 12.712/2025 fixou parâmetros de taxas e repasses para VA e VR | [Findes, informe sobre o decreto](https://findes.com.br/wp-content/uploads/2025/11/Informe-Estrategico-–-Novas-Regras-do-PAT-O-que-muda-com-o-Decreto-no-12.712_2025.pdf) | Quem gere precisa do custo total por categoria: entrou a linha de total |

**Backlog priorizado (impacto × esforço).**

| Item | Impacto | Esforço | Destino |
|---|---|---|---|
| Linha de total das categorias visíveis | Médio | Baixo | Este ciclo |
| Testes de carregamento, vazio e erro HTTP | Médio | Baixo | Este ciclo |
| CI nos PRs para `developer-**` | Médio | Baixo | Este ciclo |
| Fluxo de salvar percorrido em teste | Alto | Médio | [#20](https://github.com/douglasabnovato/niky/issues/20) |
| Total por frequência | Médio | Baixo | [#24](https://github.com/douglasabnovato/niky/issues/24) |
| Republicar, proteger a `main`, Lambda | Médio | Baixo (responsável) | [#21](https://github.com/douglasabnovato/niky/issues/21), [#22](https://github.com/douglasabnovato/niky/issues/22), [#23](https://github.com/douglasabnovato/niky/issues/23) |

**Fora do escopo.** Permissões, integrações externas e validação jurídica das categorias.

### Engenharia

**Arquitetura.** Front React 18 + Vite + React Bootstrap na raiz, cliente em `src/services/categorias.js`. API Express em `api/`, com Zod, Helmet e SQLite (`better-sqlite3`). Lambda de exemplo em `lambda/`.

**Riscos.** O Render serve um build antigo e a API não responde. A principal aceita push direto.

**Qualidade.** Vitest no front (11), `node --test` na API (8), build no CI. Sem alertas no `npm audit --omit=dev`.

**Definição de pronto.** CI verde, teste novo, `MVP.md` e README atualizados.

### Plano de ação

**Executado neste ciclo.** Linha de total; testes de carregamento, vazio, erro HTTP e resposta inválida; gatilho do CI para `developer-**`; régua N1 e critérios 6, 9 e 10 revistos; seção de estado no README.

**Vira issue.** #20 a #24.

## Ciclo de 07/11/2026

> Executado em 09/11/2026. Nível N1. Sprint `developer-sprint-2026-11-12`, feature `feature/2026-11-07`.

### Produto

**Problema e público.** Quem gere benefícios consulta as categorias e ajusta a frequência por área. Sem mudança.

**Meta do ciclo.** Fechar o critério 3: percorrer na tela filtrar, trocar a frequência, excluir e salvar, e cobrir com teste.

**O que a pesquisa trouxe.**
- A Testing Library recomenda consultar a tela como a pessoa usa, com `getByRole` primeiro. Fonte: [Testing Library, consultas](https://testing-library.com/docs/api-queries). O teste novo usa papéis e nomes acessíveis e roda com a lista em duas ordens.
- Avisar antes de sair com alterações não salvas, ligando o `beforeunload` só enquanto há algo a perder e removendo depois. Fontes: [cópia da documentação da MDN sobre `beforeunload`](https://docs.w3cub.com/dom/window/beforeunload_event) e [Cloudscape, padrão de alterações não salvas](https://cloudscape.design/patterns/general/unsaved-changes/).

**Backlog do ciclo (impacto × esforço).**

| # | Item | Impacto | Esforço | Situação |
|---|---|---|---|---|
| 1 | Percorrer o fluxo na tela e registrar | Alto | Baixo | Feito |
| 2 | Teste do fluxo nas duas ordens (#20) | Médio | Baixo | Feito |
| 3 | Tabelas roláveis com foco (axe grave, achado no percurso) | Médio | Baixo | Feito |
| 4 | Aviso ao sair com alterações não salvas (pesquisa) | Médio | Baixo | Feito |
| 5 | CI em push para `developer-**` | Baixo | Baixo | Feito |
| 6 | Total por frequência no resumo (#24) | Médio | Médio | Próximo ciclo |

**Fora do escopo.** Persistir o resumo na API; republicar (#21).

### Engenharia

**Arquitetura.** Front React 18 + React Bootstrap com Vite; API Express + SQLite (`better-sqlite3`) com `GET /categorias`. O resumo é estado local: "Salvar" grava só na memória da página.

**Riscos.** O "Salvar" não persiste: recarregar a página perde as alterações (o aviso ao sair reduz o risco). Site publicado antigo (#21). Sem proteção na `main` (#22).

**Qualidade.** Front 15 testes (`npx vitest run`) e build; API 8 (`npm test` em `api`). axe sem violações depois da correção.

**Definição de pronto.** CI verde no PR para a sprint; `docs/MVP.md` e README atualizados; PR com `revisao-responsavel`.

### Plano de ação

**Este ciclo executa.** Itens 1 a 5.

**Vira issue.** Salvar o resumo na API; #24 segue; #21, #22 e #23 com o responsável; mesclar o ciclo (responsável).
