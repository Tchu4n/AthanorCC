import { describe, expect, it } from "vitest";
import { ANDARILHO, type Character } from "./character";
import { initialCharacter } from "./initialCharacter";
import type { CharacterAction } from "./reducer";
import { getOccupations, getRules } from "./catalog";
import { applyRules, evaluateRules, noticesFor, reducerWithRules } from "./rules-engine";

const MAGO = "occupation:mago-ortodoxo";
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
    expect(blocked["occupation:mago-dissidente"]).toHaveLength(1); // R03c
    expect(blocked["occupation:bardo"]).toBeUndefined();
  });

  it("R06 emite WARN para Vampiro mago ortodoxo", () => {
    expect(evaluateRules(make({ species: "vampiros", occupation: "mago-ortodoxo" })).warnings[MAGO]).toHaveLength(1);
    expect(evaluateRules(make({ species: "vampiros" })).warnings[MAGO]).toBeUndefined();
  });
});

describe("ajustes confirmados da 1.3", () => {
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
      }
  });
});

describe("R07: nações Homens-Galho", () => {
  const reg = (id: string) => `region:${id}`;
  const MSG = "Nas nações Homens-Galho, apenas Homens-Galho podem ser escolhidos.";

  it("espécie que não é Homem-Galho bloqueia Kruk e Crick; Homens-Galho e sem espécie deixam tudo livre", () => {
    const humano = evaluateRules(make({ species: "humano" })).blocked;
    expect(humano[reg("reino-de-kruk")]).toEqual([MSG]);
    expect(humano[reg("reino-de-crick")]).toEqual([MSG]);
    expect(humano[reg("planicies-de-sunfield")]).toBeUndefined();
    for (const c of [make({ species: "homens-galho" }), make({})])
      expect(Object.keys(evaluateRules(c).blocked).filter((k) => k.startsWith("region:"))).toEqual([]);
  });

  it("voltar e trocar a espécie para uma que Kruk não aceita remove a região, com aviso", () => {
    const c = [
      { type: "SELECT_SPECIES", speciesId: "homens-galho" },
      { type: "SELECT_REGION", regionId: "reino-de-kruk" },
      { type: "SELECT_SUBREGION", subregionId: ANDARILHO },
    ].reduce((s, a) => reducerWithRules(s, a as CharacterAction), initialCharacter);
    expect(c.origin).toEqual({ regionId: "reino-de-kruk", subregionId: ANDARILHO });
    const action: CharacterAction = { type: "SELECT_SPECIES", speciesId: "humano" };
    expect(noticesFor(c, action)).toEqual([`A região Kruk (Reino Fronteiriço) foi removida da origem: ${MSG}`]);
    const next = reducerWithRules(c, action);
    expect(next.origin).toBeNull();
    expect(next.speciesId).toBe("humano");
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
});

describe("R08 e R09: Terceiro Olho de Man'naka oko e Mutação da Irmandade", () => {
  const OLHO = "mark:terceiro-olho";
  const MUTACAO = "mark:mutacao-da-irmandade";
  const SO_MUTANTES = ["Exclusiva dos Humanos da Irmandade de São Ferdinand."];

  it("Terceiro Olho: livre para qualquer espécie de Man'naka oko, bloqueado nas outras regiões", () => {
    for (const species of ["humano", "vampiros", "centauros"]) {
      expect(evaluateRules(make({ region: "mannaka-oko", species })).blocked[OLHO]).toBeUndefined();
      expect(evaluateRules(make({ region: "midland", species })).blocked[OLHO]).toEqual(["Exclusivo de personagens com origem em Man'naka oko."]);
    }
  });

  it("Terceiro Olho é opcional: nunca entra sozinho", () => {
    expect(evaluateRules(make({ region: "mannaka-oko", species: "humano" })).required).toEqual([]);
  });

  it("trocar a região para fora de Man'naka oko remove o Terceiro Olho com aviso", () => {
    const c = reducerWithRules(make({ region: "mannaka-oko", species: "humano" }), { type: "SET_MARK", mark: "terceiro-olho", on: true });
    expect(c.marks).toEqual(["terceiro-olho"]);
    const action: CharacterAction = { type: "SELECT_REGION", regionId: "midland" };
    expect(noticesFor(c, action)).toEqual(["Terceiro Olho foi removida das marcas: Exclusivo de personagens com origem em Man'naka oko."]);
    expect(reducerWithRules(c, action).marks).toEqual([]);
  });

  it("Mutação: obrigatória para o Mutante da Irmandade e bloqueada para os demais", () => {
    expect(evaluateRules(make({ species: "humano", subspecies: "mutante-sao-ferdinand" })).required).toEqual(["mutacao-da-irmandade"]);
    for (const subspecies of ["humano-comum", "elite-orelhas-pontudas"])
      expect(evaluateRules(make({ species: "humano", subspecies })).blocked[MUTACAO]).toEqual(SO_MUTANTES);
    expect(evaluateRules(make({ species: "centauros" })).blocked[MUTACAO]).toEqual(SO_MUTANTES);
  });

  it("escolher o Mutante adiciona a Mutação; trocar de subespécie a remove sem aviso", () => {
    let c = reducerWithRules(initialCharacter, { type: "SELECT_SPECIES", speciesId: "humano" });
    c = reducerWithRules(c, { type: "SELECT_SUBSPECIES", subspeciesId: "mutante-sao-ferdinand" });
    expect(c.marks).toEqual(["mutacao-da-irmandade"]);
    const action: CharacterAction = { type: "SELECT_SUBSPECIES", subspeciesId: "humano-comum" };
    expect(noticesFor(c, action)).toEqual([]);
    expect(reducerWithRules(c, action).marks).toEqual([]);
  });

  it("save antigo com a Mutação num humano comum perde a marca ao carregar", () => {
    const { character } = applyRules({ ...make({ species: "humano", subspecies: "humano-comum" }), marks: ["mutacao-da-irmandade"] });
    expect(character.marks).toEqual([]);
  });
});

describe("lista de regras", () => {
  it("a gaiola de bateria saiu (R04, R05 e R10) e a Mutação é a única marca obrigatória", () => {
    const ids = getRules().map((r) => r.id);
    expect(ids).toEqual(["R01", "R02", "R03", "R03c", "R03b", "R06", "R07", "R07b", "R08", "R09", "R09b", "R09c"]);
    expect(getRules().filter((r) => r.efeito === "REQUIRE").map((r) => r.id)).toEqual(["R09c"]);
  });

  it("vampiro mago ortodoxo continua recebendo o aviso de aterramento (R06)", () => {
    expect(evaluateRules(make({ species: "vampiros", occupation: "mago-ortodoxo" })).warnings[MAGO]).toEqual([expect.stringContaining("aterrar")]);
  });
});
