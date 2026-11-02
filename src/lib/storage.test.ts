import { describe, expect, it } from "vitest";
import { ANDARILHO, LIMITES_TEXTO, type Character } from "./character";
import { initialCharacter } from "./initialCharacter";
import { clear, load, save, STORAGE_KEY } from "./storage";
import { initialPersistentState, persistentReducer } from "./usePersistentCharacter";

function memoryStorage() {
  const map = new Map<string, string>();
  const storage = {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
    removeItem: (k: string) => void map.delete(k),
  };
  return { map, get: () => storage };
}

const throwing = () => {
  throw new DOMException("bloqueado", "SecurityError");
};

const sample: Character = {
  ...initialCharacter,
  origin: { regionId: "midland", subregionId: "aurelia" },
  speciesId: "humano",
  subspeciesId: "elite-orelhas-pontudas",
  occupationId: "bardo",
  faithIds: ["umbra", "activum"],
  marks: [],
  appearance: { image: { kind: "catalog", imageId: "factions/up-mago-alto" }, notes: "gola franzida" },
  identity: { name: "Isabela", age: "34", shortStory: "", personality: "" },
  createdAt: "2026-10-25T12:00:00.000Z",
};

describe("storage", () => {
  it("save e load fazem round-trip", () => {
    const s = memoryStorage();
    expect(save({ character: sample, step: "fe" }, s.get)).toBe(true);
    expect(load(s.get)).toEqual({ status: "ok", data: { character: sample, step: "fe" } });
  });

  it("texto salvo acima do limite do campo é cortado, não descartado", () => {
    const s = memoryStorage();
    const longo = { ...sample, identity: { ...sample.identity, name: "A".repeat(500) }, appearance: { ...sample.appearance, notes: "n".repeat(5000) } };
    save({ character: longo, step: "fe" }, s.get);
    const r = load(s.get);
    expect(r.status).toBe("ok");
    if (r.status !== "ok") return;
    expect(r.data.character.identity.name).toHaveLength(LIMITES_TEXTO.name);
    expect(r.data.character.appearance.notes).toHaveLength(LIMITES_TEXTO.notes);
  });

  it("chave vazia retorna empty", () => {
    expect(load(memoryStorage().get)).toEqual({ status: "empty" });
  });

  it("JSON corrompido é descartado e a chave é limpa", () => {
    const s = memoryStorage();
    s.map.set(STORAGE_KEY, "{isso não é json");
    expect(load(s.get)).toEqual({ status: "invalid" });
    expect(s.map.has(STORAGE_KEY)).toBe(false);
  });

  it("formato inválido ou id inexistente é descartado", () => {
    const cases = [
      { version: 1, step: "fe", character: { ...sample, speciesId: 42 } },
      { version: 1, step: "etapa-que-nao-existe", character: sample },
      { version: 1, step: "fe", character: { ...sample, speciesId: "elfo" } },
      { version: 1, step: "fe", character: { ...sample, origin: { regionId: "midland", subregionId: "ironmud" } } },
      { version: 2, step: "fe", character: sample },
    ];
    for (const data of cases) {
      const s = memoryStorage();
      s.map.set(STORAGE_KEY, JSON.stringify(data));
      expect(load(s.get)).toEqual({ status: "invalid" });
    }
  });

  it("faithIds com 4 itens é descartado", () => {
    const s = memoryStorage();
    const data = { version: 1, step: "fe", character: { ...sample, faithIds: ["umbra", "activum", "logan", "mui"] } };
    s.map.set(STORAGE_KEY, JSON.stringify(data));
    expect(load(s.get)).toEqual({ status: "invalid" });
  });

  it("localStorage lançando exceção não quebra nada", () => {
    expect(() => load(throwing)).not.toThrow();
    expect(load(throwing)).toEqual({ status: "unavailable" });
    expect(save({ character: sample, step: "fe" }, throwing)).toBe(false);
    expect(clear(throwing)).toBe(false);

    const setItemFails = () => ({ getItem: () => null, setItem: throwing, removeItem: () => {} });
    expect(save({ character: sample, step: "fe" }, setItemFails)).toBe(false);
  });

  it("clear limpa a chave", () => {
    const s = memoryStorage();
    save({ character: sample, step: "fe" }, s.get);
    expect(clear(s.get)).toBe(true);
    expect(s.map.has(STORAGE_KEY)).toBe(false);
  });
});

