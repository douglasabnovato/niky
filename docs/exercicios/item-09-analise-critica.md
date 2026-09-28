# Item 9 — Análise crítica do layout e o que foi aplicado

| # | Ponto de melhoria (análise original) | Situação em 27/09/2026 |
|---|---|---|
| 1 | Ocupar a tela inteira | ✅ Layout em tela cheia com `min-height: 100vh` e conteúdo centralizado até 1280 px |
| 2 | Barra de pesquisa à direita | ✅ Busca à direita na barra superior e **funcional** (filtra categorias, ignora acentos) |
| 3 | Tabelas com o mesmo desenho | ✅ Mesmo cabeçalho arredondado e tipografia nas duas tabelas |
| 4 | Linhas horizontais na tabela de categorias | ✅ |
| 5 | CRUD completo na tabela de categorias | ⏸️ Não aplicado: a API do item 7 é somente leitura; fica como evolução |
| 6 | Resumo sem cores por linha e sem negrito | ✅ Cores removidas (também resolviam contraste insuficiente nas linhas verde-claro e amarela) |
| 7 | Botões com o mesmo padrão | ✅ Dois botões do mesmo tamanho, sem ícone |
| 8 | Revisar as duas ações afirmativas | ✅ "Ativar categoria" virou **"Descartar alterações"**; os dois botões só habilitam quando há mudança |
| 9 | Primária forte e secundária de contraste | ✅ Primária no azul da barra; secundária em contorno |
| 10 | Centralizar em telas largas | ✅ `max-width: 1280px` com margens automáticas |
| 11 | Empilhar em tablet e celular | ✅ Uma coluna abaixo de 992 px; busca em largura total abaixo de 576 px |
| 12 | Uma rota por funcionalidade | ⏸️ Não aplicado: com duas tabelas pequenas, abas aumentariam cliques sem ganho; reavaliar quando houver CRUD |

## Achados adicionais

- **Coluna "Qtd. Beneficiários"** existe na tabela do item 7 e não aparecia no layout: foi incluída, porque é ela que explica o "Valor total".
- **Divergência de dados:** "Saúde" deveria somar R$ 29.400,00 pela regra valor × beneficiários; o enunciado traz R$ 41.160,00.
