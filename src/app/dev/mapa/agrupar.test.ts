import { describe, expect, it } from "vitest";
import { PINOS } from "@/data/mapa";
import { getRegions } from "@/lib/catalogo";
import { agruparPinos } from "./agrupar";

describe("agruparPinos", () => {
  const { grupos, soltos } = agruparPinos(PINOS, getRegions());

  it("todo pino de mapa.ts pertence a uma região ou subregião do catálogo (nenhum solto)", () => {
    expect(soltos.map((p) => p.id)).toEqual([]);
  });

  it("cada pino aparece uma única vez, ou como região ou como subregião", () => {
    const vistos = grupos.flatMap((g) => [g.regiao?.id, ...g.subs.map((s) => s.pino?.id)]).filter(Boolean);
    expect(new Set(vistos).size).toBe(vistos.length);
    expect(vistos.length).toBe(PINOS.length);
  });

  it("as subregiões ficam sob a região certa", () => {
    const laguardia = grupos.find((g) => g.regiaoId === "reino-de-laguardia")!;
    expect(laguardia.subs.map((s) => s.id)).toContain("bauer");
    const blackwater = grupos.find((g) => g.regiaoId === "blackwater")!;
    expect(blackwater.subs.map((s) => s.id)).toEqual(expect.arrayContaining(["grip", "baia-dos-contrabandistas"]));
    expect(grupos.flatMap((g) => g.subs).find((s) => s.id === "grip")?.pino?.status).toBeDefined();
  });

  it("subregião sem registro em mapa.ts aparece com pino vazio, e região sem subregiões, com lista vazia", () => {
    const kruk = grupos.find((g) => g.regiaoId === "reino-de-kruk")!;
    expect(kruk.subs).toEqual([]);
    expect(kruk.regiao).toBeDefined();
  });
});
