// Gera o favicon animado da pedra filosofal: carrega energia, dispara e reinicia.
// Saídas: public/favicon/pedra-quadros.png (folha horizontal de quadros 64x64, usada pelo FaviconAnimado),
// public/favicon/pedra.gif (o mesmo laço em GIF) e src/app/icon.png (quadro estático, fallback do Next).
// Uso: node scripts/gerar-favicon.mjs   (precisa do ImageMagick: `magick`)
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium } from "@playwright/test";

const TAMANHO = 64;
const QUADROS = 20; // mantenha igual em src/components/ui/FaviconAnimado.tsx (com TAMANHO e MS_POR_QUADRO)
const MS_POR_QUADRO = 80;
const CARGA = 12; // quadros 0..11 carregam; 12..15 disparam; 16..19 descansam
const ESTATICO = 11; // quadro mais cheio de energia, usado como ícone parado

const mix = (a, b, t) => a + (b - a) * t;
const hex = (c1, c2, t) => {
  const p = (c, i) => parseInt(c.slice(1 + i * 2, 3 + i * 2), 16);
  return "#" + [0, 1, 2].map((i) => Math.round(mix(p(c1, i), p(c2, i), t)).toString(16).padStart(2, "0")).join("");
};

function quadro(i) {
  const carga = i < CARGA ? i / (CARGA - 1) : i < 16 ? 1 : Math.max(0, 1 - (i - 15) / 3);
  const disparo = i >= CARGA && i < 16 ? (i - CARGA + 1) / 4 : 0; // 0.25..1
  const c = 32, cy = 34;
  const partes = [];

  // brilho atrás da pedra
  partes.push(`<circle cx="${c}" cy="${cy}" r="${mix(14, 30, carga)}" fill="url(#brilho)" opacity="${mix(0.15, 0.95, carga)}"/>`);

  // faíscas douradas convergindo para a pedra enquanto carrega
  if (i < CARGA)
    for (let k = 0; k < 6; k++) {
      const a = (k / 6) * Math.PI * 2 + i * 0.25;
      const r = mix(30, 15, ((i + k * 2) % CARGA) / CARGA);
      partes.push(`<circle cx="${(c + Math.cos(a) * r).toFixed(1)}" cy="${(cy + Math.sin(a) * r).toFixed(1)}" r="${mix(1.4, 2.4, carga)}" fill="#ffd27a"/>`);
    }

  // disparo: raios saindo da pedra e um clarão
  if (disparo) {
    for (let k = 0; k < 8; k++) {
      const a = (k / 8) * Math.PI * 2 + Math.PI / 8;
      const r0 = mix(16, 24, disparo), r1 = mix(24, 34, disparo);
      partes.push(
        `<line x1="${(c + Math.cos(a) * r0).toFixed(1)}" y1="${(cy + Math.sin(a) * r0).toFixed(1)}" x2="${(c + Math.cos(a) * r1).toFixed(1)}" y2="${(cy + Math.sin(a) * r1).toFixed(1)}" stroke="#fff0b8" stroke-width="${mix(5, 2, disparo)}" stroke-linecap="round" opacity="${1 - disparo * 0.7}"/>`,
      );
    }
    partes.push(`<circle cx="${c}" cy="${cy}" r="${mix(18, 30, disparo)}" fill="none" stroke="#ffd27a" stroke-width="2.5" opacity="${1 - disparo}"/>`);
  }

  // a pedra: hexágono lapidado, mais clara quanto mais carregada
  const base = hex("#6e0c18", "#b3142a", carga);
  const face = hex("#a51a2c", "#ff6a55", carga);
  const luz = hex("#e0606a", "#fff2d0", carga);
  partes.push(
    `<polygon points="32,14 47,24 47,44 32,54 17,44 17,24" fill="${base}" stroke="#2a0508" stroke-width="2.5" stroke-linejoin="round"/>`,
    `<polygon points="32,22 40,28 40,40 32,46 24,40 24,28" fill="${face}"/>`,
    `<path d="M32 14 L32 22 M47 24 L40 28 M47 44 L40 40 M32 54 L32 46 M17 44 L24 40 M17 24 L24 28" stroke="#2a0508" stroke-width="1" opacity=".6"/>`,
    `<polygon points="24,28 32,22 32,30 27,33" fill="${luz}" opacity=".85"/>`,
  );
  if (disparo) partes.push(`<circle cx="${c}" cy="${cy}" r="${mix(20, 8, disparo)}" fill="#fff8e0" opacity="${0.9 - disparo * 0.9}"/>`);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${TAMANHO}" height="${TAMANHO}" viewBox="0 0 64 64">
  <defs><radialGradient id="brilho"><stop offset="0" stop-color="#ffcf6a"/><stop offset=".5" stop-color="#ff5a3c" stop-opacity=".6"/><stop offset="1" stop-color="#ff5a3c" stop-opacity="0"/></radialGradient></defs>
  ${partes.join("\n  ")}
</svg>`;
}

const tmp = mkdtempSync(join(tmpdir(), "favicon-"));
const navegador = await chromium.launch();
const pagina = await navegador.newPage({ viewport: { width: TAMANHO, height: TAMANHO } });
const pngs = [];
for (let i = 0; i < QUADROS; i++) {
  await pagina.setContent(`<style>html,body{margin:0;background:transparent}</style>${quadro(i)}`);
  const arquivo = join(tmp, `q${String(i).padStart(2, "0")}.png`);
  await pagina.screenshot({ path: arquivo, omitBackground: true });
  pngs.push(arquivo);
}
await navegador.close();

mkdirSync("public/favicon", { recursive: true });
execFileSync("magick", [...pngs, "+append", "+repage", "public/favicon/pedra-quadros.png"]);
execFileSync("magick", ["-delay", String(MS_POR_QUADRO / 10), "-dispose", "background", "-loop", "0", ...pngs, "-resize", "32x32", "public/favicon/pedra.gif"]);
execFileSync("magick", [pngs[ESTATICO], "src/app/icon.png"]);
console.log(`${QUADROS} quadros gerados em public/favicon/ e src/app/icon.png`);
