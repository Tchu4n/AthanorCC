import { describe, expect, it } from "vitest";
import { ANDARILHO, type Character } from "./character";
import { initialCharacter } from "./initialCharacter";
import type { CharacterAction } from "./reducer";
import { getOccupations, getRules } from "./catalog";
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

  it("R04 só avisa: Vampiro pode marcar a Gaiola como disfarce", () => {
    const r = evaluateRules(make({ species: "vampiros" }));
    expect(r.blocked[GAIOLA]).toBeUndefined();
    expect(r.warnings[GAIOLA]).toEqual([expect.stringContaining("disfarce")]);
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
});

describe("R08 e R09: Terceiro Olho e Mutação da Irmandade só para humanos", () => {
  const OLHO = "mark:terceiro-olho";
  const MUTACAO = "mark:mutacao-da-irmandade";
  const SO_HUMANOS = ["Disponível apenas para humanos e suas subdivisões."];

  it("Homens-Galho não pode Terceiro Olho", () => {
    expect(evaluateRules(make({ species: "homens-galho", subspecies: "principe" })).blocked[OLHO]).toEqual(SO_HUMANOS);
  });

  it("Centauro não pode Mutação da Irmandade", () => {
    expect(evaluateRules(make({ species: "centauros" })).blocked[MUTACAO]).toEqual(SO_HUMANOS);
  });

  it("Humano comum e elite de orelhas pontudas podem as duas", () => {
    for (const subspecies of ["humano-comum", "elite-orelhas-pontudas"]) {
      const { blocked } = evaluateRules(make({ species: "humano", subspecies }));
      expect(blocked[OLHO]).toBeUndefined();
      expect(blocked[MUTACAO]).toBeUndefined();
    }
  });

  it("sem espécie escolhida, nenhuma das duas fica bloqueada", () => {
    const { blocked } = evaluateRules(make({}));
    expect(blocked[OLHO]).toBeUndefined();
    expect(blocked[MUTACAO]).toBeUndefined();
  });

  it("trocar para não-humano remove as marcas com aviso", () => {
    let c = reducerWithRules(initialCharacter, { type: "SELECT_SPECIES", speciesId: "humano" });
    c = reducerWithRules(c, { type: "SET_MARK", mark: "terceiro-olho", on: true });
    c = reducerWithRules(c, { type: "SET_MARK", mark: "mutacao-da-irmandade", on: true });
    expect(c.marks).toEqual(["terceiro-olho", "mutacao-da-irmandade"]);
    const action: CharacterAction = { type: "SELECT_SPECIES", speciesId: "vampiros" };
    expect(noticesFor(c, action)).toEqual([
      "Terceiro Olho foi removida das marcas: Disponível apenas para humanos e suas subdivisões.",
      "Mutação da Irmandade foi removida das marcas: Disponível apenas para humanos e suas subdivisões.",
    ]);
    expect(reducerWithRules(c, action).marks).toEqual([]);
  });
});

describe("bateria flexível: R05 avisa, R10 bloqueia centauros", () => {
  const R05 = "Magos ortodoxos precisam de alguma forma de bateria. Se não usar a gaiola, descreva a sua forma de bateria na história curta ou na personalidade.";
  const comGaiola = (c: Character): Character => ({ ...c, marks: ["gaiola-de-bateria"] });

  it("mago ortodoxo sem gaiola recebe o WARN do R05, em qualquer origem; com gaiola, não", () => {
    for (const region of ["reino-de-laguardia", "uniao-das-provincias", "midland", undefined]) {
      const c = make({ region, species: "humano", occupation: "mago-ortodoxo" });
      expect(evaluateRules(c).warnings[GAIOLA]).toEqual([R05]);
      expect(evaluateRules(comGaiola(c)).warnings[GAIOLA]).toBeUndefined();
    }
  });

  it("o R05 cobre Nilos e não obriga a gaiola", () => {
    const r = evaluateRules(make({ species: "humano", occupation: "mago-ortodoxo", faiths: ["nilos"] }));
    expect(r.warnings[GAIOLA]).toEqual([R05]);
    expect(r.required).toEqual([]);
    expect(reducerWithRules(initialCharacter, { type: "SELECT_OCCUPATION", occupationId: "mago-ortodoxo" }).marks).toEqual([]);
  });

  it("vampiro mago ortodoxo sem gaiola não recebe o R05, mas recebe o R04 e o R06", () => {
    const r = evaluateRules(make({ species: "vampiros", occupation: "mago-ortodoxo" }));
    expect(r.warnings[GAIOLA]).toEqual([expect.stringContaining("disfarce")]); // só o R04
    expect(r.warnings[GAIOLA]).not.toContain(R05);
    expect(r.warnings[MAGO]).toEqual([expect.stringContaining("aterrar")]); // R06
  });

  it("humano mago ortodoxo sem gaiola continua recebendo o R05", () => {
    expect(evaluateRules(make({ species: "humano", occupation: "mago-ortodoxo" })).warnings[GAIOLA]).toEqual([R05]);
  });

  it("mago ortodoxo Homem do Deserto não recebe o WARN do R05", () => {
    const r = evaluateRules(make({ species: "homens-do-deserto", occupation: "mago-ortodoxo" }));
    expect(r.warnings[GAIOLA]).toBeUndefined();
  });

  it("centauro não pode a gaiola, em qualquer ofício", () => {
    for (const occupation of [...getOccupations().map((o) => o.id), undefined])
      expect(evaluateRules(make({ species: "centauros", occupation })).blocked[GAIOLA]).toEqual([
        "Centauros nunca usam a gaiola de bateria.",
      ]);
  });

  it("gaiola marcada à mão continua ao trocar a origem e sai com aviso ao virar Centauro", () => {
    let c = reducerWithRules(make({ region: "reino-de-laguardia", species: "humano" }), { type: "SET_MARK", mark: "gaiola-de-bateria", on: true });
    c = reducerWithRules(c, { type: "SELECT_REGION", regionId: "planicies-de-sunfield" });
    expect(c.marks).toEqual(["gaiola-de-bateria"]);
    const action: CharacterAction = { type: "SELECT_SPECIES", speciesId: "centauros" };
    expect(noticesFor(c, action)).toEqual(["Gaiola de bateria foi removida das marcas: Centauros nunca usam a gaiola de bateria."]);
    expect(reducerWithRules(c, action).marks).toEqual([]);
  });

  it("humanos de qualquer ofício podem marcar a gaiola", () => {
    for (const occupation of getOccupations().map((o) => o.id))
      expect(evaluateRules(make({ species: "humano", occupation })).blocked[GAIOLA]).toBeUndefined();
  });

  it("R05b não existe mais e a lista vai de R01 a R10", () => {
    const ids = getRules().map((r) => r.id);
    expect(ids).not.toContain("R05b");
    expect(ids).toEqual(["R01", "R02", "R03", "R03b", "R04", "R05", "R06", "R07", "R08", "R09", "R10"]);
    expect(getRules().some((r) => r.efeito === "REQUIRE")).toBe(false);
  });

  it("mago dissidente não recebe aviso nem bloqueio de bateria", () => {
    const r = evaluateRules(make({ species: "humano", occupation: "mago-dissidente" }));
    expect(r.warnings[GAIOLA]).toBeUndefined();
    expect(r.blocked[GAIOLA]).toBeUndefined();
    expect(r.required).toEqual([]);
  });
});
