export const ANDARILHO = "andarilho";
export const MAX_FAITHS = 3;

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
  image?: string;
}

export interface Subspecies {
  id: string;
  name: string;
  briefing: string;
  image?: string;
}

export interface Species {
  id: string;
  name: string;
  briefing: string;
  subspecies?: Subspecies[];
  image?: string;
}

export interface Occupation {
  id: string;
  name: string;
  briefing: string;
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

export interface Character {
  // subregionId null = região escolhida, subregião ainda não
  origin: { regionId: string; subregionId: string | typeof ANDARILHO | null } | null;
  speciesId: string | null;
  subspeciesId: string | null;
  occupationId: string | null;
  faithIds: string[];
  marks: string[];
  appearance: { imageId: string | null; notes: string };
  identity: { name: string; age: string; shortStory: string; personality: string };
  createdAt: string;
}
