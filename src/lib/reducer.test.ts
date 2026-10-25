import { describe, expect, it } from "vitest";
import { characterReducer as r } from "./reducer";
import { initialCharacter } from "./initialCharacter";

describe("characterReducer", () => {
  it("recusa a quarta fé sem erro e permite remover", () => {
    let s = initialCharacter;
    for (const id of ["a", "b", "c"]) s = r(s, { type: "TOGGLE_FAITH", faithId: id });
    const cheio = s;
    expect(r(cheio, { type: "TOGGLE_FAITH", faithId: "d" })).toBe(cheio);
    expect(r(cheio, { type: "TOGGLE_FAITH", faithId: "b" }).faithIds).toEqual(["a", "c"]);
  });

  it("troca de espécie limpa a subespécie", () => {
    let s = r(initialCharacter, { type: "SELECT_SPECIES", speciesId: "x" });
    s = r(s, { type: "SELECT_SUBSPECIES", subspeciesId: "x1" });
    expect(r(s, { type: "SELECT_SPECIES", speciesId: "y" }).subspeciesId).toBeNull();
  });

  it("troca de região limpa a subregião", () => {
    let s = r(initialCharacter, { type: "SELECT_REGION", regionId: "r1" });
    s = r(s, { type: "SELECT_SUBREGION", subregionId: "andarilho" });
    expect(r(s, { type: "SELECT_REGION", regionId: "r2" }).origin).toEqual({ regionId: "r2", subregionId: null });
  });

  it("SET_APPEARANCE troca entre catálogo e upload, e com image null remove a imagem mantendo as notas", () => {
    let s = r(initialCharacter, { type: "SET_APPEARANCE", appearance: { notes: "cicatriz" } });
    s = r(s, { type: "SET_APPEARANCE", appearance: { image: { kind: "catalog", imageId: "misc/dojo-deserto" } } });
    expect(s.appearance).toEqual({ image: { kind: "catalog", imageId: "misc/dojo-deserto" }, notes: "cicatriz" });
    const upload = { kind: "upload" as const, dataUrl: "data:image/jpeg;base64,AAAA", name: "eu.jpg" };
    s = r(s, { type: "SET_APPEARANCE", appearance: { image: upload } });
    expect(s.appearance.image).toEqual(upload);
    s = r(s, { type: "SET_APPEARANCE", appearance: { image: null } });
    expect(s.appearance).toEqual({ image: null, notes: "cicatriz" });
  });

  it("RESET restaura o estado inicial", () => {
    let s = r(initialCharacter, { type: "SET_IDENTITY", identity: { name: "Fulano" } });
    s = r(s, { type: "SET_MARK", mark: "cicatriz", on: true });
    expect(r(s, { type: "RESET" })).toEqual(initialCharacter);
  });
});
