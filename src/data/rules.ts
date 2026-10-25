import type { Character } from "../lib/character.ts";
import type { Source } from "./types.ts";

export type RuleEffect = "BLOCK" | "WARN" | "REQUIRE";
export type RuleTarget = { kind: "occupation" | "mark"; id: string };

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
const GAIOLA = "gaiola-de-bateria";
const ORIGEM_GAIOLA = ["reino-de-laguardia", "uniao-das-provincias"];

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
    id: "R04",
    descricao: "Vampiros não usam bateria externa.",
    quando: { species: ["vampiros"] },
    efeito: "BLOCK",
    alvo: { kind: "mark", id: GAIOLA },
    mensagem: "Vampiros conjuram queimando a própria energia vital e dispensam baterias.",
    source: ["Vampiros de Athanor_ Regras e Fisiologia.docx"],
  }),
  rule({
    id: "R05",
    descricao: "Mago ortodoxo de Laguardia ou da UP carrega a gaiola de bateria.",
    quando: { occupation: [MAGO], region: ORIGEM_GAIOLA, notSpecies: ["homens-do-deserto", "vampiros"], notFaith: ["nilos"] },
    efeito: "REQUIRE",
    alvo: { kind: "mark", id: GAIOLA },
    mensagem: "Magos ortodoxos de Laguardia e da UP usam a gaiola de bateria.",
    source: ["decisão do usuário"],
  }),
  rule({
    id: "R05b",
    descricao: "Para seguidores de Nilos, a gaiola de R05 é opcional.",
    quando: { occupation: [MAGO], region: ORIGEM_GAIOLA, notSpecies: ["homens-do-deserto", "vampiros"], faith: ["nilos"] },
    efeito: "WARN",
    alvo: { kind: "mark", id: GAIOLA },
    mensagem: "Seguidores de Nilos não dependem da gaiola, mas podem usá-la como disfarce de mago ortodoxo.",
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
];

// Casos sem regra definida: registrados, nada é bloqueado.
export const pendencias: string[] = [
  "Humanos que não são da elite e escolhem mago ortodoxo com origem na UP (só a elite tem magia na UP): sem regra confirmada.",
  "Marca Terceiro Olho para personagens de outra subespécie que não Terceiro Olho de Man'naka oko: sem regra confirmada.",
  "Marca Mutação da Irmandade para personagens que não são mutantes da Irmandade de São Ferdinand: sem regra confirmada.",
  "Gaiola de bateria para magos ortodoxos de outras origens: opcional, sem regra.",
  "Centauros seguidores de Nilos ou outras vertentes de magia anômala: sem regra confirmada.",
  "Homens do Deserto: o texto não define restrição de ofício.",
];
