import type { Character } from "../lib/character.ts";
import { regions } from "./regions.ts";
import { species } from "./species.ts";
import type { Source } from "./types.ts";

export type RuleEffect = "BLOCK" | "WARN" | "REQUIRE";
export type RuleTargetKind = "occupation" | "mark" | "faith" | "species" | "region";
// Alvo único (id) ou todas as opções do tipo, menos as listadas (except).
export type RuleTarget = { kind: RuleTargetKind; id: string } | { kind: RuleTargetKind; except: string[] };

// Condições declarativas: todos os critérios presentes precisam valer (E lógico).
// Declarar em vez de escrever a função à mão permite ao validate:data conferir cada id citado.
export type RuleWhen = {
  species?: string[];
  notSpecies?: string[];
  subspecies?: string[];
  occupation?: string[];
  region?: string[];
  faith?: string[];
  notFaith?: string[];
};

export type Rule = {
  id: string;
  descricao: string;
  quando: RuleWhen;
  condicao: (c: Character) => boolean;
  efeito: RuleEffect;
  alvo: RuleTarget;
  mensagem: string;
  source: Source[];
};

const has = (list: string[] | undefined, value: string | null | undefined) => !list || (!!value && list.includes(value));

function when(q: RuleWhen): (c: Character) => boolean {
  return (c) =>
    has(q.species, c.speciesId) &&
    !(q.notSpecies && c.speciesId && q.notSpecies.includes(c.speciesId)) &&
    has(q.subspecies, c.subspeciesId) &&
    has(q.occupation, c.occupationId) &&
    has(q.region, c.origin?.regionId) &&
    (!q.faith || c.faithIds.some((f) => q.faith!.includes(f))) &&
    !(q.notFaith && c.faithIds.some((f) => q.notFaith!.includes(f)));
}

const rule = (r: Omit<Rule, "condicao">): Rule => ({ ...r, condicao: when(r.quando) });

const MAGO = "mago-ortodoxo";
const MUTANTE = "mutante-sao-ferdinand";
// Listas positivas em vez de notSpecies: sem espécie (ou origem) escolhida, a marca não fica bloqueada.
const NAO_HUMANOS = species.map((s) => s.id).filter((id) => id !== "humano");
const NAO_MUTANTES = species.flatMap((s) => s.subspecies ?? []).map((s) => s.id).filter((id) => id !== MUTANTE);
const SO_MUTANTES = "Exclusiva dos Humanos da Irmandade de São Ferdinand.";
const COMUM = "humano-comum";
const NAO_HUMANOS_COMUNS = species.flatMap((s) => s.subspecies ?? []).map((s) => s.id).filter((id) => id !== COMUM);
const SO_HUMANOS_COMUNS = "Exclusivo de Humanos comuns.";
const NAO_MANNAKA = regions.map((r) => r.id).filter((id) => id !== "mannaka-oko");
// A espécie vem antes da origem: nas nações Homens-Galho, a região é que fica indisponível para as outras espécies.
const NAO_HOMENS_GALHO = species.map((s) => s.id).filter((id) => id !== "homens-galho");
const SO_HOMENS_GALHO = "Nas nações Homens-Galho, apenas Homens-Galho podem ser escolhidos.";

