import type { Dispatch } from "react";
import type { Character } from "@/lib/character";
import type { CharacterAction } from "@/lib/reducer";

export type FaseOrigem = "regiao" | "subregiao";
// faseOrigem: só a Origem usa; a página decide quando passar das regiões para as subregiões.
export type StepProps = { character: Character; dispatch: Dispatch<CharacterAction>; faseOrigem?: FaseOrigem };
