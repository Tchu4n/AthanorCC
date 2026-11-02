// Ajudantes comuns dos testes e2e (antes copiados em cada arquivo).
import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

// mesma chave de src/lib/armazenamento.ts
export const KEY = "athanor:character:v1";

export const h1 = (page: Page) => page.getByRole("heading", { level: 1 });
export const radio = (page: Page, name: string) => page.getByRole("radio", { name, exact: true });
export const checkbox = (page: Page, name: string) => page.getByRole("checkbox", { name, exact: true });
export const preview = (page: Page) => page.getByRole("complementary", { name: "Prévia da análise" });

/** Clica em Avançar e espera o título da próxima etapa. */
export async function next(page: Page, expected: string) {
  await page.getByRole("button", { name: "Avançar" }).click();
  await expect(h1(page)).toHaveText(expected);
}

// Centauros não têm subespécie: a próxima etapa já é a Origem.
export async function ateOrigem(page: Page) {
  await page.goto("/criar");
  await radio(page, "Centauros").check();
  await next(page, "Origem");
}

/** A página não pode rolar na horizontal. */
export async function semOverflow(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow, "rolagem horizontal").toBeLessThanOrEqual(0);
}

/** Ids das violações críticas do axe na página. */
export async function criticas(page: Page) {
  const { violations } = await new AxeBuilder({ page }).analyze();
  return violations.filter((v) => v.impact === "critical").map((v) => v.id);
}

// Desenha um traço no quadro da assinatura (obrigatória para exportar).
export async function assinar(page: Page) {
  const quadro = page.locator("[data-assinatura]");
  await quadro.scrollIntoViewIfNeeded(); // page.mouse não rola sozinho
  const caixa = (await quadro.boundingBox())!;
  await page.mouse.move(caixa.x + 20, caixa.y + caixa.height / 2);
  await page.mouse.down();
  for (let i = 1; i <= 10; i++) await page.mouse.move(caixa.x + 20 + i * 25, caixa.y + caixa.height / 2 + (i % 2 ? -15 : 15));
  await page.mouse.up();
}
