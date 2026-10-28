import { expect, test, type Locator, type Page } from "@playwright/test";

const h1 = (page: Page) => page.getByRole("heading", { level: 1 });
const radio = (page: Page, name: string) => page.getByRole("radio", { name, exact: true });
const checkbox = (page: Page, name: string) => page.getByRole("checkbox", { name, exact: true });

async function noHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow, "overflow horizontal").toBeLessThanOrEqual(0);
}

async function next(page: Page, expected: string) {
  await noHorizontalOverflow(page);
  await page.getByRole("button", { name: "Avançar" }).click();
  await expect(h1(page)).toHaveText(expected);
  await expect(h1(page)).toBeFocused();
}

async function back(page: Page, expected: string) {
  await page.getByRole("button", { name: "Voltar" }).click();
  await expect(h1(page)).toHaveText(expected);
}

// Só teclado: Tab até o alvo e então a tecla pedida.
async function tabTo(page: Page, target: Locator, key: "Enter" | "Space" | null = null) {
  for (let i = 0; i < 60; i++) {
    if (await target.evaluate((el) => el === document.activeElement)) {
      if (key) await page.keyboard.press(key);
      return;
    }
    await page.keyboard.press("Tab");
  }
  throw new Error("alvo não alcançado com Tab");
}

test("fluxo completo com um personagem", async ({ page }) => {
  await page.goto("/criar");
  await expect(h1(page)).toHaveText("Origem");
  await expect(page.getByRole("button", { name: "Avançar" })).toBeDisabled();

  await radio(page, "Midland").check();

  await page.getByRole("button", { name: "Avançar" }).click(); // confirma a região e mostra as subregiões
  // o card também tem h2 com o nome; o briefing aberto pela escolha é a <section> abaixo da grade
  await expect(page.locator("section").getByRole("heading", { level: 2, name: "Midland" })).toBeVisible();
  await expect(radio(page, "Andarilho/Aventureiro")).toBeVisible();
  await radio(page, "Aurelia").check();
  await expect(page.locator("section").getByRole("heading", { level: 2, name: "Aurelia" })).toBeVisible();
  await next(page, "Espécie");

  await radio(page, "Humano").check();
  await expect(page.getByRole("navigation", { name: "Progresso" })).toContainText("Subespécie");
  await next(page, "Subespécie");
  await radio(page, "Elite de orelhas pontudas").check();
  await next(page, "Ofício");

  await radio(page, "Mago ortodoxo").check();
  await next(page, "Fé");

  for (const f of ["Umbra", "Activum", "Logan"]) await checkbox(page, f).check();
  await expect(page.getByText("Limite de 3 fés atingido")).toBeVisible();
  await expect(checkbox(page, "Mui")).toBeDisabled();
  await expect(page.getByRole("heading", { level: 3, name: "Implicações" })).toHaveCount(3);
  await checkbox(page, "Logan").uncheck();
  await expect(checkbox(page, "Mui")).toBeEnabled();
  await checkbox(page, "Mui").check();
  await next(page, "Marcas");

  await checkbox(page, "Gaiola de bateria").check();
  await next(page, "Aparência");

  await radio(page, "Alto mago ortodoxo da UP").check();
  await page.getByLabel("Notas de aparência").fill("Gola franzida");
  await next(page, "Identidade");

  await expect(page.getByRole("button", { name: "Avançar" })).toBeDisabled();
  await page.getByLabel("Nome (obrigatório)").fill("Isabela");
  await page.getByLabel("Idade", { exact: true }).fill("34");
  await next(page, "Revisão");

  const review = page.getByRole("main");
  for (const text of ["Midland, Aurelia", "Humano, Elite de orelhas pontudas", "Mago ortodoxo", "Umbra, Activum, Mui", "Gaiola de bateria", "Alto mago ortodoxo da UP", "Isabela"])
    await expect(review).toContainText(text);

  await noHorizontalOverflow(page);
  await page.getByRole("button", { name: "Concluir" }).click();
  await expect(h1(page)).toHaveText("Personagem concluído");
});