describe("imagem enviada (upload)", () => {
  const upload = (dataUrl: string) => ({
    ...sample,
    appearance: { image: { kind: "upload" as const, dataUrl, name: "minha-foto.png" }, notes: "cicatriz no queixo" },
  });
  const stored = (character: unknown) => {
    const s = memoryStorage();
    s.map.set(STORAGE_KEY, JSON.stringify({ version: 1, step: "aparencia", character }));
    return load(s.get);
  };

  it("personagem com upload é restaurado do localStorage", () => {
    const c = upload("data:image/jpeg;base64,/9j/4AAQSkZJRg==");
    const s = memoryStorage();
    save({ character: c, step: "aparencia" }, s.get);
    expect(load(s.get)).toEqual({ status: "ok", data: { character: c, step: "aparencia" } });
  });

  it("dataUrl com mais de 400 KB é recusado pelo schema", () => {
    const prefix = "data:image/jpeg;base64,";
    expect(stored(upload(prefix + "A".repeat(400 * 1024 - prefix.length))).status).toBe("ok");
    expect(stored(upload(prefix + "A".repeat(400 * 1024)))).toEqual({ status: "invalid" });
  });

  it("dataUrl que não é PNG, JPEG ou WebP em base64 é recusado", () => {
    for (const d of ["data:image/gif;base64,R0lG", "data:text/html;base64,PGI+", "https://exemplo.com/a.png", "data:image/png,naobase64"])
      expect(stored(upload(d))).toEqual({ status: "invalid" });
    for (const d of ["data:image/png;base64,iVBO", "data:image/webp;base64,UklG"]) expect(stored(upload(d)).status).toBe("ok");
  });

  it("salvamento antigo { imageId, notes } é convertido, não descartado", () => {
    const old = { ...sample, appearance: { imageId: "factions/up-mago-alto", notes: "antigo" } };
    expect(stored(old)).toMatchObject({
      status: "ok",
      data: { character: { appearance: { image: { kind: "catalog", imageId: "factions/up-mago-alto" }, notes: "antigo" } } },
    });
    expect(stored({ ...sample, appearance: { imageId: null, notes: "" } })).toMatchObject({
      data: { character: { appearance: { image: null } } },
    });
  });
});

describe("migração de salvamentos antigos", () => {
  const stored = (character: unknown) => {
    const s = memoryStorage();
    s.map.set(STORAGE_KEY, JSON.stringify({ version: 1, step: "aparencia", character }));
    return load(s.get);
  };

  it("formato antigo { imageId, notes } vira { image: { kind: 'catalog', imageId }, notes }", () => {
    const antigo = { ...sample, appearance: { imageId: "regions/oakhaven-habitante", notes: "barba gelada" } };
    const result = stored(antigo);
    expect(result.status).toBe("ok");
    if (result.status !== "ok") return;
    expect(result.data.character.appearance).toEqual({
      image: { kind: "catalog", imageId: "regions/oakhaven-habitante" },
      notes: "barba gelada",
    });
    // o resto do personagem passa intacto
    expect({ ...result.data.character, appearance: sample.appearance }).toEqual(sample);
  });

  it("personagem salvo sem appearance ganha aparência vazia e mantém o resto", () => {
    const semAppearance: Record<string, unknown> = { ...sample };
    delete semAppearance.appearance;
    const result = stored(semAppearance);
    expect(result).toEqual({
      status: "ok",
      data: { step: "aparencia", character: { ...sample, appearance: { image: null, notes: "" } } },
    });
    const state = persistentReducer(initialPersistentState, { type: "HYDRATE", result });
    expect(state).toMatchObject({ ready: true, step: "aparencia", storageNotice: null });
    expect(state.character.identity.name).toBe("Isabela");
  });
});

