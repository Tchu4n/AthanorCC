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

async function noHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
}

test("personagem completo: prévia acompanha e o PDF baixa com o nome certo", async ({ page }) => {
  await page.goto("/criar");
  await expect(preview(page)).toContainText("—");
  await radio(page, "Reino de Laguardia").check();
  await radio(page, "Schwarzenberg").check();
  await expect(preview(page)).toContainText("Reino de Laguardia, Schwarzenberg");
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
  await next(page, "Aparência");
  await radio(page, "Mago ortodoxo de Laguardia").check();
  await page.getByLabel("Notas de aparência").fill("Gola franzida, luvas de couro vulcanizado");
  await next(page, "Identidade");

  await expect(exportar(page)).toBeDisabled();
  await expect(preview(page)).toContainText("Dê um nome ao personagem para exportar");
  await page.getByLabel("Nome (obrigatório)").fill("Isabela de Souça");
  await page.getByLabel("Idade", { exact: true }).fill("34");
  await page.getByLabel("História curta").fill("Fugiu da corte de Schwarzenberg.");
  await page.getByLabel("Personalidade").fill("Fria e calculista.");
  await expect(exportar(page)).toBeEnabled();

  for (const text of ["Isabela de Souça", "Humano (Elite de orelhas pontudas)", "Mago ortodoxo", "Umbra", "Activum", "Terceiro Olho", "Gaiola de bateria", "Mago ortodoxo de Laguardia"])
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
  await page.goto("/criar");
  await expect(exportar(page)).toBeDisabled();
  await expect(exportar(page)).toHaveAccessibleDescription("Dê um nome ao personagem para exportar");
});

test("prévia atualiza ao trocar a espécie", async ({ page }) => {
  await page.goto("/criar");
  await radio(page, "Midland").check();
  await radio(page, "Andarilho/Aventureiro").check();
  await next(page, "Espécie");
  await radio(page, "Humano").check();
  await expect(preview(page)).toContainText("Humano");
  await radio(page, "Vampiros").check();
  await expect(preview(page)).toContainText("Vampiros");
  await expect(preview(page)).not.toContainText("Humano");
});

test("prévia fica ao lado no desktop e abaixo das etapas no celular, sem overflow", async ({ page }, info) => {
  await page.goto("/criar");
  await radio(page, "Midland").check();
  const main = await page.getByRole("main").boundingBox();
  const aside = await preview(page).boundingBox();
  expect(main && aside).toBeTruthy();
  if (info.project.name === "mobile-375") {
    expect(aside!.y).toBeGreaterThanOrEqual(main!.y + main!.height);
    expect(aside!.x + aside!.width).toBeLessThanOrEqual(375);
  } else {
    expect(aside!.x).toBeGreaterThanOrEqual(main!.x + main!.width);
    expect(aside!.y).toBeLessThan(main!.y + 50);
  }
  await noHorizontalOverflow(page);
});
