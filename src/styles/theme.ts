// Tokens de cor do tema escuro. themeCss() gera o CSS de :root e de cada [data-region]; o layout injeta no <head>.
// Controles e texto usam as cores cheias (--accent). Fundo, brilho, faixa e progresso usam --vivo, que vai do cinza
// (--vida: 0) à cor da região (--vida: 1); --vida vem do progresso e é posta no <html> pela página.
export type Palette = {
  accent: string; // botão primário, etapa atual, opção marcada
  accentText: string; // texto sobre o accent
  accent2: string; // segunda cor da bandeira, só decorativa (faixa do topo)
};

export const base = {
  background: "#0f1115",
  surface: "#1a1d24",
  foreground: "#ececf1",
  muted: "#a8adb8",
  border: "#3a3f4b",
};

// Opacidade mínima do véu sobre a imagem de fundo: garante o contraste do texto mesmo sobre pixel branco.
export const VEIL_MIN_OPACITY = 0.9;
const VEIL_MAX_OPACITY = 0.97;

export const neutral: Palette = { accent: "#c9ccd3", accentText: base.background, accent2: base.border };

// Cores das bandeiras confirmadas; as outras regiões ficam no neutro até haver decisão.
export const regionPalettes: Record<string, Palette> = {
  "uniao-das-provincias": { accent: "#3f6fd8", accentText: "#ffffff", accent2: "#ffffff" }, // azul e branco
  "reino-de-laguardia": { accent: "#d4a72c", accentText: "#111111", accent2: "#111111" }, // preto e dourado
  "planicies-de-sunfield": { accent: "#c93a3a", accentText: "#ffffff", accent2: "#3f6fd8" }, // vermelho e azul
  midland: { accent: "#f2f2f2", accentText: "#111111", accent2: "#111111" }, // preto e branco
};

export const paletteFor = (regionId: string | null | undefined) => (regionId && regionPalettes[regionId]) || neutral;

const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const rgba = (hex: string, alpha: number) => `rgb(${rgb(hex).join(" ")} / ${alpha})`;

// Brilho decorativo no topo do fundo, na cor viva; a opacidade máxima entra no teste de contraste.
export const GLOW_OPACITY = 0.12;
const glow = `radial-gradient(ellipse 80% 50% at 50% 0%, color-mix(in oklch, var(--vivo) ${GLOW_OPACITY * 100}%, transparent), transparent)`;

export const backgrounds = {
  veil: `${glow}, linear-gradient(to bottom, ${rgba(base.background, VEIL_MIN_OPACITY)}, ${rgba(base.background, VEIL_MAX_OPACITY)})`,
  solid: `${glow}, linear-gradient(to bottom, ${base.surface}, ${base.background})`,
};

// Opacidade do preenchimento das etapas concluídas na barra de progresso (bg-vivo/25).
export const DONE_FILL_OPACITY = 0.25;

// Contraste WCAG 2.x entre duas cores #rrggbb.
export function contrast(a: string, b: string) {
  const lum = (hex: string) => {
    const [r, g, bl] = rgb(hex).map((v) => {
      const c = v / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// Cor resultante de `top` com opacidade `alpha` sobre `bottom`.
export function blend(top: string, alpha: number, bottom: string) {
  const [t, b] = [rgb(top), rgb(bottom)];
  return `#${t.map((v, i) => Math.round(v * alpha + b[i] * (1 - alpha)).toString(16).padStart(2, "0")).join("")}`;
}

// sRGB <-> OKLab, para achar o cinza de mesma luminosidade de cada cor e simular o color-mix(in oklch).
const toLinear = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const toGamma = (v: number) => (v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055);
const toHex = (channels: number[]) =>
  `#${channels.map((v) => Math.round(Math.min(1, Math.max(0, toGamma(v))) * 255).toString(16).padStart(2, "0")).join("")}`;

function toOklab(hex: string) {
  const [r, g, b] = rgb(hex).map((v) => toLinear(v / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
}

function fromOklab([L, a, b]: number[]) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return toHex([
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ]);
}

// Cinza com a mesma luminosidade OKLab: o texto sobre a cor viva mantém o contraste em qualquer --vida.
export const grayOf = (hex: string) => fromOklab([toOklab(hex)[0], 0, 0]);

// color-mix(in oklch, cor t, cinzaDela): o cinza não tem matiz, então só L e croma andam (a, b escalam juntos).
export function vivid(hex: string, vida: number) {
  const [L, a, b] = toOklab(hex);
  const L0 = toOklab(grayOf(hex))[0];
  return fromOklab([L0 + (L - L0) * vida, a * vida, b * vida]);
}

const paletteVars = (p: Palette) =>
  `--accent: ${p.accent}; --accent-text: ${p.accentText}; --accent-2: ${p.accent2}; ` +
  `--accent-gray: ${grayOf(p.accent)}; --accent-2-gray: ${grayOf(p.accent2)}; ` +
  // redeclarados em cada bloco: var() em propriedade customizada resolve onde é declarada
  "--vivo: color-mix(in oklch, var(--accent) calc(var(--vida) * 100%), var(--accent-gray)); " +
  "--vivo-2: color-mix(in oklch, var(--accent-2) calc(var(--vida) * 100%), var(--accent-2-gray));";

export function themeCss() {
  const root = `:root { --background: ${base.background}; --surface: ${base.surface}; --foreground: ${base.foreground}; --muted: ${base.muted}; --border: ${base.border}; ${paletteVars(neutral)} color-scheme: dark; }`;
  const regions = Object.entries(regionPalettes).map(([id, p]) => `[data-region="${id}"] { ${paletteVars(p)} }`);
  return [root, ...regions].join("\n");
}
