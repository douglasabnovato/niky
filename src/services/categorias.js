/*
 * categorias.js · cliente da API GET /categorias (item 8).
 * A URL vem de VITE_API_URL; sem ela, usa a API local da pasta api/ (porta 3333).
 */
export const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:3333").replace(/\/$/, "");

/* Busca as categorias; lança Error com mensagem amigável em falha de rede ou HTTP. */
export async function fetchCategorias({ signal } = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}/categorias`, { signal });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new Error("Não foi possível conectar à API de categorias.");
  }
  if (!response.ok) throw new Error(`A API respondeu com erro ${response.status}.`);
  const data = await response.json();
  if (!Array.isArray(data)) throw new Error("Resposta inesperada da API.");
  return data;
}
/* fim de categorias.js */
