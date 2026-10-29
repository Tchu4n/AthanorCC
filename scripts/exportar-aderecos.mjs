// Grava os desenhos de src/components/ui/aderecos-desenho.tsx como SVGs estáticos em public/aderecos.
// Uso, com `npm run dev` rodando: node scripts/exportar-aderecos.mjs [url da página /dev/aderecos]
import { writeFileSync } from "node:fs";
import { chromium } from "@playwright/test";

const url = process.argv[2] ?? "http://localhost:3000/dev/aderecos";
const navegador = await chromium.launch();
const pagina = await navegador.newPage();
await pagina.goto(url);
const svgs = await pagina.$$eval("svg[data-adereco]", (lista) =>
  lista.map((svg) => {
    const c = svg.cloneNode(true);
    const nome = c.getAttribute("data-adereco");
    c.removeAttribute("data-adereco");
    c.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    // como <img>, o SVG não vê as fontes da página: fica a fonte serifada do sistema
    c.querySelectorAll("[style]").forEach((e) => e.setAttribute("style", e.getAttribute("style").replace(/var\(--font-titulo\),\s*/, "")));
    return [nome, c.outerHTML];
  }),
);
await navegador.close();
if (!svgs.length) throw new Error(`nenhum adereço encontrado em ${url}`);
for (const [nome, svg] of svgs) {
  writeFileSync(`public/aderecos/${nome}.svg`, svg);
  console.log(`public/aderecos/${nome}.svg  ${(svg.length / 1024).toFixed(1)} KB`);
}
