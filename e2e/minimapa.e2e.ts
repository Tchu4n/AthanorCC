import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { radio, ateOrigem } from "./helpers";

// há dois (celular no topo da etapa, desktop na coluna); só um aparece por vez
const minimapa = (page: Page) => page.locator("[data-minimapa]:visible");
const atual = (page: Page) => minimapa(page).locator("[data-pino-atual]");
// posição do pino destacado, em % do mapa (vem do style left/top)
const posicao = (page: Page) =>
  atual(page).evaluate((el) => [parseFloat((el as HTMLElement).style.left), parseFloat((el as HTMLElement).style.top)]);

test("escolher Laguardia põe o pino nela, com rótulo e alt; trocar de região move o pino", async ({ page }) => {
  await ateOrigem(page);
  await expect(minimapa(page)).toBeVisible();
  await expect(atual(page)).toHaveCount(0); // sem escolha, nenhum pino destacado
  await expect(minimapa(page).getByRole("img")).toHaveAttribute("alt", "Mapa do continente de Athanor");

  await radio(page, "Reino de Laguardia").check();
  await expect(atual(page).locator("[data-rotulo-pino]")).toHaveText("Reino de Laguardia");
  await expect(minimapa(page).getByRole("img")).toHaveAttribute("alt", "Mapa do continente de Athanor. Pino na posição de Reino de Laguardia");
  const laguardia = await posicao(page);

  await radio(page, "Midland").check();
  await expect(atual(page).locator("[data-rotulo-pino]")).toHaveText("Midland");
  expect(await posicao(page)).not.toEqual(laguardia);
  await expect(minimapa(page).getByRole("button", { name: "Midland" })).toHaveAttribute("aria-pressed", "true");
});

test("clicar no pino escolhe a região; na fase das subregiões o mapa aproxima e os pinos escolhem a subregião", async ({ page }) => {
  await ateOrigem(page);
  await minimapa(page).getByRole("button", { name: "Blackwater" }).click();
  await expect(radio(page, "Blackwater")).toBeChecked();
  await page.getByRole("button", { name: "Avançar" }).click(); // confirma a região e mostra as subregiões
  await expect(minimapa(page).getByRole("button", { name: "Midland" })).toHaveCount(0); // só as subregiões de Blackwater
  await minimapa(page).getByRole("button", { name: "Jakarta" }).click();
  await expect(radio(page, "Jakarta")).toBeChecked();
  await expect(atual(page).locator("[data-rotulo-pino]")).toHaveText("Jakarta");
});

test("Man'naka oko, fora do mapa, mostra a nota de terra distante e nenhum pino destacado", async ({ page }) => {
  await ateOrigem(page);
  await radio(page, "Man'naka oko").check();
  await expect(minimapa(page).getByRole("note")).toHaveText("Man'naka oko é uma terra muito distante, além das bordas deste mapa.");
  await expect(atual(page)).toHaveCount(0);
  await expect(minimapa(page).getByRole("button", { name: "Man'naka oko" })).toHaveCount(0);
});

test("minimapa sem violações críticas de acessibilidade e sem rolagem horizontal", async ({ page }) => {
  await ateOrigem(page);
  await radio(page, "Reino de Laguardia").check();
  await expect(atual(page).locator("[data-rotulo-pino]")).toBeVisible();
  const { violations } = await new AxeBuilder({ page }).include("[data-minimapa]").analyze();
  expect(violations.filter((v) => v.impact === "critical").map((v) => v.id)).toEqual([]);
  const sobra = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(sobra).toBeLessThanOrEqual(0);
});

test("páginas de desenvolvimento (/dev/mapa e /dev/aderecos) respondem 404 em produção", async ({ page }) => {
  for (const rota of ["/dev/mapa", "/dev/aderecos"]) expect((await page.goto(rota))?.status(), rota).toBe(404);
});

// centro do pino de uma região, em pixels da janela
const centro = async (page: Page, nome: string) => {
  const b = (await minimapa(page).getByRole("button", { name: nome }).boundingBox())!;
  return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
};
const algumaRegiaoMarcada = (page: Page) => page.getByRole("radio", { checked: true }).count();

