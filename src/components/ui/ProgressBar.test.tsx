import { describe, expect, it } from "vitest";
import type { StepId } from "@/lib/flow";
import { vida } from "./ProgressBar";

const steps: StepId[] = ["origem", "especie", "oficio", "fe", "marcas", "aparencia", "identidade", "revisao"];

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
    const com: StepId[] = ["origem", "especie", "subespecie", ...steps.slice(2)];
    expect(vida(com, "oficio")).toBe(3 / 9);
  });
});
