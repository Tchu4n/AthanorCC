import { describe, expect, it } from "vitest";
import { ANDARILHO, type Character } from "./character";
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
  marks: ["terceiro-olho"],
  appearance: { imageId: "factions/up-mago-alto", notes: "gola franzida" },
  identity: { name: "Isabela", age: "34", shortStory: "", personality: "" },
  createdAt: "2026-10-25T12:00:00.000Z",
};

describe("storage", () => {
  it("save e load fazem round-trip", () => {
    const s = memoryStorage();
    expect(save({ character: sample, step: "fe" }, s.get)).toBe(true);
    expect(load(s.get)).toEqual({ status: "ok", data: { character: sample, step: "fe" } });
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

  it("carga válida restaura personagem e etapa; etapa invisível volta para Origem", () => {
    const ok = persistentReducer(initialPersistentState, { type: "HYDRATE", result: { status: "ok", data: { character: sample, step: "fe" } } });
    expect(ok).toMatchObject({ ready: true, step: "fe", character: sample });
    const centauro = { ...sample, speciesId: "centauros", subspeciesId: null };
    const back = persistentReducer(initialPersistentState, {
      type: "HYDRATE",
      result: { status: "ok", data: { character: centauro, step: "subespecie" } },
    });
    expect(back.step).toBe("origem");
  });
});
