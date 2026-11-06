/*
 * format.js · formatação monetária no padrão brasileiro.
 */
const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

/* Converte número em "R$ 1.234,56". */
export function formatBRL(value) {
  return currency.format(Number(value) || 0);
}
/* Soma o valor total e os beneficiários das categorias; valores inválidos contam como zero. */
export function totalizar(categorias) {
  return categorias.reduce(
    (t, c) => ({ valorTotal: t.valorTotal + (Number(c.valorTotal) || 0), beneficiarios: t.beneficiarios + (Number(c.beneficiarios) || 0) }),
    { valorTotal: 0, beneficiarios: 0 },
  );
}
/* fim de format.js */
