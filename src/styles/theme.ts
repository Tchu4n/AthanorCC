// Tokens de cor do tema escuro. themeCss() gera o CSS de :root e de cada [data-region]; o layout injeta no <head>.
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
export const VEIL_MIN_OPACITY = 0.85;
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

export const backgrounds = {
  veil: `linear-gradient(to bottom, ${rgba(base.background, VEIL_MIN_OPACITY)}, ${rgba(base.background, VEIL_MAX_OPACITY)})`,
  solid: `linear-gradient(to bottom, ${base.surface}, ${base.background})`,
};

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

const paletteVars = (p: Palette) => `--accent: ${p.accent}; --accent-text: ${p.accentText}; --accent-2: ${p.accent2};`;

export function themeCss() {
  const root = `:root { --background: ${base.background}; --surface: ${base.surface}; --foreground: ${base.foreground}; --muted: ${base.muted}; --border: ${base.border}; ${paletteVars(neutral)} color-scheme: dark; }`;
  const regions = Object.entries(regionPalettes).map(([id, p]) => `[data-region="${id}"] { ${paletteVars(p)} }`);
  return [root, ...regions].join("\n");
}
