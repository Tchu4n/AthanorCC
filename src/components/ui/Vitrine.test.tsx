import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { Character } from "@/lib/character";
import { initialCharacter } from "@/lib/initialCharacter";
import { escolhaDaEtapa, Vitrine } from "./Vitrine";

const make = (o: Partial<Character>): Character => ({ ...initialCharacter, ...o });

describe("escolhaDaEtapa", () => {
  it("Origem: imagem da região, com alt do catálogo e legenda com a subregião", () => {
    expect(escolhaDaEtapa("origem", make({ origin: { regionId: "reino-de-laguardia", subregionId: "krupp" } }))).toEqual({
      src: "/athanor/regions/laguardia-quartel.jpg",
      alt: "Quartel de Laguardia",
      legenda: "Reino de Laguardia, Krupp",
    });
  });

  it("Origem: região sem imagem e sem subregião com imagem vira placeholder com legenda", () => {
    // nos dados atuais nenhuma região sem imagem tem subregião com imagem (Warsaw é de Midland, que já tem)
    expect(escolhaDaEtapa("origem", make({ origin: { regionId: "blackwater", subregionId: null } }))).toMatchObject({ src: null, legenda: "Blackwater" });
  });

  it("Espécie e Subespécie: subespécie sem imagem cai na da espécie", () => {
    expect(escolhaDaEtapa("especie", make({ speciesId: "vampiros" }))).toMatchObject({ src: "/athanor/species/vampiros.png", alt: "Vampiro fugitivo" });
    expect(escolhaDaEtapa("subespecie", make({ speciesId: "homens-galho", subspeciesId: "trabalhador" }))).toMatchObject({
      src: "/athanor/species/homens-galho-principe.jpg",
      legenda: "Trabalhador",
    });
    expect(escolhaDaEtapa("subespecie", make({ speciesId: "humano", subspeciesId: "elite-orelhas-pontudas" }))).toMatchObject({
      src: "/athanor/factions/up-mago-alto.jpg",
    });
  });

  it("Ofício com e sem imagem; Fé e Marcas sem imagem viram placeholder com o nome", () => {
    expect(escolhaDaEtapa("oficio", make({ occupationId: "soldado" }))).toMatchObject({ src: "/athanor/factions/up-soldado-regular.png" });
    expect(escolhaDaEtapa("oficio", make({ occupationId: "bardo" }))).toEqual({ src: null, alt: "", legenda: "Bardo" });
    expect(escolhaDaEtapa("fe", make({ faithIds: ["umbra", "activum"] }))).toEqual({ src: null, alt: "", legenda: "Activum" });
    expect(escolhaDaEtapa("marcas", make({ marks: ["terceiro-olho", "gaiola-de-bateria"] }))).toEqual({ src: null, alt: "", legenda: "Gaiola de bateria" });
  });

  it("Aparência: catálogo ou upload; Revisão: região", () => {
    const catalogo = make({ appearance: { image: { kind: "catalog", imageId: "misc/dojo-deserto" }, notes: "" } });
    expect(escolhaDaEtapa("aparencia", catalogo)).toEqual({ src: "/athanor/misc/dojo-deserto.jpg", alt: "Dojo do deserto", legenda: "Dojo do deserto" });
    const upload = make({ appearance: { image: { kind: "upload", dataUrl: "data:image/png;base64,iVBORw0KGgo=", name: "eu.png" }, notes: "" } });
    expect(escolhaDaEtapa("aparencia", upload)).toMatchObject({ src: "data:image/png;base64,iVBORw0KGgo=", alt: "eu.png" });
    expect(escolhaDaEtapa("revisao", make({ origin: { regionId: "midland", subregionId: null } }))).toMatchObject({ legenda: "Midland", alt: "Cavaleiro de Midland" });
  });

  it("sem escolha: placeholder sem legenda", () => {
    for (const step of ["origem", "especie", "oficio", "fe", "marcas", "aparencia", "revisao"] as const)
      expect(escolhaDaEtapa(step, initialCharacter)).toEqual({ src: null, alt: "", legenda: undefined });
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
      <Vitrine src="/athanor/regions/laguardia-quartel.jpg" alt="Quartel de Laguardia" legenda="Reino de Laguardia" placeholder="origem" />,
    );
    expect(html).toMatch(/<img[^>]*alt="Quartel de Laguardia"/);
    expect(html).toMatch(/<img[^>]*loading="lazy"/);
    expect(html).toMatch(/<img[^>]*decoding="async"/);
    expect(html).toContain(">Reino de Laguardia</figcaption>");
  });

  it("imagem decorativa (alt vazio) fica fora da árvore de acessibilidade", () => {
    const html = renderToStaticMarkup(<Vitrine src="/athanor/misc/dojo-deserto.jpg" alt="" placeholder="aparencia" />);
    expect(html).toMatch(/<img[^>]*alt=""[^>]*aria-hidden="true"|<img[^>]*aria-hidden="true"[^>]*alt=""/);
  });

  it("cor plena: sem filter e com --vida fixo em 1; nada interativo dentro", () => {
    const html = renderToStaticMarkup(<Vitrine src="/athanor/misc/dojo-deserto.jpg" alt="Dojo do deserto" placeholder="aparencia" />);
    expect(html).not.toMatch(/filter|saturate/);
    expect(html).toContain("--vida:1");
    expect(html).not.toMatch(/<(button|a|input|select|textarea)\b|tabindex/);
  });
});
