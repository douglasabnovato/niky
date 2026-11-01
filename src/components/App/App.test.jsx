/*
 * App.test.js · itens 8 e 10: tabelas montadas pela API, estados de erro e regra de exclusão.
 */
import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import App, { DELETE_QUESTION, MONTHLY_ERROR } from "./index";

const CATEGORIAS = [
  { id: 1, categoria: "Alimentação", recorrencia: "Diária", valor: 45.5, valorTotal: 63700, beneficiarios: 70 },
  { id: 2, categoria: "Combustível", recorrencia: "Mensal", valor: 100, valorTotal: 3500, beneficiarios: 35 },
];

/* Simula a resposta do fetch. */
function mockFetch(response) {
  global.fetch = vi.fn(() => response);
}

describe("App", () => {
  test("monta as duas tabelas a partir de GET /categorias", async () => {
    mockFetch(Promise.resolve({ ok: true, json: () => Promise.resolve(CATEGORIAS) }));
    render(<App />);
    const categorias = await screen.findByRole("region", { name: "Categorias" });
    expect(within(categorias).getByText("R$ 63.700,00")).toBeInTheDocument();
    const resumo = screen.getByRole("region", { name: "Resumo" });
    expect(within(resumo).getByRole("combobox", { name: "Frequência de Alimentação" })).toHaveValue("Diária");
    expect(global.fetch.mock.calls[0][0]).toMatch(/\/categorias$/);
  });

  test("mostra erro com Tentar novamente quando a API falha", async () => {
    mockFetch(Promise.reject(new TypeError("Failed to fetch")));
    render(<App />);
    expect(await screen.findByText("Não foi possível conectar à API de categorias.")).toBeInTheDocument();
    mockFetch(Promise.resolve({ ok: true, json: () => Promise.resolve(CATEGORIAS) }));
    fireEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));
    expect(await screen.findByRole("region", { name: "Categorias" })).toBeInTheDocument();
  });

  test("pede confirmação e remove a linha quando a frequência não é Mensal", async () => {
    mockFetch(Promise.resolve({ ok: true, json: () => Promise.resolve(CATEGORIAS) }));
    render(<App />);
    fireEvent.click(await screen.findByRole("button", { name: "Excluir Alimentação" }));
    expect(screen.getByRole("dialog")).toHaveTextContent(DELETE_QUESTION);
    fireEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Excluir" }));
    expect(screen.queryByRole("button", { name: "Excluir Alimentação" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salvar alterações" })).toBeEnabled();
  });

  test("bloqueia a exclusão quando a frequência escolhida no combo é Mensal", async () => {
    mockFetch(Promise.resolve({ ok: true, json: () => Promise.resolve(CATEGORIAS) }));
    render(<App />);
    const combo = await screen.findByRole("combobox", { name: "Frequência de Alimentação" });
    fireEvent.change(combo, { target: { value: "Mensal" } });
    fireEvent.click(screen.getByRole("button", { name: "Excluir Alimentação" }));
    fireEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Excluir" }));
    expect(screen.getByRole("alert")).toHaveTextContent(MONTHLY_ERROR);
    expect(screen.getByRole("button", { name: "Excluir Alimentação" })).toBeInTheDocument();
  });

  test("cancelar a confirmação não altera nada", async () => {
    mockFetch(Promise.resolve({ ok: true, json: () => Promise.resolve(CATEGORIAS) }));
    render(<App />);
    fireEvent.click(await screen.findByRole("button", { name: "Excluir Combustível" }));
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(screen.getByRole("button", { name: "Excluir Combustível" })).toBeInTheDocument();
  });

  test("a busca filtra a tabela de categorias sem diferenciar acentos", async () => {
    mockFetch(Promise.resolve({ ok: true, json: () => Promise.resolve(CATEGORIAS) }));
    render(<App />);
    const categorias = await screen.findByRole("region", { name: "Categorias" });
    fireEvent.change(screen.getByRole("searchbox", { name: "Pesquisar categoria" }), { target: { value: "combustivel" } });
    const rows = within(categorias).getAllByRole("row").slice(1);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toHaveTextContent("Combustível");
  });
});
/* fim de App.test.js */
