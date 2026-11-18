# MVP — niky

> Revisto em 15/11/2026 (ciclo de 15/11/2026) e em 16/11/2026 (correções da revisão do PR #32; critério 9 com os alertas do Dependabot ligados, 12h03). **Nível: N1 (estudo).** Meta: N1. Testado no Windows com Node 24 e no CI com Node 22. Não houve teste com pessoas nem em aparelho real.

**Resumo:** 10 de 10 aplicáveis atendidos
**Finalizado:** sim. Todos os critérios aplicáveis atendem; o 9 passou a "Atende" em 16/11/2026, quando o responsável ligou os alertas do Dependabot.

Régua N1: os critérios 5 e 7 são "Não se aplica (N1)" e saem do denominador. Antes deste ciclo, a conferência de 15/11 contou **7 de 10**: os critérios 2, 3 e 8 estavam marcados "Atende" sem a evidência que a régua pede (hipótese sem meta; fluxo sem teste no navegador; axe rodado à mão). O ciclo chegou à `main` pelo PR #30, mesclado em 16/11/2026 (`gh pr view 30`, conferido em 18/11/2026). O site publicado serve um build antigo (#21; `curl` em 18/11/2026: HTTP 200, `lang="en"`, título "Nikey").

Em 18/11/2026 (triagem das issues), a feature `feature/2026-11-18` levou a API ao Express 5 (#35) e a Testing Library ao 16, com jsdom 31 (#36), sem mudar critério: local, `npm test` 16 de 16 na raiz, `npm test` em `api` 9 de 9 com `# skipped 0`, `npm run test:e2e` 3 de 3 e `npm audit --omit=dev` com 0 vulnerabilidades na raiz e em `api`.

| # | Critério | Como verificar | Situação e evidência (15 e 16/11/2026) |
|---|---|---|---|
| 1 | Problema e público claros | Dá para explicar em uma frase | Atende: quem gere benefícios vê as categorias e o custo total e ajusta a frequência por área, sem excluir o que é mensal (seção "Problema e público"). |
| 2 | Hipótese a validar | Aposta escrita, com meta | Atende: seção "Hipótese", com meta e "saberemos quando"; medida pelo teste do critério 3. Sem validação com pessoas (N1). |
| 3 | Fluxo principal completo | Teste de ponta a ponta no navegador passando no CI | Atende: `npm run test:e2e` (Playwright 1.65, `e2e/fluxo.e2e.js`) sobe a API real e o front e percorre buscar, filtrar, trocar a frequência, excluir com confirmação, ver o bloqueio do Mensal e salvar. Job `e2e` do CI, run 43795783549 (commit `5075d95`, o último do PR #32, 16/11/2026 00h03, horário de Brasília): 6 passed, que eram os 3 testes repetidos em dois projetos iguais. Desde 16/11/2026 há um projeto só: local, 16/11/2026: 3 de 3. |
| 4 | Escopo enxuto | Seção "Fora do MVP" | Atende: seção "Fora do MVP". |
| 5 | Medição de uso | A métrica principal é coletada | Não se aplica (N1): projeto de estudo sem coleta de uso. |
| 6 | Falhas tratadas | Testes de falha de rede, vazio e espera | Atende: no Vitest, carregamento, falha de rede com "Tentar novamente", HTTP 500, resposta inválida, busca vazia e aviso ao sair com alterações não salvas; no Playwright, a API cortada mostra o erro e "Tentar novamente" recupera a lista, e a busca sem resultado mostra o vazio. `npm test`, 15/11: 16 de 16; run 43795151726 verde. |
| 7 | Desempenho aceitável | LCP de até 2,5 s no celular | Não se aplica (N1). O site publicado está desatualizado (#21). |
| 8 | Acessibilidade básica | axe (claro e escuro, desktop, dados reais) e teclado | Atende: o axe (`@axe-core/playwright` 4.14, tags WCAG 2.1 A e AA) roda dentro do teste do critério 3 em 5 estados da tela (lista, diálogo, erro do Mensal, salvo, falha de rede), no projeto `desktop-chrome` (tema claro; o app não tem tema escuro próprio: o `style.css` não usa `prefers-color-scheme` e o app não usa `data-bs-theme`), com os 7 itens da API: 0 violações (run 43795783549). O axe achou contraste de 3,39:1 no botão "Tentar novamente", corrigido neste ciclo. Teste só de teclado: Tab com anel de foco visível, o foco chega por Tab ao botão de excluir e ao de confirmar (sem `.focus()` no teste), Esc fecha a confirmação e devolve o foco, e o foco vai para a mensagem depois de excluir. |
| 9 | Segurança e conformidade | `npm audit --omit=dev`, Dependabot, segredos, dados pessoais | Atende: `gh api "repos/douglasabnovato/niky/dependabot/alerts?state=open&per_page=100"`, 16/11/2026 12h03: 0 alertas abertos; `npm ci` e `npm audit --omit=dev`, 16/11/2026 12h03 a 12h23, na raiz e em `api`: found 0 vulnerabilities nos dois. Sem segredo no código (`.env.example` só com nomes). Dados de teste são do mock, sem dados pessoais. |
| 10 | Entrega confiável | CI nos PRs e principal protegida | Atende: `gh api repos/douglasabnovato/niky/rulesets/<id>`, 15/11/2026: ruleset `principal-protegida` ativo, com `deletion`, `non_fast_forward`, `pull_request` e `required_status_checks` (`raiz` e `api`). O job novo `e2e` ainda não é obrigatório (#34). O CI roda nos PRs e em push para `main` e `developer-**`. |
| 11 | Testes dos fluxos críticos | Log do CI sem `# skipped` | Atende: run 43795783549, 16/11/2026 00h03: `raiz` 16 de 16 (Vitest), `api` `# pass 8` e `# skipped 0`, `e2e` 6 passed (3 testes em dois projetos iguais; agora 3), sem testes pulados. |
| 12 | Documentação honesta | README com comandos conferidos contra o `package.json` | Atende: README e `docs/DEPLOY.md` revistos em 16/11/2026 (commit `481a208`, 00h01, horário de Brasília) contra os scripts (`start`, `build`, `test`, `test:e2e` na raiz; `start`, `test` em `api`); o link publicado aparece com o aviso de que serve um build antigo (`curl` em 16/11/2026, 00h11, horário de Brasília: HTTP 200 no front e 404 na API). |

## Problema e público

Quem gere benefícios de uma empresa precisa ver as categorias (alimentação, combustível etc.), a recorrência e o custo total, e ajustar o resumo por área sem excluir o que é mensal. É o teste técnico da Niky (itens 6 a 10), feito como estudo.

## Hipótese

Acreditamos que a tela com busca, filtro, troca de frequência e a regra do Mensal deixa uma pessoa concluir o fluxo do desafio sem ajuda. **Saberemos quando** um teste no navegador percorrer buscar, filtrar, trocar a frequência, excluir com confirmação e salvar, passando no CI com 0 violações do axe (tema claro; o app não tem tema escuro próprio) e com um percurso só pelo teclado. **Meta:** esse teste verde em todo PR para a sprint e para a `main`. Estado em 16/11/2026: atingida no run 43795783549.

## Fora do MVP

- Gravar o resumo na API (#28): o "Salvar" grava só na memória da página.
- Permissões, login e integrações externas.
- Validação jurídica das categorias de benefício.
- Total por frequência (#24), que fica para o próximo ciclo.

## Neste ciclo (15/11/2026)

Teste Playwright do fluxo com axe (tema claro; o app não tem tema escuro próprio) e job `e2e` no CI; contraste do botão "Tentar novamente" corrigido; foco na mensagem depois de excluir; Bootstrap 5.3.9; `DEPLOY.md` revisto. Detalhes em [PLANO-DE-ACAO.md](PLANO-DE-ACAO.md), seção "Ciclo de 15/11/2026".

## Histórico

- **16/11/2026:** o responsável ligou os alertas do Dependabot; o critério 9 passou de "Parcial" (API 403, #33) a "Atende", com 0 alertas abertos e 0 no audit de produção. Resumo: 9 → 10 de 10.
- **10/11/2026:** o critério 10 passou a "Atende" com o ruleset `principal-protegida` (#22).
- **09/11/2026 (ciclo de 07/11):** a tabela marcava 9 de 10, e depois 10 de 10. O critério 3 se apoiava num percurso manual no navegador e em testes no jsdom, e o 8 num axe rodado à mão. Pela régua, os dois eram "Parcial"; o 2 não tinha meta. Corrigido em 15/11.
- **06/11/2026 (ciclo de 03/11):** 8 de 10 (3 e 10 parciais). Régua N1 aplicada; linha de total; testes de carregamento, vazio e erro.
- **02/11/2026:** criado o `MVP.md`.
