import { expect, test } from "@playwright/test";

const icone = (page: import("@playwright/test").Page) => page.locator('link[rel~="icon"]').first().getAttribute("href");

test("favicon da pedra filosofal anima trocando os quadros", async ({ page }) => {
  await page.goto("/");
  await expect.poll(() => icone(page)).toMatch(/^data:image\/png/);
  const vistos = new Set<string>();
  await expect.poll(async () => (vistos.add((await icone(page))!), vistos.size)).toBeGreaterThan(3);
});

test("com movimento reduzido o favicon fica parado", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.waitForTimeout(500);
  expect(await icone(page)).toMatch(/\/icon\.png/);
});
