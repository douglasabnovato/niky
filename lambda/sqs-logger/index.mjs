/*
 * index.mjs · Lambda (Node.js 20) acionada pela fila SQS do item 11.
 * Lê cada mensagem, valida o JSON e grava o conteúdo no log de execução (CloudWatch Logs).
 * Usa "partial batch response": só as mensagens com erro voltam para a fila.
 */

/* Registra cada mensagem do lote e devolve as que falharam para nova tentativa. */
export const handler = async (event) => {
  const batchItemFailures = [];
  for (const record of event.Records ?? []) {
    try {
      const body = JSON.parse(record.body);
      console.log(JSON.stringify({ messageId: record.messageId, body }));
    } catch (error) {
      console.error(JSON.stringify({ messageId: record.messageId, error: "JSON inválido", raw: record.body }));
      batchItemFailures.push({ itemIdentifier: record.messageId });
    }
  }
  return { batchItemFailures };
};
/* fim de index.mjs */
