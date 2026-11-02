import { describe, expect, it } from "vitest";
import { characterReducer as r } from "./reducer";
import { personagemInicial } from "./personagemInicial";

describe("characterReducer", () => {
  it("recusa a quarta fé sem erro e permite remover", () => {
    let s = personagemInicial;
    for (const id of ["a", "b", "c"]) s = r(s, { type: "ALTERNAR_FE", faithId: id });
    const cheio = s;
    expect(r(cheio, { type: "ALTERNAR_FE", faithId: "d" })).toBe(cheio);
    expect(r(cheio, { type: "ALTERNAR_FE", faithId: "b" }).faithIds).toEqual(["a", "c"]);
  });

  it("troca de espécie limpa a subespécie", () => {
    let s = r(personagemInicial, { type: "ESCOLHER_ESPECIE", speciesId: "x" });
    s = r(s, { type: "ESCOLHER_SUBESPECIE", subspeciesId: "x1" });
    expect(r(s, { type: "ESCOLHER_ESPECIE", speciesId: "y" }).subspeciesId).toBeNull();
  });

  it("troca de região limpa a subregião", () => {
    let s = r(personagemInicial, { type: "ESCOLHER_REGIAO", regionId: "r1" });
    s = r(s, { type: "ESCOLHER_SUBREGIAO", subregionId: "andarilho" });
    expect(r(s, { type: "ESCOLHER_REGIAO", regionId: "r2" }).origin).toEqual({ regionId: "r2", subregionId: null });
  });

  it("DEFINIR_APARENCIA troca entre catálogo e upload, e com image null remove a imagem mantendo as notas", () => {
    let s = r(personagemInicial, { type: "DEFINIR_APARENCIA", appearance: { notes: "cicatriz" } });
    s = r(s, { type: "DEFINIR_APARENCIA", appearance: { image: { kind: "catalog", imageId: "misc/dojo-deserto" } } });
    expect(s.appearance).toEqual({ image: { kind: "catalog", imageId: "misc/dojo-deserto" }, notes: "cicatriz" });
    const upload = { kind: "upload" as const, dataUrl: "data:image/jpeg;base64,AAAA", name: "eu.jpg" };
    s = r(s, { type: "DEFINIR_APARENCIA", appearance: { image: upload } });
    expect(s.appearance.image).toEqual(upload);
    s = r(s, { type: "DEFINIR_APARENCIA", appearance: { image: null } });
    expect(s.appearance).toEqual({ image: null, notes: "cicatriz" });
  });

  it("REINICIAR restaura o estado inicial", () => {
    let s = r(personagemInicial, { type: "DEFINIR_IDENTIDADE", identity: { name: "Fulano" } });
    s = r(s, { type: "DEFINIR_MARCA", mark: "cicatriz", on: true });
    expect(r(s, { type: "REINICIAR" })).toEqual(personagemInicial);
  });
});
