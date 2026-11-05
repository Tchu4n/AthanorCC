import { expect, test, type Page } from "@playwright/test";
import { h1, radio, next, semOverflow } from "./helpers";

const content = (page: Page) => page.locator("[data-step-content]");
const background = (page: Page) => page.locator("[data-step-background]");
const animation = (page: Page) => content(page).evaluate((el) => getComputedStyle(el).animationName);

test("troca de etapa tem fade, e com reduced-motion não tem animação", async ({ page }) => {
  await page.goto("/criar");
  await radio(page, "Centauros").check();
  await next(page, "Origem");
  expect(await animation(page)).toBe("step-in");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: "Voltar" }).click();
  await expect(h1(page)).toHaveText("Espécie");
  expect(await animation(page)).toBe("none");
  await next(page, "Origem");
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
  await radio(page, "Centauros").check();
  await next(page, "Origem");
  await expect(background(page).locator("img")).toHaveCount(0);
  await radio(page, "Reino de Laguardia").check();
  await page.getByRole("button", { name: "Avançar" }).click(); // confirma a região e mostra as subregiões
  // com bandeira, a região aparece no fundo pela bandeira
  await expect(background(page)).toHaveAttribute("data-step-background", "/athanor/regions/laguardia-bandeira.webp");
  await expect(background(page).locator("img")).toHaveAttribute("src", /laguardia-bandeira/);
  await radio(page, "Schwarzenberg").check();
  await next(page, "Ofício");
  await expect(background(page).locator("img")).toHaveCount(0);
  // a paleta da região continua nas etapas seguintes
  await expect(page.locator('[data-region="reino-de-laguardia"]:not([data-navegacao])')).toHaveCount(1);
});

test("nenhum overflow horizontal em nenhuma etapa", async ({ page }) => {
  await page.goto("/criar");
  await radio(page, "Humano").check();
  await semOverflow(page);
  for (const [action, expected] of [
    [() => radio(page, "Elite de orelhas pontudas").check(), "Subespécie"],
    [
      async () => {
        await radio(page, "União das Províncias (UP)").check();
        await semOverflow(page);
        await page.getByRole("button", { name: "Avançar" }).click(); // confirma a região e mostra as subregiões
        await radio(page, "Asenov").check();
      },
      "Origem",
    ],
    [() => radio(page, "Mago ortodoxo").check(), "Ofício"],
    [async () => {}, "Fé"],
    [async () => {}, "Aparência"],
    [
      async () => {
        await page.getByLabel("Nome (obrigatório)").fill("Isabela");
        await page.getByRole("radio", { name: "Incerto", exact: true }).check(); // sexo é obrigatório
      },
      "Identidade",
    ],
    [async () => {}, "Revisão"],
  ] as const) {
    await next(page, expected);
    await action();
    await semOverflow(page);
  }
});
