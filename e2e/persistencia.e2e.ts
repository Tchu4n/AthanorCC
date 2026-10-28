import { expect, test, type Page } from "@playwright/test";

const KEY = "athanor:character:v1";
const h1 = (page: Page) => page.getByRole("heading", { level: 1 });
const radio = (page: Page, name: string) => page.getByRole("radio", { name, exact: true });
const checkbox = (page: Page, name: string) => page.getByRole("checkbox", { name, exact: true });
const saved = (page: Page) => page.evaluate((k) => localStorage.getItem(k), KEY);

async function next(page: Page, expected: string) {
  await page.getByRole("button", { name: "Avançar" }).click();
  await expect(h1(page)).toHaveText(expected);
}

async function fillUntilFaith(page: Page) {
  await page.goto("/criar");
  await radio(page, "Midland").check();
  await page.getByRole("button", { name: "Avançar" }).click(); // confirma a região e mostra as subregiões
  await radio(page, "Aurelia").check();
  await next(page, "Espécie");
  await radio(page, "Humano").check();
  await next(page, "Subespécie");
  await radio(page, "Elite de orelhas pontudas").check();
  await next(page, "Ofício");
  await radio(page, "Bardo").check();
  await next(page, "Fé");
  await checkbox(page, "Umbra").check();
}

test("recarregar volta na mesma etapa com as mesmas escolhas", async ({ page }) => {
  await fillUntilFaith(page);
  await expect.poll(() => saved(page)).toContain('"umbra"'); // debounce de 300 ms
  await page.reload();

  await expect(h1(page)).toHaveText("Fé");
  await expect(checkbox(page, "Umbra")).toBeChecked();
  await page.getByRole("button", { name: "Voltar" }).click();
  await expect(radio(page, "Bardo")).toBeChecked();
  await page.getByRole("button", { name: "Voltar" }).click();
  await expect(radio(page, "Elite de orelhas pontudas")).toBeChecked();
  await page.getByRole("button", { name: "Voltar" }).click();
  await page.getByRole("button", { name: "Voltar" }).click();
  // com a região escolhida, a Origem mostra só as subregiões; a região aparece na explicação ao lado
  await expect(page.locator("[data-explicacao]").getByRole("heading", { level: 2, name: "Midland" })).toBeVisible();
  await expect(radio(page, "Aurelia")).toBeChecked();

  const data = JSON.parse((await saved(page)) ?? "{}");
  expect(data.character.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
});

test("mudança feita logo antes de recarregar não se perde", async ({ page }) => {
  await fillUntilFaith(page);
  await checkbox(page, "Activum").check();
  await page.reload(); // sem esperar o debounce: o pagehide salva
  await expect(h1(page)).toHaveText("Fé");
  await expect(checkbox(page, "Activum")).toBeChecked();
});

test("chave corrompida abre a página com aviso, no início", async ({ page }) => {
  await page.goto("/criar");
  await expect(h1(page)).toHaveText("Origem"); // carga inicial concluída antes de corromper a chave
  await page.evaluate((k) => localStorage.setItem(k, "{corrompido"), KEY);
  await page.reload();
  await expect(page.getByRole("main").getByRole("alert")).toContainText("formato inválido e foi descartado");
  await expect(h1(page)).toHaveText("Origem");
  expect(await saved(page)).toBeNull();

  // id que não existe nos dados também é descartado
  await page.evaluate(
    (k) => localStorage.setItem(k, JSON.stringify({ version: 1, step: "especie", character: { speciesId: "elfo" } })),
    KEY,
  );
  await page.reload();
  await expect(page.getByRole("main").getByRole("alert")).toContainText("descartado");
  await expect(h1(page)).toHaveText("Origem");
});

test("Recomeçar pede confirmação, Esc cancela e confirmar limpa tudo", async ({ page }) => {
  await fillUntilFaith(page);
  await expect.poll(() => saved(page)).not.toBeNull();

  await page.getByRole("button", { name: "Recomeçar" }).click();
  const dialog = page.getByRole("dialog", { name: "Recomeçar o personagem?" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Cancelar" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(dialog.getByRole("button", { name: "Recomeçar" })).toBeFocused();
  await page.keyboard.press("Tab"); // foco preso: não sai do modal para a página
  await expect(page.locator("main >> :focus")).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(h1(page)).toHaveText("Fé");
  await expect(checkbox(page, "Umbra")).toBeChecked();

  await page.getByRole("button", { name: "Recomeçar" }).click();
  await dialog.getByRole("button", { name: "Recomeçar" }).click();
  await expect(h1(page)).toHaveText("Origem");
  await expect(radio(page, "Midland")).not.toBeChecked();
  expect(await saved(page)).toBeNull();
  await page.waitForTimeout(500); // depois do debounce a chave continua vazia
  expect(await saved(page)).toBeNull();
  await page.reload();
  await expect(h1(page)).toHaveText("Origem");
  await expect(radio(page, "Midland")).not.toBeChecked();
});

test("localStorage indisponível: avisa e segue em memória", async ({ page }) => {
  await page.addInitScript(() => {
    const blocked = () => {
      throw new DOMException("bloqueado", "SecurityError");
    };
    Storage.prototype.getItem = blocked;
    Storage.prototype.setItem = blocked;
    Storage.prototype.removeItem = blocked;
  });
  await page.goto("/criar");
  await expect(page.getByRole("main").getByRole("alert")).toContainText("armazenamento do navegador não está disponível");
  await radio(page, "Império das Estepes (Gorturk)").check();
  await page.getByRole("button", { name: "Avançar" }).click(); // confirma a região e mostra as subregiões
  await radio(page, "Andarilho/Aventureiro").check();
  await next(page, "Espécie");
  await radio(page, "Vampiros").check();
  await next(page, "Ofício");
});
