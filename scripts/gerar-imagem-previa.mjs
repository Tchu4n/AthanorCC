// Gera src/app/opengraph-image.jpg (1200 x 630): a prévia que aparece ao compartilhar o link (WhatsApp, Discord, X).
// Compõe a carta do continente em sépia com as vinhetas, o título e as fontes do site, e fotografa com o Playwright.
// Uso: node scripts/gerar-imagem-previa.mjs   (precisa do ImageMagick para o JPEG final: `magick`)
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const arq = (p) => pathToFileURL(resolve(p)).href;
const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>
  @font-face { font-family: Cinzel; src: url(${arq("public/fonts/Cinzel-Bold.ttf")}); }
  @font-face { font-family: Gotica; src: url(${arq("public/fonts/GrenzeGotisch-SemiBold.ttf")}); }
  @font-face { font-family: Noto; src: url(${arq("public/fonts/NotoSans-Regular.ttf")}); }
  html, body { margin: 0; width: 1200px; height: 630px; overflow: hidden; }
  body { position: relative; background: #2a1810 url(${arq("public/textures/pano-adamascado.webp")}) center / 600px; font-family: Noto; }
  .papel { position: absolute; inset: 28px; border-radius: 6px; overflow: hidden;
    background: radial-gradient(ellipse at 30% 40%, #f3e4bf, #dcc28c 70%, #b8955a);
    box-shadow: 0 18px 50px rgb(0 0 0 / .65), inset 0 0 70px rgb(90 50 15 / .55); }
  .carta { position: absolute; left: 20px; top: 14px; width: 600px; height: 578px; }
  .carta img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain;
    -webkit-mask-image: radial-gradient(ellipse at center, black 62%, transparent 100%); }
  .mapa { filter: sepia(.8) saturate(.7) contrast(.95) brightness(1.12); }
  .texto { position: absolute; left: 640px; right: 48px; top: 0; bottom: 0; display: flex; flex-direction: column; justify-content: center; color: #2b1a0b; }
  .kicker { font: 700 20px Noto; letter-spacing: .28em; text-transform: uppercase; color: #6b4a24; }
  h1 { font: 700 62px/1.05 Cinzel; margin: 14px 0 6px; }
  .athanor { font: 600 76px/1 Gotica; color: #7a1f1f; }
  p { font: 400 25px/1.35 Noto; margin: 22px 0 0; color: #4a3015; }
  .filete { height: 2px; width: 220px; margin-top: 24px; background: linear-gradient(90deg, #8a6424, #e6c46f, #8a6424); }
</style></head><body>
  <div class="papel">
    <div class="carta">
      <img class="mapa" src="${arq("public/athanor/mapa/mapa-continente.jpeg")}">
      <img src="${arq("public/athanor/mapa/vinhetas.svg")}">
    </div>
    <div class="texto">
      <div class="kicker">Criador de personagem</div>
      <h1>Crie seu herói em</h1>
      <div class="athanor">Athanor</div>
      <div class="filete"></div>
      <p>Espécie, origem, ofício e fé, com a ficha confidencial da Agência de Highbridge em PDF.</p>
    </div>
  </div>
</body></html>`;

// aberto como arquivo (não com setContent): só uma página file:// pode carregar as fontes e imagens locais
const pasta = mkdtempSync(join(tmpdir(), "previa-"));
writeFileSync(join(pasta, "previa.html"), html);
const navegador = await chromium.launch();
const pagina = await navegador.newPage({ viewport: { width: 1200, height: 630 } });
await pagina.goto(arq(join(pasta, "previa.html")), { waitUntil: "load" });
await pagina.evaluate(() => document.fonts.ready);
const png = join(pasta, "previa.png");
await pagina.screenshot({ path: png });
await navegador.close();
execFileSync("magick", [png, "-strip", "-quality", "85", "src/app/opengraph-image.jpg"]);
console.log("src/app/opengraph-image.jpg gerada");