test("botões aproximam e afastam o mapa; arrastar move a carta e não escolhe o pino sob o dedo", async ({ page }) => {
  await ateOrigem(page);
  const a0 = await centro(page, "Midland");
  const b0 = await centro(page, "Blackwater");
  const afastar = minimapa(page).getByRole("button", { name: "Afastar o mapa" });
  await expect(afastar).toBeDisabled(); // já está no enquadramento inicial

  // com poucos cliques a carta mal passa da moldura e não há para onde arrastar
  for (let i = 0; i < 4; i++) await minimapa(page).getByRole("button", { name: "Aproximar o mapa" }).click();
  await expect(afastar).toBeEnabled();
  await expect.poll(async () => Math.abs((await centro(page, "Blackwater")).x - (await centro(page, "Midland")).x)).toBeGreaterThan(Math.abs(b0.x - a0.x) * 1.5);

  // arrasta começando em cima de um pino: move o mapa, e o pino não é escolhido
  await page.waitForTimeout(500); // transição de 400 ms do zoom
  const antes = await centro(page, "Blackwater");
  await page.mouse.move(antes.x, antes.y);
  await page.mouse.down();
  await page.mouse.move(antes.x + 20, antes.y + 14, { steps: 4 });
  await page.mouse.move(antes.x + 40, antes.y + 28, { steps: 4 });
  await page.mouse.up();
  const depois = await centro(page, "Blackwater");
  expect(depois.x - antes.x).toBeGreaterThan(30);
  expect(depois.y - antes.y).toBeGreaterThan(18);
  expect(await algumaRegiaoMarcada(page), "arrastar não escolhe a região").toBe(0);

  // um clique de verdade ainda escolhe
  await minimapa(page).getByRole("button", { name: "Blackwater" }).click();
  await expect(radio(page, "Blackwater")).toBeChecked();

  // afastar até o fim volta ao enquadramento inicial
  await expect(async () => {
    if (await afastar.isEnabled()) await afastar.click();
    await expect(afastar).toBeDisabled({ timeout: 300 });
  }).toPass({ timeout: 10_000 });
  await expect.poll(async () => Math.abs((await centro(page, "Midland")).x - a0.x)).toBeLessThan(2);
});

test.describe("toque", () => {
  test.use({ isMobile: true, hasTouch: true }); // pointer: coarse

  test("pinos com área de toque de 44 px e pinça aproxima o mapa", async ({ page, context }, info) => {
    test.skip(info.project.name === "desktop", "só em tela de toque");
    await ateOrigem(page);
    // pinos isolados chegam a 44 px; os apertados encolhem até 24 px para a área não roubar o toque do vizinho
    const caixas = await minimapa(page)
      .locator("button[aria-pressed]")
      .evaluateAll((els) =>
        els.map((e) => {
          const r = e.getBoundingClientRect();
          return { x: r.x + r.width / 2, y: r.y + r.height / 2, l: r.width };
        }),
      );
    expect(Math.max(...caixas.map((c) => c.l))).toBeGreaterThanOrEqual(44);
    expect(Math.min(...caixas.map((c) => c.l))).toBeGreaterThanOrEqual(24);
    for (const [i, a] of caixas.entries())
      for (const b of caixas.slice(i + 1))
        if (Math.hypot(a.x - b.x, a.y - b.y) < (a.l + b.l) / 2 - 0.5) expect(Math.max(a.l, b.l), "só pinos já no mínimo se sobrepõem").toBeLessThanOrEqual(24.5);
    for (const nome of ["Aproximar o mapa", "Afastar o mapa"]) {
      const b = (await minimapa(page).getByRole("button", { name: nome }).boundingBox())!;
      expect(Math.min(b.width, b.height), nome).toBeGreaterThanOrEqual(44);
    }

    // pinça com dois dedos pelo CDP: afastar os dedos aproxima o mapa
    await minimapa(page).scrollIntoViewIfNeeded();
    await page.waitForTimeout(400); // o layout e a rolagem assentam antes de medir: o CDP toca em coordenadas da janela
    const mapa = (await minimapa(page).boundingBox())!;
    const cx = mapa.x + mapa.width / 2;
    const cy = mapa.y + mapa.height / 2;
    const cdp = await context.newCDPSession(page);
    const toque = (type: "touchStart" | "touchMove" | "touchEnd", dedos: { x: number; y: number }[]) =>
      cdp.send("Input.dispatchTouchEvent", { type, touchPoints: dedos.map((d, id) => ({ ...d, id })) });
    const a0 = await centro(page, "Blackwater");
    const m0 = await centro(page, "Midland");
    await toque("touchStart", [{ x: cx - 20, y: cy }, { x: cx + 20, y: cy }]);
    for (let i = 1; i <= 8; i++) await toque("touchMove", [{ x: cx - 20 - i * 6, y: cy }, { x: cx + 20 + i * 6, y: cy }]);
    await toque("touchEnd", []);
    await expect.poll(async () => Math.abs((await centro(page, "Blackwater")).x - (await centro(page, "Midland")).x)).toBeGreaterThan(Math.abs(a0.x - m0.x) * 1.5);
    await expect(minimapa(page).getByRole("button", { name: "Afastar o mapa" })).toBeEnabled();
    expect(await algumaRegiaoMarcada(page)).toBe(0);
  });
});
