import { describe, expect, it } from "vitest";
import { getRegion } from "@/lib/catalog";
import { base, blend, contrast, neutral, regionPalettes, themeCss, VEIL_MIN_OPACITY } from "./theme";

const AA_TEXT = 4.5;
const AA_UI = 3; // bordas e indicadores (WCAG 1.4.11)
const palettes = { neutro: neutral, ...regionPalettes };

describe("theme", () => {
  it("contraste confere com valores conhecidos", () => {
    expect(contrast("#000000", "#ffffff")).toBeCloseTo(21);
    expect(contrast("#777777", "#ffffff")).toBeCloseTo(4.48, 1);
  });

  it("texto e texto secundário passam AA sobre o fundo e a superfície", () => {
    for (const fg of [base.foreground, base.muted])
      for (const bg of [base.background, base.surface]) expect(contrast(fg, bg), `${fg} sobre ${bg}`).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it("texto passa AA sobre o véu mesmo com pixel branco ou preto da imagem por baixo", () => {
    for (const pixel of ["#ffffff", "#000000", "#808080"]) {
      const fundo = blend(base.background, VEIL_MIN_OPACITY, pixel);
      expect(contrast(base.foreground, fundo), `sobre ${fundo}`).toBeGreaterThanOrEqual(AA_TEXT);
      expect(contrast(base.muted, fundo), `muted sobre ${fundo}`).toBeGreaterThanOrEqual(AA_TEXT);
    }
  });

  it.each(Object.entries(palettes))("paleta %s: texto do destaque passa AA e o destaque aparece sobre o fundo", (_, p) => {
    expect(contrast(p.accentText, p.accent)).toBeGreaterThanOrEqual(AA_TEXT);
    for (const bg of [base.background, base.surface]) expect(contrast(p.accent, bg)).toBeGreaterThanOrEqual(AA_UI);
  });

  it("só UP, Laguardia, Sunfield e Midland têm paleta própria, e os ids existem", () => {
    expect(Object.keys(regionPalettes).sort()).toEqual(["midland", "planicies-de-sunfield", "reino-de-laguardia", "uniao-das-provincias"]);
    for (const id of Object.keys(regionPalettes)) expect(getRegion(id), id).toBeTruthy();
  });

  it("themeCss gera :root e um bloco por região", () => {
    const css = themeCss();
    expect(css).toContain(`:root { --background: ${base.background};`);
    expect(css).toContain(`[data-region="reino-de-laguardia"] { --accent: #d4a72c;`);
  });
});