test("voltar não perde escolhas e subespécie pulada some da barra", async ({ page }) => {
  await page.goto("/criar");
  await radio(page, "Oakhaven").check();
  await page.getByRole("button", { name: "Avançar" }).click(); // confirma a região e mostra as subregiões
  await radio(page, "Posto das Peles").check();
  await next(page, "Espécie");
  await radio(page, "Centauros").check();
  await expect(page.getByRole("navigation", { name: "Progresso" })).not.toContainText("Subespécie");
  await next(page, "Ofício");
  await radio(page, "Bardo").check();
  await next(page, "Fé");
  await checkbox(page, "Gorturk").check();

  await back(page, "Ofício");
  await expect(radio(page, "Bardo")).toBeChecked();
  await back(page, "Espécie");
  await expect(radio(page, "Centauros")).toBeChecked();
  await back(page, "Origem");
  await expect(page.locator("[data-explicacao]").getByRole("heading", { level: 2, name: "Oakhaven" })).toBeVisible();
  await expect(radio(page, "Posto das Peles")).toBeChecked();

  await next(page, "Espécie");
  await next(page, "Ofício");
  await next(page, "Fé");
  await expect(checkbox(page, "Gorturk")).toBeChecked();
});

test("concluir sem fé, sem ofício e sem imagem, em região sem subregiões", async ({ page }) => {
  await page.goto("/criar");
  await radio(page, "Império das Estepes (Gorturk)").check();
  await page.getByRole("button", { name: "Avançar" }).click(); // confirma a região e mostra as subregiões
  await expect(page.getByText("estão em definição")).toBeVisible();
  await expect(page.getByRole("group", { name: "Subregião" }).getByRole("radio")).toHaveCount(1);
  await radio(page, "Andarilho/Aventureiro").check();
  await next(page, "Espécie");
  await radio(page, "Vampiros").check();
  await next(page, "Ofício");
  await expect(radio(page, "Sem ofício")).toBeChecked();
  await next(page, "Fé");
  await next(page, "Marcas");
  await next(page, "Aparência");
  await expect(radio(page, "Sem imagem")).toBeChecked();
  await next(page, "Identidade");
  await page.getByLabel("Nome (obrigatório)").fill("Corvo");
  await next(page, "Revisão");

  const review = page.getByRole("main");
  for (const text of ["Império das Estepes (Gorturk), Andarilho/Aventureiro", "Vampiros", "Nenhum", "Nenhuma", "Sem imagem", "Corvo"])
    await expect(review).toContainText(text);
  await page.getByRole("button", { name: "Concluir" }).click();
  await expect(h1(page)).toHaveText("Personagem concluído");
});

test("fluxo completo só com teclado", async ({ page }) => {
  await page.goto("/criar");
  await expect(h1(page)).toBeFocused();
  const avancar = page.getByRole("button", { name: "Avançar" });
  // Radios: Tab entra no grupo, espaço marca o item focado e as setas andam até o alvo.
  const pickRadio = async (target: Locator) => {
    const group = await target.getAttribute("name");
    for (let i = 0; i < 60; i++) {
      if (await page.evaluate((n) => (document.activeElement as HTMLInputElement | null)?.name === n, group)) break;
      await page.keyboard.press("Tab");
    }
    await page.keyboard.press("Space");
    for (let i = 0; i < 30 && !(await target.isChecked()); i++) await page.keyboard.press("ArrowDown");
  };
  const step = async (choice: Locator, title: string) => {
    if ((await choice.getAttribute("type")) === "radio") await pickRadio(choice);
    else await tabTo(page, choice, "Space");
    await expect(choice).toBeChecked();
    await tabTo(page, avancar, "Enter");
    await expect(h1(page)).toHaveText(title);
    await expect(h1(page)).toBeFocused();
  };

  // escolher a região não troca a tela: Avançar confirma e mostra as subregiões
  await pickRadio(radio(page, "Chiefdom de Vargarf"));
  await expect(radio(page, "Chiefdom de Vargarf")).toBeChecked();
  await tabTo(page, avancar, "Enter");
  await expect(page.getByRole("group", { name: "Subregião" })).toBeVisible();
  await expect(h1(page)).toBeFocused();
  await step(radio(page, "Baía da Boa Viagem"), "Espécie");
  await step(radio(page, "Homens-Galho"), "Subespécie");
  await step(radio(page, "Príncipe"), "Ofício");
  await step(radio(page, "Contrabandista"), "Fé");
  await step(checkbox(page, "Nilos"), "Marcas");
  await tabTo(page, avancar, "Enter");
  await expect(h1(page)).toHaveText("Aparência");
  await tabTo(page, avancar, "Enter");
  await expect(h1(page)).toHaveText("Identidade");
  await tabTo(page, page.getByLabel("Nome (obrigatório)"));
  await page.keyboard.type("Zek");
  await tabTo(page, avancar, "Enter");
  await expect(h1(page)).toHaveText("Revisão");
  await tabTo(page, page.getByRole("button", { name: "Concluir" }), "Enter");
  await expect(h1(page)).toHaveText("Personagem concluído");
});

