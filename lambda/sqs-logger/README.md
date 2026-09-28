# Item 11 — Fila SQS com gatilho Lambda (nível gratuito da AWS)

O código da Lambda está em [`index.mjs`](./index.mjs). Os passos abaixo precisam ser feitos na sua conta AWS e geram os prints pedidos em 11.b e 11.d.

## Passo a passo

1. **Criar a fila:** SQS → *Create queue* → tipo **Standard**, nome `niky-fila`. Deixe o *visibility timeout* em 30 s (precisa ser maior que o timeout da Lambda).
2. **Criar a função:** Lambda → *Create function* → *Author from scratch*, nome `niky-sqs-logger`, runtime **Node.js 20.x**, arquitetura arm64. Cole o conteúdo de `index.mjs` e clique em *Deploy*.
3. **Permissão de leitura da fila:** na função, *Configuration → Permissions* → abra a role e anexe a política gerenciada `AWSLambdaSQSQueueExecutionRole`.
4. **Ligar a fila à função (11.b):** na função, *Add trigger* → **SQS** → `niky-fila`, *batch size* 10, marque **Report batch item failures**. Tire o print da tela que mostra o gatilho SQS ligado à função.
5. **Enviar a mensagem:** SQS → `niky-fila` → *Send and receive messages* → cole o JSON do enunciado → *Send message*.
6. **Ver o log (11.d):** Lambda → *Monitor → View CloudWatch logs* → último *log stream*. A linha registrada tem o formato `{"messageId":"…","body":{…}}`. Tire o print.

## Testar sem a AWS

```bash
node -e "import('./index.mjs').then(async m => console.log(await m.handler(JSON.parse(require('fs').readFileSync('event.test.json','utf8')))))"
```

## Custo

O nível gratuito cobre 1 milhão de requisições SQS e 1 milhão de invocações Lambda por mês. Apague a fila e a função ao terminar a avaliação.
