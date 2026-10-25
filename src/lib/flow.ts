import { getSubspecies } from "./catalog";
import { MAX_FAITHS, type Character } from "./character";

export type StepId =
  | "origem" | "especie" | "subespecie" | "oficio" | "fe" | "marcas" | "aparencia" | "identidade" | "revisao";

export const STEP_LABELS: Record<StepId, string> = {
  origem: "Origem",
  especie: "Espécie",
  subespecie: "Subespécie",
  oficio: "Ofício",
  fe: "Fé",
  marcas: "Marcas",
  aparencia: "Aparência",
  identidade: "Identidade",
  revisao: "Revisão",
};

const ALL_STEPS = Object.keys(STEP_LABELS) as StepId[];

export function getVisibleSteps(character: Character): StepId[] {
  const hasSubspecies = getSubspecies(character.speciesId).length > 0;
  return ALL_STEPS.filter((s) => s !== "subespecie" || hasSubspecies);
}

export function canAdvance(step: StepId, c: Character): boolean {
  switch (step) {
    case "origem":
      return !!c.origin?.subregionId;
    case "especie":
      return !!c.speciesId;
    case "subespecie":
      return !!c.subspeciesId;
    case "identidade":
      return c.identity.name.trim() !== "";
    default:
      return true;
  }
}

export const isFaithDisabled = (c: Character, faithId: string) =>
  !c.faithIds.includes(faithId) && c.faithIds.length >= MAX_FAITHS;
