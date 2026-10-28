import { expect, test, type Page } from "@playwright/test";

const h1 = (page: Page) => page.getByRole("heading", { level: 1 });
const radio = (page: Page, name: string) => page.getByRole("radio", { name, exact: true });
const cards = (page: Page) => page.locator("[data-escolha]");
const busca = (page: Page) => page.getByRole("searchbox", { name: "Buscar por nome" });
const pilulas = (page: Page) => page.getByRole("group", { name: "Filtrar por disponibilidade" });

async function semOverflow(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow, "rolagem horizontal").toBeLessThanOrEqual(0);
}

async function next(page: Page, expected: string) {
  await page.getByRole("button", { name: "Avançar" }).click();
  await expect(h1(page)).toHaveText(expected);
}

// Midland/Aurelia + Centauros: sem subespécie, e com ofícios, fés e marcas indisponíveis por regra.
async function ateCentauro(page: Page) {
  await page.goto("/criar");
  await radio(page, "Midland").check();
  await page.getByRole("button", { name: "Avançar" }).click(); // confirma a região e mostra as subregiões
  await radio(page, "Aurelia").check();
  await next(page, "Espécie");
  await radio(page, "Centauros").check();
}

test("filtros de disponibilidade e busca filtram a grade", async ({ page }) => {
  await page.goto("/criar");
  await radio(page, "Midland").check();
  await page.getByRole("button", { name: "Avançar" }).click(); // confirma a região e mostra as subregiões
  await radio(page, "Aurelia").check();
  await next(page, "Espécie");

  // sem opção indisponível na etapa: só a busca
  await expect(pilulas(page)).toHaveCount(0);
  await busca(page).fill("centau");
  await expect(cards(page)).toHaveCount(1);
  await expect(radio(page, "Centauros")).toBeVisible();
  await radio(page, "Centauros").check();

  await next(page, "Ofício");
  await expect(busca(page)).toHaveValue(""); // o filtro recomeça a cada etapa
  const total = await cards(page).count();

  await pilulas(page).getByRole("button", { name: "Indisponíveis", exact: true }).click();
  await expect(pilulas(page).getByRole("button", { name: "Indisponíveis", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("[data-escolha]:not([data-indisponivel])")).toHaveCount(0);
  const indisponiveis = await cards(page).count();
  expect(indisponiveis).toBeGreaterThan(0);

  await pilulas(page).getByRole("button", { name: "Disponíveis", exact: true }).click();
  await expect(page.locator("[data-indisponivel]")).toHaveCount(0);
  await expect(cards(page)).toHaveCount(total - indisponiveis);
  await expect(radio(page, "Sem ofício")).toBeVisible();

  await busca(page).fill("zzz");
  await expect(cards(page)).toHaveCount(0);
  await expect(page.getByText("Nenhuma opção corresponde ao filtro.")).toBeVisible();

  await pilulas(page).getByRole("button", { name: "Todas", exact: true }).click();
  await busca(page).fill("");
  await expect(cards(page)).toHaveCount(total);
});

test("indisponível mostra o motivo e Escolher desabilitado", async ({ page }) => {
  await ateCentauro(page);
  await next(page, "Ofício");
  const card = page.locator("[data-indisponivel]").first();
  await expect(card).toContainText("Indisponível para esta escolha");
  await expect(card.getByRole("radio")).toBeDisabled();
});

test("escolher pelo botão Escolher marca o card e mostra a explicação na coluna ao lado", async ({ page }) => {
  await ateCentauro(page);
  await next(page, "Ofício");
  await page.locator('[data-escolha="Bardo"]').getByText("Escolher", { exact: true }).click();
  await expect(radio(page, "Bardo")).toBeChecked();
  await expect(page.locator('[data-escolha="Bardo"]')).toContainText("Escolhido");
  const explicacao = page.locator("[data-explicacao]");
  await expect(explicacao.getByRole("heading", { level: 2, name: "Bardo" })).toBeVisible();
  // a explicação fica fora do <main>, no lugar onde antes ficava a prévia da ficha
  await expect(page.getByRole("main").locator("[data-explicacao]")).toHaveCount(0);
});

test("antes do final não há prévia da ficha, retrato nem nome; a busca fica na barra superior", async ({ page }) => {
  await page.goto("/criar");
  await expect(page.getByRole("complementary", { name: "Prévia da ficha" })).toHaveCount(0);
  await expect(page.getByRole("region", { name: "Personagem" })).toHaveCount(0);
  await expect(page.locator("[data-retrato]")).toHaveCount(0);
  await expect(page.getByLabel("Nome do personagem")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Criar personagem" })).toHaveCount(0);
  await expect(page.getByRole("navigation", { name: "Navegação" }).getByRole("searchbox", { name: "Buscar por nome" })).toBeVisible();
});

test("cada etapa mostra a instrução logo abaixo do título, e ela descreve o Avançar desabilitado", async ({ page }) => {
  await page.goto("/criar");
  const instrucao = page.locator("header").filter({ has: h1(page) }).locator("p#dica-avancar");
  await expect(instrucao).toHaveText("Escolha uma região e uma subregião, ou Andarilho/Aventureiro, para avançar.");
  const avancar = page.getByRole("button", { name: "Avançar" });
  await expect(avancar).toBeDisabled();
  await expect(avancar).toHaveAccessibleDescription("Escolha uma região e uma subregião, ou Andarilho/Aventureiro, para avançar.");
  // escolher não avança sozinho: só o Avançar confirma
  await radio(page, "Midland").check();
  await page.getByRole("button", { name: "Avançar" }).click(); // confirma a região e mostra as subregiões
  await radio(page, "Aurelia").check();
  await expect(h1(page)).toHaveText("Origem");
  await expect(avancar).toBeInViewport(); // rodapé fixo, sempre à vista
  await next(page, "Espécie");
  await expect(instrucao).toHaveText("Escolha uma espécie para avançar.");
  await radio(page, "Centauros").check();
  for (const [etapa, texto] of [
    ["Ofício", "Escolha um ofício, ou Sem ofício, para avançar."],
    ["Fé", "Escolha até 3 fés, ou nenhuma, para avançar."],
    ["Marcas", "Escolha as marcas do personagem, ou nenhuma, para avançar."],
    ["Aparência", "Escolha uma imagem de referência, envie a sua ou siga sem imagem para avançar."],
    ["Identidade", "Preencha o nome para avançar."],
  ]) {
    await next(page, etapa);
    await expect(instrucao).toHaveText(texto);
  }
  await page.getByLabel("Nome (obrigatório)").fill("Corvo");
  await next(page, "Revisão");
  await expect(instrucao).toHaveText("Confira as escolhas e conclua o personagem.");
});

test("Origem: escolher a região não avança; Avançar mostra só as subregiões e Voltar retorna às regiões", async ({ page }) => {
  await page.goto("/criar");
  const regioes = page.getByRole("group", { name: "Região", exact: true });
  const subregioes = page.getByRole("group", { name: "Subregião" });
  const avancar = page.getByRole("button", { name: "Avançar" });
  await expect(subregioes).toHaveCount(0);
  await expect(avancar).toBeDisabled();

  await radio(page, "Midland").check();
  await expect(regioes).toBeVisible(); // continua nas regiões até confirmar
  await expect(page.locator("[data-explicacao]").getByRole("heading", { level: 2, name: "Midland" })).toBeVisible();
  await expect(page.locator('[data-region="midland"]')).toHaveCount(1); // a cor da região entra já na escolha
  await radio(page, "Oakhaven").check(); // trocar de ideia antes de confirmar
  await expect(regioes).toBeVisible();

  await avancar.click();
  await expect(regioes).toHaveCount(0);
  await expect(subregioes).toBeVisible();
  await expect(h1(page)).toHaveText("Origem");
  await expect(h1(page)).toBeFocused();
  await expect(radio(page, "Posto das Peles")).toBeVisible();
  await expect(avancar).toBeDisabled(); // falta a subregião

  await page.getByRole("button", { name: "Voltar" }).click();
  await expect(regioes).toBeVisible();
  await expect(radio(page, "Oakhaven")).toBeChecked();
  await expect(page.getByRole("button", { name: "Voltar" })).toBeDisabled();
});

test("rodapé com Voltar e Avançar fica preso na base da tela", async ({ page }) => {
  await page.goto("/criar");
  const avancar = page.getByRole("button", { name: "Avançar" });
  const vh = page.viewportSize()!.height;
  for (const y of [0, 1500, 100_000]) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await expect(avancar).toBeInViewport();
    const rodape = await avancar.evaluate((el) => el.closest(".sticky")!.getBoundingClientRect().bottom);
    expect(Math.abs(rodape - vh)).toBeLessThanOrEqual(1);
  }
});

test('"Saiba mais" abre o briefing da opção e Esc fecha', async ({ page }) => {
  await page.goto("/criar");
  await page.getByRole("button", { name: "Saiba mais sobre Midland" }).click();
  const briefing = page.locator("[popover]:popover-open");
  await expect(briefing.getByRole("heading", { level: 2, name: "Midland" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(briefing).toHaveCount(0);
});

test("etapa sem imagem mostra placeholder nos cards", async ({ page }) => {
  await ateCentauro(page);
  await next(page, "Ofício");
  await next(page, "Fé");
  await next(page, "Marcas");
  const n = await cards(page).count();
  expect(n).toBeGreaterThan(0);
  await expect(page.locator("[data-escolha] [data-card-placeholder]")).toHaveCount(n);
});

test("sem rolagem horizontal em nenhuma etapa", async ({ page }) => {
  await ateCentauro(page);
  await semOverflow(page);
  for (const etapa of ["Ofício", "Fé", "Marcas", "Aparência", "Identidade"]) {
    await next(page, etapa);
    await semOverflow(page);
  }
  await page.getByLabel("Nome (obrigatório)").fill("Isabela");
  await next(page, "Revisão");
  await semOverflow(page);
});

test("desabilitado tem cores próprias e o Escolher mostra o anel de foco no teclado", async ({ page }) => {
  await page.goto("/criar");
  const avancar = page.getByRole("button", { name: "Avançar" });
  await expect(avancar).toBeDisabled();
  await expect(avancar).toHaveCSS("color", "rgb(168, 173, 184)"); // --muted, não só opacidade
  expect(await avancar.evaluate((el) => getComputedStyle(el, "::before").backgroundColor)).toBe("rgb(58, 63, 75)"); // --border

  const midland = radio(page, "Midland");
  await midland.focus();
  await page.keyboard.press("Space");
  const escolher = page.locator("label", { has: midland });
  await expect(escolher).toHaveCSS("outline-style", "solid");
  await expect(escolher).toHaveCSS("outline-width", "3px");
});
