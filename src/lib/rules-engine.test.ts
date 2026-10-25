import { describe, expect, it } from "vitest";
import { ANDARILHO, type Character } from "./character";
import { initialCharacter } from "./initialCharacter";
import type { CharacterAction } from "./reducer";
import { applyRules, evaluateRules, reducerWithRules } from "./rules-engine";

const MAGO = "occupation:mago-ortodoxo";
const GAIOLA = "mark:gaiola-de-bateria";

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
