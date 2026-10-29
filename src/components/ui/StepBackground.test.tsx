import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { backgrounds } from "@/styles/theme";
import { StepBackground } from "./StepBackground";

describe("StepBackground", () => {
  it("sem imagem renderiza só o gradiente sólido", () => {
    const html = renderToStaticMarkup(<StepBackground image={null} />);
    expect(html).not.toContain("<img");
    expect(html).toContain(`background-image:${backgrounds.solid}`);
  });

  it("com imagem, o véu escuro fica por cima dela", () => {
    const html = renderToStaticMarkup(<StepBackground image="/athanor/regions/laguardia-quartel.webp" />);
    const img = html.indexOf("<img");
    const veil = html.indexOf(`background-image:${backgrounds.veil}`);
    expect(img).toBeGreaterThan(-1);
    expect(veil).toBeGreaterThan(img); // depois no DOM = pintado por cima
    expect(html).toContain('aria-hidden="true"');
  });
});
