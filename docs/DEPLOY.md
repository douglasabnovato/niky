# Deploy · Niky

Passo a passo para publicar o front e a API do teste Niky no Render, no plano gratuito. Revisto em 16/11/2026, 00h01 (horário de Brasília). Criar a conta, o Blueprint e mexer no painel é do **responsável** (#21); o agente só prepara o código e este roteiro.

## 1. O que sobe

| Peça | Serviço no `render.yaml` | Tipo | Comando |
|---|---|---|---|
| API (`api/`) | `niky-api` | Web Service, `plan: free`, `rootDir: api` | `npm ci` e `npm start`; saúde em `/health` |
| Front (raiz) | `niky` | Static Site (`runtime: static`) | `npm ci && npm run build`; publica `./build` |

O front lê a URL da API de `VITE_API_URL` **no build**. Mudou a variável, precisa de um deploy novo do front.

Referência: [Render, Blueprint YAML Reference](https://render.com/docs/blueprint-spec) (site estático com `runtime: static` e `staticPublishPath`, sem plano de computação).

## 2. Estado em 16/11/2026, 00h11 (horário de Brasília, `curl`)

| Endereço | HTTP | O que serve |
|---|---|---|
| https://niky.onrender.com | 200 | Build antigo: `lang="en"`, título "Nikey", `last-modified` de 01/05/2025 |
| https://niky-api.onrender.com/health | 404 | Outro servidor (`x-render-origin-server: gunicorn`, Python). O nome `niky-api.onrender.com` não é desta API |

Conclusão: o Blueprint ainda não foi aplicado com o `render.yaml` atual. Quando for, o Render pode dar à API outro endereço (por exemplo, `niky-api-xxxx.onrender.com`), porque o subdomínio `niky-api` já responde com outro serviço. O passo 3.5 corrige isso.

## 3. Passo a passo (responsável)

### 3.1 Conferir localmente (opcional)

```bash
cd api && npm ci && npm start          # http://localhost:3333/health
# outro terminal, na raiz:
npm ci && npm start                    # http://localhost:3000
```

### 3.2 Esperar a `main`

O `render.yaml` publica a branch `main`. Mesclar antes o PR #30 (sprint → `main`).

### 3.3 Criar o Blueprint

1. Entrar em https://dashboard.render.com com a conta do GitHub.
2. **New +** → **Blueprint**.
3. Escolher o repositório `douglasabnovato/niky` (se não aparecer: **Configure account** → dar acesso ao repositório).
4. **Blueprint Name:** `niky`. **Branch:** `main`.
5. Conferir os dois serviços: `niky-api` (Web Service, Free) e `niky` (Static Site). Clicar em **Apply**.

Se o painel já tiver um serviço antigo `niky` (o site de 2025), o Render pede para ligar o Blueprint a ele ou criar outro. Ligar ao existente mantém o endereço `niky.onrender.com`.

### 3.4 Conferir a API

1. Abrir o serviço `niky-api` → copiar o endereço do topo (ex.: `https://niky-api-xxxx.onrender.com`).
2. Abrir `<endereço>/health`: deve mostrar `{"status":"ok"}`.
3. Abrir `<endereço>/categorias`: deve mostrar 7 categorias em JSON.

### 3.5 Ligar o front à API

1. Se o endereço da API **não** for `https://niky-api.onrender.com`: serviço `niky` → **Environment** → `VITE_API_URL` → **Edit** → colar o endereço da API, sem barra no fim → **Save changes**.
2. Serviço `niky` → **Manual Deploy** → **Deploy latest commit** (a variável só entra no build).
3. Opcional: o agente atualiza o `render.yaml` com o endereço real num PR, para o Blueprint não voltar ao valor antigo.

### 3.6 Conferir no ar

```bash
curl -s https://niky.onrender.com | grep -o 'lang="pt-BR"'            # o build novo
curl -s -o /dev/null -w "%{http_code}\n" <endereço-da-api>/categorias   # 200
```

Na tela: as categorias carregam (a primeira chamada pode levar cerca de 1 minuto, enquanto a API acorda), a busca filtra e excluir pede confirmação.

### 3.7 Fechar

1. Comentar na #21 o resultado dos dois `curl`, com a data.
2. No GitHub: **About** (engrenagem) → **Website** → `https://niky.onrender.com`.

## 4. Limites do plano gratuito

- A API dorme depois de 15 minutos sem acesso; a tela mostra "Carregando" e, se falhar, o erro com "Tentar novamente".
- O disco da API é temporário: o SQLite da academia (itens 3 e 4) volta vazio a cada reinício; as categorias vêm de `api/src/db/categorias.json`.
- CORS: a API aceita qualquer origem por padrão (`CORS_ORIGIN` opcional). Para restringir: serviço `niky-api` → **Environment** → `CORS_ORIGIN` = `https://niky.onrender.com`.
- Sem segredos: nenhuma variável deste projeto é sigilosa.

## 5. Item 11 (AWS)

A fila SQS e a Lambda rodam na conta AWS do responsável: seguir [lambda/sqs-logger/README.md](../lambda/sqs-logger/README.md) (#23).
