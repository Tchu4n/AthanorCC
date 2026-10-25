// Conteúdo da ficha a partir do Character e do catálogo. Usado pela prévia e pelo PDF, na mesma ordem.
import {
  ANDARILHO_LABEL,
  getFaith,
  getImage,
  getMark,
  getOccupation,
  getRegion,
  getSpecies,
  getSubregion,
  getSubspecies,
  isPending,
  type ImageRef,
} from "./catalog";
import { ANDARILHO, type Character } from "./character";

export const VAZIO = "—";

export type Ficha = {
  nome: string;
  idade: string;
  origem: string;
  especie: string;
  oficio: string;
  fes: { nome: string; implicacoes: string }[];
  marcas: { nome: string; descricao: string }[];
  aparencia: { imagem: ImageRef | null; notas: string };
  historia: string;
  personalidade: string;
};

const valor = (v: string | undefined | null) => v?.trim() || VAZIO;
// [[Termo]] vira só "Termo"; texto em definição aparece como na interface.
const texto = (t: string) => (isPending(t) ? "Em definição." : t.replace(/\[\[([^\]]+)\]\]/g, "$1"));

export function montarFicha(c: Character): Ficha {
  const region = getRegion(c.origin?.regionId);
  const subId = c.origin?.subregionId;
  const sub = subId === ANDARILHO ? ANDARILHO_LABEL : region && subId ? getSubregion(region.id, subId)?.name : undefined;
  const species = getSpecies(c.speciesId);
  const subspecies = getSubspecies(c.speciesId).find((s) => s.id === c.subspeciesId);

  return {
    nome: valor(c.identity.name),
    idade: valor(c.identity.age),
    origem: valor([region?.name, sub].filter(Boolean).join(", ")),
    especie: valor(species && (subspecies ? `${species.name} (${subspecies.name})` : species.name)),
    oficio: valor(getOccupation(c.occupationId)?.name),
    fes: c.faithIds.flatMap((id) => {
      const f = getFaith(id);
      return f ? [{ nome: f.name, implicacoes: texto(f.implications) }] : [];
    }),
    // marcas sem descricao (prós e contras) mostram o briefing
    marcas: c.marks.flatMap((id) => {
      const m = getMark(id);
      return m ? [{ nome: m.name, descricao: texto(m.descricao ?? m.briefing) }] : [];
    }),
    aparencia: { imagem: getImage(c.appearance.imageId) ?? null, notas: valor(c.appearance.notes) },
    historia: valor(c.identity.shortStory),
    personalidade: valor(c.identity.personality),
  };
}

// "Isabela de Souça" -> "ficha-isabela-de-souca.pdf"
export function nomeArquivoFicha(c: Character): string {
  const slug = c.identity.name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `ficha-${slug || "personagem"}.pdf`;
}
