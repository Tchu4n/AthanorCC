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
  await expect(h1(page)).toHaveText("Espécie");
  await expect(page.getByRole("button", { name: "Avançar" })).toBeDisabled();

  await radio(page, "Humano").check();
  await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuemax", "8");
  await expect(page.locator("[data-barra-proximas]").first()).toContainText("Subespécie");
  await next(page, "Subespécie");
  await radio(page, "Elite de orelhas pontudas").check();
  await next(page, "Origem");

  await radio(page, "Midland").check();
  await page.getByRole("button", { name: "Avançar" }).click(); // confirma a região e mostra as subregiões
  // o card também tem h2 com o nome; o briefing aberto pela escolha é a <section> abaixo da grade
  await expect(page.locator("section").getByRole("heading", { level: 2, name: "Midland" })).toBeVisible();
  await expect(radio(page, "Andarilho/Aventureiro")).toBeVisible();
  await radio(page, "Aurelia").check();
  await expect(page.locator("section").getByRole("heading", { level: 2, name: "Aurelia" })).toBeVisible();
  await next(page, "Ofício");

  await radio(page, "Mago ortodoxo").check();
  await next(page, "Fé");

  for (const f of ["Umbra", "Activum", "Logan"]) await checkbox(page, f).check();
  await expect(page.getByRole("status").getByText("Limite de 3 fés atingido")).toBeVisible();
  await expect(checkbox(page, "Mui")).toBeDisabled();
  await expect(page.getByRole("heading", { level: 3, name: "Implicações" })).toHaveCount(3);
  await checkbox(page, "Logan").uncheck();
  await expect(checkbox(page, "Mui")).toBeEnabled();
  await checkbox(page, "Mui").check();
  await next(page, "Aparência");

  await radio(page, "Alto mago ortodoxo da UP").check();
  await page.getByLabel("Notas de aparência").fill("Gola franzida");
  await next(page, "Identidade");

  await expect(page.getByRole("button", { name: "Avançar" })).toBeDisabled();
  await page.getByLabel("Nome (obrigatório)").fill("Isabela");
  await page.getByRole("radio", { name: "Incerto", exact: true }).check(); // sexo é obrigatório
  await page.getByLabel("Idade (em anos) (opcional)", { exact: true }).fill("34");
  await next(page, "Revisão");

  const review = page.getByRole("main");
  for (const text of ["Midland, Aurelia", "Humano, Elite de orelhas pontudas", "Mago ortodoxo", "Umbra, Activum, Mui", "Alto mago ortodoxo da UP", "Isabela"])
    await expect(review).toContainText(text);

  await noHorizontalOverflow(page);
  await page.getByRole("button", { name: "Concluir" }).click();
  await expect(h1(page)).toHaveText("Arquivo confidencial");
});

test("voltar não perde escolhas e subespécie pulada some da barra", async ({ page }) => {
  await page.goto("/criar");
  await radio(page, "Centauros").check();
  await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuemax", "7");
  await expect(page.locator("[data-barra-proximas]").first()).not.toContainText("Subespécie");
  await next(page, "Origem");
  await radio(page, "Oakhaven").check();
  await page.getByRole("button", { name: "Avançar" }).click(); // confirma a região e mostra as subregiões
  await radio(page, "Posto das Peles").check();
  await next(page, "Ofício");
  await radio(page, "Bardo").check();
  await next(page, "Fé");
  await checkbox(page, "Gorturk").check();

  await back(page, "Ofício");
  await expect(radio(page, "Bardo")).toBeChecked();
  await back(page, "Origem");
  await expect(page.locator("[data-explicacao]").getByRole("heading", { level: 2, name: "Oakhaven" })).toBeVisible();
  await expect(radio(page, "Posto das Peles")).toBeChecked();
  await page.getByRole("button", { name: "Voltar" }).click(); // das subregiões de volta às regiões
  await back(page, "Espécie");
  await expect(radio(page, "Centauros")).toBeChecked();

  await next(page, "Origem"); // com a região já escolhida, abre direto nas subregiões
  await expect(radio(page, "Posto das Peles")).toBeChecked();
  await next(page, "Ofício");
  await next(page, "Fé");
  await expect(checkbox(page, "Gorturk")).toBeChecked();
});

test("concluir sem fé, sem ofício e sem imagem, em região sem subregiões", async ({ page }) => {
  await page.goto("/criar");
  await radio(page, "Vampiros").check();
  await next(page, "Origem");
  await radio(page, "Império das Estepes (Gorturk)").check();
  await page.getByRole("button", { name: "Avançar" }).click(); // confirma a região e mostra as subregiões
  await expect(page.getByText("estão em definição")).toBeVisible();
  await expect(page.getByRole("group", { name: "Subregião" }).getByRole("radio")).toHaveCount(1);
  await radio(page, "Andarilho/Aventureiro").check();
  await next(page, "Ofício");
  await expect(radio(page, "Sem ofício")).toBeChecked();
  await next(page, "Fé");
  await next(page, "Aparência");
  await expect(radio(page, "Sem imagem")).toBeChecked();
  await next(page, "Identidade");
  await page.getByLabel("Nome (obrigatório)").fill("Corvo");
  await page.getByRole("radio", { name: "Incerto", exact: true }).check(); // sexo é obrigatório
  await next(page, "Revisão");

  const review = page.getByRole("main");
  for (const text of ["Império das Estepes (Gorturk), Andarilho/Aventureiro", "Vampiros", "Nenhum", "Nenhuma", "Sem imagem", "Corvo"])
    await expect(review).toContainText(text);
  await page.getByRole("button", { name: "Concluir" }).click();
  await expect(h1(page)).toHaveText("Arquivo confidencial");
});