describe("persistentReducer (estado do hook)", () => {
  const now = () => "2026-10-25T13:00:00.000Z";
  const ready = persistentReducer(initialPersistentState, { type: "HYDRATE", result: { status: "empty" } });

  it("createdAt é preenchido na primeira ação, não antes", () => {
    expect(ready.character.createdAt).toBe("");
    const s = persistentReducer(ready, { type: "SELECT_REGION", regionId: "midland" }, now);
    expect(s.character.createdAt).toBe(now());
    const later = persistentReducer(s, { type: "SELECT_SUBREGION", subregionId: ANDARILHO }, () => "depois");
    expect(later.character.createdAt).toBe(now());
    expect(persistentReducer(later, { type: "RESET" }).character).toBe(initialCharacter);
  });

  it("carga inválida ou armazenamento indisponível viram aviso, sem quebrar", () => {
    expect(persistentReducer(initialPersistentState, { type: "HYDRATE", result: { status: "invalid" } })).toMatchObject({
      ready: true,
      storageNotice: "discarded",
      character: initialCharacter,
    });
    expect(persistentReducer(initialPersistentState, { type: "HYDRATE", result: { status: "unavailable" } }).storageNotice).toBe(
      "unavailable",
    );
  });

  it("save da etapa Marcas (removida) com gaiola e subespécie Terceiro Olho: migra em vez de descartar", () => {
    const s = memoryStorage();
    const antigo = { ...sample, origin: { regionId: "mannaka-oko", subregionId: "andarilho" }, subspeciesId: "terceiro-olho", marks: ["gaiola-de-bateria"] };
    s.map.set(STORAGE_KEY, JSON.stringify({ version: 1, step: "marcas", character: antigo }));
    expect(load(s.get)).toEqual({
      status: "ok",
      data: { step: "aparencia", character: { ...antigo, subspeciesId: "humano-comum", marks: ["terceiro-olho"] } },
    });
  });

  it("Irmandade salva com Andarilho volta a pedir o forte; o Forte Leste renomeado vira Forte Central", () => {
    const s = memoryStorage();
    const comAndarilho = { ...sample, origin: { regionId: "irmandade-de-sao-ferdinand", subregionId: ANDARILHO } };
    s.map.set(STORAGE_KEY, JSON.stringify({ version: 1, step: "origem", character: comAndarilho }));
    const r = load(s.get);
    expect(r.status === "ok" && r.data.character.origin).toEqual({ regionId: "irmandade-de-sao-ferdinand", subregionId: null });

    const leste = { ...sample, origin: { regionId: "irmandade-de-sao-ferdinand", subregionId: "forte-leste" } };
    s.map.set(STORAGE_KEY, JSON.stringify({ version: 1, step: "fe", character: leste }));
    const r2 = load(s.get);
    expect(r2.status === "ok" && r2.data.character.origin).toEqual({ regionId: "irmandade-de-sao-ferdinand", subregionId: "forte-central" });

    // Andarilho continua valendo nas outras regiões
    s.map.set(STORAGE_KEY, JSON.stringify({ version: 1, step: "fe", character: { ...sample, origin: { regionId: "midland", subregionId: ANDARILHO } } }));
    const r3 = load(s.get);
    expect(r3.status === "ok" && r3.data.character.origin).toEqual({ regionId: "midland", subregionId: ANDARILHO });
  });

  it("idade antiga em texto livre fica só com o número; save sem assinatura carrega com assinatura nula", () => {
    const s = memoryStorage();
    const semAssinatura: Partial<Character> = { ...sample, identity: { ...sample.identity, age: "34 anos" } };
    delete semAssinatura.assinatura;
    s.map.set(STORAGE_KEY, JSON.stringify({ version: 1, step: "fe", character: semAssinatura }));
    const r = load(s.get);
    expect(r.status === "ok" && r.data.character.identity.age).toBe("34");
    expect(r.status === "ok" && r.data.character.assinatura).toBeNull();
  });

  it("carga válida restaura personagem e etapa; etapa invisível volta para a primeira etapa sem escolha", () => {
    const ok = persistentReducer(initialPersistentState, { type: "HYDRATE", result: { status: "ok", data: { character: sample, step: "fe" } } });
    expect(ok).toMatchObject({ ready: true, step: "fe", character: sample });
    const centauro = { ...sample, speciesId: "centauros", subspeciesId: null };
    const back = persistentReducer(initialPersistentState, {
      type: "HYDRATE",
      result: { status: "ok", data: { character: centauro, step: "subespecie" } },
    });
    expect(back.step).toBe("especie"); // etapa salva invisível: volta ao início do fluxo
  });

  it("save da ordem antiga, com origem e sem espécie, volta para a etapa Espécie", () => {
    const semEspecie = { ...sample, speciesId: null, subspeciesId: null };
    const r = persistentReducer(initialPersistentState, { type: "HYDRATE", result: { status: "ok", data: { character: semEspecie, step: "oficio" } } });
    expect(r.step).toBe("especie");
  });
});
