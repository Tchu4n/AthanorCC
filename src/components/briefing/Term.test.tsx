import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BriefingPanel } from "./BriefingPanel";
import { Term } from "./Term";

afterEach(() => vi.unstubAllEnvs());

describe("Term", () => {
  it("id válido vira botão sublinhado ligado ao briefing por aria-describedby", () => {
    const html = renderToStaticMarkup(<Term id="up" />);
    const describedBy = html.match(/aria-describedby="([^"]+)"/)?.[1];
    expect(describedBy).toBeTruthy();
    expect(html).toContain(`id="${describedBy}" role="tooltip" hidden=""`);
    expect(html).toMatch(/<button[^>]*decoration-dotted[^>]*>UP<\/button>/);
    expect(html).toContain("lugar");
    // o texto do briefing sai sem os [[ ]] do glossário
    expect(html).toContain("o Antigo Império");
    expect(html).not.toContain("[[");
  });

  it("id inválido lança erro fora de produção", () => {
    expect(() => renderToStaticMarkup(<Term id="nao-existe" />)).toThrow('Termo "nao-existe" não existe em glossary.ts');
  });

  it("id inválido em produção mostra só o texto", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(renderToStaticMarkup(<Term id="nao-existe">Coisa</Term>)).toBe("Coisa");
  });
});

describe("BriefingPanel", () => {
  it("converte [[Termo]] em <Term>, inclusive por alias, e mantém o texto ao redor", () => {
    const html = renderToStaticMarkup(
      <BriefingPanel title="T" sections={[{ text: "Vem da [[UP]] e cavalga com um [[Centauro]]." }]} />,
    );
    expect(html).not.toContain("data-term");
    expect(html).not.toContain("[[");
    expect(html.match(/role="tooltip"/g)).toHaveLength(2);
    expect(html).toMatch(/Vem da <span[^>]*><button[^>]*>UP<\/button>/);
    expect(html).toMatch(/<button[^>]*>Centauro<\/button>/);
    expect(html).toContain("Homens-cavalo das estepes");
  });
});
