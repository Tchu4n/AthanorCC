import { readFileSync } from "node:fs";
import type { ComponentProps } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { getFaiths, getMarks, getOccupations, getRegions, getSpeciesList } from "@/lib/catalog";
import { SOURCES } from "@/data/types";
import { ChoiceCard, OptionGroup } from "./ChoiceCard";
import { combina, FiltroContext, SEM_FILTRO, type Filtro } from "./FilterBar";
import { PortraitFrame } from "./PortraitFrame";

type Props = ComponentProps<typeof ChoiceCard>;
const base: Props = { type: "radio", name: "t", label: "Midland", categoria: "Região", icone: "origem", checked: false, onChange: () => {} };
const html = (p: Partial<Props> = {}, filtro: Filtro = SEM_FILTRO) =>
  renderToStaticMarkup(
    <FiltroContext value={filtro}>
      <ChoiceCard {...base} {...p} />
    </FiltroContext>,
  );

describe("ChoiceCard", () => {
  it("nunca mostra a fonte interna do dado, em nenhum card do catálogo", () => {
    const itens = [...getRegions(), ...getSpeciesList(), ...getOccupations(), ...getFaiths(), ...getMarks()];
    for (const item of itens) {
      const out = html({ label: item.name, descricao: item.briefing, saibaMais: { sections: [{ text: item.briefing }] } });
      for (const fonte of SOURCES) expect(out, `${item.name}: ${fonte}`).not.toContain(fonte);
    }
  });

  it('"Saiba mais" abre o briefing da escolha (popover com o texto do briefing)', () => {
    const out = html({ saibaMais: { sections: [{ text: "Terra de [[Vampiro]]s." }] } });
    const alvo = out.match(/popovertarget="([^"]+)"/i)?.[1];
    expect(alvo).toBeTruthy();
    expect(out).toContain(`id="${alvo}" popover="auto"`);
    expect(out).toMatch(/Saiba mais<span class="sr-only"> sobre Midland<\/span>/);
    // o briefing completo, com o termo do glossário como botão do Term
    expect(out).toMatch(/Terra de <span class="relative"><button[^>]*>Vampiro<\/button>/);
    expect(html()).not.toContain("Saiba mais");
  });

  it("chips só aparecem quando há tags", () => {
    expect(html({ tags: ["Costeira", "Fria"] })).toContain('aria-label="Características"');
    expect(html({ tags: ["Costeira"] })).toContain(">Costeira</li>");
    expect(html({ tags: [] })).not.toContain("Características");
    expect(html()).not.toContain("<li");
  });

  it("indisponível mostra o motivo em texto, véu e Escolher desabilitado", () => {
    const out = html({ blockedReasons: ["Centauros nunca usam a gaiola de bateria."] });
    expect(out).toContain("Indisponível para esta escolha");
    expect(out).toContain("Centauros nunca usam a gaiola de bateria.");
    expect(out).toMatch(/<input[^>]*disabled=""/);
    expect(out).toContain('data-indisponivel="true"');
  });

  it("escolhido mostra ✓ e o texto Escolhido", () => {
    expect(html({ checked: true })).toMatch(/✓<\/span> Escolhido/);
    expect(html()).toContain("Escolher");
  });

  it("descrição sem marcação do glossário e sem A_DEFINIR; destaque só com valor", () => {
    expect(html({ descricao: "Povo de [[Vampiro]]s." })).toContain("Povo de Vampiros.");
    expect(html({ descricao: "A_DEFINIR" })).not.toContain("A_DEFINIR");
    expect(html({ destaque: "Área principal: Aurelia" })).toContain("Área principal: Aurelia");
    expect(html({ destaque: undefined })).not.toContain("font-semibold\"></p>");
  });

  it("título é h2 e nomeia o input", () => {
    const out = html();
    const id = out.match(/<h2 id="([^"]+)"/)?.[1];
    expect(out).toContain(`aria-labelledby="${id}"`);
  });

  it("filtro: busca sem acento e estado de disponibilidade", () => {
    expect(combina({ estado: "todas", busca: "especie" }, "Espécie Alta", false)).toBe(true);
    expect(combina({ estado: "todas", busca: "xyz" }, "Midland", false)).toBe(false);
    expect(combina({ estado: "disponiveis", busca: "" }, "Midland", true)).toBe(false);
    expect(combina({ estado: "indisponiveis", busca: "" }, "Midland", true)).toBe(true);
    expect(combina({ estado: "indisponiveis", busca: "" }, "Midland", false)).toBe(false);
    expect(html({}, { estado: "todas", busca: "aurelia" })).toBe("");
  });

  it("grade filtrada sem nenhum card fica vazia e mostra o aviso", () => {
    const out = renderToStaticMarkup(
      <FiltroContext value={{ estado: "todas", busca: "nada" }}>
        <OptionGroup legend="Região">
          <ChoiceCard {...base} />
        </OptionGroup>
      </FiltroContext>,
    );
    expect(out).toMatch(/<div data-cards="true"[^>]*><\/div>/);
    expect(out).toContain("Nenhuma opção corresponde ao filtro.");
  });

  it("nenhuma animação sem motion-safe: com prefers-reduced-motion tudo fica parado", () => {
    const out = html({ image: "/athanor/regions/laguardia-quartel.jpg", saibaMais: { sections: [{ text: "x" }] } });
    const classes = [...out.matchAll(/class="([^"]*)"/g)].flatMap((m) => m[1].split(/\s+/));
    const movimento = classes.filter((c) => /transition|animate|translate|scale/.test(c) && !c.includes("[clip-path"));
    expect(movimento.length).toBeGreaterThan(0);
    for (const c of movimento) expect(c, c).toMatch(/^motion-safe:/);
    // a entrada escalonada dos cards só existe dentro do bloco no-preference
    const css = readFileSync(new URL("../../app/globals.css", import.meta.url), "utf8");
    expect(css).toMatch(/@media \(prefers-reduced-motion: no-preference\) \{\s*\[data-cards\] > \* \{\s*animation: card-in/);
    expect(css.match(/card-in \d/g)).toHaveLength(1);
  });
});

describe("PortraitFrame", () => {
  it("com retrato: imagem com alt descritivo", () => {
    const out = renderToStaticMarkup(<PortraitFrame retrato={{ src: "/athanor/misc/x.jpg", alt: "Retrato do personagem: Cavaleiro" }} />);
    expect(out).toContain('alt="Retrato do personagem: Cavaleiro"');
  });

  it("sem retrato: silhueta decorativa, sem imagem e sem botão", () => {
    const out = renderToStaticMarkup(<PortraitFrame retrato={null} />);
    expect(out).toContain('<svg aria-hidden="true"');
    expect(out).not.toContain("<img");
    expect(out).not.toContain("<button");
  });
});
