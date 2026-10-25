import type { Character } from "../lib/character.ts";
import { species } from "./species.ts";
import type { Source } from "./types.ts";

export type RuleEffect = "BLOCK" | "WARN" | "REQUIRE";
export type RuleTargetKind = "occupation" | "mark" | "faith" | "species";
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
  notMarks?: string[];
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
    !(q.notFaith && c.faithIds.some((f) => q.notFaith!.includes(f))) &&
    !(q.notMarks && c.marks.some((m) => q.notMarks!.includes(m)));
}

const rule = (r: Omit<Rule, "condicao">): Rule => ({ ...r, condicao: when(r.quando) });

const MAGO = "mago-ortodoxo";
const GAIOLA = "gaiola-de-bateria";
// Lista positiva em vez de notSpecies: sem espécie escolhida, a marca não fica bloqueada.
const NAO_HUMANOS = species.map((s) => s.id).filter((id) => id !== "humano");
const SO_HUMANOS = "Disponível apenas para humanos e suas subdivisões.";

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
    id: "R03b",
    descricao: "Centauros não podem seguir Nilos.",
    quando: { species: ["centauros"] },
    efeito: "BLOCK",
    alvo: { kind: "faith", id: "nilos" },
    mensagem: "Centauros não podem seguir Nilos.",
    source: ["decisão do usuário"],
  }),
  rule({
    id: "R04",
    descricao: "Vampiros não precisam de bateria externa; a gaiola é opcional, como disfarce.",
    quando: { species: ["vampiros"] },
    efeito: "WARN",
    alvo: { kind: "mark", id: GAIOLA },
    mensagem: "Vampiros conjuram queimando a própria energia vital e dispensam baterias, mas podem usar a gaiola como disfarce.",
    source: ["Vampiros de Athanor_ Regras e Fisiologia.docx", "decisão do usuário"],
  }),
  rule({
    id: "R05",
    descricao: "Mago ortodoxo sem gaiola precisa de outra forma de bateria.",
    quando: { occupation: [MAGO], notSpecies: ["homens-do-deserto", "vampiros"], notMarks: [GAIOLA] },
    efeito: "WARN",
    alvo: { kind: "mark", id: GAIOLA },
    mensagem:
      "Magos ortodoxos precisam de alguma forma de bateria. Se não usar a gaiola, descreva a sua forma de bateria na história curta ou na personalidade.",
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
    descricao: "Nas nações Homens-Galho, só Homens-Galho podem ser escolhidos.",
    quando: { region: ["reino-de-kruk", "reino-de-crick"] },
    efeito: "BLOCK",
    alvo: { kind: "species", except: ["homens-galho"] },
    mensagem: "Nas nações Homens-Galho, apenas Homens-Galho podem ser escolhidos.",
    source: ["decisão do usuário"],
  }),
  rule({
    id: "R08",
    descricao: "Só Humanos (e suas subespécies) podem ter o Terceiro Olho.",
    quando: { species: NAO_HUMANOS },
    efeito: "BLOCK",
    alvo: { kind: "mark", id: "terceiro-olho" },
    mensagem: SO_HUMANOS,
    source: ["decisão do usuário"],
  }),
  rule({
    id: "R09",
    descricao: "Só Humanos (e suas subespécies) podem ter a Mutação da Irmandade.",
    quando: { species: NAO_HUMANOS },
    efeito: "BLOCK",
    alvo: { kind: "mark", id: "mutacao-da-irmandade" },
    mensagem: SO_HUMANOS,
    source: ["decisão do usuário"],
  }),
  rule({
    id: "R10",
    descricao: "Centauros nunca usam a gaiola de bateria.",
    quando: { species: ["centauros"] },
    efeito: "BLOCK",
    alvo: { kind: "mark", id: GAIOLA },
    mensagem: "Centauros nunca usam a gaiola de bateria.",
    source: ["decisão do usuário"],
  }),
];

// Casos sem regra definida: registrados, nada é bloqueado.
// Decididos sem regra: Homens do Deserto não têm restrição de ofício.
export const pendencias: string[] = [
  "Centauros e outras vertentes de magia anômala além de Nilos (ex.: Ocultismo Ancestral): sem regra confirmada.",
];
