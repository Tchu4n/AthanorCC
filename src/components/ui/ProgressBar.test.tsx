import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { STEP_LABELS, type StepId } from "@/lib/flow";
import { preenchimento, ProgressBar, vida } from "./ProgressBar";

const steps: StepId[] = ["origem", "especie", "oficio", "fe", "marcas", "aparencia", "identidade", "revisao"];
const nove: StepId[] = ["origem", "especie", "subespecie", ...steps.slice(2)];

const barra = (current: StepId, extra: { concluido?: boolean; reduzido?: boolean } = {}) =>
  renderToStaticMarkup(<ProgressBar steps={nove} current={current} titulo={STEP_LABELS[current]} {...extra} />);
// largura do preenchimento (primeiro estilo width do HTML)
const largura = (html: string) => html.match(/style="width:([\d.]+)%"/)?.[1];

describe("vida (progressão de cor)", () => {
  it("0 sem etapas concluídas", () => {
    expect(vida(steps, "origem")).toBe(0);
  });

  it("1 com todas concluídas", () => {
    expect(vida(steps, "revisao", true)).toBe(1);
  });

  it("valores intermediários: etapas antes da atual ÷ total, crescendo a cada etapa", () => {
    expect(vida(steps, "especie")).toBe(1 / 8);
    expect(vida(steps, "marcas")).toBe(4 / 8);
    expect(vida(steps, "revisao")).toBe(7 / 8);
    const valores = steps.map((s) => vida(steps, s));
    for (let i = 1; i < valores.length; i++) expect(valores[i]).toBeGreaterThan(valores[i - 1]);
    for (const v of valores) expect(v).toBeLessThan(1);
  });

  it("acompanha o total visível (com subespécie são 9 etapas)", () => {
    expect(vida(nove, "oficio")).toBe(3 / 9);
  });
});

describe("ProgressBar", () => {
  it("preenchimento: 0% na Origem, 100% na Revisão, crescendo entre elas", () => {
    expect(largura(barra("origem"))).toBe("0");
    expect(largura(barra("revisao"))).toBe("100");
    expect(largura(barra("marcas"))).toBe("62.5"); // 5ª de 9: 5 ÷ 8
    const valores = nove.map((s) => preenchimento(nove, s));
    for (let i = 1; i < valores.length; i++) expect(valores[i]).toBeGreaterThan(valores[i - 1]);
  });

  it("etapa atual é o h1; a anterior não está no DOM", () => {
    const html = barra("oficio");
    expect(html).toMatch(/<h1[^>]*>Ofício<\/h1>/);
    expect(html.match(/<h1/g)).toHaveLength(1); // a cópia no preenchimento não é heading
    expect(html).not.toContain("Subespécie");
  });

  it("próximas etapas apagadas à direita, escondidas do leitor; no celular, só a próxima", () => {
    const html = barra("marcas");
    const proximas = [...html.matchAll(/<li data-barra-proxima="(\w+)" class="([^"]*)"/g)].slice(0, 3); // camada de cima
    expect(proximas.map(([, s]) => s)).toEqual(["aparencia", "identidade", "revisao"]);
    expect(proximas[0][2]).not.toContain("max-sm:hidden");
    for (const [, , cls] of proximas.slice(1)) expect(cls).toContain("max-sm:hidden");
    expect(proximas[0][2]).toContain("text-muted");
    expect(html).toMatch(/<ul aria-hidden="true" data-barra-proximas/);
  });

  it("progressbar com valores e rótulo da etapa", () => {
    const html = barra("fe");
    expect(html).toContain('role="progressbar" aria-valuemin="1" aria-valuemax="9" aria-valuenow="5" aria-label="Etapa 5 de 9: Fé"');
    expect(html).not.toContain("</p>"); // sem o texto "Etapa X de Y" na tela
  });

  it("com prefers-reduced-motion, nenhuma classe de animação ou transição", () => {
    expect(barra("fe")).toContain("animate-[barra-entra");
    expect(barra("revisao", { concluido: true })).toContain("animate-[barra-pulso");
    for (const html of [barra("fe", { reduzido: true }), barra("revisao", { concluido: true, reduzido: true })]) {
      expect(html).not.toContain("animate-");
      expect(html).not.toContain("transition-");
    }
  });
});
