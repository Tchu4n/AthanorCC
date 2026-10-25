import { describe, expect, it } from "vitest";
import { getOriginOptions, getRegions } from "./catalog";
import { ANDARILHO } from "./character";
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

  it("Andarilho aparece sempre junto com as subregiões", () => {
    for (const region of getRegions()) {
      const ids = getOriginOptions(region.id).map((o) => o.id);
      expect(ids).toContain(ANDARILHO);
      expect(ids).toHaveLength(region.subregions.length + 1);
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
  it("nome é obrigatório", () => {
    expect(canAdvance("identidade", initialCharacter)).toBe(false);
    const c = r(initialCharacter, { type: "SET_IDENTITY", identity: { name: "  " } });
    expect(canAdvance("identidade", c)).toBe(false);
    expect(canAdvance("identidade", r(c, { type: "SET_IDENTITY", identity: { name: "Ana" } }))).toBe(true);
  });
});
