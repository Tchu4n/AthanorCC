import { describe, expect, it } from "vitest";
import { ANDARILHO, type Character } from "./character";
import { initialCharacter } from "./initialCharacter";
import type { CharacterAction } from "./reducer";
import { getOccupations } from "./catalog";
import { applyRules, evaluateRules, noticesFor, reducerWithRules } from "./rules-engine";

const MAGO = "occupation:mago-ortodoxo";
const GAIOLA = "mark:gaiola-de-bateria";
const NILOS = "faith:nilos";

// Monta o personagem direto, sem passar pelas regras, para testar evaluateRules isolado.
const make = (o: { region?: string; species?: string; subspecies?: string; occupation?: string; faiths?: string[] }): Character => ({
  ...initialCharacter,
  origin: o.region ? { regionId: o.region, subregionId: ANDARILHO } : null,
  speciesId: o.species ?? null,
  subspeciesId: o.subspecies ?? null,
  occupationId: o.occupation ?? null,
  faithIds: o.faiths ?? [],
});

describe("evaluateRules", () => {
  it("R01 bloqueia mago ortodoxo para Trabalhador e não para Príncipe", () => {
    expect(evaluateRules(make({ species: "homens-galho", subspecies: "trabalhador" })).blocked[MAGO]).toHaveLength(1);
    expect(evaluateRules(make({ species: "homens-galho", subspecies: "principe" })).blocked[MAGO]).toBeUndefined();
  });

  it("R02 bloqueia mago ortodoxo para Princesa", () => {
    expect(evaluateRules(make({ species: "homens-galho", subspecies: "princesa" })).blocked[MAGO]).toHaveLength(1);
  });

  it("R03 bloqueia mago ortodoxo para Centauro e permite bardo", () => {
    const { blocked } = evaluateRules(make({ species: "centauros" }));
    expect(blocked[MAGO]).toHaveLength(1);
    expect(blocked["occupation:bardo"]).toBeUndefined();
  });

  it("R04 bloqueia a Gaiola para Vampiro", () => {
    expect(evaluateRules(make({ species: "vampiros" })).blocked[GAIOLA]).toHaveLength(1);
  });

  it("R05 exige Gaiola para mago ortodoxo de Laguardia e da UP, e não para Homens do Deserto", () => {
    for (const region of ["reino-de-laguardia", "uniao-das-provincias"])
      expect(evaluateRules(make({ region, species: "humano", occupation: "mago-ortodoxo" })).required).toEqual(["gaiola-de-bateria"]);
    expect(evaluateRules(make({ region: "midland", species: "humano", occupation: "mago-ortodoxo" })).required).toEqual([]);
    expect(
      evaluateRules(make({ region: "reino-de-laguardia", species: "homens-do-deserto", occupation: "mago-ortodoxo" })).required,
    ).toEqual([]);
  });

  it("R05 com fé Nilos vira WARN, não REQUIRE", () => {
    const r = evaluateRules(make({ region: "uniao-das-provincias", species: "humano", occupation: "mago-ortodoxo", faiths: ["nilos"] }));
    expect(r.required).toEqual([]);
    expect(r.warnings[GAIOLA]).toHaveLength(1);
  });

  it("R06 emite WARN para Vampiro mago ortodoxo", () => {
    expect(evaluateRules(make({ species: "vampiros", occupation: "mago-ortodoxo" })).warnings[MAGO]).toHaveLength(1);
    expect(evaluateRules(make({ species: "vampiros" })).warnings[MAGO]).toBeUndefined();
  });
});

describe("ajustes confirmados da 1.3", () => {
  it("Gaiola só é exigida para mago ortodoxo de Laguardia ou UP", () => {
    for (const occupation of ["soldado", "bardo", "mercenario", undefined])
      for (const region of ["reino-de-laguardia", "uniao-das-provincias"])
        expect(evaluateRules(make({ region, species: "humano", occupation })).required).toEqual([]);
    expect(evaluateRules(make({ region: "reino-de-laguardia", species: "humano", occupation: "mago-ortodoxo" })).required).toEqual([
      "gaiola-de-bateria",
    ]);
  });

  it("Gaiola é removida sem aviso quando a origem muda para Sunfield", () => {
    let c = [
      { type: "SELECT_REGION", regionId: "reino-de-laguardia" },
      { type: "SELECT_SPECIES", speciesId: "humano" },
      { type: "SELECT_OCCUPATION", occupationId: "mago-ortodoxo" },
    ].reduce((s, a) => reducerWithRules(s, a as CharacterAction), initialCharacter);
    expect(c.marks).toEqual(["gaiola-de-bateria"]);
    const action: CharacterAction = { type: "SELECT_REGION", regionId: "planicies-de-sunfield" };
    expect(noticesFor(c, action)).toEqual([]);
    c = reducerWithRules(c, action);
    expect(c.marks).toEqual([]);
  });

  it("Gaiola escolhida à mão, sem obrigação, continua marcada", () => {
    let c = reducerWithRules(make({ region: "midland", species: "humano", occupation: "mago-ortodoxo" }), {
      type: "SET_MARK",
      mark: "gaiola-de-bateria",
      on: true,
    });
    c = reducerWithRules(c, { type: "SELECT_REGION", regionId: "planicies-de-sunfield" });
    expect(c.marks).toEqual(["gaiola-de-bateria"]);
  });

  it("Centauro com fé Nilos: BLOCK, e a fé é removida ao virar Centauro", () => {
    expect(evaluateRules(make({ species: "centauros" })).blocked[NILOS]).toHaveLength(1);
    expect(evaluateRules(make({ species: "humano" })).blocked[NILOS]).toBeUndefined();
    const c = reducerWithRules(make({ species: "humano", faiths: ["nilos", "umbra"] }), { type: "SELECT_SPECIES", speciesId: "centauros" });
    expect(c.faithIds).toEqual(["umbra"]);
  });

  it("Homem do Deserto: nenhum ofício bloqueado, em qualquer origem", () => {
    for (const region of ["reino-de-laguardia", "uniao-das-provincias", "reclusos-do-deserto", "midland"])
      for (const occupation of getOccupations().map((o) => o.id)) {
        const r = evaluateRules(make({ region, species: "homens-do-deserto", occupation }));
        expect(Object.keys(r.blocked).filter((k) => k.startsWith("occupation:"))).toEqual([]);
        expect(r.required).toEqual([]);
      }
  });
});

