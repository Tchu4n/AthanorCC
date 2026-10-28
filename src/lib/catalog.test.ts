import { describe, expect, it } from "vitest";
import { getFaiths, getImages, getMarks, getOccupations, getOriginOptions, getRegions, getSpeciesList, getSubregions, getSubspecies } from "./catalog";

const emOrdem = (nomes: string[]) => expect(nomes).toEqual([...nomes].sort((a, b) => a.localeCompare(b, "pt-BR")));

describe("catálogo em ordem alfabética (ordem dos cards)", () => {
  it("regiões, espécies, ofícios, fés, marcas e imagens", () => {
    for (const lista of [getRegions(), getSpeciesList(), getOccupations(), getFaiths(), getMarks()]) emOrdem(lista.map((x) => x.name));
    emOrdem(getImages().map((i) => i.displayName));
  });

  it("subregiões e subespécies; Andarilho/Aventureiro continua por último", () => {
    for (const r of getRegions()) {
      emOrdem(getSubregions(r.id).map((s) => s.name));
      expect(getOriginOptions(r.id).at(-1)?.andarilho).toBe(true);
    }
    for (const s of getSpeciesList()) emOrdem(getSubspecies(s.id).map((x) => x.name));
  });
});
