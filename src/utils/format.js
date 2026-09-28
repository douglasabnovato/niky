/*
 * format.js · formatação monetária no padrão brasileiro.
 */
const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

/* Converte número em "R$ 1.234,56". */
export function formatBRL(value) {
  return currency.format(Number(value) || 0);
}
/* fim de format.js */
