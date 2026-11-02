import { expect, test } from "@playwright/test";

test("endereço inexistente: 404 com página em pt-BR e caminho de volta ao criador", async ({ page }) => {
  const resposta = await page.goto("/nao-existe");
  expect(resposta?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Página não encontrada");
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  await page.getByRole("link", { name: "Ir para o criador" }).click();
  await expect(page).toHaveURL(/\/criar$/);
});
