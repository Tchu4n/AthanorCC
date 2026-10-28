import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const h1 = (page: Page) => page.getByRole("heading", { level: 1 });
const radio = (page: Page, name: string) => page.getByRole("radio", { name, exact: true });
const vida = (page: Page) => page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--vida").trim());

// Primeira cor da faixa do topo em oklch(L C H). A faixa usa a cor da região (rgb); o próprio navegador
// converte, passando a cor por um color-mix em oklch.
async function corDaFaixa(page: Page) {
  const bg = await page.locator("[data-faixa]").evaluate((el) => {
    const primeira = getComputedStyle(el).backgroundImage.match(/(?:rgba?|oklch)\([^)]*\)/)?.[0] ?? "";
    const tmp = document.createElement("span");
    tmp.style.color = `color-mix(in oklch, ${primeira} 100%, ${primeira})`;
    document.body.append(tmp);
    const cor = getComputedStyle(tmp).color;
    tmp.remove();
    return cor;
  });
  const [, c, h] = bg.match(/oklch\([\d.]+ ([\d.e-]+) ([\d.]+|none)\)/) ?? [];
  return { croma: Number(c), matiz: h === "none" ? NaN : Number(h) };
}

async function next(page: Page, expected: string) {
  await page.getByRole("button", { name: "Avançar" }).click();
  await expect(h1(page)).toHaveText(expected);
}

async function concluirOrigemLaguardia(page: Page) {
  await radio(page, "Reino de Laguardia").check();
  await page.getByRole("button", { name: "Avançar" }).click(); // confirma a região e mostra as subregiões
  await radio(page, "Schwarzenberg").check();
  await next(page, "Espécie");
}

async function concluirTudo(page: Page) {
  await concluirOrigemLaguardia(page);
  await radio(page, "Humano").check();
  await next(page, "Subespécie");
  await radio(page, "Humano comum").check();
  for (const etapa of ["Ofício", "Fé", "Marcas", "Aparência", "Identidade"]) await next(page, etapa);
  await page.getByLabel("Nome (obrigatório)").fill("Isabela");
  await next(page, "Revisão");
  await page.getByRole("button", { name: "Concluir" }).click();
  await expect(h1(page)).toHaveText("Personagem concluído");
}

async function axeCriticas(page: Page) {
  const { violations } = await new AxeBuilder({ page }).analyze();
  return violations.filter((v) => v.impact === "critical").map((v) => v.id);
}

test("início em cinza; escolher a região já pinta a faixa e o fundo na cor dela", async ({ page }) => {
  await page.goto("/criar");
  await expect(h1(page)).toHaveText("Origem");
  await expect.poll(() => vida(page)).toBe("0");
  expect((await corDaFaixa(page)).croma).toBeLessThan(0.015); // sem região: paleta neutra, cinza levemente azulado
  await expect(page.locator("[data-step-background]")).toHaveCSS("filter", "none"); // a imagem do fundo não é dessaturada
  await radio(page, "Reino de Laguardia").check();
  await expect(page.locator('[data-region="reino-de-laguardia"]')).toHaveCount(1);
  await expect.poll(async () => (await corDaFaixa(page)).croma).toBeGreaterThan(0.05); // --vida ainda 0, faixa já colorida
  await expect.poll(() => vida(page)).toBe("0");
  await expect(page.getByText("Etapa 1 de 8")).toBeVisible();
});

test("após concluir Origem, a faixa recebe a cor da região", async ({ page }) => {
  await page.goto("/criar");
  await concluirOrigemLaguardia(page);
  await expect(page.locator('[data-region="reino-de-laguardia"]')).toHaveCount(1);
  await expect.poll(() => vida(page)).toBe(String(1 / 8));
  const { croma, matiz } = await corDaFaixa(page);
  expect(croma).toBeGreaterThan(0.01);
  expect(matiz).toBeGreaterThan(70); // dourado de Laguardia (~87°)
  expect(matiz).toBeLessThan(100);
  // etapa concluída continua marcada por texto e ícone, não só por cor
  await expect(page.getByText("Etapa 2 de 8")).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Progresso" }).getByText("✓")).toHaveCount(1);
});

test("ao final, --vida é 1", async ({ page }) => {
  await page.goto("/criar");
  await concluirTudo(page);
  await expect.poll(() => vida(page)).toBe("1");
});

test("com reduced-motion e ao recarregar, a cor muda sem animação", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/criar");
  await concluirOrigemLaguardia(page);
  expect(await vida(page)).toBe(String(1 / 8)); // instantâneo, sem esperar
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.reload();
  await expect(h1(page)).toHaveText("Espécie");
  expect(await vida(page)).toBe(String(1 / 8)); // volta ao nível do progresso sem subir de 0
});

test("axe sem violações críticas em --vida 0 e --vida 1", async ({ page }) => {
  await page.goto("/criar");
  await expect.poll(() => vida(page)).toBe("0");
  expect(await axeCriticas(page)).toEqual([]);
  await page.reload();
  await concluirTudo(page);
  await expect.poll(() => vida(page)).toBe("1");
  expect(await axeCriticas(page)).toEqual([]);
});