test("regra: Trabalhador vê mago ortodoxo desabilitado com mensagem", async ({ page }) => {
  await page.goto("/criar");
  await radio(page, "Kruk (Reino Fronteiriço)").check();
  await page.getByRole("button", { name: "Avançar" }).click(); // confirma a região e mostra as subregiões
  await radio(page, "Andarilho/Aventureiro").check();
  await next(page, "Espécie");
  await radio(page, "Homens-Galho").check();
  await next(page, "Subespécie");
  await radio(page, "Trabalhador").check();
  await next(page, "Ofício");

  const mago = radio(page, "Mago ortodoxo");
  await expect(mago).toBeDisabled();
  await expect(mago).toHaveAccessibleDescription(/Indisponível para esta escolha.*só príncipes e a rainha/);
  await expect(page.getByText("Indisponível para esta escolha")).toBeVisible();
  await expect(radio(page, "Bardo")).toBeEnabled();
});

test("regra R05: mago ortodoxo sem gaiola vê o aviso de bateria na etapa Marcas", async ({ page }) => {
  await page.goto("/criar");
  await radio(page, "Reino de Laguardia").check();
  await page.getByRole("button", { name: "Avançar" }).click(); // confirma a região e mostra as subregiões
  await radio(page, "Schwarzenberg").check();
  await next(page, "Espécie");
  await radio(page, "Humano").check();
  await next(page, "Subespécie");
  await radio(page, "Elite de orelhas pontudas").check();
  await next(page, "Ofício");
  await radio(page, "Mago ortodoxo").check();
  await next(page, "Fé");
  await next(page, "Marcas");

  const gaiola = checkbox(page, "Gaiola de bateria");
  // o mesmo aviso também está no "Saiba mais" do card, fechado (oculto)
  const aviso = page.getByText("Magos ortodoxos precisam de alguma forma de bateria.", { exact: false }).filter({ visible: true });
  await expect(gaiola).not.toBeChecked();
  await expect(gaiola).toBeEnabled();
  await expect(aviso).toBeVisible();
  await gaiola.check();
  await expect(aviso).toBeHidden();
});

test("regra R10: centauro vê a gaiola desabilitada", async ({ page }) => {
  await page.goto("/criar");
  await radio(page, "Midland").check();
  await page.getByRole("button", { name: "Avançar" }).click(); // confirma a região e mostra as subregiões
  await radio(page, "Andarilho/Aventureiro").check();
  await next(page, "Espécie");
  await radio(page, "Centauros").check();
  await next(page, "Ofício");
  await radio(page, "Bardo").check();
  await next(page, "Fé");
  await next(page, "Marcas");

  await expect(checkbox(page, "Gaiola de bateria")).toBeDisabled();
  await expect(page.getByText("Centauros nunca usam a gaiola de bateria.")).toBeVisible();
});

test("regra R07: origem Kruk só habilita Homens-Galho na etapa Espécie", async ({ page }) => {
  await page.goto("/criar");
  await expect(radio(page, "Kruk (Reino Fronteiriço)")).toBeVisible();
  await expect(radio(page, "Crick (A Horda de Southgarden)")).toBeVisible();

  // com Humano já escolhido, ir para Kruk remove a espécie com aviso
  await radio(page, "Planícies de Sunfield").check();
  await page.getByRole("button", { name: "Avançar" }).click(); // confirma a região e mostra as subregiões
  await radio(page, "Andarilho/Aventureiro").check();
  await next(page, "Espécie");
  await radio(page, "Humano").check();
  await back(page, "Origem");
  await page.getByRole("button", { name: "Voltar" }).click(); // das subregiões de volta às regiões
  await radio(page, "Kruk (Reino Fronteiriço)").check();
  await page.getByRole("button", { name: "Avançar" }).click(); // confirma a região e mostra as subregiões
  await expect(page.getByRole("main").getByRole("status").first()).toContainText("A espécie Humano foi removida");
  await radio(page, "Andarilho/Aventureiro").check();
  await next(page, "Espécie");

  const especies = page.getByRole("group", { name: "Espécie" }).getByRole("radio");
  await expect(especies).toHaveCount(5);
  for (const name of ["Humano", "Centauros", "Homens do Deserto", "Vampiros"]) {
    await expect(radio(page, name)).toBeDisabled();
    await expect(radio(page, name)).toHaveAccessibleDescription(/apenas Homens-Galho podem ser escolhidos/);
  }
  await expect(radio(page, "Homens-Galho")).toBeEnabled();
  await radio(page, "Homens-Galho").check();
  await next(page, "Subespécie");
});
