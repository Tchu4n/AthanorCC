import { describe, expect, it } from "vitest";
import { apuracaoDe, flexiona } from "./ficha";
import { personagemInicial } from "./personagemInicial";
import { cruzamentoDe, getFaiths, getImages, getMarks, getOccupations, getOriginOptions, getRegions, getRetratos, getSpeciesList, getSubregions, getSubspecies, identidadeDe, secoesDe } from "./catalogo";
import { ANDARILHO, OFICIO_PROPRIO } from "./character";

const emOrdem = (nomes: string[]) => expect(nomes).toEqual([...nomes].sort((a, b) => a.localeCompare(b, "pt-BR")));

describe("opções de origem", () => {
  it("toda região oferece Andarilho/Aventureiro, menos a Irmandade, que só tem os fortes", () => {
    for (const r of getRegions()) {
      const andarilho = getOriginOptions(r.id).some((o) => o.andarilho);
      expect(andarilho, r.id).toBe(r.id !== "irmandade-de-sao-ferdinand");
    }
    expect(getOriginOptions("irmandade-de-sao-ferdinand").map((o) => o.name)).toEqual(["Forte Central", "Forte Norte", "Forte Oeste", "Forte Sul"]);
  });
});

describe("catálogo em ordem alfabética (ordem dos cards)", () => {
  it("regiões, espécies, ofícios, fés, marcas e imagens", () => {
    for (const lista of [getRegions(), getSpeciesList(), getOccupations(), getFaiths(), getMarks()]) emOrdem(lista.map((x) => x.name));
    emOrdem(getImages().map((i) => i.displayName));
  });

  it("subregiões e subespécies; Andarilho/Aventureiro continua por último", () => {
    for (const r of getRegions()) {
      emOrdem(getSubregions(r.id).map((s) => s.name));
      if (!r.semAndarilho) expect(getOriginOptions(r.id).at(-1)?.andarilho).toBe(true);
    }
    for (const s of getSpeciesList()) emOrdem(getSubspecies(s.id).map((x) => x.name));
  });
});

describe("retratos da Aparência", () => {
  // up-tropa e deserto-andarilho repetem a imagem de outro retrato
  it("só imagens de um personagem: nenhuma cena, bandeira, grupo ou repetida", () => {
    const ids = getRetratos().map((i) => i.id);
    expect(ids.length).toBeGreaterThan(20);
    expect(getRetratos().every((i) => !("cena" in i))).toBe(true);
    for (const fora of ["factions/up-bandeira", "factions/up-exercito", "factions/mercenarios", "misc/batalha-warsaw", "regions/midland-centro", "factions/up-tropa", "regions/deserto-andarilho"])
      expect(ids).not.toContain(fora);
  });
});

