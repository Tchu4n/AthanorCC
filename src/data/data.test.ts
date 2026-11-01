import { describe, expect, it } from "vitest";
import { validateData } from "../../scripts/validate-data.ts";
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
