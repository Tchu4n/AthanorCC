import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PINOS } from "@/data/mapa";
import { serializarMapa } from "./serializar";

describe("serializarMapa", () => {
  it("gera exatamente o src/data/mapa.ts atual: o Copiar JSON de /dev/mapa produz um arquivo válido", () => {
    expect(serializarMapa(PINOS)).toBe(readFileSync("src/data/mapa.ts", "utf8"));
  });
});
