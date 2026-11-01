import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;

export default defineConfig({
  testDir: "e2e",
  testMatch: "**/*.e2e.ts", // fora do padrão *.test.ts para o Vitest não pegar estes arquivos
  // um só servidor (next start) atende todos os navegadores: com 8 em paralelo, testes travavam de forma intermitente
  workers: 4,
  timeout: 60_000, // fluxos longos (teclado, PDF gerado no navegador)
  use: { baseURL: `http://localhost:${PORT}` },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-375", use: { ...devices["Desktop Chrome"], viewport: { width: 375, height: 740 }, hasTouch: true } },
  ],
  webServer: {
    command: `npm run build && npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}/criar`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
