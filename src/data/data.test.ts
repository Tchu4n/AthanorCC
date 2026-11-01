import { describe, expect, it } from "vitest";
import { validarMapa, validateData } from "../../scripts/validate-data.ts";
import { faiths } from "./faiths.ts";
import { regions } from "./regions.ts";
import { species } from "./species.ts";

describe("dados de Athanor", () => {
  it("validate-data passa com os dados atuais", () => {
    expect(validateData()).toEqual([]);
  });

  it("cada região tem id único", () => {
    const ids = regions.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("subespécies de humano: as três esperadas (o Terceiro Olho virou marca de Man'naka oko)", () => {
    const humano = species.find((s) => s.id === "humano");
    expect(humano?.subspecies?.map((s) => s.id).sort()).toEqual(["elite-orelhas-pontudas", "humano-comum", "mutante-sao-ferdinand"]);
  });

  it("fés têm exatamente 8 entradas", () => {
    expect(faiths).toHaveLength(8);
  });

  it("Midland tem Aurelia como domínio do rei", () => {
    const midland = regions.find((r) => r.id === "midland");
    expect(midland?.mainArea).toBe("Aurelia");
    expect(midland?.subregions.map((s) => s.id)).toContain("aurelia");
  });
});

describe("validarMapa", () => {
  const regioes = [{ id: "midland", subregions: [{ id: "aurelia" }] }];
  it("aceita pinos válidos", () => {
    expect(validarMapa([{ id: "midland", status: "estimado", pista: "a oeste do lago", x: 0.5, y: 0.3 }, { id: "aurelia", status: "sem posição", pista: "a definir" }], regioes)).toEqual([]);
  });
  it("acusa id de mapa inexistente", () => {
    const erros = validarMapa([{ id: "midland", status: "estimado", pista: "p", x: 0.5, y: 0.5 }, { id: "atlantida", status: "estimado", pista: "p", x: 0.1, y: 0.1 }], regioes);
    expect(erros).toContain('mapa.ts/atlantida: id não existe em regions.ts');
  });
  it("acusa pino sem status, região sem pino e coordenada fora do mapa", () => {
    const semStatus = { id: "midland", pista: "p", x: 0.5, y: 0.5 } as unknown as Parameters<typeof validarMapa>[0][number];
    expect(validarMapa([semStatus], regioes).some((e) => e.startsWith("mapa.ts/midland: sem status"))).toBe(true);
    expect(validarMapa([], regioes)).toContain('mapa.ts: região "midland" sem registro de pino');
    expect(validarMapa([{ id: "midland", status: "calibrado", pista: "p", x: 1.4, y: 0.5 }], regioes)).toContain("mapa.ts/midland: x e y precisam estar entre 0 e 1");
  });
});
