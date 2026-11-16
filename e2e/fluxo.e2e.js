/* Fluxo principal no navegador, com a API real: buscar, filtrar, trocar a frequência, excluir com confirmação e salvar */
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

/* axe sem violações nas regras WCAG A e AA; com o diálogo aberto, mede só o diálogo */
async function semViolacoes(page, seletor) {
  let axe = new AxeBuilder({ page }).withTags(TAGS);
  if (seletor) axe = axe.include(seletor);
  const { violations } = await axe.analyze();
  expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target + " " + n.failureSummary).join(" | ")}`)).toEqual([]);
}

/* Aperta Tab até o alvo receber o foco, com limite de tentativas; falha se não chegar */
async function tabAte(page, alvo, limite = 40) {
  for (let i = 0; i < limite; i += 1) {
    if (await alvo.evaluate((el) => el === document.activeElement)) return;
    await page.keyboard.press("Tab");
  }
  await expect(alvo).toBeFocused();
}

/* Linhas do corpo da tabela de categorias */
const linhasCategorias = (page) => page.getByRole("region", { name: "Categorias" }).locator("tbody tr");

test("busca, filtra, troca a frequência, exclui com confirmação e salva", async ({ page }) => {
  await page.goto("/");
  const categorias = page.getByRole("region", { name: "Categorias" });
  const resumo = page.getByRole("region", { name: "Resumo" });
  await expect(linhasCategorias(page)).toHaveCount(7);
  await semViolacoes(page);

  await page.getByRole("searchbox", { name: "Pesquisar categoria" }).fill("educacao");
  await expect(linhasCategorias(page)).toHaveCount(1);
  await expect(linhasCategorias(page).first()).toContainText("Educação");
  await expect(categorias.locator("tfoot")).toContainText("Total (1 categoria)");
  await expect(categorias.locator("tfoot")).toContainText("R$ 42.000,00");

  await page.getByRole("searchbox", { name: "Pesquisar categoria" }).fill("inexistente");
  await expect(categorias.getByRole("status")).toHaveText("Nenhuma categoria encontrada.");
  await page.getByRole("searchbox", { name: "Pesquisar categoria" }).fill("");

  await page.getByRole("combobox", { name: "Filtrar por grupo" }).selectOption("Combustível");
  await expect(linhasCategorias(page)).toHaveCount(1);
  await expect(linhasCategorias(page).first()).toContainText("Combustível");

  const salvar = resumo.getByRole("button", { name: "Salvar alterações" });
  await expect(salvar).toBeDisabled();
  await resumo.getByRole("combobox", { name: "Frequência de Combustível" }).selectOption("Semanal");
  await expect(salvar).toBeEnabled();

  await resumo.getByRole("button", { name: "Excluir Transporte" }).click();
  const dialogo = page.getByRole("dialog");
  await expect(dialogo).toContainText("Deseja excluir essa categoria?");
  await semViolacoes(page, ".modal");
  await dialogo.getByRole("button", { name: "Excluir", exact: true }).click();
  await expect(dialogo).toBeHidden();
  await expect(resumo.getByRole("button", { name: "Excluir Transporte" })).toHaveCount(0);
  await expect(resumo.getByRole("status")).toHaveText("Categoria Transporte excluída. Salve para confirmar.");

  await resumo.getByRole("button", { name: "Excluir Saúde" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Excluir", exact: true }).click();
  await expect(resumo.getByRole("alert")).toContainText("frequência Mensal não podem ser excluídas");
  await expect(resumo.getByRole("button", { name: "Excluir Saúde" })).toBeVisible();
  await semViolacoes(page);

  await salvar.click();
  await expect(resumo.getByRole("status")).toHaveText("Alterações salvas.");
  await expect(salvar).toBeDisabled();
  await expect(resumo.getByRole("button", { name: "Descartar alterações" })).toBeDisabled();
  await expect(resumo.getByRole("combobox", { name: "Frequência de Combustível" })).toHaveValue("Semanal");
  await semViolacoes(page);
});

test("só pelo teclado: foco visível, Esc fecha a confirmação e o foco não se perde ao excluir", async ({ page }) => {
  await page.goto("/");
  await expect(linhasCategorias(page)).toHaveCount(7);

  await page.keyboard.press("Tab");
  const busca = page.getByRole("searchbox", { name: "Pesquisar categoria" });
  await expect(busca).toBeFocused();
  const anel = await busca.evaluate((el) => getComputedStyle(el).boxShadow);
  expect(anel).not.toBe("none");

  await page.keyboard.press("Tab");
  await expect(page.getByRole("combobox", { name: "Filtrar por grupo" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("group", { name: "Tabela de categorias" })).toBeFocused();

  const excluir = page.getByRole("button", { name: "Excluir Alimentação" });
  await tabAte(page, excluir);
  await expect(excluir).toBeFocused();
  await page.keyboard.press("Enter");
  const dialogo = page.getByRole("dialog");
  await expect(dialogo).toBeVisible();
  await expect.poll(() => dialogo.evaluate((el) => el.contains(document.activeElement))).toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialogo).toBeHidden();
  await expect(excluir).toBeFocused();

  await page.keyboard.press("Enter");
  await expect(dialogo).toBeVisible();
  const confirmar = dialogo.getByRole("button", { name: "Excluir", exact: true });
  await tabAte(page, confirmar, 5);
  await expect(confirmar).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(dialogo).toBeHidden();
  const mensagem = page.getByRole("region", { name: "Resumo" }).getByRole("status");
  await expect(mensagem).toHaveText("Categoria Alimentação excluída. Salve para confirmar.");
  const alvo = page.locator("#mensagem-resumo");
  await expect(alvo).toBeFocused();
  expect(await alvo.evaluate((el) => getComputedStyle(el).outlineStyle)).toBe("solid");
});

test("sem a API, mostra o erro e volta com Tentar novamente", async ({ page }) => {
  let falhar = true;
  await page.route("**/categorias", (route) => (falhar ? route.abort() : route.continue()));
  await page.goto("/");
  await expect(page.getByText("Não foi possível conectar à API de categorias.")).toBeVisible();
  await semViolacoes(page);
  falhar = false;
  await page.getByRole("button", { name: "Tentar novamente" }).click();
  await expect(linhasCategorias(page)).toHaveCount(7);
});
/* fim de fluxo.e2e.js */
