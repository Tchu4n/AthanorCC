import { expect, test } from "@playwright/test";

test("endereço inexistente: 404 com página em pt-BR e caminho de volta ao criador", async ({ page }) => {
  const resposta = await page.goto("/nao-existe");
  expect(resposta?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Página não encontrada");
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  await page.getByRole("link", { name: "Ir para o criador" }).click();
  await expect(page).toHaveURL(/\/criar$/);
});

test("prévia do link: Open Graph em pt-BR com imagem 1200 x 630 e cartão grande no X", async ({ page, request }) => {
  await page.goto("/criar");
  const meta = (chave: string) => page.locator(`meta[property="${chave}"], meta[name="${chave}"]`).first().getAttribute("content");
  expect(await meta("og:title")).toBe("Criador de Personagem — Athanor");
  expect(await meta("og:locale")).toBe("pt_BR");
  expect(await meta("og:image:width")).toBe("1200");
  expect(await meta("og:image:height")).toBe("630");
  expect(await meta("twitter:card")).toBe("summary_large_image");
  // a URL absoluta aponta para o domínio de produção na Vercel; aqui, só o caminho importa
  const url = new URL((await meta("og:image"))!);
  const imagem = await request.get(url.pathname + url.search);
  expect(imagem.status()).toBe(200);
  expect(imagem.headers()["content-type"]).toBe("image/jpeg");
});
