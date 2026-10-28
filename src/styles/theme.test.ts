import { describe, expect, it } from "vitest";
import { getRegion, getRegions } from "@/lib/catalog";
import { base, blend, CAPTION_OPACITY, CARD_VEIL_OPACITY, contrast, DONE_FILL_OPACITY, GLOW_OPACITY, grayOf, neutral, OURO, regionPalettes, themeCss, VEIL_MIN_OPACITY, vivid } from "./theme";

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

  it("toda região tem paleta própria, e os ids existem", () => {
    expect(Object.keys(regionPalettes).sort()).toEqual(getRegions().map((r) => r.id).sort());
    for (const id of Object.keys(regionPalettes)) expect(getRegion(id), id).toBeTruthy();
  });

  it("themeCss gera :root e um bloco por região", () => {
    const css = themeCss();
    expect(css).toContain(`:root { --background: ${base.background};`);
    expect(css).toContain(`[data-region="reino-de-laguardia"] { --accent: #d4a72c;`);
  });

  describe("progressão de vida: contraste nos extremos (--vida 0 e 1) e no meio", () => {
    const VIDAS = [0, 0.5, 1];
    // fundos possíveis atrás do texto: fundo, superfície e véu sobre pixel branco da imagem
    const fundos = [base.background, base.surface, blend(base.background, VEIL_MIN_OPACITY, "#ffffff")];

    it.each(Object.entries(palettes))("paleta %s", (_, p) => {
      expect(vivid(p.accent, 1)).toBe(vivid(p.accent, 1));
      expect(vivid(p.accent, 0)).toBe(grayOf(p.accent)); // vida 0 = cinza
      for (const v of VIDAS) {
        const vivo = vivid(p.accent, v);
        // etapa atual da barra: texto sobre a cor viva
        expect(contrast(p.accentText, vivo), `etapa atual, vida ${v}`).toBeGreaterThanOrEqual(AA_TEXT);
        for (const fundo of fundos) {
          // texto sobre o brilho decorativo e sobre o preenchimento das etapas concluídas
          expect(contrast(base.foreground, blend(vivo, GLOW_OPACITY, fundo)), `brilho, vida ${v}`).toBeGreaterThanOrEqual(AA_TEXT);
          expect(contrast(base.muted, blend(vivo, GLOW_OPACITY, fundo)), `muted no brilho, vida ${v}`).toBeGreaterThanOrEqual(AA_TEXT);
          expect(contrast(base.foreground, blend(vivo, DONE_FILL_OPACITY, fundo)), `concluída, vida ${v}`).toBeGreaterThanOrEqual(AA_TEXT);
        }
      }
      // controles e foco não dessaturam: usam a cor cheia, que não depende de --vida
      expect(contrast(p.accentText, p.accent)).toBeGreaterThanOrEqual(AA_TEXT);
      expect(contrast("#3b82f6", base.background)).toBeGreaterThanOrEqual(AA_UI); // outline-blue-500 do foco
    });

    it("themeCss deriva --vivo de --vida com color-mix em oklch", () => {
      expect(themeCss()).toContain("--vivo: color-mix(in oklch, var(--accent) calc(var(--vida) * 100%), var(--accent-gray));");
    });
  });

  it.each([0, 1])("legenda da vitrine passa AA sobre qualquer pixel da imagem (--vida %s)", () => {
    // a imagem da vitrine não muda com --vida; o teste roda nos dois extremos como pedido
    for (const pixel of ["#ffffff", "#000000", "#ffff00", "#808080"]) {
      const faixa = blend(base.background, CAPTION_OPACITY, pixel);
      expect(contrast(base.foreground, faixa), `sobre ${pixel}`).toBeGreaterThanOrEqual(AA_TEXT);
    }
  });

  describe("cards e botões: contraste em --vida 0, 0.5 e 1", () => {
    const VIDAS = [0, 0.5, 1];
    const PIXELS = ["#ffffff", "#000000", "#ffff00", "#808080"];

    it.each(Object.entries(palettes))("paleta %s", (_, p) => {
      for (const v of VIDAS) {
        for (const pixel of PIXELS) {
          // título (foreground), descrição e rótulo da categoria (muted) ficam sobre o véu do card, por cima da imagem
          const veu = blend(base.background, CARD_VEIL_OPACITY, pixel);
          expect(contrast(base.foreground, veu), `título, vida ${v}, pixel ${pixel}`).toBeGreaterThanOrEqual(AA_TEXT);
          expect(contrast(base.muted, veu), `descrição, vida ${v}, pixel ${pixel}`).toBeGreaterThanOrEqual(AA_TEXT);
        }
        // chips: texto sobre a superfície sólida
        expect(contrast(base.foreground, base.surface), `chip, vida ${v}`).toBeGreaterThanOrEqual(AA_TEXT);
        // botões usam a cor cheia, que não muda com --vida: primário, "Escolhido", secundário e desabilitado
        expect(contrast(p.accentText, p.accent), `primário, vida ${v}`).toBeGreaterThanOrEqual(AA_TEXT);
        expect(contrast(base.foreground, base.background), `secundário, vida ${v}`).toBeGreaterThanOrEqual(AA_TEXT);
        expect(contrast(base.muted, base.surface), `desabilitado, vida ${v}`).toBeGreaterThanOrEqual(AA_TEXT);
        // ícone da faixa (decorativo) sobre a cor viva
        expect(contrast(p.accentText, vivid(p.accent, v)), `faixa, vida ${v}`).toBeGreaterThanOrEqual(AA_UI);
      }
    });

    it.each([0, 0.5, 1])("moldura dourada aparece sobre o fundo (--vida %s)", (v) => {
      for (const bg of [base.background, base.surface]) expect(contrast(vivid(OURO, v), bg)).toBeGreaterThanOrEqual(AA_UI);
    });

    it("themeCss deriva --ouro-vivo de --vida", () => {
      expect(themeCss()).toContain("--ouro-vivo: color-mix(in oklch, var(--ouro) calc(var(--vida) * 100%), var(--ouro-gray));");
    });
  });
});
