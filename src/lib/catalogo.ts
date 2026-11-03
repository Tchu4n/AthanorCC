// Único ponto de leitura de /data para a interface.
import { faiths } from "../data/faiths";
import { IMAGES } from "../data/images";
import { cruzamentos } from "../data/cruzamentos";
import { marks } from "../data/marks";
import { occupations } from "../data/occupations";
import { regions } from "../data/regions";
import { rules } from "../data/rules";
import { species } from "../data/species";
import { A_DEFINIR } from "../data/types";
import type { BriefingSection } from "../components/briefing/PainelBriefing";
import { ANDARILHO, OFICIO_PROPRIO, type Character } from "./character";

export type ImageId = keyof typeof IMAGES;
export type ImageRef = { id: ImageId; src: string; displayName: string };
export type OriginOption = { id: string; name: string; briefing: string; andarilho: boolean; image?: string; cena: boolean };

export const isPending = (text: string) => text === A_DEFINIR;

// Listas em ordem alfabética: os cards de todas as etapas seguem esta ordem (pt-BR, acentos não desordenam).
const porNome = <T extends { name: string }>(lista: readonly T[]) => [...lista].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

const regioes = porNome(regions);
export const getRegions = () => regioes;
export const getRegion = (id: string | null | undefined) => regions.find((r) => r.id === id);
export const getSubregions = (regionId: string) => porNome(getRegion(regionId)?.subregions ?? []);
export const getSubregion = (regionId: string, subregionId: string) =>
  getSubregions(regionId).find((s) => s.id === subregionId);

// Andarilho/Aventureiro é gerado aqui, não é dado de lore.
export const ANDARILHO_LABEL = "Andarilho/Aventureiro";
// Sem imagem própria, a opção usa a arte da região, que é sempre cena; a própria só é cena se o registro marcar.
const ehCena = (src: string) => Object.values(IMAGES).some((i) => i.src === src && "cena" in i);
export function getOriginOptions(regionId: string): OriginOption[] {
  const region = getRegion(regionId);
  const imagem = (propria?: string) => ({ image: propria ?? region?.image, cena: !propria || ehCena(propria) });
  return [
    ...getSubregions(regionId).map((s) => ({ id: s.id, name: s.name, briefing: s.briefing, andarilho: false, ...imagem(s.image) })),
    ...(region?.semAndarilho ? [] : [{ id: ANDARILHO, name: ANDARILHO_LABEL, briefing: "", andarilho: true, ...imagem(region?.andarilho) }]),
  ];
}

const especies = porNome(species);
export const getSpeciesList = () => especies;
export const getSpecies = (id: string | null | undefined) => species.find((s) => s.id === id);
export const getSubspecies = (speciesId: string | null | undefined) => porNome(getSpecies(speciesId)?.subspecies ?? []);

const oficios = porNome(occupations);
export const getOccupations = () => oficios;
export const getOccupation = (id: string | null | undefined) => occupations.find((o) => o.id === id);
export const OFICIO_PROPRIO_LABEL = "Ofício personalizado";
// Nome do ofício escolhido, do catálogo ou criado pelo usuário (com descrição, quando houver).
export function oficioDe(c: Character): { nome: string; descricao: string } | undefined {
  if (c.occupationId !== OFICIO_PROPRIO) {
    const o = getOccupation(c.occupationId);
    return o && { nome: o.name, descricao: "" };
  }
  return { nome: c.customOccupation.name.trim() || OFICIO_PROPRIO_LABEL, descricao: c.customOccupation.description.trim() };
}
export const textoDoOficio = (c: Character) => {
  const o = oficioDe(c);
  return o ? [o.nome, o.descricao].filter(Boolean).join(" — ") : "";
};

const fes = porNome(faiths);
export const getFaiths = () => fes;
export const getFaith = (id: string) => faiths.find((f) => f.id === id);

const marcas = porNome(marks);
export const getMarks = () => marcas;
export const getMark = (id: string) => marks.find((m) => m.id === id);

const imagens: ImageRef[] = (Object.keys(IMAGES) as ImageId[])
  .map((id) => ({ id, ...IMAGES[id] }))
  .sort((a, b) => a.displayName.localeCompare(b.displayName, "pt-BR"));
export const getImages = () => imagens;
export const getRetratos = () => imagens.filter((i) => "retrato" in i);
export const getImage = (id: string | null | undefined): ImageRef | undefined =>
  id && id in IMAGES ? { id: id as ImageId, ...IMAGES[id as ImageId] } : undefined;

export const getRules = () => rules;

// Painel de uma escolha: voz do cenário, "Você no mundo" e, com origem escolhida, "Vindo de <região>".
export const identidadeDe = (c: Character) => c.subspeciesId ?? c.speciesId ?? undefined;
export const getCruzamento = (escolhaId: string | null | undefined, regiaoId: string | null | undefined) =>
  cruzamentos.find((x) => x.escolha === escolhaId && x.regiao === regiaoId)?.texto;
export function cruzamentoDe(escolhaId: string | null | undefined, c: Character) {
  const regiao = getRegion(c.origin?.regionId);
  const texto = regiao && getCruzamento(escolhaId, regiao.id);
  return texto ? { regiao: regiao.name, texto } : undefined;
}
export const secoesDe = (item: { briefing: string; implications?: string }, cruzamento?: { regiao: string; texto: string }): BriefingSection[] => [
  { text: item.briefing },
  ...(item.implications ? [{ label: "Você no mundo", text: item.implications }] : []),
  ...(cruzamento ? [{ label: `Vindo de ${cruzamento.regiao}`, text: cruzamento.texto }] : []),
];
