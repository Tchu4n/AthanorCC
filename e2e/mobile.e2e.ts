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
