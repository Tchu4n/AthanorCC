import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { expect, test, type Page } from "@playwright/test";
import { PDFParse } from "pdf-parse";

const KEY = "athanor:character:v1";
const h1 = (page: Page) => page.getByRole("heading", { level: 1 });
const radio = (page: Page, name: string) => page.getByRole("radio", { name, exact: true });
const preview = (page: Page) => page.getByRole("complementary", { name: "Prévia da ficha" });
// a prévia só aparece no final; durante a etapa, a imagem enviada aparece no bloco de envio
const enviada = (page: Page) => page.getByRole("region", { name: "Imagem do personagem" });
const fileInput = (page: Page) => page.getByLabel("Enviar sua imagem", { exact: true });
const savedUpload = (page: Page) =>
  page.evaluate((k) => JSON.parse(localStorage.getItem(k) ?? "null")?.character?.appearance?.image ?? null, KEY);

async function next(page: Page, expected: string) {
  await page.getByRole("button", { name: "Avançar" }).click();
  await expect(h1(page)).toHaveText(expected);
}

async function goToAppearance(page: Page) {
  await page.goto("/criar");
  await radio(page, "Midland").check();
  await page.getByRole("button", { name: "Avançar" }).click(); // confirma a região e mostra as subregiões
  await radio(page, "Andarilho/Aventureiro").check();
  await next(page, "Espécie");
  await radio(page, "Centauros").check();
  await next(page, "Ofício");
  await next(page, "Fé");
  await next(page, "Marcas");
  await next(page, "Aparência");
}

test("enviar PNG pequeno, ver na prévia, recarregar e remover", async ({ page }) => {
  await goToAppearance(page);
  await expect(page.getByText("A imagem fica salva só neste navegador.")).toBeVisible();
  await fileInput(page).setInputFiles(join(process.cwd(), "e2e/fixtures/pequena.png"));

  await expect(enviada(page).getByRole("img", { name: "pequena.png" })).toBeVisible();
  await expect(radio(page, "Sem imagem")).not.toBeChecked();
  await expect.poll(() => savedUpload(page)).toMatchObject({ kind: "upload", name: "pequena.png" });
  expect((await savedUpload(page)).dataUrl).toMatch(/^data:image\/jpeg;base64,/);

  await page.reload();
  await expect(h1(page)).toHaveText("Aparência");
  await expect(enviada(page).getByRole("img", { name: "pequena.png" })).toBeVisible();

  const remover = page.getByRole("button", { name: "Remover imagem" });
  await remover.focus();
  await expect(remover).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(enviada(page).getByRole("img")).toHaveCount(0);
  await expect(radio(page, "Sem imagem")).toBeChecked();
  await expect.poll(() => savedUpload(page)).toBeNull();
});

test("arquivo .txt mostra a mensagem de formato e não muda a imagem", async ({ page }) => {
  await goToAppearance(page);
  await fileInput(page).setInputFiles({ name: "notas.txt", mimeType: "text/plain", buffer: Buffer.from("não sou imagem") });
  await expect(page.getByRole("main").getByRole("alert")).toHaveText("Use PNG, JPEG ou WebP.");
  await expect(enviada(page).getByRole("img")).toHaveCount(0);
  await expect(radio(page, "Sem imagem")).toBeChecked();
});

test("foto grande é reduzida para 512 px e cabe em 400 KB", async ({ page }) => {
  await goToAppearance(page);
  await fileInput(page).setInputFiles(join(process.cwd(), "public/athanor/regions/crick-criatura.png")); // ~2,7 MB
  await expect(enviada(page).getByRole("img", { name: "crick-criatura.png" })).toBeVisible();
  await expect.poll(() => savedUpload(page)).toMatchObject({ kind: "upload" });
  const { dataUrl } = await savedUpload(page);
  expect(dataUrl.length).toBeLessThanOrEqual(400 * 1024);
  const size = await page.evaluate(
    (src) =>
      new Promise<{ w: number; h: number }>((resolve) => {
        const img = new Image();
        img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
        img.src = src;
      }),
    dataUrl,
  );
  expect(Math.max(size.w, size.h)).toBe(512);
});

