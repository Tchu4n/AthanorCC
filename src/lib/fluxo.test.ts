import { describe, expect, it } from "vitest";
import { getOriginOptions, getRegions } from "./catalogo";
import { ANDARILHO, limpar, OFICIO_PROPRIO } from "./character";
import { canAdvance, getVisibleSteps, isFaithDisabled } from "./fluxo";
import { personagemInicial } from "./personagemInicial";
import { characterReducer as r } from "./reducer";

describe("getVisibleSteps", () => {
  it("pula subespécie quando a espécie não tem subespécies", () => {
    const c = r(personagemInicial, { type: "ESCOLHER_ESPECIE", speciesId: "centauros" });
    expect(getVisibleSteps(c)).not.toContain("subespecie");
  });

  it("inclui subespécie quando a espécie tem subespécies", () => {
    const c = r(personagemInicial, { type: "ESCOLHER_ESPECIE", speciesId: "humano" });
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
    let c = r(personagemInicial, { type: "ESCOLHER_REGIAO", regionId: "reino-de-kruk" });
    expect(canAdvance("origem", c)).toBe(false);
    c = r(c, { type: "ESCOLHER_SUBREGIAO", subregionId: ANDARILHO });
    expect(canAdvance("origem", c)).toBe(true);
  });
});

describe("fé", () => {
  it("quarto clique é recusado e desmarcar libera", () => {
    let c = personagemInicial;
    for (const id of ["logan", "umbra", "activum"]) c = r(c, { type: "ALTERNAR_FE", faithId: id });
    expect(isFaithDisabled(c, "mui")).toBe(true);
    expect(isFaithDisabled(c, "logan")).toBe(false);
    expect(r(c, { type: "ALTERNAR_FE", faithId: "mui" }).faithIds).toEqual(["logan", "umbra", "activum"]);

    c = r(c, { type: "ALTERNAR_FE", faithId: "umbra" });
    expect(isFaithDisabled(c, "mui")).toBe(false);
    expect(r(c, { type: "ALTERNAR_FE", faithId: "mui" }).faithIds).toEqual(["logan", "activum", "mui"]);
  });
});

describe("identidade", () => {
  it("nome é obrigatório (com o sexo marcado)", () => {
    expect(canAdvance("identidade", personagemInicial)).toBe(false);
    const c = r(r(personagemInicial, { type: "DEFINIR_SEXO", sexo: "feminino" }), { type: "DEFINIR_IDENTIDADE", identity: { name: "  " } });
    expect(canAdvance("identidade", c)).toBe(false);
    expect(canAdvance("identidade", r(c, { type: "DEFINIR_IDENTIDADE", identity: { name: "Ana" } }))).toBe(true);
  });
});

describe("ofício personalizado", () => {
  it("só avança com nome; o texto fica guardado ao trocar de ofício", () => {
    let c = r(personagemInicial, { type: "ESCOLHER_OFICIO", occupationId: OFICIO_PROPRIO });
    expect(canAdvance("oficio", c)).toBe(false);
    c = r(c, { type: "DEFINIR_OFICIO_PROPRIO", customOccupation: { name: "Ferreiro" } });
    expect(canAdvance("oficio", c)).toBe(true);
    c = r(c, { type: "ESCOLHER_OFICIO", occupationId: "bardo" });
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
    const comNome = r(personagemInicial, { type: "DEFINIR_IDENTIDADE", identity: { name: "Corvo" } });
    expect(canAdvance("identidade", comNome)).toBe(false);
    expect(canAdvance("identidade", r(comNome, { type: "DEFINIR_SEXO", sexo: "incerto" }))).toBe(true);
  });
});