export const rules: Rule[] = [
  rule({
    id: "R01",
    descricao: "Trabalhadores Homens-Galho não têm acesso à magia.",
    quando: { species: ["homens-galho"], subspecies: ["trabalhador"] },
    efeito: "BLOCK",
    alvo: { kind: "occupation", id: MAGO },
    mensagem: "Entre os Homens-Galho, só príncipes e a rainha têm acesso à magia.",
    source: ["Raça_ Homens-Galho.docx"],
  }),
  rule({
    id: "R02",
    descricao: "Princesas Homens-Galho não têm acesso à magia.",
    quando: { species: ["homens-galho"], subspecies: ["princesa"] },
    efeito: "BLOCK",
    alvo: { kind: "occupation", id: MAGO },
    mensagem: "Entre os Homens-Galho, só príncipes e a rainha têm acesso à magia.",
    source: ["Raça_ Homens-Galho.docx"],
  }),
  rule({
    id: "R03",
    descricao: "Centauros rejeitam a magia ortodoxa.",
    quando: { species: ["centauros"] },
    efeito: "BLOCK",
    alvo: { kind: "occupation", id: MAGO },
    mensagem: "Centauros abominam a magia e o dreno vital, que consideram trapaça e desonra; o caminho do bardo continua aberto.",
    source: ["Os centauros.docx", "Os Bardos de Athanor.docx"],
  }),
  rule({
    id: "R03c",
    descricao: "Centauros também rejeitam a magia dissidente.",
    quando: { species: ["centauros"] },
    efeito: "BLOCK",
    alvo: { kind: "occupation", id: "mago-dissidente" },
    mensagem: "Centauros abominam a magia e o dreno vital, que consideram trapaça e desonra, inclusive a dos dissidentes.",
    source: ["Os centauros.docx", "decisão do usuário"],
  }),
  rule({
    id: "R03b",
    descricao: "Centauros não podem seguir Nilos.",
    quando: { species: ["centauros"] },
    efeito: "BLOCK",
    alvo: { kind: "faith", id: "nilos" },
    mensagem: "Centauros não podem seguir Nilos.",
    source: ["decisão do usuário"],
  }),
  rule({
    id: "R06",
    descricao: "Vampiros precisam de aterramento ao conjurar.",
    quando: { species: ["vampiros"], occupation: [MAGO] },
    efeito: "WARN",
    alvo: { kind: "occupation", id: MAGO },
    mensagem: "Mesmo sem bateria, o vampiro precisa se aterrar de alguma forma para conjurar.",
    source: ["Vampiros de Athanor_ Regras e Fisiologia.docx"],
  }),
  rule({
    id: "R07",
    descricao: "Kruk só aceita Homens-Galho.",
    quando: { species: NAO_HOMENS_GALHO },
    efeito: "BLOCK",
    alvo: { kind: "region", id: "reino-de-kruk" },
    mensagem: SO_HOMENS_GALHO,
    source: ["decisão do usuário"],
  }),
  rule({
    id: "R07b",
    descricao: "Crick só aceita Homens-Galho.",
    quando: { species: NAO_HOMENS_GALHO },
    efeito: "BLOCK",
    alvo: { kind: "region", id: "reino-de-crick" },
    mensagem: SO_HOMENS_GALHO,
    source: ["decisão do usuário"],
  }),
  rule({
    id: "R08",
    descricao: "O Terceiro Olho é exclusivo de quem tem origem em Man'naka oko.",
    quando: { region: NAO_MANNAKA },
    efeito: "BLOCK",
    alvo: { kind: "mark", id: "terceiro-olho" },
    mensagem: "Exclusivo de personagens com origem em Man'naka oko.",
    source: ["A terra de Man_naka oko.docx", "decisão do usuário"],
  }),
  // Espécie e subespécie vêm antes da origem; humano ainda sem subespécie (null) não fica bloqueado.
  rule({
    id: "R08b",
    descricao: "O Terceiro Olho é exclusivo de Humanos comuns: as outras espécies não o têm.",
    quando: { species: NAO_HUMANOS },
    efeito: "BLOCK",
    alvo: { kind: "mark", id: "terceiro-olho" },
    mensagem: SO_HUMANOS_COMUNS,
    source: ["decisão do usuário"],
  }),
  rule({
    id: "R08c",
    descricao: "O Terceiro Olho é exclusivo de Humanos comuns: nem a elite de orelhas pontudas nem os mutantes da Irmandade o têm.",
    quando: { subspecies: NAO_HUMANOS_COMUNS },
    efeito: "BLOCK",
    alvo: { kind: "mark", id: "terceiro-olho" },
    mensagem: SO_HUMANOS_COMUNS,
    source: ["decisão do usuário"],
  }),
  rule({
    id: "R09",
    descricao: "Só os Humanos da Irmandade de São Ferdinand têm a Mutação da Irmandade.",
    quando: { species: NAO_HUMANOS },
    efeito: "BLOCK",
    alvo: { kind: "mark", id: "mutacao-da-irmandade" },
    mensagem: SO_MUTANTES,
    source: ["decisão do usuário"],
  }),
  rule({
    id: "R09b",
    descricao: "Humanos fora da Irmandade de São Ferdinand não têm a Mutação da Irmandade.",
    quando: { subspecies: NAO_MUTANTES },
    efeito: "BLOCK",
    alvo: { kind: "mark", id: "mutacao-da-irmandade" },
    mensagem: SO_MUTANTES,
    source: ["decisão do usuário"],
  }),
  rule({
    id: "R09c",
    descricao: "Todo Humano da Irmandade de São Ferdinand tem a Mutação da Irmandade.",
    quando: { subspecies: [MUTANTE] },
    efeito: "REQUIRE",
    alvo: { kind: "mark", id: "mutacao-da-irmandade" },
    mensagem: "Todo Humano da Irmandade de São Ferdinand carrega a Mutação da Irmandade.",
    source: ["Contexto basico de faccoes.docx", "decisão do usuário"],
  }),
  rule({
    id: "R09d",
    descricao: "O Humano da Irmandade de São Ferdinand tem origem na própria Irmandade.",
    quando: { subspecies: [MUTANTE] },
    efeito: "BLOCK",
    alvo: { kind: "region", except: ["irmandade-de-sao-ferdinand"] },
    mensagem: "O Mutante da Irmandade vem das terras da Irmandade de São Ferdinand.",
    source: ["decisão do usuário"],
  }),
];

// Casos sem regra definida: registrados, nada é bloqueado.
// Decididos sem regra: Homens do Deserto não têm restrição de ofício.
export const pendencias: string[] = [
  "Centauros e outras vertentes de magia anômala além de Nilos (ex.: Ocultismo Ancestral): sem regra confirmada.",
];
