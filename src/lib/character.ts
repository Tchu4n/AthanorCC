export const ANDARILHO = "andarilho";
export const MAX_FAITHS = 3;
// occupationId do ofício criado pelo usuário; nome e descrição ficam em customOccupation.
export const OFICIO_PROPRIO = "personalizado";
// Limites dos textos livres: os campos cortam ao digitar e colar, e o carregamento corta saves antigos maiores.
export const LIMITES_TEXTO = { name: 60, age: 4, shortStory: 2000, personality: 1000, notes: 1000, oficioNome: 60, oficioDescricao: 500 } as const;
// Filtros de digitação: idade só com dígitos; nomes só com letras (acentuadas inclusive), espaço, apóstrofo, hífen e ponto.
export const limpar = {
  idade: (v: string) => v.replace(/\D/g, ""),
  nome: (v: string) => v.replace(/[^\p{L}\p{M} '’.-]|[ªº]/gu, ""), // ª e º contam como letra no Unicode
};
export const SEXOS = ["masculino", "feminino", "incerto"] as const;
export type Sexo = (typeof SEXOS)[number];
export const SEXO_LABEL: Record<Sexo, string> = { masculino: "Masculino", feminino: "Feminino", incerto: "Incerto" };
// Grau de periculosidade marcado na análise da Agência (tela final), que o PDF mostra com um X a pena.
export const PERICULOSIDADES = ["baixo", "moderado", "alto", "extremo"] as const;
export type Periculosidade = (typeof PERICULOSIDADES)[number];
export const PERICULOSIDADE_LABEL: Record<Periculosidade, string> = { baixo: "Baixo", moderado: "Moderado", alto: "Alto", extremo: "Extremo" };
// Assinatura desenhada na conclusão: PNG em data URL, guardado só no navegador.
export const MAX_ASSINATURA = 300_000;

export interface Subregion {
  id: string;
  name: string;
  briefing: string;
  image?: string;
}

export interface Region {
  id: string;
  name: string;
  mainArea?: string;
  subregions: Subregion[];
  briefing: string;
  implications?: string; // "Você no mundo": como a escolha pesa no social e no combate
  image?: string;
  // Com bandeira, ela representa a região na escolha; a imagem continua nas subregiões sem imagem própria.
  bandeira?: string;
  // arte própria do Andarilho/Aventureiro; sem ela, ele usa a imagem da região
  andarilho?: string;
  // região sem a opção Andarilho/Aventureiro (ex.: Irmandade: quem vem de lá serviu num dos fortes)
  semAndarilho?: true;
}

export interface Subspecies {
  id: string;
  name: string;
  briefing: string;
  implications?: string; // "Você no mundo": como a escolha pesa no social e no combate
  image?: string;
}

export interface Species {
  id: string;
  name: string;
  briefing: string;
  implications?: string; // "Você no mundo": como a escolha pesa no social e no combate
  subspecies?: Subspecies[];
  image?: string;
}

export interface Occupation {
  id: string;
  name: string;
  briefing: string;
  implications?: string; // "Você no mundo": como a escolha pesa no social e no combate
  image?: string;
}

export interface Faith {
  id: string;
  name: string;
  briefing: string;
  implications: string;
  image?: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  category: string;
  briefing: string;
  image?: string;
}

// Imagem de referência do catálogo ou enviada pelo usuário (fica só no navegador, como data URL).
export type AppearanceImage =
  | { kind: "catalog"; imageId: string }
  | { kind: "upload"; dataUrl: string; name: string };

export interface Character {
  // subregionId null = região escolhida, subregião ainda não
  origin: { regionId: string; subregionId: string | typeof ANDARILHO | null } | null;
  speciesId: string | null;
  subspeciesId: string | null;
  occupationId: string | null;
  customOccupation: { name: string; description: string };
  faithIds: string[];
  marks: string[];
  appearance: { image: AppearanceImage | null; notes: string };
  identity: { name: string; age: string; shortStory: string; personality: string };
  sexo: Sexo | null;
  periculosidade: Periculosidade | null;
  assinatura: string | null;
  createdAt: string;
}
