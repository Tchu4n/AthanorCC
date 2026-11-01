import { describe, expect, it } from "vitest";
import { apuracaoDe, flexiona } from "./ficha";
import { initialCharacter } from "./initialCharacter";
import { getFaiths, getImages, getMarks, getOccupations, getOriginOptions, getRegions, getRetratos, getSpeciesList, getSubregions, getSubspecies } from "./catalog";

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

describe("retratos da Aparência", () => {
  // up-tropa e deserto-andarilho repetem a imagem de outro retrato
  it("só imagens de um personagem: nenhuma cena, bandeira, grupo ou repetida", () => {
    const ids = getRetratos().map((i) => i.id);
    expect(ids.length).toBeGreaterThan(20);
    expect(getRetratos().every((i) => !("cena" in i))).toBe(true);
    for (const fora of ["factions/up-bandeira", "factions/up-exercito", "factions/mercenarios", "misc/batalha-warsaw", "regions/midland-centro", "factions/up-tropa", "regions/deserto-andarilho"])
      expect(ids).not.toContain(fora);
  });
});

describe("apuração da Agência", () => {
  const base = { ...initialCharacter, speciesId: "humano", subspeciesId: "mutante-sao-ferdinand", origin: { regionId: "reino-de-crick", subregionId: "andarilho" } };
  it("texto próprio para espécie, subespécie, origem, andarilho e ofício", () => {
    const { especie, origem, oficio } = apuracaoDe({ ...base, occupationId: "mercenario" });
    for (const trecho of ["Humano:", "Irmandade de São Ferdinand"]) expect(especie).toContain(trecho);
    for (const trecho of ["Horda de Southgarden", "andarilho"]) expect(origem).toContain(trecho);
    expect(oficio).toContain("Ofício declarado: mercenário.");
  });
  it("concorda com o sexo: feminino flexiona; masculino, incerto e sem sexo usam o masculino genérico", () => {
    expect(apuracaoDe({ ...base, sexo: "feminino" }).oficio).toContain("Vagabunda sem renda");
    expect(apuracaoDe({ ...base, sexo: "feminino" }).especie).toMatch(/^Humana:/);
    for (const sexo of ["masculino", "incerto", null] as const) expect(apuracaoDe({ ...base, sexo }).oficio).toContain("Vagabundo sem renda");
    expect(flexiona("{ele|ela} e {este|esta}", "feminino")).toBe("ela e esta");
  });

  it("sem ofício é vagabundo; o personalizado usa o nome dado", () => {
    expect(apuracaoDe(base).oficio).toContain("Vagabundo");
    const proprio = apuracaoDe({ ...base, occupationId: "personalizado", customOccupation: { name: "Ferreiro", description: "" } });
    expect(proprio.oficio).toMatch(/^Ofício declarado: ferreiro\./);
  });
});
