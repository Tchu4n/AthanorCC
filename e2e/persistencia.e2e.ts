import { expect, test, type Page } from "@playwright/test";
import { KEY, h1, radio, checkbox, next } from "./helpers";

const saved = (page: Page) => page.evaluate((k) => localStorage.getItem(k), KEY);

async function fillUntilFaith(page: Page) {
  await page.goto("/criar");
  await radio(page, "Humano").check();
  await next(page, "Subespécie");
  await radio(page, "Elite de orelhas pontudas").check();
  await next(page, "Origem");
  await radio(page, "Midland").check();
  await page.getByRole("button", { name: "Avançar" }).click(); // confirma a região e mostra as subregiões
  await radio(page, "Aurelia").check();
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
  // com a região escolhida, a Origem mostra só as subregiões; a região aparece na explicação ao lado
  await expect(page.locator("[data-explicacao]").getByRole("heading", { level: 2, name: "Midland" })).toBeVisible();
  await expect(radio(page, "Aurelia")).toBeChecked();
  await page.getByRole("button", { name: "Voltar" }).click(); // subregiões -> regiões
  await page.getByRole("button", { name: "Voltar" }).click();
  await expect(radio(page, "Elite de orelhas pontudas")).toBeChecked();

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
  await expect(h1(page)).toHaveText("Espécie"); // carga inicial concluída antes de corromper a chave
  await page.evaluate((k) => localStorage.setItem(k, "{corrompido"), KEY);
  await page.reload();
  await expect(page.getByRole("main").getByRole("alert")).toContainText("formato inválido e foi descartado");
  await expect(h1(page)).toHaveText("Espécie");
  expect(await saved(page)).toBeNull();

  // id que não existe nos dados também é descartado
  await page.evaluate(
    (k) => localStorage.setItem(k, JSON.stringify({ version: 1, step: "especie", character: { speciesId: "elfo" } })),
    KEY,
  );
  await page.reload();
  await expect(page.getByRole("main").getByRole("alert")).toContainText("descartado");
  await expect(h1(page)).toHaveText("Espécie");
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
  await expect(h1(page)).toHaveText("Espécie");
  await expect(radio(page, "Humano")).not.toBeChecked();
  expect(await saved(page)).toBeNull();
  await page.waitForTimeout(500); // depois do debounce a chave continua vazia
  expect(await saved(page)).toBeNull();
  await page.reload();
  await expect(h1(page)).toHaveText("Espécie");
  await expect(radio(page, "Humano")).not.toBeChecked();
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
  await radio(page, "Vampiros").check();
  await next(page, "Origem");
  await radio(page, "Império das Estepes (Gorturk)").check();
  await page.getByRole("button", { name: "Avançar" }).click(); // confirma a região e mostra as subregiões
  await radio(page, "Andarilho/Aventureiro").check();
  await next(page, "Ofício");
});

test("save da ordem antiga (origem escolhida, sem espécie, já no Ofício) volta para a Espécie sem perder a origem", async ({ page }) => {
  await page.goto("/criar");
  await expect(h1(page)).toHaveText("Espécie"); // carga inicial concluída antes de gravar a chave
  const antigo = {
    version: 1,
    step: "oficio",
    character: {
      origin: { regionId: "midland", subregionId: "aurelia" },
      speciesId: null,
      subspeciesId: null,
      occupationId: null,
      faithIds: [],
      marks: [],
      appearance: { image: null, notes: "" },
      identity: { name: "", age: "", shortStory: "", personality: "" },
      createdAt: "2026-10-01T00:00:00.000Z",
    },
  };
  await page.evaluate(([k, v]) => localStorage.setItem(k, v), [KEY, JSON.stringify(antigo)] as const);
  await page.reload();
  await expect(h1(page)).toHaveText("Espécie");
  await radio(page, "Centauros").check();
  await next(page, "Origem");
  await expect(radio(page, "Aurelia")).toBeChecked();
});
