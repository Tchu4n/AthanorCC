import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const h1 = (page: Page) => page.getByRole("heading", { level: 1 });
const radio = (page: Page, name: string) => page.getByRole("radio", { name, exact: true });
// há dois (celular no topo da etapa, desktop na coluna); só um aparece por vez
const minimapa = (page: Page) => page.locator("[data-minimapa]:visible");
const atual = (page: Page) => minimapa(page).locator("[data-pino-atual]");
// posição do pino destacado, em % do mapa (vem do style left/top)
const posicao = (page: Page) =>
  atual(page).evaluate((el) => [parseFloat((el as HTMLElement).style.left), parseFloat((el as HTMLElement).style.top)]);

// Centauros não têm subespécie: a próxima etapa já é a Origem.
async function ateOrigem(page: Page) {
  await page.goto("/criar");
  await radio(page, "Centauros").check();
  await page.getByRole("button", { name: "Avançar" }).click();
  await expect(h1(page)).toHaveText("Origem");
}

test("escolher Laguardia põe o pino nela, com rótulo e alt; trocar de região move o pino", async ({ page }) => {
  await ateOrigem(page);
  await expect(minimapa(page)).toBeVisible();
  await expect(atual(page)).toHaveCount(0); // sem escolha, nenhum pino destacado
  await expect(minimapa(page).getByRole("img")).toHaveAttribute("alt", "Mapa do continente de Athanor");

  await radio(page, "Reino de Laguardia").check();
  await expect(atual(page).locator("[data-rotulo-pino]")).toHaveText("Reino de Laguardia");
  await expect(minimapa(page).getByRole("img")).toHaveAttribute("alt", "Mapa do continente de Athanor. Pino na posição de Reino de Laguardia");
  const laguardia = await posicao(page);

  await radio(page, "Midland").check();
  await expect(atual(page).locator("[data-rotulo-pino]")).toHaveText("Midland");
  expect(await posicao(page)).not.toEqual(laguardia);
  await expect(minimapa(page).getByRole("button", { name: "Midland" })).toHaveAttribute("aria-pressed", "true");
});

test("clicar no pino escolhe a região; na fase das subregiões o mapa aproxima e os pinos escolhem a subregião", async ({ page }) => {
  await ateOrigem(page);
  await minimapa(page).getByRole("button", { name: "Blackwater" }).click();
  await expect(radio(page, "Blackwater")).toBeChecked();
  await page.getByRole("button", { name: "Avançar" }).click(); // confirma a região e mostra as subregiões
  await expect(minimapa(page).getByRole("button", { name: "Midland" })).toHaveCount(0); // só as subregiões de Blackwater
  await minimapa(page).getByRole("button", { name: "Jakarta" }).click();
  await expect(radio(page, "Jakarta")).toBeChecked();
  await expect(atual(page).locator("[data-rotulo-pino]")).toHaveText("Jakarta");
});

test("região sem posição no mapa mostra a nota e nenhum pino destacado", async ({ page }) => {
  await ateOrigem(page);
  await radio(page, "Man'naka oko").check();
  await expect(minimapa(page).getByRole("note")).toHaveText("Localização no mapa ainda não definida.");
  await expect(atual(page)).toHaveCount(0);
  await expect(minimapa(page).getByRole("button", { name: "Man'naka oko" })).toHaveCount(0);
});

test("minimapa sem violações críticas de acessibilidade e sem rolagem horizontal", async ({ page }) => {
  await ateOrigem(page);
  await radio(page, "Reino de Laguardia").check();
  await expect(atual(page).locator("[data-rotulo-pino]")).toBeVisible();
  const { violations } = await new AxeBuilder({ page }).include("[data-minimapa]").analyze();
  expect(violations.filter((v) => v.impact === "critical").map((v) => v.id)).toEqual([]);
  const sobra = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(sobra).toBeLessThanOrEqual(0);
});

test("/dev/mapa responde 404 em produção", async ({ page }) => {
  const resposta = await page.goto("/dev/mapa");
  expect(resposta?.status()).toBe(404);
});
