import { expect, test, type Page } from "@playwright/test";

const h1 = (page: Page) => page.getByRole("heading", { level: 1 });
const radio = (page: Page, name: string) => page.getByRole("radio", { name, exact: true });
const barra = (page: Page) => page.getByRole("progressbar");
// sentido da última troca, posto no contêiner da barra: 1 ao avançar, -1 ao voltar
const sentido = (page: Page) => page.locator("[data-barra]").locator("..");

async function next(page: Page, expected: string) {
  await page.getByRole("button", { name: "Avançar" }).click();
  await expect(h1(page)).toHaveText(expected);
}

async function concluirOrigem(page: Page) {
  await radio(page, "Reino de Laguardia").check();
  await page.getByRole("button", { name: "Avançar" }).click(); // confirma a região e mostra as subregiões
  await radio(page, "Schwarzenberg").check();
  await next(page, "Espécie");
}

test("a fileira de pílulas não existe; o título da etapa fica dentro da barra", async ({ page }) => {
  await page.goto("/criar");
  await expect(page.getByRole("navigation", { name: "Progresso" })).toHaveCount(0);
  await expect(page.locator('[aria-current="step"]')).toHaveCount(0);
  await expect(page.locator("[data-barra]").getByRole("heading", { level: 1, name: "Origem" })).toBeVisible();
  await expect(barra(page)).toHaveAttribute("aria-label", "Etapa 1 de 8: Origem");
  await expect(page.locator("[data-barra-preenchimento]")).toHaveAttribute("style", "width: 0%;");
});

test("ao avançar, o título muda e a etapa anterior sai; ao voltar, o sentido se inverte", async ({ page }) => {
  await page.goto("/criar");
  await concluirOrigem(page);
  await expect(sentido(page)).toHaveAttribute("style", "--dir: 1;");
  await expect(barra(page)).toHaveAttribute("aria-valuenow", "2");
  // a anterior some na hora, mesmo no meio da animação: um título só, alinhado à esquerda do trilho
  await expect(page.locator("[data-barra]")).not.toContainText("Origem");
  const [trilho, titulo] = await Promise.all([page.locator("[data-barra]").boundingBox(), h1(page).boundingBox()]);
  expect(titulo!.x - trilho!.x).toBeLessThan(32);

  await page.getByRole("button", { name: "Voltar" }).click();
  await expect(h1(page)).toHaveText("Origem");
  await expect(sentido(page)).toHaveAttribute("style", "--dir: -1;");
  await expect(barra(page)).toHaveAttribute("aria-valuenow", "1");
});

test("com reduced-motion, a troca é instantânea: sem animação", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/criar");
  await concluirOrigem(page);
  expect(await page.locator("[data-barra]").evaluate((el) => el.outerHTML)).not.toMatch(/animate-|transition-/);
});

test("Revisão enche a barra; sem rolagem horizontal em nenhuma etapa", async ({ page }, info) => {
  const semRolagem = async () =>
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  await page.goto("/criar");
  await semRolagem();
  await concluirOrigem(page);
  await semRolagem();
  await radio(page, "Humano").check();
  await next(page, "Subespécie");
  await radio(page, "Humano comum").check();
  for (const etapa of ["Ofício", "Fé", "Marcas", "Aparência", "Identidade"]) {
    await next(page, etapa);
    await semRolagem();
    // no celular, só a próxima etapa aparece à direita
    const visiveis = await page.locator("[data-barra-proxima]:visible").count();
    if (info.project.name === "mobile-375") expect(visiveis).toBeLessThanOrEqual(2); // uma por camada (trilho e preenchimento)
  }
  await page.getByLabel("Nome (obrigatório)").fill("Isabela");
  await next(page, "Revisão");
  await semRolagem();
  await expect(barra(page)).toHaveAttribute("aria-label", "Etapa 9 de 9: Revisão");
  await expect(page.locator("[data-barra-preenchimento]")).toHaveAttribute("style", /width: 100%/);
  await page.getByRole("button", { name: "Concluir" }).click();
  await expect(h1(page)).toHaveText("Personagem concluído");
  await expect(barra(page)).toHaveAttribute("aria-valuenow", "9");
});

test("o preenchimento usa a cor do tema da página (a mesma do botão Avançar), desde a primeira etapa", async ({ page }) => {
  await page.goto("/criar");
  await concluirOrigem(page);
  await radio(page, "Humano").check(); // com escolha, o Avançar fica habilitado e na cor do tema
  const preenchimento = () => page.locator("[data-barra-preenchimento]").evaluate((el) => getComputedStyle(el).backgroundColor);
  // o botão pinta a cor no ::after (formato de seta)
  const botao = await page.getByRole("button", { name: "Avançar" }).evaluate((el) => getComputedStyle(el, "::after").backgroundColor);
  expect(botao).toBe("rgb(212, 167, 44)"); // dourado de Laguardia
  await expect.poll(preenchimento).toBe(botao);
});
