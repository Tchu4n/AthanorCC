import { readFile } from "node:fs/promises";
import { expect, test, type Page } from "@playwright/test";
import { PDFParse } from "pdf-parse";

const h1 = (page: Page) => page.getByRole("heading", { level: 1 });
const radio = (page: Page, name: string) => page.getByRole("radio", { name, exact: true });
const checkbox = (page: Page, name: string) => page.getByRole("checkbox", { name, exact: true });
const preview = (page: Page) => page.getByRole("complementary", { name: "Prévia da análise" });
const exportar = (page: Page) => preview(page).getByRole("button", { name: "Exportar análise em PDF" });

// Desenha um traço no quadro da assinatura (obrigatória para exportar).
async function assinar(page: Page) {
  const quadro = page.locator("[data-assinatura]");
  await quadro.scrollIntoViewIfNeeded(); // page.mouse não rola sozinho
  const caixa = (await quadro.boundingBox())!;
  await page.mouse.move(caixa.x + 20, caixa.y + caixa.height / 2);
  await page.mouse.down();
  for (let i = 1; i <= 10; i++) await page.mouse.move(caixa.x + 20 + i * 25, caixa.y + caixa.height / 2 + (i % 2 ? -15 : 15));
  await page.mouse.up();
}

async function next(page: Page, expected: string) {
  await page.getByRole("button", { name: "Avançar" }).click();
  await expect(h1(page)).toHaveText(expected);
}

// Personagem mínimo até a página de concluído, onde ficam a prévia, o retrato e o nome.
async function concluirMinimo(page: Page, nome = "Corvo") {
  await page.goto("/criar");
  await radio(page, "Centauros").check();
  await next(page, "Origem");
  await radio(page, "Midland").check();
  await page.getByRole("button", { name: "Avançar" }).click(); // confirma a região e mostra as subregiões
  await radio(page, "Andarilho/Aventureiro").check();
  for (const etapa of ["Ofício", "Fé", "Aparência", "Identidade"]) await next(page, etapa);
  await page.getByLabel("Nome (obrigatório)").fill(nome);
  await page.getByRole("radio", { name: "Incerto", exact: true }).check(); // sexo é obrigatório
  await next(page, "Revisão");
  await page.getByRole("button", { name: "Concluir" }).click();
  await expect(h1(page)).toHaveText("Arquivo confidencial");
}

async function noHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
}