test("fluxo completo só com teclado", async ({ page }) => {
  test.setTimeout(60_000); // o fluxo inteiro com Tab é longo e, com a suíte em paralelo, passava de 30 s
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
    for (let i = 0; i < 30 && !(await target.isChecked()); i++) {
      // passar por Ofício personalizado abre o pop-up; Esc cancela e devolve o foco ao card
      if (await page.getByRole("dialog").isVisible()) await page.keyboard.press("Escape");
      await page.keyboard.press("ArrowDown");
    }
  };
  const step = async (choice: Locator, title: string) => {
    if ((await choice.getAttribute("type")) === "radio") await pickRadio(choice);
    else await tabTo(page, choice, "Space");
    await expect(choice).toBeChecked();
    await tabTo(page, avancar, "Enter");
    await expect(h1(page)).toHaveText(title);
    await expect(h1(page)).toBeFocused();
  };

  await step(radio(page, "Homens-Galho"), "Subespécie");
  await step(radio(page, "Príncipe"), "Origem");
  // escolher a região não troca a tela: Avançar confirma e mostra as subregiões
  await pickRadio(radio(page, "Chiefdom de Vargarf"));
  await expect(radio(page, "Chiefdom de Vargarf")).toBeChecked();
  await tabTo(page, avancar, "Enter");
  await expect(page.getByRole("group", { name: "Subregião" })).toBeVisible();
  await expect(h1(page)).toBeFocused();
  await step(radio(page, "Baía da Boa Viagem"), "Ofício");
  await step(radio(page, "Contrabandista"), "Fé");
  await step(checkbox(page, "Nilos"), "Aparência");
  await tabTo(page, avancar, "Enter");
  await expect(h1(page)).toHaveText("Identidade");
  await tabTo(page, page.getByLabel("Nome (obrigatório)"));
  await page.keyboard.type("Zek");
  // sexo (obrigatório): Tab entra no grupo e espaço marca a primeira opção
  await tabTo(page, page.getByRole("radio", { name: "Masculino", exact: true }), "Space");
  await expect(page.getByRole("radio", { name: "Masculino", exact: true })).toBeChecked();
  await tabTo(page, avancar, "Enter");
  await expect(h1(page)).toHaveText("Revisão");
  await tabTo(page, page.getByRole("button", { name: "Concluir" }), "Enter");
  await expect(h1(page)).toHaveText("Arquivo confidencial");
});

test("regra: Trabalhador vê mago ortodoxo desabilitado com mensagem", async ({ page }) => {
  await page.goto("/criar");
  await radio(page, "Homens-Galho").check();
  await next(page, "Subespécie");
  await radio(page, "Trabalhador").check();
  await next(page, "Origem");
  await radio(page, "Kruk (Reino Fronteiriço)").check();
  await page.getByRole("button", { name: "Avançar" }).click(); // confirma a região e mostra as subregiões
  await radio(page, "Andarilho/Aventureiro").check();
  await next(page, "Ofício");

  const mago = radio(page, "Mago ortodoxo");
  await expect(mago).toBeDisabled();
  await expect(mago).toHaveAccessibleDescription(/Indisponível para esta escolha.*só príncipes e a rainha/);
  await expect(page.getByText("Indisponível para esta escolha")).toBeVisible();
  await expect(radio(page, "Bardo")).toBeEnabled();
});

test("Terceiro Olho: marca opcional na Origem só em Man'naka oko, para qualquer espécie", async ({ page }) => {
  await page.goto("/criar");
  await radio(page, "Vampiros").check();
  await next(page, "Origem");
  await radio(page, "Midland").check();
  await page.getByRole("button", { name: "Avançar" }).click(); // confirma a região e mostra as subregiões
  await expect(checkbox(page, "Terceiro Olho")).toHaveCount(0);
  await back(page, "Origem");
  await radio(page, "Man'naka oko").check();
  await page.getByRole("button", { name: "Avançar" }).click();
  await radio(page, "Andarilho/Aventureiro").check();
  const olho = checkbox(page, "Terceiro Olho");
  await expect(olho).not.toBeChecked();
  await olho.check();
  await next(page, "Ofício");
  await expect(page.getByRole("button", { name: "Avançar" })).toBeEnabled();
});

