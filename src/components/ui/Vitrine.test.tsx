import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ANDARILHO_LABEL, getRegions } from "@/lib/catalog";
import { ANDARILHO } from "@/lib/character";
import type { Character } from "@/lib/character";
import { initialCharacter } from "@/lib/initialCharacter";
import { escolhaDaEtapa, Vitrine } from "./Vitrine";

const make = (o: Partial<Character>): Character => ({ ...initialCharacter, ...o });

describe("escolhaDaEtapa", () => {
  it("Origem: imagem da região, com alt do catálogo e legenda com a subregião", () => {
    expect(escolhaDaEtapa("origem", make({ origin: { regionId: "reino-de-laguardia", subregionId: "krupp" } }))).toEqual({
      src: "/athanor/regions/laguardia-centro-comercial.webp",
      alt: "Centro comercial de Laguardia",
      legenda: "Reino de Laguardia, Krupp",
      cena: true, // lugar: recorte mais baixo
    });
  });

  it("subregiões com imagem própria pelo contexto; as demais usam a arte da região", () => {
    const casos: [string, string, string][] = [
      ["protetorado-de-morrow", "lamacal", "/athanor/regions/morrow-habitante.webp"],
      ["oakhaven", "posto-das-peles", "/athanor/regions/oakhaven-habitante.webp"],
      ["planicies-de-sunfield", "justa", "/athanor/factions/sunfield-cavaleiro.webp"],
      ["grao-ducado-de-highbridge", "ponte-matriz", "/athanor/regions/highbridge-arcos.webp"],
      ["uniao-das-provincias", "dragomir", "/athanor/factions/up-exercito.webp"],
      ["uniao-das-provincias", "haller", "/athanor/factions/up-mago-alto.webp"],
      ["reino-de-laguardia", "schwarzenberg", "/athanor/regions/laguardia-quartel.webp"],
      ["reino-de-laguardia", "krupp", "/athanor/regions/laguardia-centro-comercial.webp"], // sem imagem própria
      // artes conceituais de lugar, marcadas como cena no registro
      ["chiefdom-de-vargarf", "fiordes-cortantes", "/athanor/regions/vargarf-fiordes-cortantes.webp"],
      ["midland", "aurelia", "/athanor/regions/midland-aurelia.webp"],
      ["blackwater", "smokelands", "/athanor/regions/blackwater-smokelands.webp"],
      ["grao-ducado-de-highbridge", "quarteirao-dourado", "/athanor/regions/highbridge-quarteirao-dourado.webp"],
    ];
    for (const [regionId, subregionId, src] of casos) {
      const e = escolhaDaEtapa("origem", make({ origin: { regionId, subregionId } }));
      expect(e.src, subregionId).toBe(src);
      // retrato próprio da subregião alinhado pelo alto; arte da região e arte de lugar, recorte de cena
      expect(e.cena, subregionId).toBe(/centro-comercial|fiordes-cortantes|midland-aurelia|blackwater-smokelands|quarteirao-dourado/.test(src));
    }
  });

  it("Andarilho/Aventureiro usa a arte própria da região quando existe", () => {
    const e = escolhaDaEtapa("origem", make({ origin: { regionId: "blackwater", subregionId: ANDARILHO } }));
    expect(e).toMatchObject({ src: "/athanor/regions/blackwater-andarilho.webp", cena: false });
  });

  it("escolha sem imagem vira placeholder com legenda (fés ainda não têm imagem)", () => {
    expect(escolhaDaEtapa("fe", make({ faithIds: ["umbra"] }))).toMatchObject({ src: null, legenda: "Umbra" });
  });

  it("toda região tem imagem, e a prévia mostra a mesma arte do card (nunca a bandeira)", () => {
    for (const r of getRegions()) {
      expect(escolhaDaEtapa("origem", make({ origin: { regionId: r.id, subregionId: null } })).src, r.name).toBe(r.image);
      // Andarilho/Aventureiro usa a arte própria ou a da região, com o nome na legenda
      expect(escolhaDaEtapa("origem", make({ origin: { regionId: r.id, subregionId: ANDARILHO } })), r.name).toMatchObject({
        src: r.andarilho ?? r.image,
        legenda: `${r.name}, ${ANDARILHO_LABEL}`,
      });
    }
    expect(getRegions().every((r) => r.image)).toBe(true);
  });

  it("Espécie e Subespécie: subespécie sem imagem cai na da espécie", () => {
    expect(escolhaDaEtapa("especie", make({ speciesId: "vampiros" }))).toMatchObject({ src: "/athanor/species/vampiros.webp", alt: "Vampiro fugitivo" });
    expect(escolhaDaEtapa("subespecie", make({ speciesId: "homens-galho", subspeciesId: "trabalhador" }))).toMatchObject({
      src: "/athanor/species/homem-galho.webp", // a espécie usa o close genérico; o Príncipe tem imagem própria
      legenda: "Trabalhador",
    });
    expect(escolhaDaEtapa("subespecie", make({ speciesId: "humano", subspeciesId: "elite-orelhas-pontudas" }))).toMatchObject({
      src: "/athanor/factions/up-mago-alto.webp",
    });
  });

  it("Ofício com e sem imagem; Fé e Marcas sem imagem viram placeholder com o nome", () => {
    expect(escolhaDaEtapa("oficio", make({ occupationId: "soldado" }))).toMatchObject({ src: "/athanor/factions/up-soldado-regular.webp" });
    expect(escolhaDaEtapa("oficio", make({ occupationId: "bardo" }))).toEqual({ src: null, alt: "", legenda: "Bardo" });
    expect(escolhaDaEtapa("fe", make({ faithIds: ["umbra", "activum"] }))).toEqual({ src: null, alt: "", legenda: "Activum" });
    expect(escolhaDaEtapa("marcas", make({ marks: ["terceiro-olho", "gaiola-de-bateria"] }))).toEqual({ src: null, alt: "", legenda: "Gaiola de bateria" });
  });

  it("Aparência: catálogo ou upload; Revisão: região", () => {
    const catalogo = make({ appearance: { image: { kind: "catalog", imageId: "misc/dojo-deserto" }, notes: "" } });
    expect(escolhaDaEtapa("aparencia", catalogo)).toEqual({ src: "/athanor/misc/dojo-deserto.webp", alt: "Dojo do deserto", legenda: "Dojo do deserto" });
    const upload = make({ appearance: { image: { kind: "upload", dataUrl: "data:image/png;base64,iVBORw0KGgo=", name: "eu.png" }, notes: "" } });
    expect(escolhaDaEtapa("aparencia", upload)).toMatchObject({ src: "data:image/png;base64,iVBORw0KGgo=", alt: "eu.png" });
    expect(escolhaDaEtapa("revisao", make({ origin: { regionId: "midland", subregionId: null } }))).toMatchObject({ legenda: "Midland", alt: "Centro da cidade de Midland" });
  });

  it("sem escolha: placeholder sem legenda", () => {
    for (const step of ["origem", "especie", "oficio", "fe", "marcas", "aparencia", "revisao"] as const)
    {
      const e = escolhaDaEtapa(step, initialCharacter);
      expect([e.src, e.alt, e.legenda], step).toEqual([null, "", undefined]);
    }
  });
});