test("PDF exportado contém o nome e a imagem enviada", async ({ page }) => {
  await goToAppearance(page);
  await fileInput(page).setInputFiles(join(process.cwd(), "e2e/fixtures/pequena.png"));
  await expect(enviada(page).getByRole("img", { name: "pequena.png" })).toBeVisible();
  await next(page, "Identidade");
  await page.getByLabel("Nome (obrigatório)").fill("Tavra Cascorrubro");
  await next(page, "Revisão");
  await page.getByRole("button", { name: "Concluir" }).click();
  await expect(preview(page).getByRole("img", { name: "pequena.png" })).toBeVisible();

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    preview(page).getByRole("button", { name: "Exportar PDF" }).click(),
  ]);
  expect(download.suggestedFilename()).toBe("ficha-tavra-cascorrubro.pdf");
  const bytes = await readFile(await download.path());
  expect(bytes.toString("latin1")).toContain("/Subtype /Image");
  const parser = new PDFParse({ data: new Uint8Array(bytes) });
  const { text } = await parser.getText();
  await parser.destroy();
  expect(text).toContain("Tavra Cascorrubro");
  expect(text).toContain("pequena.png");
});

test("imagem de 3000 x 2000 px com ruído (pior caso) sai com 512 px e menos de 400 KB", async ({ page }) => {
  await goToAppearance(page);
  // gera no próprio navegador um JPEG de ruído aleatório, que quase não comprime
  const base64 = await page.evaluate(async () => {
    const canvas = document.createElement("canvas");
    canvas.width = 3000;
    canvas.height = 2000;
    const ctx = canvas.getContext("2d")!;
    const data = ctx.createImageData(3000, 2000);
    for (let i = 0; i < data.data.length; i++) data.data[i] = i % 4 === 3 ? 255 : Math.random() * 256;
    ctx.putImageData(data, 0, 0);
    const blob = await new Promise<Blob>((r) => canvas.toBlob((b) => r(b!), "image/jpeg", 0.95));
    const bytes = new Uint8Array(await blob.arrayBuffer());
    let bin = "";
    for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    return btoa(bin);
  });
  const original = Buffer.from(base64, "base64");
  expect(original.length).toBeGreaterThan(2_000_000);

  await fileInput(page).setInputFiles({ name: "ruido.jpg", mimeType: "image/jpeg", buffer: original });
  await expect(enviada(page).getByRole("img", { name: "ruido.jpg" })).toBeVisible();
  await expect.poll(() => savedUpload(page)).toMatchObject({ kind: "upload", name: "ruido.jpg" });
  const { dataUrl } = await savedUpload(page);
  expect(dataUrl.length).toBeLessThan(400 * 1024);
  const size = await page.evaluate(
    (src) =>
      new Promise<{ w: number; h: number }>((resolve) => {
        const img = new Image();
        img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
        img.src = src;
      }),
    dataUrl,
  );
  expect(size).toEqual({ w: 512, h: 341 });
});

test("botão de anexar fica no topo, antes da grade de referências, sem overflow", async ({ page }, info) => {
  await goToAppearance(page);
  const anexar = page.locator("label", { hasText: "Enviar sua imagem" });
  const sem = page.locator("label", { has: radio(page, "Sem imagem") });
  const grade = page.getByRole("group", { name: "Imagens de referência" });
  const [a, s, g] = [await anexar.boundingBox(), await sem.boundingBox(), await grade.boundingBox()];
  expect(a!.y + a!.height).toBeLessThanOrEqual(g!.y);
  expect(await anexar.evaluate((el, grid) => !!(el.compareDocumentPosition(grid!) & Node.DOCUMENT_POSITION_FOLLOWING), await grade.elementHandle())).toBe(true);
  // fase 3.0: "Sem imagem" é o primeiro card da grade de referências
  await expect(grade.locator("label", { has: radio(page, "Sem imagem") })).toBeVisible();
  expect(s!.y).toBeGreaterThanOrEqual(g!.y);
  if (info.project.name === "mobile-375") expect(a!.x + a!.width).toBeLessThanOrEqual(375);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});
