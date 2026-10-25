import type { Dispatch } from "react";
import type { Character } from "@/lib/character";
import type { CharacterAction } from "@/lib/reducer";

export type StepProps = { character: Character; dispatch: Dispatch<CharacterAction> };
