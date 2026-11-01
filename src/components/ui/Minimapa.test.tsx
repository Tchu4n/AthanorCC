import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PINOS } from "@/data/mapa";
import { getRegions } from "@/lib/catalog";
import { ANDARILHO } from "@/lib/character";
import { ESCALA_CONTINENTE, Minimapa, naMoldura, pinosDasSubregioes, vistaPara } from "./Minimapa";

type P = Parameters<typeof Minimapa>[0];
const html = (p: Partial<P>) => renderToStaticMarkup(<Minimapa regionId={null} subregionId={null} {...p} />);
// posição do alfinete do lugar escolhido, como sai no style (left/top em %)
const marcador = (h: string) => h.match(/data-pino-atual="true"[^>]*style="left:([-\d.]+)%;top:([-\d.]+)%"/)?.slice(1).map(Number) ?? null;
const rotulo = (h: string) => h.match(/data-rotulo-pino="true"[^>]*>([^<]*)</)?.[1] ?? null;
const alt = (h: string) => h.match(/<img alt="([^"]*)"/)?.[1];
const botoes = (h: string) => [...h.matchAll(/<span class="sr-only">([^<]+)<\/span>/g)].map((m) => m[1].replace("&#x27;", "'"));
const regioes = getRegions();
const comPosicao = PINOS.filter((p) => p.x !== undefined && regioes.some((r) => r.id === p.id));
const continente = vistaPara([]);
const perto = (a: number, b: number) => Math.abs(a - b) < 1e-6;

describe("vista do minimapa", () => {
  it("sem foco, o continente inteiro cabe na moldura 16:9, centrado na horizontal e com folga em cima para o alfinete", () => {
    expect(continente.s).toBe(ESCALA_CONTINENTE);
    const [a, b] = [naMoldura(continente, 0, 0), naMoldura(continente, 1, 1)];
    expect(perto(a.left, 100 - b.left)).toBe(true); // mesma folga dos dois lados
    expect(a.top).toBeGreaterThan(8);
    expect(b.top).toBeLessThanOrEqual(100);
  });

  it("com foco, todos os pinos enquadrados ficam dentro da moldura", () => {
    for (const r of regioes) {
      const subs = pinosDasSubregioes(r.id);
      if (subs.length < 2) continue;
      const v = vistaPara(subs);
      expect(v.s, r.id).toBeGreaterThanOrEqual(ESCALA_CONTINENTE);
      for (const p of subs) {
        const m = naMoldura(v, p.x, p.y);
        expect(m.left >= 0 && m.left <= 100 && m.top >= 0 && m.top <= 100, `${r.id}/${p.id}`).toBe(true);
      }
    }
  });
});

describe("Minimapa", () => {
  it("sem escolha: continente sem alfinete, um botão por região com posição", () => {
    const h = html({});
    expect(marcador(h)).toBeNull();
    expect(alt(h)).toBe("Mapa do continente de Athanor");
    expect(botoes(h).sort()).toEqual(comPosicao.map((p) => regioes.find((r) => r.id === p.id)!.name).sort());
    expect(h).not.toContain("Lugares do mapa em texto");
  });

  it("cada região com posição põe o alfinete no lugar certo, com rótulo e alt", () => {
    for (const p of comPosicao) {
      const h = html({ regionId: p.id });
      const esperado = naMoldura(continente, p.x!, p.y!);
      const [x, y] = marcador(h)!;
      expect(perto(x, esperado.left) && perto(y, esperado.top), p.id).toBe(true);
      const nome = regioes.find((r) => r.id === p.id)!.name;
      expect(rotulo(h)).toBe(nome);
      expect(alt(h)).toBe(`Mapa do continente de Athanor. Pino na posição de ${nome}`);
    }
  });

  it("região sem posição: nenhum botão dela, nenhum alfinete e a nota", () => {
    const h = html({ regionId: "mannaka-oko" });
    expect(botoes(h)).not.toContain("Man'naka oko");
    expect(marcador(h)).toBeNull();
    expect(h).toContain("Localização no mapa ainda não definida.");
  });

  it("fase das subregiões: aproxima a região, mostra só as subregiões dela e o alfinete vai para a escolhida", () => {
    const h = html({ regionId: "midland", subregionId: "aurelia", focarRegiao: true, onSelectSubregiao: () => {} });
    const subs = pinosDasSubregioes("midland");
    expect(botoes(h).sort()).toEqual(subs.map((s) => s.nome).sort());
    expect(botoes(h)).not.toContain("Blackwater");
    const aurelia = subs.find((s) => s.id === "aurelia")!;
    const m = naMoldura(vistaPara([...subs, PINOS.find((p) => p.id === "midland") as { x: number; y: number }]), aurelia.x, aurelia.y);
    const [x, y] = marcador(h)!;
    expect(perto(x, m.left) && perto(y, m.top)).toBe(true);
    expect(rotulo(h)).toBe("Aurelia");
  });

  it("Andarilho fica com o nome e a posição da região", () => {
    expect(rotulo(html({ regionId: "midland", subregionId: ANDARILHO }))).toBe("Midland");
  });

  it("subregião marcada sem posição não herda o pino da região", () => {
    const h = html({ regionId: "protetorado-de-morrow", subregionId: "ironmud" });
    expect(marcador(h)).toBeNull();
    expect(h).toContain("Localização no mapa ainda não definida.");
  });

  it("pinos só selecionam quando a etapa permite", () => {
    const desligado = /aria-pressed="false" disabled=""[^>]*title="Midland"/;
    expect(html({})).toMatch(desligado);
    expect(html({ onSelectRegiao: () => {} })).not.toMatch(desligado);
  });
});