test("personagem completo: prévia acompanha e o PDF baixa com o nome certo", async ({ page }) => {
  await page.goto("/criar");
  await expect(preview(page)).toHaveCount(0); // a prévia só aparece no final
  await radio(page, "Humano").check();
  await next(page, "Subespécie");
  await radio(page, "Elite de orelhas pontudas").check();
  await next(page, "Origem");
  await radio(page, "Reino de Laguardia").check();
  await page.getByRole("button", { name: "Avançar" }).click(); // confirma a região e mostra as subregiões
  await radio(page, "Schwarzenberg").check();
  await next(page, "Ofício");
  await radio(page, "Mago ortodoxo").check();
  await next(page, "Fé");
  await checkbox(page, "Umbra").check();
  await checkbox(page, "Activum").check();
  await next(page, "Aparência");
  await radio(page, "Mago ortodoxo de Laguardia").check();
  // escolher a imagem abre a janela de notas
  const notas = page.getByRole("dialog", { name: "Notas de aparência" });
  await expect(notas.getByLabel("Notas de aparência")).toBeFocused();
  await notas.getByLabel("Notas de aparência").fill("Gola franzida, luvas de couro vulcanizado");
  await notas.getByRole("button", { name: "Pronto" }).click();
  await expect(notas).toBeHidden();
  await next(page, "Identidade");

  await page.getByLabel("Nome (obrigatório)").fill("Isabela de Souça");
  await page.getByRole("radio", { name: "Incerto", exact: true }).check(); // sexo é obrigatório
  await page.getByRole("radio", { name: "Feminino", exact: true }).check();
  const idade = page.getByLabel("Idade (em anos) (opcional)", { exact: true });
  await idade.pressSequentially("3a4 anos"); // só os dígitos entram
  await expect(idade).toHaveValue("34");
  await page.getByLabel("História curta").fill("Fugiu da corte de Schwarzenberg.");
  await page.getByLabel("Personalidade").fill("Fria e calculista.");
  await next(page, "Revisão");
  await expect(preview(page)).toHaveCount(0);
  await page.getByRole("button", { name: "Concluir" }).click();
  await expect(h1(page)).toHaveText("Arquivo confidencial");
  await expect(exportar(page)).toBeDisabled(); // sem grau de periculosidade nem assinatura
  await expect(exportar(page)).toHaveAccessibleDescription("Marque o grau de periculosidade para exportar");

  for (const text of ["Isabela de Souça", "Reino de Laguardia, Schwarzenberg", "Humano (Elite de orelhas pontudas)", "Mago ortodoxo", "Umbra", "Activum", "Feminino"])
    await expect(preview(page)).toContainText(text);
  await expect(preview(page).getByText("Mago ortodoxo de Laguardia")).toHaveCount(0); // sem legenda embaixo da foto
  await expect(preview(page).getByRole("img", { name: "Mago ortodoxo de Laguardia" })).toBeVisible();

  // análise de periculosidade da Agência de Highbridge com a assinatura desenhada
  const dossie = page.getByRole("region", { name: /Análise de periculosidade nº HB-\d{4}/ });
  await expect(dossie).toContainText("Isabela de Souça");
  // sexo (já marcado na Identidade) e grau de periculosidade, na mesma tela da assinatura
  await expect(dossie.getByRole("radio", { name: "Feminino" })).toBeChecked();
  await dossie.getByRole("radio", { name: "Alto" }).check();
  await assinar(page);
  await expect(dossie.getByRole("button", { name: "Apagar assinatura" })).toBeEnabled();
  await expect(exportar(page)).toBeEnabled();

  const [download] = await Promise.all([page.waitForEvent("download"), exportar(page).click()]);
  expect(download.suggestedFilename()).toBe("ficha-isabela-de-souca.pdf");
  const bytes = await readFile(await download.path());
  expect(bytes.subarray(0, 5).toString()).toBe("%PDF-");

  const parser = new PDFParse({ data: new Uint8Array(bytes) });
  const { text } = await parser.getText();
  await parser.destroy();
  for (const s of ["Isabela de Souça", "Humano (Elite de orelhas pontudas)", "Reino de Laguardia, Schwarzenberg", "Fugiu da corte de Schwarzenberg.", "34 anos", "Feminino", "Análise de Periculosidade de Indivíduo"])
    expect(text.replace(/\s+/g, " ")).toContain(s); // o título longo quebra linha no PDF
  // pergaminho + selo de cera (PNG com máscara) + retrato do catálogo (WebP convertido no navegador) + assinatura (PNG com máscara)
  expect(bytes.toString("latin1").split("/Subtype /Image").length - 1).toBe(6);
});

test("assinatura fica salva ao recarregar e pode ser apagada", async ({ page }) => {
  await concluirMinimo(page);
  await assinar(page);
  const apagar = page.getByRole("button", { name: "Apagar assinatura" });
  await expect(apagar).toBeEnabled();
  await page.waitForTimeout(500); // o save no navegador espera 300 ms
  await page.reload();
  // recarregar volta à Revisão; concluir de novo reabre o arquivo com a assinatura
  await page.getByRole("button", { name: "Concluir" }).click();
  await expect(apagar).toBeEnabled();
  await apagar.click();
  await expect(apagar).toBeDisabled();
  await expect(exportar(page)).toBeDisabled(); // apagar a assinatura bloqueia de novo
});

test("arquivo confidencial tem Voltar: volta à Revisão sem perder nada, e Concluir reabre", async ({ page }) => {
  await concluirMinimo(page);
  await page.getByRole("button", { name: "Voltar à revisão" }).click();
  await expect(h1(page)).toHaveText("Revisão");
  await expect(page.getByRole("main")).toContainText("Corvo");
  await page.getByRole("button", { name: "Concluir" }).click();
  await expect(h1(page)).toHaveText("Arquivo confidencial");
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
    // no final, a coluna direita tem só o retrato com o nome e a prévia (sem vitrine), e a prévia é alta
    await expect(page.locator("[data-vitrine]:visible")).toHaveCount(0);
    const painel = await page.getByRole("region", { name: "Personagem" }).boundingBox();
    expect(painel!.y).toBeLessThan(main!.y + 50);
    expect(aside!.y).toBeGreaterThanOrEqual(painel!.y + painel!.height);
    expect(aside!.height).toBeGreaterThanOrEqual(400);
  }
  await noHorizontalOverflow(page);
});
