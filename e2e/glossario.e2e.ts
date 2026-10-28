import { expect, test, type Page } from "@playwright/test";

const radio = (page: Page, name: string) => page.getByRole("radio", { name, exact: true });
// o briefing da escolha fica na coluna de explicação, ao lado (desktop) ou abaixo (celular) das opções
const term = (page: Page) => page.locator("[data-explicacao]").getByRole("button", { name: "Antigo Império", exact: true }).first();
const briefing = (page: Page) => page.getByRole("tooltip").filter({ hasText: "Império derrubado" }).first();
const preview = (page: Page) => page.getByRole("complementary", { name: "Prévia da ficha" });

async function abrirUP(page: Page) {
  await page.goto("/criar");
  await radio(page, "União das Províncias (UP)").check();
  await page.getByRole("button", { name: "Avançar" }).click(); // confirma a região e mostra as subregiões
  await expect(term(page)).toBeVisible();
}

test.describe("desktop", () => {
  test.beforeEach(({}, info) => test.skip(info.project.name !== "desktop", "só no desktop"));

  test("hover abre o briefing só depois de 150 ms, e Esc fecha", async ({ page }) => {
    await page.clock.install();
    await abrirUP(page);
    // relógio parado: só o runFor faz o tempo andar
    await page.clock.pauseAt(Date.now() + 60_000);
    await term(page).hover();
    await page.clock.runFor(140);
    await expect(briefing(page)).toBeHidden();
    await page.clock.runFor(20);
    await expect(briefing(page)).toBeVisible();
    await expect(briefing(page)).toContainText("Antigo Império");
    await expect(briefing(page)).toContainText("lugar");
    await expect(term(page)).toHaveAccessibleDescription(/Império derrubado/);
    await page.keyboard.press("Escape");
    await expect(briefing(page)).toBeHidden();
  });

  test("Tab abre o briefing, Esc fecha e sair do termo também fecha", async ({ page }) => {
    await abrirUP(page);
    await page.getByRole("heading", { level: 1 }).focus();
    for (let i = 0; i < 80 && !(await term(page).evaluate((el) => el === document.activeElement)); i++)
      await page.keyboard.press("Tab");
    await expect(term(page)).toBeFocused();
    await expect(briefing(page)).toBeVisible();
    await expect(page.getByRole("status").filter({ hasText: "Briefing aberto: Antigo Império" })).toBeAttached();
    await page.keyboard.press("Escape");
    await expect(briefing(page)).toBeHidden();
    await term(page).blur();
    await term(page).focus();
    await expect(briefing(page)).toBeVisible();
    await page.keyboard.press("Tab");
    await expect(briefing(page)).toBeHidden();
  });

  test("o briefing abre por cima de tudo: inteiro na tela e sem criar rolagem na coluna", async ({ page }) => {
    await abrirUP(page);
    const coluna = page.locator("[data-explicacao]");
    const alturaAntes = await coluna.evaluate((el) => el.scrollHeight);
    await term(page).hover();
    await expect(briefing(page)).toBeVisible();
    expect(await coluna.evaluate((el) => el.scrollHeight)).toBe(alturaAntes);
    await expect(briefing(page)).toBeInViewport({ ratio: 1 });
    // fica na camada do topo: o ponto central do briefing é ele mesmo, não um card ou a coluna por cima
    const noTopo = await briefing(page).evaluate((el) => {
      const r = el.getBoundingClientRect();
      return el.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2));
    });
    expect(noTopo).toBe(true);
  });

  test("Exportar PDF continua visível ao rolar a prévia", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 480 });
    await abrirUP(page);
    // a prévia só existe na página de concluído
    await radio(page, "Andarilho/Aventureiro").check();
    for (const etapa of ["Espécie", "Ofício", "Fé", "Marcas", "Aparência", "Identidade"]) {
      await page.getByRole("button", { name: "Avançar" }).click();
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(etapa);
      if (etapa === "Espécie") await radio(page, "Centauros").check();
    }
    await page.getByLabel("Nome (obrigatório)").fill("Corvo");
    await page.getByRole("button", { name: "Avançar" }).click();
    await page.getByRole("button", { name: "Concluir" }).click();
    const aside = preview(page);
    const scrolled = await aside.evaluate((el) => {
      el.scrollTop = el.scrollHeight;
      return el.scrollTop;
    });
    expect(scrolled, "a prévia precisa rolar para o teste valer").toBeGreaterThan(0);
    const button = aside.getByRole("button", { name: "Exportar PDF" });
    await expect(button).toBeInViewport();
    const [a, b] = [await aside.boundingBox(), await button.boundingBox()];
    expect(b!.y - a!.y).toBeLessThan(80);
  });
});

test.describe("celular", () => {
  test.beforeEach(({}, info) => test.skip(info.project.name !== "mobile-375", "só em 375 px"));

  test("toque abre o briefing em 375 px e toque fora fecha", async ({ page }) => {
    await abrirUP(page);
    await term(page).tap();
    await expect(briefing(page)).toBeVisible();
    const box = await briefing(page).boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(375);
    await page.getByRole("heading", { level: 1 }).tap();
    await expect(briefing(page)).toBeHidden();
  });
});