describe("Vitrine", () => {
  it("sem imagem mostra placeholder com ícone e texto", () => {
    const html = renderToStaticMarkup(<Vitrine src={null} alt="" legenda="Bardo" placeholder="oficio" />);
    expect(html).toContain("Sem imagem para esta escolha");
    expect(html).toMatch(/<svg aria-hidden="true"/);
    expect(html).not.toContain("<img");
    expect(html).toContain("<figcaption");
  });

  it("com imagem: alt descritivo, legenda, carregamento lazy e async", () => {
    const html = renderToStaticMarkup(
      <Vitrine src="/athanor/regions/laguardia-quartel.webp" alt="Quartel de Laguardia" legenda="Reino de Laguardia" placeholder="origem" />,
    );
    expect(html).toMatch(/<img[^>]*alt="Quartel de Laguardia"/);
    expect(html).toMatch(/<img[^>]*loading="lazy"/);
    expect(html).toMatch(/<img[^>]*decoding="async"/);
    expect(html).toContain(">Reino de Laguardia</figcaption>");
  });

  it("imagem decorativa (alt vazio) fica fora da árvore de acessibilidade", () => {
    const html = renderToStaticMarkup(<Vitrine src="/athanor/misc/dojo-deserto.webp" alt="" placeholder="aparencia" />);
    expect(html).toMatch(/<img[^>]*alt=""[^>]*aria-hidden="true"|<img[^>]*aria-hidden="true"[^>]*alt=""/);
  });

  it("cor plena: sem filter e com --vida fixo em 1; nada interativo dentro", () => {
    const html = renderToStaticMarkup(<Vitrine src="/athanor/misc/dojo-deserto.webp" alt="Dojo do deserto" placeholder="aparencia" />);
    expect(html).not.toMatch(/filter|saturate/);
    expect(html).toContain("--vida:1");
    expect(html).not.toMatch(/<(button|a|input|select|textarea)\b|tabindex/);
  });
});
