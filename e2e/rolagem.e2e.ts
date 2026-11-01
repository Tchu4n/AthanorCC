import { expect, test } from "@playwright/test";

test("botões de ir ao fim e voltar ao topo aparecem conforme a rolagem", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 600 });
  await page.goto("/criar");
  const topo = page.getByRole("button", { name: "Ir para o topo" });
  const fim = page.getByRole("button", { name: "Ir para o fim da página" });

  await expect(topo).toBeHidden(); // já está no topo
  await fim.click();
  await expect.poll(() => page.evaluate(() => window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2)).toBe(true);
  await expect(fim).toBeHidden();

  await topo.click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect(topo).toBeHidden();
});