test("Mutação da Irmandade entra sozinha para o Mutante da Irmandade e aparece na revisão", async ({ page }) => {
  await page.goto("/criar");
  await radio(page, "Humano").check();
  await next(page, "Subespécie");
  await radio(page, "Mutante da Irmandade de São Ferdinand").check();
  await next(page, "Origem");
  await radio(page, "Midland").check();
  await page.getByRole("button", { name: "Avançar" }).click();
  await radio(page, "Warsaw").check();
  for (const etapa of ["Ofício", "Fé", "Aparência", "Identidade"]) await next(page, etapa);
  await page.getByLabel("Nome (obrigatório)").fill("Ferdinand");
  await page.getByRole("radio", { name: "Incerto", exact: true }).check(); // sexo é obrigatório
  await next(page, "Revisão");
  await expect(page.getByRole("main")).toContainText("Mutação da Irmandade");
});

test("ofício personalizado: exige nome e aparece na revisão", async ({ page }) => {
  await page.goto("/criar");
  await radio(page, "Centauros").check();
  await next(page, "Origem");
  await radio(page, "Midland").check();
  await page.getByRole("button", { name: "Avançar" }).click();
  await radio(page, "Andarilho/Aventureiro").check();
  await next(page, "Ofício");
  // o pop-up abre ao escolher; Cancelar volta para o ofício anterior
  await radio(page, "Ofício personalizado").check();
  const dialogo = page.getByRole("dialog", { name: "Ofício personalizado" });
  await expect(dialogo).toBeVisible();
  await expect(dialogo.getByLabel("Nome do ofício (obrigatório)")).toBeFocused();
  await expect(dialogo.getByRole("button", { name: "Salvar ofício" })).toBeDisabled();
  await dialogo.getByRole("button", { name: "Cancelar" }).click();
  await expect(dialogo).toBeHidden();
  await expect(radio(page, "Sem ofício")).toBeChecked();

  await radio(page, "Ofício personalizado").check();
  await dialogo.getByLabel("Nome do ofício (obrigatório)").fill("Ferreiro");
  await dialogo.getByLabel("Descrição (opcional)").fill("Forja ferraduras.");
  await dialogo.getByRole("button", { name: "Salvar ofício" }).click();
  await expect(dialogo).toBeHidden();
  await expect(page.getByRole("button", { name: "Editar ofício personalizado" })).toBeVisible();
  for (const etapa of ["Fé", "Aparência", "Identidade"]) await next(page, etapa);
  await page.getByLabel("Nome (obrigatório)").fill("Brasa");
  await page.getByRole("radio", { name: "Incerto", exact: true }).check(); // sexo é obrigatório
  await next(page, "Revisão");
  await expect(page.getByRole("main")).toContainText("Ferreiro — Forja ferraduras.");
});

test("opção bloqueada mostra o motivo ao passar o mouse", async ({ page }, info) => {
  test.skip(info.project.name === "mobile-375", "hover só com mouse");
  await page.goto("/criar");
  await radio(page, "Centauros").check();
  await next(page, "Origem");
  await radio(page, "Midland").check();
  await page.getByRole("button", { name: "Avançar" }).click();
  await radio(page, "Andarilho/Aventureiro").check();
  await next(page, "Ofício");
  const card = page.locator('[data-escolha="Mago ortodoxo"]');
  const tooltip = card.getByRole("tooltip");
  await expect(tooltip).toBeHidden();
  await card.hover();
  await expect(tooltip).toBeVisible();
  await expect(tooltip).toContainText("Centauros abominam a magia");
});

test("regra R07: espécie que não é Homem-Galho deixa Kruk e Crick indisponíveis na Origem", async ({ page }) => {
  await page.goto("/criar");
  await radio(page, "Humano").check();
  await next(page, "Subespécie");
  await radio(page, "Humano comum").check();
  await next(page, "Origem");
  for (const name of ["Kruk (Reino Fronteiriço)", "Crick (A Horda de Southgarden)"]) {
    await expect(radio(page, name)).toBeDisabled();
    await expect(radio(page, name)).toHaveAccessibleDescription(/apenas Homens-Galho podem ser escolhidos/);
  }
  await expect(radio(page, "Midland")).toBeEnabled();

  // Homem-Galho em Kruk; voltar e trocar para Humano remove a região, com aviso
  await back(page, "Subespécie");
  await back(page, "Espécie");
  await radio(page, "Homens-Galho").check();
  await next(page, "Subespécie");
  await radio(page, "Príncipe").check();
  await next(page, "Origem");
  await expect(radio(page, "Kruk (Reino Fronteiriço)")).toBeEnabled();
  await radio(page, "Kruk (Reino Fronteiriço)").check();
  await back(page, "Subespécie");
  await back(page, "Espécie");
  await radio(page, "Humano").check();
  await expect(page.getByRole("main").getByRole("status").first()).toContainText("A região Kruk (Reino Fronteiriço) foi removida");
  await next(page, "Subespécie");
  await radio(page, "Humano comum").check();
  await next(page, "Origem");
  await expect(page.getByRole("button", { name: "Avançar" })).toBeDisabled();
});
