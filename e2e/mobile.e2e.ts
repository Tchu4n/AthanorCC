import { expect, test, type Page } from "@playwright/test";
import { h1, next, radio, semOverflow } from "./helpers";

// Layout abaixo de 1024 px (projetos mobile-*, paisagem-844 e mobile-375). No desktop a explicação fica na coluna da direita.
test.beforeEach(({}, info) => test.skip(info.project.name === "desktop", "só abaixo de 1024 px"));

/** A explicação da escolha abre colada à carta marcada, em largura total, e fica à vista. */
async function explicacaoColada(page: Page, carta: string, titulo: string) {
  const painel = page.locator("main [data-explicacao]").filter({ has: page.getByRole("heading", { level: 2, name: titulo }) });
  await expect(painel).toBeVisible();
  await expect(painel).toBeInViewport();
  // as duas caixas no mesmo instante: a rolagem suave ainda pode estar andando
  const folga = await page.evaluate(
    ([nomeCarta, nomePainel]) => {
      const c = document.querySelector(`[data-escolha="${nomeCarta}"]`)!.getBoundingClientRect();
      const h = [...document.querySelectorAll("main [data-explicacao] h2")].find((e) => e.textContent === nomePainel)!;
      return h.closest("[data-explicacao]")!.getBoundingClientRect().top - c.bottom;
    },
    [carta, titulo],
  );
  expect(folga, "o painel começa logo abaixo da carta, não depois de outras cartas").toBeGreaterThanOrEqual(-1);
  expect(folga).toBeLessThan(80);
  // a coluna da direita não leva uma segunda cópia do texto
  await expect(page.locator("[data-explicacao]").getByRole("heading", { level: 2, name: titulo })).toHaveCount(1);
}

test("descrição aparece junto da carta escolhida, em espécie, origem, ofício e fé", async ({ page }) => {
  await page.goto("/criar");
  await radio(page, "Centauros").check();
  await explicacaoColada(page, "Centauros", "Centauros");
  await semOverflow(page);

  await next(page, "Origem");
  await radio(page, "Midland").check();
  await explicacaoColada(page, "Midland", "Midland");
  await page.getByRole("button", { name: "Avançar" }).click();
  await radio(page, "Aurelia").check();
  await explicacaoColada(page, "Aurelia", "Aurelia");
  await expect(page.getByRole("heading", { level: 2, name: "Midland" })).toBeVisible(); // contexto da região, antes das subregiões
  await semOverflow(page);

  await next(page, "Ofício");
  // carta do fim da lista: o caso que mais pesava (explicação a ~480 px depois da última carta)
  const ultima = page.locator("[data-escolha]:not([data-indisponivel])").last();
  const nome = (await ultima.getAttribute("data-escolha"))!;
  await ultima.scrollIntoViewIfNeeded();
  await radio(page, nome).check();
  await explicacaoColada(page, nome, nome);
  await semOverflow(page);
});

test("trocar a escolha move o painel para a carta nova", async ({ page }) => {
  await page.goto("/criar");
  await radio(page, "Centauros").check();
  await expect(page.locator("main [data-explicacao]")).toHaveCount(1);
  await radio(page, "Humano").check(); // nunca dois painéis ao mesmo tempo
  await expect(page.locator("main [data-explicacao]")).toHaveCount(1);
  await expect(h1(page)).toHaveText("Espécie");
});

test("Voltar e Avançar ficam à vista em qualquer rolagem e não cobrem o fim da etapa", async ({ page }) => {
  await page.goto("/criar");
  await radio(page, "Centauros").check();
  await next(page, "Origem");
  await radio(page, "Midland").check();
  await page.getByRole("button", { name: "Avançar" }).click();
  await radio(page, "Aurelia").check();
  await next(page, "Ofício"); // a etapa mais longa
  const voltar = page.getByRole("button", { name: "Voltar" });
  const avancar = page.getByRole("button", { name: "Avançar" });
  for (const y of [0, 3000, 100_000]) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
    await expect(voltar).toBeInViewport();
    await expect(avancar).toBeInViewport();
  }
  // no fim da página, nada do conteúdo fica atrás da barra
  const { barra, fim } = await page.evaluate(() => ({
    barra: document.querySelector("[data-navegacao-fixa]")!.getBoundingClientRect().top,
    fim: Math.max(...[...document.querySelectorAll("main, [data-pergaminho]")].map((e) => e.getBoundingClientRect().bottom)),
  }));
  expect(fim, "fim do pergaminho acima da barra").toBeLessThanOrEqual(barra + 1);
  // o botão ↓/↑ sobe acima da barra
  const rolagem = await page.locator("[data-rolagem]").boundingBox();
  expect(rolagem!.y + rolagem!.height).toBeLessThanOrEqual(barra);
  await semOverflow(page);
});

test("celular deitado: sem vitrine nem mapa, e a 1ª tela já mostra cartas", async ({ page }, info) => {
  test.skip(info.project.name !== "paisagem-844", "só em 844×390");
  await page.goto("/criar");
  await expect(page.locator("[data-vitrine]")).toBeHidden();
  const carta = page.locator("[data-escolha]").first();
  await expect(carta).toBeInViewport();
  const topo = (await carta.boundingBox())!.y;
  const BARRA = 70; // barra fixa Voltar/Avançar
  expect(topo, "pelo menos 40 px de carta acima da barra fixa").toBeLessThanOrEqual(390 - BARRA - 40);
  await radio(page, "Centauros").check();
  await next(page, "Origem");
  await expect(page.locator("[data-minimapa]").first()).toBeHidden();
  await expect(page.locator("[data-escolha]").first()).toBeInViewport();
  await semOverflow(page);
});

test("cartas compactas abaixo de 640 px: arte em largura total, ≤ 360 px de altura (era ~410), Ofício bem mais curto", async ({ page }, info) => {
  test.skip(!["mobile-360", "mobile-375", "mobile-390"].includes(info.project.name), "só em largura de celular");
  await page.goto("/criar");
  await expect(page.locator("[data-escolha]").first()).toBeVisible();
  const alturas = await page.locator("[data-escolha]").evaluateAll((els) => els.map((e) => e.getBoundingClientRect().height));
  expect(alturas.length).toBeGreaterThan(0);
  for (const h of alturas) expect(h).toBeLessThanOrEqual(360);
  await radio(page, "Centauros").check();
  await next(page, "Origem");
  await radio(page, "Midland").check();
  await page.getByRole("button", { name: "Avançar" }).click();
  await radio(page, "Aurelia").check();
  await next(page, "Ofício");
  await expect(page.locator("[data-escolha]").nth(5)).toBeVisible();
  const altura = await page.evaluate(() => document.documentElement.scrollHeight);
  expect(altura, "altura da etapa Ofício (era ~11.600 px)").toBeLessThan(10000);
  await semOverflow(page);
});
