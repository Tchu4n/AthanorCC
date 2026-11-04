import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ANDARILHO_LABEL, getFaiths, getOccupations, getRegions } from "@/lib/catalogo";
import { ANDARILHO } from "@/lib/character";
import type { Character } from "@/lib/character";
import { personagemInicial } from "@/lib/personagemInicial";
import { SIMBOLOS_FE } from "./SimboloFe";
import { SIMBOLOS_REGIAO } from "./SimboloRegiao";
import { SIMBOLOS } from "./SimboloOficio";
import { escolhaDaEtapa, Vitrine } from "./Vitrine";

const make = (o: Partial<Character>): Character => ({ ...personagemInicial, ...o });

describe("escolhaDaEtapa", () => {
  it("Origem: imagem da região, com alt do catálogo e legenda com a subregião", () => {
    // Asenov (UP) ainda não tem arte própria: usa a da região
    expect(escolhaDaEtapa("origem", make({ origin: { regionId: "uniao-das-provincias", subregionId: "asenov" } }))).toEqual({
      src: "/athanor/regions/up-centro.webp",
      alt: "Centro da cidade da UP",
      legenda: "União das Províncias (UP), Asenov",
      cena: true, // lugar: recorte mais baixo
    });
  });

  it("subregiões com imagem própria pelo contexto; as demais usam a arte da região", () => {
    // [região, subregião, imagem, cena]: retrato próprio alinhado pelo alto; arte da região e arte de lugar, recorte de cena
    const casos: [string, string, string, boolean][] = [
      ["planicies-de-sunfield", "justa", "/athanor/regions/sunfield-justa.webp", true],
      ["grao-ducado-de-highbridge", "ponte-matriz", "/athanor/regions/highbridge-arcos.webp", false],
      ["uniao-das-provincias", "dragomir", "/athanor/factions/up-exercito.webp", false],
      ["uniao-das-provincias", "haller", "/athanor/factions/up-mago-alto.webp", false],
      ["reino-de-laguardia", "schwarzenberg", "/athanor/regions/laguardia-quartel.webp", false],
      ["reino-de-laguardia", "bauer", "/athanor/regions/laguardia-bauer.webp", true],
      ["reino-de-laguardia", "krupp", "/athanor/regions/laguardia-krupp.webp", true], // arte de 2026-11-01
      ["uniao-das-provincias", "asenov", "/athanor/regions/up-centro.webp", true], // sem imagem própria
      ["chiefdom-de-vargarf", "fiordes-cortantes", "/athanor/regions/vargarf-fiordes-cortantes.webp", true],
      ["protetorado-de-morrow", "lamacal", "/athanor/regions/morrow-lamacal.webp", true],
      ["oakhaven", "posto-das-peles", "/athanor/regions/oakhaven-posto-das-peles.webp", true],
      ["midland", "aurelia", "/athanor/regions/midland-aurelia.webp", true],
      ["blackwater", "smokelands", "/athanor/regions/blackwater-smokelands.webp", true],
      ["reclusos-do-deserto", "mahabam", "/athanor/regions/deserto-mahabam.webp", true],
    ];
    for (const [regionId, subregionId, src, cena] of casos) {
      const e = escolhaDaEtapa("origem", make({ origin: { regionId, subregionId } }));
      expect(e.src, subregionId).toBe(src);
      expect(e.cena, subregionId).toBe(cena);
    }
  });

  it("Andarilho/Aventureiro usa a arte própria da região quando existe", () => {
    const e = escolhaDaEtapa("origem", make({ origin: { regionId: "blackwater", subregionId: ANDARILHO } }));
    expect(e).toMatchObject({ src: "/athanor/regions/blackwater-andarilho.webp", cena: false });
  });

  it("escolha sem imagem vira placeholder com legenda (fés ainda não têm imagem)", () => {
    expect(escolhaDaEtapa("fe", make({ faithIds: ["umbra"] }))).toMatchObject({ src: null, legenda: "Umbra" });
  });

  it("toda região tem imagem (ou brasão), e a prévia mostra a mesma arte do card (nunca a bandeira)", () => {
    for (const r of getRegions()) {
      expect(escolhaDaEtapa("origem", make({ origin: { regionId: r.id, subregionId: null } })).src, r.name).toBe(r.image ?? null);
      // Andarilho/Aventureiro usa a arte própria ou a da região, com o nome na legenda (onde a região tem essa opção)
      if (!r.semAndarilho) expect(escolhaDaEtapa("origem", make({ origin: { regionId: r.id, subregionId: ANDARILHO } })), r.name).toMatchObject({
        src: r.andarilho ?? r.image ?? null,
        legenda: `${r.name}, ${ANDARILHO_LABEL}`,
      });
    }
    expect(getRegions().filter((r) => !r.image && !SIMBOLOS_REGIAO[r.id]).map((r) => r.id)).toEqual([]);
  });

  it("Espécie e Subespécie: subespécie sem imagem cai na da espécie", () => {
    expect(escolhaDaEtapa("especie", make({ speciesId: "vampiros" }))).toMatchObject({ src: "/athanor/species/vampiros.webp", alt: "Vampiro fugitivo" });
    expect(escolhaDaEtapa("subespecie", make({ speciesId: "homens-galho", subspeciesId: "trabalhador" }))).toMatchObject({
      src: "/athanor/species/homem-galho.webp", // a espécie usa o close genérico; o Príncipe tem imagem própria
      legenda: "Trabalhador",
    });
    expect(escolhaDaEtapa("subespecie", make({ speciesId: "humano", subspeciesId: "elite-orelhas-pontudas" }))).toMatchObject({
      src: "/athanor/species/elite-orelhas-pontudas.webp",
    });
    expect(escolhaDaEtapa("subespecie", make({ speciesId: "humano", subspeciesId: "mutante-sao-ferdinand" }))).toMatchObject({
      src: "/athanor/species/mutante-da-irmandade.webp",
    });
  });

  it("Ofício com símbolo (e o personalizado); Fé sem imagem vira placeholder com o nome", () => {
    expect(escolhaDaEtapa("oficio", make({ occupationId: "soldado" }))).toEqual({ src: null, alt: "", legenda: "Soldado", simbolo: { tipo: "oficio", id: "soldado" } });
    expect(escolhaDaEtapa("oficio", make({ occupationId: "bardo" }))).toEqual({ src: null, alt: "", legenda: "Bardo", simbolo: { tipo: "oficio", id: "bardo" } });
    expect(escolhaDaEtapa("fe", make({ faithIds: ["umbra", "activum"] }))).toEqual({ src: null, alt: "", legenda: "Activum", simbolo: { tipo: "fe", id: "activum" } });
    expect(escolhaDaEtapa("oficio", make({ occupationId: "personalizado", customOccupation: { name: "Ferreiro", description: "" } }))).toEqual({ src: null, alt: "", legenda: "Ferreiro" });
  });

  it("Aparência: catálogo ou upload; Revisão: região", () => {
    const catalogo = make({ appearance: { image: { kind: "catalog", imageId: "misc/dojo-deserto" }, notes: "" } });
    expect(escolhaDaEtapa("aparencia", catalogo)).toEqual({ src: "/athanor/misc/dojo-deserto.webp", alt: "Dojo do deserto", legenda: "Dojo do deserto" });
    const upload = make({ appearance: { image: { kind: "upload", dataUrl: "data:image/png;base64,iVBORw0KGgo=", name: "eu.png" }, notes: "" } });
    expect(escolhaDaEtapa("aparencia", upload)).toMatchObject({ src: "data:image/png;base64,iVBORw0KGgo=", alt: "Imagem enviada", legenda: "Imagem enviada" }); // nunca o nome do arquivo
    expect(escolhaDaEtapa("revisao", make({ origin: { regionId: "midland", subregionId: null } }))).toMatchObject({ legenda: "Midland", alt: "Centro da cidade de Midland" });
  });

  it("sem escolha: placeholder sem legenda", () => {
    for (const step of ["origem", "especie", "oficio", "fe", "aparencia", "revisao"] as const)
    {
      const e = escolhaDaEtapa(step, personagemInicial);
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

  it("ofício sem imagem: todo ofício sem arte tem símbolo, e a vitrine mostra o medalhão", () => {
    const semArte = getOccupations().filter((o) => !o.image);
    expect(semArte.filter((o) => !SIMBOLOS[o.id]).map((o) => o.id)).toEqual([]);
    const e = escolhaDaEtapa("oficio", make({ occupationId: "ferreiro" }));
    expect(e.simbolo).toEqual({ tipo: "oficio", id: "ferreiro" });
    const html = renderToStaticMarkup(<Vitrine {...e} placeholder="oficio" />);
    expect(html).toContain('data-simbolo-oficio="ferreiro"');
    expect(html).not.toContain("Sem imagem para esta escolha");
  });

  it("fé sem imagem: toda fé sem arte tem símbolo, e a vitrine mostra o medalhão da última escolhida", () => {
    expect(getFaiths().filter((f) => !f.image && !SIMBOLOS_FE[f.id]).map((f) => f.id)).toEqual([]);
    const html = renderToStaticMarkup(<Vitrine {...escolhaDaEtapa("fe", make({ faithIds: ["logan", "nilos"] }))} placeholder="fe" />);
    expect(html).toContain('data-simbolo-fe="nilos"');
    expect(html).not.toContain("Sem imagem para esta escolha");
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
