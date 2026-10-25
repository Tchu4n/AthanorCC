import { expect, test, type Page } from "@playwright/test";

const h1 = (page: Page) => page.getByRole("heading", { level: 1 });
const radio = (page: Page, name: string) => page.getByRole("radio", { name, exact: true });
const content = (page: Page) => page.locator("[data-step-content]");
const background = (page: Page) => page.locator("[data-step-background]");
const animation = (page: Page) => content(page).evaluate((el) => getComputedStyle(el).animationName);

async function next(page: Page, expected: string) {
  await page.getByRole("button", { name: "Avançar" }).click();
  await expect(h1(page)).toHaveText(expected);
}

async function noHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow, "overflow horizontal").toBeLessThanOrEqual(0);
}

test("troca de etapa tem fade, e com reduced-motion não tem animação", async ({ page }) => {
  await page.goto("/criar");
  await radio(page, "Midland").check();
  await radio(page, "Andarilho/Aventureiro").check();
  await next(page, "Espécie");
  expect(await animation(page)).toBe("step-in");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: "Voltar" }).click();
  await expect(h1(page)).toHaveText("Origem");
  expect(await animation(page)).toBe("none");
  await next(page, "Espécie");
  expect(await animation(page)).toBe("none");
});

test("ligar o som persiste após recarregar, na chave própria", async ({ page }) => {
  await page.goto("/criar");
  const toggle = page.getByRole("button", { name: /^Sons:/ });
  await expect(toggle).toHaveText("Sons: desligados");
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await toggle.click();
  await expect(toggle).toHaveText("Sons: ligados");
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  expect(await page.evaluate(() => localStorage.getItem("athanor:sound:v1"))).toBe("on");
  await page.reload();
  await expect(page.getByRole("button", { name: "Sons: ligados" })).toHaveAttribute("aria-pressed", "true");
});

test("origem com região que tem imagem mostra o fundo; as outras etapas usam o neutro", async ({ page }) => {
  await page.goto("/criar");
  await expect(background(page).locator("img")).toHaveCount(0);
  await radio(page, "Reino de Laguardia").check();
  await expect(background(page)).toHaveAttribute("data-step-background", "/athanor/regions/laguardia-quartel.jpg");
  await expect(background(page).locator("img")).toHaveAttribute("src", /laguardia-quartel/);
  await radio(page, "Schwarzenberg").check();
  await next(page, "Espécie");
  await expect(background(page).locator("img")).toHaveCount(0);
  // a paleta da região entra depois que a Origem é concluída (fase 2.1)
  await expect(page.locator('[data-region="reino-de-laguardia"]')).toHaveCount(1);
});

test("nenhum overflow horizontal em nenhuma etapa", async ({ page }) => {
  await page.goto("/criar");
  await radio(page, "União das Províncias (UP)").check();
  await radio(page, "Asenov").check();
  await noHorizontalOverflow(page);
  for (const [action, expected] of [
    [() => radio(page, "Humano").check(), "Espécie"],
    [() => radio(page, "Elite de orelhas pontudas").check(), "Subespécie"],
    [() => radio(page, "Mago ortodoxo").check(), "Ofício"],
    [async () => {}, "Fé"],
    [async () => {}, "Marcas"],
    [async () => {}, "Aparência"],
    [() => page.getByLabel("Nome (obrigatório)").fill("Isabela"), "Identidade"],
    [async () => {}, "Revisão"],
  ] as const) {
    await next(page, expected);
    await action();
    await noHorizontalOverflow(page);
  }
});
