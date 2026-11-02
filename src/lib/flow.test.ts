import { describe, expect, it } from "vitest";
import { getOriginOptions, getRegions } from "./catalog";
import { ANDARILHO, limpar, OFICIO_PROPRIO } from "./character";
import { canAdvance, getVisibleSteps, isFaithDisabled } from "./flow";
import { initialCharacter } from "./initialCharacter";
import { characterReducer as r } from "./reducer";

describe("getVisibleSteps", () => {
  it("pula subespécie quando a espécie não tem subespécies", () => {
    const c = r(initialCharacter, { type: "SELECT_SPECIES", speciesId: "centauros" });
    expect(getVisibleSteps(c)).not.toContain("subespecie");
  });

  it("inclui subespécie quando a espécie tem subespécies", () => {
    const c = r(initialCharacter, { type: "SELECT_SPECIES", speciesId: "humano" });
    expect(getVisibleSteps(c)).toContain("subespecie");
    expect(getVisibleSteps(c).indexOf("subespecie")).toBe(getVisibleSteps(c).indexOf("especie") + 1);
  });
});

describe("origem", () => {
  it("região sem subregiões mostra só Andarilho", () => {
    for (const id of ["reino-de-kruk", "reino-de-crick", "imperio-das-estepes", "mannaka-oko"])
      expect(getOriginOptions(id).map((o) => o.id)).toEqual([ANDARILHO]);
  });

  it("Andarilho aparece junto com as subregiões, menos nas regiões sem essa opção (Irmandade)", () => {
    for (const region of getRegions()) {
      const ids = getOriginOptions(region.id).map((o) => o.id);
      expect(ids.includes(ANDARILHO), region.id).toBe(!region.semAndarilho);
      expect(ids).toHaveLength(region.subregions.length + (region.semAndarilho ? 0 : 1));
    }
  });

  it("só avança com região e subregião ou Andarilho", () => {
    let c = r(initialCharacter, { type: "SELECT_REGION", regionId: "reino-de-kruk" });
    expect(canAdvance("origem", c)).toBe(false);
    c = r(c, { type: "SELECT_SUBREGION", subregionId: ANDARILHO });
    expect(canAdvance("origem", c)).toBe(true);
  });
});

describe("fé", () => {
  it("quarto clique é recusado e desmarcar libera", () => {
    let c = initialCharacter;
    for (const id of ["logan", "umbra", "activum"]) c = r(c, { type: "TOGGLE_FAITH", faithId: id });
    expect(isFaithDisabled(c, "mui")).toBe(true);
    expect(isFaithDisabled(c, "logan")).toBe(false);
    expect(r(c, { type: "TOGGLE_FAITH", faithId: "mui" }).faithIds).toEqual(["logan", "umbra", "activum"]);

    c = r(c, { type: "TOGGLE_FAITH", faithId: "umbra" });
    expect(isFaithDisabled(c, "mui")).toBe(false);
    expect(r(c, { type: "TOGGLE_FAITH", faithId: "mui" }).faithIds).toEqual(["logan", "activum", "mui"]);
  });
});

describe("identidade", () => {
  it("nome é obrigatório (com o sexo marcado)", () => {
    expect(canAdvance("identidade", initialCharacter)).toBe(false);
    const c = r(r(initialCharacter, { type: "SET_SEXO", sexo: "feminino" }), { type: "SET_IDENTITY", identity: { name: "  " } });
    expect(canAdvance("identidade", c)).toBe(false);
    expect(canAdvance("identidade", r(c, { type: "SET_IDENTITY", identity: { name: "Ana" } }))).toBe(true);
  });
});

describe("ofício personalizado", () => {
  it("só avança com nome; o texto fica guardado ao trocar de ofício", () => {
    let c = r(initialCharacter, { type: "SELECT_OCCUPATION", occupationId: OFICIO_PROPRIO });
    expect(canAdvance("oficio", c)).toBe(false);
    c = r(c, { type: "SET_CUSTOM_OCCUPATION", customOccupation: { name: "Ferreiro" } });
    expect(canAdvance("oficio", c)).toBe(true);
    c = r(c, { type: "SELECT_OCCUPATION", occupationId: "bardo" });
    expect(c.customOccupation).toEqual({ name: "Ferreiro", description: "" });
  });
});

describe("filtros de digitação", () => {
  it("idade só com dígitos; nomes só com letras, espaço, apóstrofo, hífen e ponto", () => {
    expect(limpar.idade("3a4 anos!")).toBe("34");
    expect(limpar.nome("Isabela de Souça-Ó'Neil Jr. 2º @#")).toBe("Isabela de Souça-Ó'Neil Jr.  ");
  });
});

describe("identidade", () => {
  it("só avança com nome e sexo", () => {
    const comNome = r(initialCharacter, { type: "SET_IDENTITY", identity: { name: "Corvo" } });
    expect(canAdvance("identidade", comNome)).toBe(false);
    expect(canAdvance("identidade", r(comNome, { type: "SET_SEXO", sexo: "incerto" }))).toBe(true);
  });
});
