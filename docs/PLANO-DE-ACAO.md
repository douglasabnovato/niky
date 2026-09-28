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
| T13 | Must (usuário) | Publicar a API (Render/alwaysdata) e o front (Pages/Vercel) com `REACT_APP_API_URL` | 7b | C9 | 1 | ⏳ Com você |
| T14 | Must (usuário) | Criar fila e Lambda na AWS e tirar os prints 11.b e 11.d | 11 | C1 | 1 | ⏳ Com você |
| T15 | Could | CRUD de categorias e rotas separadas | 9.5, 9.12 | C1 | 3 | Roadmap |

## Definição de pronto

- `npm test -- --watchAll=false` na raiz (6/6) e `npm test` em `api/` (8/8).
- `npm run build` com `CI=true`.
- axe-core sem violações na tela com a mensagem de erro do item 10.c.
