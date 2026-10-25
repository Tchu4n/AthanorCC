import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const h1 = (page: Page) => page.getByRole("heading", { level: 1 });
const radio = (page: Page, name: string) => page.getByRole("radio", { name, exact: true });
// existem duas vitrines (celular no topo da etapa, desktop na coluna); só uma aparece por vez
const vitrine = (page: Page) => page.locator("[data-vitrine]:visible");

async function next(page: Page, expected: string) {
  await page.getByRole("button", { name: "Avançar" }).click();
  await expect(h1(page)).toHaveText(expected);
}

async function criticas(page: Page) {
  const { violations } = await new AxeBuilder({ page }).analyze();
  return violations.filter((v) => v.impact === "critical").map((v) => v.id);
}

test("escolha sem imagem mostra o placeholder", async ({ page }) => {
  await page.goto("/criar");
  await expect(vitrine(page)).toHaveCount(1);
  await expect(vitrine(page)).toContainText("Sem imagem para esta escolha");
  await radio(page, "Blackwater").check();
  await expect(vitrine(page)).toContainText("Sem imagem para esta escolha");
  await expect(vitrine(page).locator("figcaption")).toHaveText("Blackwater");
  await expect(vitrine(page).locator("img")).toHaveCount(0);
});

test("trocar a escolha troca a imagem, com alt e legenda coerentes", async ({ page }) => {
  await page.goto("/criar");
  await radio(page, "Reino de Laguardia").check();
  await expect(vitrine(page).getByRole("img", { name: "Quartel de Laguardia" })).toBeVisible();
  await expect(vitrine(page).locator("figcaption")).toHaveText("Reino de Laguardia");
  await radio(page, "Midland").check();
  await expect(vitrine(page).getByRole("img", { name: "Cavaleiro de Midland" })).toBeVisible();
  await expect(vitrine(page).locator("figcaption")).toHaveText("Midland");
  // depois do crossfade, só a imagem nova fica
  await expect(vitrine(page).locator("img")).toHaveCount(1);
});

test("vitrine em cor plena: sem filter nela nem nos ancestrais, e --vida fixo em 1", async ({ page }) => {
  await page.goto("/criar");
  await radio(page, "Reino de Laguardia").check();
  const img = vitrine(page).locator("img");
  await expect(img).toBeVisible();
  const estilos = await img.evaluate((el) => {
    const filtros: string[] = [];
    for (let n: Element | null = el; n; n = n.parentElement) filtros.push(getComputedStyle(n).filter);
    return {
      filtros,
      vidaVitrine: getComputedStyle(el).getPropertyValue("--vida").trim(),
      vidaRaiz: getComputedStyle(document.documentElement).getPropertyValue("--vida").trim(),
      fundo: getComputedStyle(document.querySelector("[data-step-background]")!).filter,
    };
  });
  expect(new Set(estilos.filtros)).toEqual(new Set(["none"]));
  expect(estilos.vidaVitrine).toBe("1");
  expect(estilos.vidaRaiz).toBe("0"); // o resto da página continua cinza
  expect(estilos.fundo).toBe("saturate(0)");
});

test("layout: coluna direita no desktop, topo da etapa no celular, sem foco dentro e sem overflow", async ({ page }, info) => {
  await page.goto("/criar");
  await radio(page, "Reino de Laguardia").check();
  const v = await vitrine(page).boundingBox();
  const h = await h1(page).boundingBox();
  const regiao = await page.getByRole("group", { name: "Região", exact: true }).boundingBox();
  if (info.project.name === "mobile-375") {
    expect(v!.y).toBeGreaterThan(h!.y); // logo abaixo do título da etapa
    expect(v!.y + v!.height).toBeLessThanOrEqual(regiao!.y); // antes das escolhas
    expect(v!.height).toBeLessThanOrEqual(740 * 0.4 + 1); // até 40vh
  } else {
    const ficha = await page.getByRole("complementary", { name: "Prévia da ficha" }).boundingBox();
    expect(v!.x).toBeGreaterThan(regiao!.x + regiao!.width); // coluna direita
    expect(v!.y + v!.height).toBeLessThanOrEqual(ficha!.y); // vitrine acima da prévia
    expect(Math.abs(v!.width / v!.height - 4 / 5)).toBeLessThan(0.02);
  }
  const focaveis = await page.locator("[data-vitrine]").evaluateAll((els) =>
    els.flatMap((el) => [...el.querySelectorAll("a, button, input, select, textarea, [tabindex]")]).length,
  );
  expect(focaveis).toBe(0);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test("axe sem violações críticas em todas as etapas", async ({ page }) => {
  test.setTimeout(120_000); // uma análise do axe por etapa
  await page.goto("/criar");
  await radio(page, "Reino de Laguardia").check();
  await radio(page, "Schwarzenberg").check();
  expect(await criticas(page), "Origem").toEqual([]);
  const passos: [string, () => Promise<unknown>][] = [
    ["Espécie", () => radio(page, "Humano").check()],
    ["Subespécie", () => radio(page, "Humano comum").check()],
    ["Ofício", () => radio(page, "Soldado").check()],
    ["Fé", () => page.getByRole("checkbox", { name: "Umbra", exact: true }).check()],
    ["Marcas", () => page.getByRole("checkbox", { name: "Terceiro Olho", exact: true }).check()],
    ["Aparência", () => radio(page, "Mago ortodoxo de Laguardia").check()],
    ["Identidade", () => page.getByLabel("Nome (obrigatório)").fill("Isabela")],
    ["Revisão", async () => {}],
  ];
  for (const [etapa, escolher] of passos) {
    await next(page, etapa);
    await escolher();
    expect(await criticas(page), etapa).toEqual([]);
  }
});
