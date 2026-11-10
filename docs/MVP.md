# MVP — niky

> Revisto em 09/11/2026 (ciclo de 07/11/2026). **Nível: N1 (estudo).** Meta: N1. Testado no Windows com Node 24 e no CI com Node 22. Não houve teste com pessoas nem em aparelho real.

**Resumo:** 10 de 10 aplicáveis atendidos
**Finalizado:** sim

Régua N1: os critérios 5 e 7 são "Não se aplica (N1)" e saem do denominador. Antes deste ciclo: 8 de 10. O 10 passou a "Atende" em 10/11/2026, com a `main` protegida (#22). O ciclo ainda não está na `main`: espera a revisão do responsável. O site publicado serve um build antigo (#21).

| # | Critério | Como verificar | Situação (09/11/2026; critério 10 revisto em 10/11/2026) |
|---|---|---|---|
| 1 | Problema e público claros | Dá para explicar em uma frase | Atende: quem gere benefícios vê categorias e ajusta a frequência por área. |
| 2 | Hipótese a validar | Existe uma aposta escrita, com meta | Atende: seção "Hipótese"; ainda sem validação com pessoas. |
| 3 | Fluxo principal completo | Uma pessoa conclui sem ajuda | Atende: em 09/11, API local (`node src/server.js`, SQLite) e front com `npx vite`, percorri no navegador embutido do app: a busca "educacao" acha "Educação" (1 categoria, total R$ 42.000,00); o filtro por grupo, com as setas do teclado, mostra só "Combustível"; Esc fecha a confirmação; a frequência de Combustível muda pelo teclado e liga "Salvar"; excluir "Saúde" (Mensal) mostra o erro com `role="alert"`; excluir "Transporte" mostra "excluída. Salve para confirmar."; "Salvar alterações" mostra "Alterações salvas." e os botões voltam a desligados. Testes em `App.test.jsx`: filtro, troca de frequência e Salvar nas duas ordens da lista (#20, novo); exclusão com confirmação e bloqueio do Mensal (testes já existentes). |
| 4 | Escopo enxuto | O que não entra está registrado | Atende: seção "Fora do MVP". |
| 5 | Medição de uso | A métrica principal é coletada | Não se aplica (N1): projeto de estudo sem coleta de uso. |
| 6 | Falhas tratadas | Erro, vazio e carregamento têm resposta clara | Atende: carregamento, vazio na busca, falha de rede com "Tentar novamente", HTTP 500 e resposta inválida têm teste; agora o navegador avisa ao sair com alterações não salvas (teste). `npx vitest run` em 09/11: 15 de 15. |
| 7 | Desempenho aceitável | LCP de até 2,5 s no celular | Não se aplica (N1), pela régua de estudo. O site publicado está desatualizado (#21). |
| 8 | Acessibilidade básica | axe e teclado | Atende: o axe-core 4.10 acusou em 09/11 `scrollable-region-focusable` (grave) na tabela de categorias; corrigido (tabelas roláveis com foco), e o axe ficou sem violações. Foco visível nos combos (anel do Bootstrap); sem rolagem lateral em 375 px. |
| 9 | Segurança e conformidade | Riscos decididos | Atende: `npm audit --omit=dev` sem alertas na raiz e em `api` em 06/11/2026 (zod 4, PR #17); sem dependência nova neste ciclo. |
| 10 | Entrega confiável | CI verde antes de entrar na principal | Atende: `gh api repos/douglasabnovato/niky/rulesets`, em 10/11/2026: ruleset `principal-protegida` ativo (exige PR, bloqueia force push e exclusão); o workflow `CI` roda nos PRs e em push para `main` e `developer-**` (#22). |
| 11 | Testes dos fluxos críticos | Testes automatizados no CI | Atende: front 15 testes (`npx vitest run`, 09/11), API 8 (`npm test` em `api`, 09/11), build no CI. |
| 12 | Documentação honesta | O README ensina a rodar | Atende: README com o ciclo de 07/11 e o aviso de que o site publicado é antigo. |

## Hipótese (proposta)

Praticar React com API: filtrar categorias e ajustar o resumo sem ajuda.

## Fora do MVP

Permissões e integrações externas.

## Neste ciclo (07/11/2026)

Fluxo principal percorrido na tela e testado nas duas ordens (#20), aviso ao sair com alterações não salvas, tabelas roláveis com foco, CI em push para `developer-**`. Detalhes em [PLANO-DE-ACAO.md](PLANO-DE-ACAO.md), seção "Ciclo de 07/11/2026".

## Histórico

### Estado em 06/11/2026 (ciclo de 03/11/2026)

> Criado em 02/11/2026. Meta: N1 (estudo). Testado no Windows, com Node 24, na cópia de `main`. Não houve teste com pessoas nem em aparelho real.

**Nível:** N1 (estudo). **Resumo em 06/11/2026:** 8 de 10 critérios aplicáveis atendem (1, 2, 4, 6, 8, 9, 11, 12); 2 parciais (3, 10); 5 e 7 não se aplicam (N1). **Finalizado: não.** Falta o critério 3 (#20), que o código resolve; o 10 depende do responsável (#22).

#### 1. Critérios: 8 de 10 aplicáveis atendidos

| # | Critério | Como verificar | Situação |
|---|---|---|---|
| 1 | Problema e público claros | Dá para explicar em uma frase | Atende: Quem gere benefícios vê categorias e cadastra grupos. |
| 2 | Hipótese a validar | Existe uma aposta escrita, com meta | Atende: Proposta na seção 2; ainda sem validação com pessoas. |
| 3 | Fluxo principal completo | Uma pessoa conclui sem ajuda | Parcial: No navegador, com API e SQLite locais: categorias carregaram; a seleção e o cadastro não foram percorridos na tela (#20). |
| 4 | Escopo enxuto | O que não entra está registrado | Atende: Seção 3. |
| 5 | Medição de uso | A métrica principal é coletada | Não se aplica (N1): projeto de estudo sem coleta de uso. |
| 6 | Falhas tratadas | Erro, vazio e carregamento têm resposta clara | Atende: testes de carregamento, lista vazia na busca, falha de rede com "Tentar novamente", erro HTTP 500 e resposta inválida (`App.test.jsx`, 06/11/2026). |
| 7 | Desempenho aceitável | LCP de até 2,5 s no celular | Não se aplica (N1): o site publicado está desatualizado (#21). |
| 8 | Acessibilidade básica | axe e teclado | Atende: Depois da correção, axe sem violações e sem rolagem em 375 px (antes, 199 px); foco visível. |
| 9 | Segurança e conformidade | Riscos decididos | Atende: `npm audit --omit=dev` sem alertas na raiz e em `api` em 06/11/2026 (zod 4, PR #17). |
| 10 | Entrega confiável | CI verde antes de entrar na principal | Parcial: CI verde nos PRs, mas a principal não tem proteção (#22). |
| 11 | Testes dos fluxos críticos | Testes automatizados no CI | Atende: Testes automatizados rodam no CI. |
| 12 | Documentação honesta | O README ensina a rodar | Atende: Comandos conferidos com o `package.json`; aviso de estudo no README. |

#### 2. Hipótese (proposta)

Praticar React com API: filtrar categorias e abrir o cadastro sem ajuda.

#### 3. Fora do MVP

Permissões e integrações externas.

#### 4. Neste ciclo

Corrige 199 px de rolagem horizontal em 375 px e atualiza dependências da API.

#### 5. Revisão de 06/11/2026 (ciclo de 03/11/2026)

- Régua N1: critérios 5 e 7 passam a "Não se aplica" e saem do denominador.
- Critério 6 vai para "Atende": o código já tinha carregamento, vazio e erro, e agora há teste de cada um.
- Critério 9 vai para "Atende"; critério 10 vai para "Parcial" (principal sem proteção).
- Tabela de categorias com linha de total. Testes do front: 11 (antes 6). API: 8.
