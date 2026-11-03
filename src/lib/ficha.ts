// Conteúdo da ficha a partir do Character e do catálogo. Usado pela prévia e pelo PDF, na mesma ordem.
import {
  ANDARILHO_LABEL,
  getFaith,
  getImage,
  getMark,
  textoDoOficio,
  getRegion,
  getSpecies,
  getSubregion,
  getSubspecies,
  isPending,
} from "./catalogo";
import {
  APURACAO_ANDARILHO,
  APURACAO_ESPECIE,
  APURACAO_OFICIO,
  APURACAO_OFICIO_PROPRIO,
  APURACAO_ORIGEM,
  APURACAO_SEM_OFICIO,
  APURACAO_SUBESPECIE,
  APURACAO_SUBREGIAO,
} from "../data/apuracao";
import { APURACAO_CRUZAMENTO, APURACAO_FE, APURACAO_MARCA } from "../data/apuracao-cruzamentos";
import { ANDARILHO, OFICIO_PROPRIO, SEXO_LABEL, type AppearanceImage, type Character, type Periculosidade, type Sexo } from "./character";
import { isValidImageDataUrl } from "./envio-imagem";

export const VAZIO = "—";

export type ImagemFicha = { src: string; displayName: string };

// Imagem do catálogo ou enviada; se não existir ou não puder ser lida, a ficha mostra "—".
export function imagemDoPersonagem(img: AppearanceImage | null): ImagemFicha | null {
  if (!img) return null;
  if (img.kind === "catalog") {
    const ref = getImage(img.imageId);
    return ref ? { src: ref.src, displayName: ref.displayName } : null;
  }
  // o nome do arquivo enviado nunca aparece (pode ser pessoal): a foto é sempre "Imagem enviada"
  return isValidImageDataUrl(img.dataUrl) ? { src: img.dataUrl, displayName: "Imagem enviada" } : null;
}

export type Ficha = {
  nome: string;
  idade: string;
  sexo: string;
  // valores crus, para o PDF marcar com X a opção escolhida
  marcados: { sexo: Sexo | null; periculosidade: Periculosidade | null };
  origem: string;
  especie: string;
  oficio: string;
  fes: { nome: string; implicacoes: string }[];
  marcas: { nome: string; descricao: string }[];
  aparencia: { imagem: ImagemFicha | null; notas: string };
  historia: string;
  personalidade: string;
  dossie: string; // "HB-0427"
  lavradoEm: string; // "1 de novembro de 2026"
  assinatura: string | null;
  apuracao: { especie: string; origem: string; oficio: string }; // texto da Agência sob medida, um parágrafo cada
};

// Textos da apuração marcam as palavras que mudam com o sexo como {masculino|feminino}. Sem sexo ou incerto,
// vale o masculino genérico, que concorda com "o indivíduo".
export const flexiona = (texto: string, sexo: Sexo | null) =>
  texto.replace(/\{([^|}]*)\|([^}]*)\}/g, (_, m: string, f: string) => (sexo === "feminino" ? f : m));

// Apuração da Agência: espécie (com a subespécie), origem (com a subregião ou o andarilho) e ofício.
export function apuracaoDe(c: Character): Ficha["apuracao"] {
  const junta = (...partes: (string | false | null | undefined)[]) => flexiona(partes.filter(Boolean).join(" "), c.sexo);
  const especie = junta(c.speciesId && APURACAO_ESPECIE[c.speciesId], c.subspeciesId && APURACAO_SUBESPECIE[c.subspeciesId]);
  const sub = c.origin?.subregionId;
  const cruzamento = (escolha: string | null) => (escolha && c.origin ? APURACAO_CRUZAMENTO[`${escolha}|${c.origin.regionId}`] : undefined);
  const origem = junta(
    c.origin && APURACAO_ORIGEM[c.origin.regionId],
    sub === ANDARILHO ? APURACAO_ANDARILHO : sub && APURACAO_SUBREGIAO[sub],
    cruzamento(c.subspeciesId ?? c.speciesId),
  );
  const oficio =
    c.occupationId === OFICIO_PROPRIO
      ? APURACAO_OFICIO_PROPRIO.replace("{oficio}", c.customOccupation.name.trim().toLowerCase() || "não informado")
      : (c.occupationId && APURACAO_OFICIO[c.occupationId]) || APURACAO_SEM_OFICIO;
  return { especie, origem, oficio: junta(oficio, cruzamento(c.occupationId)) };
}

// Número do dossiê do relatório de Highbridge: estável para o mesmo personagem (criação + nome), 4 dígitos.
export function numeroDoDossie(c: Character): string {
  let h = 7;
  for (const ch of `${c.createdAt}|${c.identity.name}`) h = (h * 31 + ch.codePointAt(0)!) % 9973;
  return `HB-${String(h).padStart(4, "0")}`;
}

// Sem data de criação (personagem nunca alterado), vale a data de hoje.
const porExtenso = (iso: string) => {
  const d = iso ? new Date(iso) : new Date();
  return (Number.isNaN(d.getTime()) ? new Date() : d).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });
};

const valor = (v: string | undefined | null) => v?.trim() || VAZIO;
// [[Termo]] vira só "Termo"; texto em definição aparece como na interface.
export const texto = (t: string) => (isPending(t) ? "Em definição." : t.replace(/\[\[([^\]]+)\]\]/g, "$1"));

export function montarFicha(c: Character): Ficha {
  const region = getRegion(c.origin?.regionId);
  const subId = c.origin?.subregionId;
  const sub = subId === ANDARILHO ? ANDARILHO_LABEL : region && subId ? getSubregion(region.id, subId)?.name : undefined;
  const species = getSpecies(c.speciesId);
  const subspecies = getSubspecies(c.speciesId).find((s) => s.id === c.subspeciesId);

  return {
    nome: valor(c.identity.name),
    idade: c.identity.age.trim() ? `${c.identity.age.trim()} anos` : VAZIO,
    sexo: c.sexo ? SEXO_LABEL[c.sexo] : VAZIO,
    marcados: { sexo: c.sexo, periculosidade: c.periculosidade },
    origem: valor([region?.name, sub].filter(Boolean).join(", ")),
    especie: valor(species && (subspecies ? `${species.name} (${subspecies.name})` : species.name)),
    oficio: valor(textoDoOficio(c)),
    fes: c.faithIds.flatMap((id) => {
      const f = getFaith(id);
      const cruz = c.origin && APURACAO_CRUZAMENTO[`${id}|${c.origin.regionId}`];
      return f ? [{ nome: f.name, implicacoes: flexiona([APURACAO_FE[id] ?? texto(f.implications), cruz].filter(Boolean).join(" "), c.sexo) }] : [];
    }),
    // marcas sem descricao (prós e contras) mostram o briefing
    marcas: c.marks.flatMap((id) => {
      const m = getMark(id);
      return m ? [{ nome: m.name, descricao: flexiona(APURACAO_MARCA[id] ?? texto(m.descricao ?? m.briefing), c.sexo) }] : [];
    }),
    aparencia: { imagem: imagemDoPersonagem(c.appearance.image), notas: valor(c.appearance.notes) },
    historia: valor(c.identity.shortStory),
    personalidade: valor(c.identity.personality),
    dossie: numeroDoDossie(c),
    lavradoEm: porExtenso(c.createdAt),
    assinatura: c.assinatura,
    apuracao: apuracaoDe(c),
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