describe("R07: nações Homens-Galho", () => {
  const sp = (id: string) => `species:${id}`;

  it("origem Kruk bloqueia Humano, Crick bloqueia Centauros e Homens-Galho fica permitido", () => {
    const kruk = evaluateRules(make({ region: "reino-de-kruk" })).blocked;
    expect(kruk[sp("humano")]).toEqual(["Nas nações Homens-Galho, apenas Homens-Galho podem ser escolhidos."]);
    const crick = evaluateRules(make({ region: "reino-de-crick" })).blocked;
    expect(crick[sp("centauros")]).toHaveLength(1);
    for (const blocked of [kruk, crick]) expect(blocked[sp("homens-galho")]).toBeUndefined();
    expect(evaluateRules(make({ region: "planicies-de-sunfield" })).blocked[sp("humano")]).toBeUndefined();
  });

  it("trocar a origem de Sunfield para Kruk com Humano remove a espécie, com aviso", () => {
    const c = [
      { type: "SELECT_REGION", regionId: "planicies-de-sunfield" },
      { type: "SELECT_SPECIES", speciesId: "humano" },
      { type: "SELECT_SUBSPECIES", subspeciesId: "humano-comum" },
    ].reduce((s, a) => reducerWithRules(s, a as CharacterAction), initialCharacter);
    const action: CharacterAction = { type: "SELECT_REGION", regionId: "reino-de-kruk" };
    expect(noticesFor(c, action)).toEqual([
      "A espécie Humano foi removida: Nas nações Homens-Galho, apenas Homens-Galho podem ser escolhidos.",
    ]);
    const next = reducerWithRules(c, action);
    expect(next.speciesId).toBeNull();
    expect(next.subspeciesId).toBeNull();
  });
});

describe("correção automática", () => {
  const run = (actions: CharacterAction[]) => actions.reduce(reducerWithRules, initialCharacter);

  it("remove mago ortodoxo ao trocar a espécie para Centauros, com aviso", () => {
    let c = run([
      { type: "SELECT_SPECIES", speciesId: "humano" },
      { type: "SELECT_OCCUPATION", occupationId: "mago-ortodoxo" },
    ]);
    expect(c.occupationId).toBe("mago-ortodoxo");
    const { notices } = applyRules({ ...c, speciesId: "centauros", subspeciesId: null });
    expect(notices[0]).toMatch(/^Mago ortodoxo foi removido/);
    c = reducerWithRules(c, { type: "SELECT_SPECIES", speciesId: "centauros" });
    expect(c.occupationId).toBeNull();
  });

  it("remove mago ortodoxo ao trocar a subespécie para Trabalhador", () => {
    const c = run([
      { type: "SELECT_SPECIES", speciesId: "homens-galho" },
      { type: "SELECT_SUBSPECIES", subspeciesId: "principe" },
      { type: "SELECT_OCCUPATION", occupationId: "mago-ortodoxo" },
      { type: "SELECT_SUBSPECIES", subspeciesId: "trabalhador" },
    ]);
    expect(c.occupationId).toBeNull();
  });

  it("marca a Gaiola obrigatória e a remove ao virar Vampiro", () => {
    let c = run([
      { type: "SELECT_REGION", regionId: "reino-de-laguardia" },
      { type: "SELECT_SPECIES", speciesId: "humano" },
      { type: "SELECT_OCCUPATION", occupationId: "mago-ortodoxo" },
    ]);
    expect(c.marks).toEqual(["gaiola-de-bateria"]);
    c = reducerWithRules(c, { type: "SET_MARK", mark: "gaiola-de-bateria", on: false });
    expect(c.marks).toEqual(["gaiola-de-bateria"]); // obrigatória: não sai
    c = reducerWithRules(c, { type: "SELECT_SPECIES", speciesId: "vampiros" });
    expect(c.marks).toEqual([]);
  });
});
