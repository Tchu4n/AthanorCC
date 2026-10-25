import type {
  Faith,
  GlossaryTerm,
  Occupation,
  Region,
  Species,
  Subregion,
  Subspecies,
} from "../lib/character.ts";

export const A_DEFINIR = "A_DEFINIR";

export const SOURCES = [
  "A Seita do Deus Oculto (Os Dedutivos).docx",
  "A noite maldita.docx",
  "A origem do deserto de Marranol.docx",
  "A terra de Man_naka oko.docx",
  "COMPÊNDIO DE APARÊNCIA E BIOLOGIA — ATHANOR.docx",
  "Contexto basico de faccoes.docx",
  "Minor Powers.docx",
  "O Sistema de Magia e a Engenharia dos Cajados em Athanor.docx",
  "Os Bardos de Athanor.docx",
  "Os centauros.docx",
  "Os homens do deserto.docx",
  "Panteao.docx",
  "Raça_ Homens-Galho.docx",
  "Regras Globais do Cenário.docx",
  "Subregioes.docx",
  "União das Províncias (UP).docx",
  "Vampiros de Athanor_ Regras e Fisiologia.docx",
  "decisão do usuário",
  "imagens conceituais (mago ortodoxo de Laguardia e soldado regular da UP)",
] as const;
export type Source = (typeof SOURCES)[number];

type Sourced = { source: Source[] };

// Briefings marcam termos do lore como [[Termo]]; scripts/validate-data.ts exige que existam no glossário.
export type SubregionData = Subregion & { source?: Source[] }; // sem source, herda o da região
export type RegionData = Omit<Region, "subregions"> &
  Sourced & { subregions: SubregionData[]; pendencias: string[] };
export type SubspeciesData = Subspecies & Sourced;
export type SpeciesData = Omit<Species, "subspecies"> & Sourced & { subspecies?: SubspeciesData[] };
export type OccupationData = Occupation & Sourced;
export type FaithData = Faith & Sourced;
export type GlossaryData = GlossaryTerm & Sourced & { aliases?: string[] };
