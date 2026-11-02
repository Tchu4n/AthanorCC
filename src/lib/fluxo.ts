import { getSubspecies } from "./catalogo";
import { MAX_FAITHS, OFICIO_PROPRIO, type Character } from "./character";

export type StepId =
  | "especie" | "subespecie" | "origem" | "oficio" | "fe" | "aparencia" | "identidade" | "revisao";

// A ordem das chaves é a ordem do fluxo: quem o personagem é vem antes de onde ele nasceu.
export const STEP_LABELS: Record<StepId, string> = {
  especie: "Espécie",
  subespecie: "Subespécie",
  origem: "Origem",
  oficio: "Ofício",
  fe: "Fé",
  aparencia: "Aparência",
  identidade: "Identidade",
  revisao: "Revisão",
};

export const ALL_STEPS = Object.keys(STEP_LABELS) as [StepId, ...StepId[]];

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
    case "oficio":
      return c.occupationId !== OFICIO_PROPRIO || c.customOccupation.name.trim() !== "";
    case "subespecie":
      return !!c.subspeciesId;
    case "identidade":
      return c.identity.name.trim() !== "" && c.sexo !== null;
    default:
      return true;
  }
}

export const isFaithDisabled = (c: Character, faithId: string) =>
  !c.faithIds.includes(faithId) && c.faithIds.length >= MAX_FAITHS;