describe("apuração da Agência", () => {
  const base = { ...personagemInicial, speciesId: "humano", subspeciesId: "mutante-sao-ferdinand", origin: { regionId: "reino-de-crick", subregionId: "andarilho" } };
  it("texto próprio para espécie, subespécie, origem, andarilho e ofício", () => {
    const { especie, origem, oficio } = apuracaoDe({ ...base, occupationId: "mercenario" });
    for (const trecho of ["Humano:", "Irmandade de São Ferdinand"]) expect(especie).toContain(trecho);
    for (const trecho of ["Horda de Southgarden", "linhagem que"]) expect(origem).toContain(trecho);
    expect(oficio).toContain("Ofício declarado: mercenário.");
  });
  it("todo Andarilho/Aventureiro tem texto próprio na escolha e na Agência", () => {
    for (const r of getRegions().filter((x) => !x.semAndarilho)) {
      expect(getOriginOptions(r.id).at(-1)?.briefing.length, r.id).toBeGreaterThan(80);
      const c = { ...personagemInicial, speciesId: "humano", origin: { regionId: r.id, subregionId: ANDARILHO } };
      expect(apuracaoDe(c).origem, r.id).not.toContain("sem endereço para cobrança");
    }
    const feminino = { ...personagemInicial, sexo: "feminino" as const, speciesId: "humano", origin: { regionId: "companhia-de-comercio", subregionId: ANDARILHO } };
    expect(apuracaoDe(feminino).origem).toContain("andarilha das rotas da Companhia");
  });
  it("acrescenta o cruzamento da Agência à origem, flexionado, e nada quando não há texto", () => {
    const hd = { ...personagemInicial, speciesId: "homens-do-deserto", origin: { regionId: "oakhaven", subregionId: "andarilho" } };
    expect(apuracaoDe({ ...hd, sexo: "feminino" }).origem).toContain("é tolerada");
    expect(apuracaoDe({ ...hd, sexo: "masculino" }).origem).toContain("é tolerado");
    expect(apuracaoDe(base).origem).not.toContain("jornada pelo casco");
  });
  it("concorda com o sexo: feminino flexiona; masculino, incerto e sem sexo usam o masculino genérico", () => {
    expect(apuracaoDe({ ...base, sexo: "feminino" }).oficio).toContain("Vagabunda sem renda");
    expect(apuracaoDe({ ...base, sexo: "feminino" }).especie).toMatch(/^Humana:/);
    for (const sexo of ["masculino", "incerto", null] as const) expect(apuracaoDe({ ...base, sexo }).oficio).toContain("Vagabundo sem renda");
    expect(flexiona("{ele|ela} e {este|esta}", "feminino")).toBe("ela e esta");
  });

  it("a origem leva em conta a subregião (e o andarilho, quando não há subregião)", () => {
    const krupp = apuracaoDe({ ...base, origin: { regionId: "reino-de-laguardia", subregionId: "krupp" } }).origem;
    expect(krupp).toMatch(/^Vem do Reino de Laguardia.*Vem de Krupp, o coração das fundições/);
    expect(krupp).not.toContain("andarilho");
    expect(apuracaoDe(base).origem).toContain("linhagem que");
  });

  it("sem ofício é vagabundo; o personalizado usa o nome dado", () => {
    expect(apuracaoDe(base).oficio).toContain("Vagabundo");
    const proprio = apuracaoDe({ ...base, occupationId: "personalizado", customOccupation: { name: "Ferreiro", description: "" } });
    expect(proprio.oficio).toMatch(/^Ofício declarado: ferreiro\./);
  });
});

describe("seções do painel (Você no mundo e Vindo de)", () => {
  const comRegiao = { ...personagemInicial, origin: { regionId: "uniao-das-provincias", subregionId: null } };
  it("só o briefing quando não há implications nem cruzamento", () => {
    expect(secoesDe({ briefing: "A." })).toEqual([{ text: "A." }]);
  });
  it("briefing, Você no mundo e Vindo de <região>, nessa ordem", () => {
    expect(secoesDe({ briefing: "A.", implications: "B." }, { regiao: "UP", texto: "C." })).toEqual([
      { text: "A." },
      { label: "Você no mundo", text: "B." },
      { label: "Vindo de UP", text: "C." },
    ]);
  });
  it("a identidade é a subespécie quando há uma, senão a espécie", () => {
    expect(identidadeDe({ ...personagemInicial, speciesId: "humano", subspeciesId: "elite-orelhas-pontudas" })).toBe("elite-orelhas-pontudas");
    expect(identidadeDe({ ...personagemInicial, speciesId: "centauros", subspeciesId: null })).toBe("centauros");
  });
  it("com origem, um par existente devolve o nome da região e o texto", () => {
    const c = cruzamentoDe("centauros", { ...personagemInicial, origin: { regionId: "reino-de-laguardia", subregionId: null } });
    expect(c?.regiao).toBe("Reino de Laguardia");
    expect(c?.texto).toMatch(/centauros mercenários são comuns/);
  });
  it("sem origem ou com ofício personalizado não há cruzamento", () => {
    expect(cruzamentoDe("centauros", { ...personagemInicial, origin: null })).toBeUndefined();
    expect(cruzamentoDe(OFICIO_PROPRIO, comRegiao)).toBeUndefined();
  });
});
