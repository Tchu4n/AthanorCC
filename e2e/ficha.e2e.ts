import { readFile } from "node:fs/promises";
import { expect, test, type Page } from "@playwright/test";
import { PDFParse } from "pdf-parse";

const h1 = (page: Page) => page.getByRole("heading", { level: 1 });
const radio = (page: Page, name: string) => page.getByRole("radio", { name, exact: true });
const checkbox = (page: Page, name: string) => page.getByRole("checkbox", { name, exact: true });
const preview = (page: Page) => page.getByRole("complementary", { name: "Prévia da ficha" });
const exportar = (page: Page) => preview(page).getByRole("button", { name: "Exportar PDF" });

async function next(page: Page, expected: string) {
  await page.getByRole("button", { name: "Avançar" }).click();
  await expect(h1(page)).toHaveText(expected);
}

// Personagem mínimo até a página de concluído, onde ficam a prévia, o retrato e o nome.
async function concluirMinimo(page: Page, nome = "Corvo") {
  await page.goto("/criar");
  await radio(page, "Midland").check();
  await page.getByRole("button", { name: "Avançar" }).click(); // confirma a região e mostra as subregiões
  await radio(page, "Andarilho/Aventureiro").check();
  await next(page, "Espécie");
  await radio(page, "Centauros").check();
  for (const etapa of ["Ofício", "Fé", "Marcas", "Aparência", "Identidade"]) await next(page, etapa);
  await page.getByLabel("Nome (obrigatório)").fill(nome);
  await next(page, "Revisão");
  await page.getByRole("button", { name: "Concluir" }).click();
  await expect(h1(page)).toHaveText("Personagem concluído");
}

async function noHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
}

test("personagem completo: prévia acompanha e o PDF baixa com o nome certo", async ({ page }) => {
  await page.goto("/criar");
  await expect(preview(page)).toHaveCount(0); // a prévia só aparece no final
  await radio(page, "Reino de Laguardia").check();
  await page.getByRole("button", { name: "Avançar" }).click(); // confirma a região e mostra as subregiões
  await radio(page, "Schwarzenberg").check();
  await next(page, "Espécie");
  await radio(page, "Humano").check();
  await next(page, "Subespécie");
  await radio(page, "Elite de orelhas pontudas").check();
  await next(page, "Ofício");
  await radio(page, "Mago ortodoxo").check();
  await next(page, "Fé");
  await checkbox(page, "Umbra").check();
  await checkbox(page, "Activum").check();
  await next(page, "Marcas");
  await checkbox(page, "Terceiro Olho").check();
  await checkbox(page, "Gaiola de bateria").check();
  await next(page, "Aparência");
  await radio(page, "Mago ortodoxo de Laguardia").check();
  await page.getByLabel("Notas de aparência").fill("Gola franzida, luvas de couro vulcanizado");
  await next(page, "Identidade");

  await page.getByLabel("Nome (obrigatório)").fill("Isabela de Souça");
  await page.getByLabel("Idade", { exact: true }).fill("34");
  await page.getByLabel("História curta").fill("Fugiu da corte de Schwarzenberg.");
  await page.getByLabel("Personalidade").fill("Fria e calculista.");
  await next(page, "Revisão");
  await expect(preview(page)).toHaveCount(0);
  await page.getByRole("button", { name: "Concluir" }).click();
  await expect(h1(page)).toHaveText("Personagem concluído");
  await expect(exportar(page)).toBeEnabled();

  for (const text of ["Isabela de Souça", "Reino de Laguardia, Schwarzenberg", "Humano (Elite de orelhas pontudas)", "Mago ortodoxo", "Umbra", "Activum", "Terceiro Olho", "Gaiola de bateria", "Mago ortodoxo de Laguardia"])
    await expect(preview(page)).toContainText(text);
  await expect(preview(page).getByRole("img", { name: "Mago ortodoxo de Laguardia" })).toBeVisible();

  const [download] = await Promise.all([page.waitForEvent("download"), exportar(page).click()]);
  expect(download.suggestedFilename()).toBe("ficha-isabela-de-souca.pdf");
  const bytes = await readFile(await download.path());
  expect(bytes.subarray(0, 5).toString()).toBe("%PDF-");

  const parser = new PDFParse({ data: new Uint8Array(bytes) });
  const { text } = await parser.getText();
  await parser.destroy();
  for (const s of ["Isabela de Souça", "Humano (Elite de orelhas pontudas)", "Reino de Laguardia, Schwarzenberg", "Gaiola de bateria", "Fugiu da corte de Schwarzenberg."])
    expect(text).toContain(s);
});

test("exportar fica desabilitado sem nome", async ({ page }) => {
  await concluirMinimo(page);
  await page.getByRole("region", { name: "Personagem" }).getByLabel("Nome do personagem").fill("");
  await expect(exportar(page)).toBeDisabled();
  await expect(exportar(page)).toHaveAccessibleDescription("Dê um nome ao personagem para exportar");
});

test("prévia, retrato e nome só aparecem no final; o nome editado lá atualiza a prévia", async ({ page }) => {
  await page.goto("/criar");
  await expect(preview(page)).toHaveCount(0);
  await expect(page.getByRole("region", { name: "Personagem" })).toHaveCount(0);
  await concluirMinimo(page);
  const painel = page.getByRole("region", { name: "Personagem" });
  await expect(painel.locator("[data-retrato] svg")).toBeVisible(); // sem imagem: silhueta
  await expect(painel.getByRole("button")).toHaveCount(0);
  await expect(preview(page)).toContainText("Centauros");
  await painel.getByLabel("Nome do personagem").fill("Corvo Velho");
  await expect(preview(page)).toContainText("Corvo Velho");
});

test("prévia fica ao lado no desktop e abaixo das etapas no celular, sem overflow", async ({ page }, info) => {
  await concluirMinimo(page);
  await page.evaluate(() => window.scrollTo(0, 0));
  const main = await page.getByRole("main").boundingBox();
  const aside = await preview(page).boundingBox();
  expect(main && aside).toBeTruthy();
  if (info.project.name === "mobile-375") {
    expect(aside!.y).toBeGreaterThanOrEqual(main!.y + main!.height);
    expect(aside!.x + aside!.width).toBeLessThanOrEqual(375);
  } else {
    expect(aside!.x).toBeGreaterThanOrEqual(main!.x + main!.width);
    // no final, a coluna direita tem a vitrine, o retrato com o nome e a prévia
    const vitrine = await page.locator("[data-vitrine]:visible").boundingBox();
    const painel = await page.getByRole("region", { name: "Personagem" }).boundingBox();
    expect(vitrine!.y).toBeLessThan(main!.y + 50);
    expect(painel!.y).toBeGreaterThanOrEqual(vitrine!.y + vitrine!.height);
    expect(aside!.y).toBeGreaterThanOrEqual(painel!.y + painel!.height);
  }
  await noHorizontalOverflow(page);
});
