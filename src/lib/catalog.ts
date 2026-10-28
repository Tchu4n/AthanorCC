// Único ponto de leitura de /data para a interface.
import { faiths } from "../data/faiths";
import { IMAGES } from "../data/images";
import { marks } from "../data/marks";
import { occupations } from "../data/occupations";
import { regions } from "../data/regions";
import { rules } from "../data/rules";
import { species } from "../data/species";
import { A_DEFINIR } from "../data/types";
import { ANDARILHO } from "./character";

export type ImageId = keyof typeof IMAGES;
export type ImageRef = { id: ImageId; src: string; displayName: string };
export type OriginOption = { id: string; name: string; briefing: string; andarilho: boolean };

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
export function getOriginOptions(regionId: string): OriginOption[] {
  return [
    ...getSubregions(regionId).map((s) => ({ id: s.id, name: s.name, briefing: s.briefing, andarilho: false })),
    { id: ANDARILHO, name: ANDARILHO_LABEL, briefing: "", andarilho: true },
  ];
}

const especies = porNome(species);
export const getSpeciesList = () => especies;
export const getSpecies = (id: string | null | undefined) => species.find((s) => s.id === id);
export const getSubspecies = (speciesId: string | null | undefined) => porNome(getSpecies(speciesId)?.subspecies ?? []);

const oficios = porNome(occupations);
export const getOccupations = () => oficios;
export const getOccupation = (id: string | null | undefined) => occupations.find((o) => o.id === id);

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
export const getImage = (id: string | null | undefined): ImageRef | undefined =>
  id && id in IMAGES ? { id: id as ImageId, ...IMAGES[id as ImageId] } : undefined;

export const getRules = () => rules;
