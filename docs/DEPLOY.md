# Deploy · Niky

Plano de ação para publicar o front-end e a API do teste Niky em hospedagem gratuita.

## 1. Desafio

Publicar duas peças que conversam entre si (front CRA que consome `GET /categorias` e API Express + SQLite) sem custo, com a URL da API configurável e sem segredos no código.

## 2. Conteúdo

### Decisão de hospedagem

| Peça | Onde | Por quê |
|---|---|---|
| **API** (`api/`) | Render, serviço web gratuito (`niky-api`) | Node + SQLite com `rootDir: api` |
| **Front** (raiz) | Render, site estático gratuito (`niky`) | CDN, não hiberna, variável `REACT_APP_API_URL` no build |

Os dois ficam no mesmo `render.yaml` e sobem com um único Blueprint.

### Pontos de atenção

- A API dorme após 15 min sem acesso: a primeira carga do front pode levar cerca de 1 min, e a tela mostra o estado de carregamento e, se passar do tempo, o erro com a opção de tentar de novo.
- O disco da API é temporário: o schema é reaplicado a cada início (idempotente) e as categorias vêm do mock `categorias.json`.
- CORS: a API aceita qualquer origem por padrão (`CORS_ORIGIN` opcional); o conteúdo é público e somente de leitura no front.

### O que foi ajustado para o deploy

| Mudança | Arquivo | Por quê |
|---|---|---|
| Blueprint com API e front | `render.yaml` | Os dois serviços e a ligação entre eles versionados |
| `package-lock.json` do front regenerado | `package-lock.json` | Estava fora de sincronia com o `package.json` e o `npm ci` do deploy falhava |
| Seção de publicação com links | `readme.md` | Endereços e limitações para quem visita |

### Verificação feita antes da entrega

- API: `npm ci` limpo, 8 testes passando, `npm audit --omit=dev` sem vulnerabilidades, `/health` e `/categorias` respondendo 200.
- Front: `npm ci` limpo, 6 testes passando, build com `CI=true` compilado sem avisos.

## 3. Solução (passo a passo)

### Etapa 1 · Validar localmente (Git Bash)

1. `cd /c/ambiente-projeto/ser-mvp/niky/api && npm ci && npm test && npm start` (deixe rodando)
2. Em outro terminal: `cd /c/ambiente-projeto/ser-mvp/niky && npm ci && npm test -- --watchAll=false && npm start`
3. A lista de categorias aparece e as ações de marcar e excluir pedem confirmação.

### Etapa 2 · Subir para o GitHub

1. `cd /c/ambiente-projeto/ser-mvp/niky`
2. `git rm src/assets/check-lg.svg src/assets/search.svg src/assets/trash-fill.svg src/components/App/assets/photo-1.jpg` (arquivos sem referência)
3. `git status` (não podem aparecer `node_modules/`, `build/`, `api/data/` nem `.sqlite`)
4. `git add -A`
5. `git commit -m "feat: API Express+SQLite 3FN, lambda SQS, exercícios, testes e deploy no Render (API + front)"`
6. `git push`

### Etapa 3 · Criar os serviços no Render

1. Entrar em **render.com** com o GitHub e autorizar o repositório `niky`.
2. **New → Blueprint** e escolher `douglasabnovato/niky`.
3. Conferir os dois serviços (`niky-api` web Free e `niky` Static Site) e clicar em **Apply**.
4. Quando a API terminar, abrir `https://<endereço-da-api>/health`.
5. Se o endereço da API não for `https://niky-api.onrender.com`, abrir o serviço `niky` → **Environment**, corrigir `REACT_APP_API_URL` e clicar em **Manual Deploy → Deploy latest commit** (a variável entra no build).

### Etapa 4 · Conferir no ar

1. Abrir o front: as categorias carregam (a primeira vez pode demorar enquanto a API acorda).
2. Buscar, marcar e excluir uma categoria (com confirmação).
3. `https://<endereço-da-api>/categorias` devolve o JSON do mock.

### Etapa 5 · Fechar

1. Se os endereços reais forem diferentes, corrigir o `readme.md` e o `render.yaml`, commit e push.
2. No GitHub, **About → Website**: colar a URL do front.
3. Item 11 (SQS + Lambda) é opcional e roda na AWS: seguir `lambda/sqs-logger/README.md` e gerar as capturas 11.b e 11.d.
