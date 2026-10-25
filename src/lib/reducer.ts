import { MAX_FAITHS, type ANDARILHO, type Character } from "./character";
import { initialCharacter } from "./initialCharacter";

export type CharacterAction =
  | { type: "SELECT_REGION"; regionId: string }
  | { type: "SELECT_SUBREGION"; subregionId: string | typeof ANDARILHO }
  | { type: "SELECT_SPECIES"; speciesId: string | null }
  | { type: "SELECT_SUBSPECIES"; subspeciesId: string | null }
  | { type: "SELECT_OCCUPATION"; occupationId: string | null }
  | { type: "TOGGLE_FAITH"; faithId: string }
  | { type: "SET_MARK"; mark: string; on: boolean }
  | { type: "SET_APPEARANCE"; appearance: Partial<Character["appearance"]> }
  | { type: "SET_IDENTITY"; identity: Partial<Character["identity"]> }
  | { type: "RESET" };

export function characterReducer(state: Character, action: CharacterAction): Character {
  switch (action.type) {
    case "SELECT_REGION":
      return { ...state, origin: { regionId: action.regionId, subregionId: null } };
    case "SELECT_SUBREGION":
      if (!state.origin) return state;
      return { ...state, origin: { ...state.origin, subregionId: action.subregionId } };
    case "SELECT_SPECIES":
      if (action.speciesId === state.speciesId) return state;
      return { ...state, speciesId: action.speciesId, subspeciesId: null };
    case "SELECT_SUBSPECIES":
      return { ...state, subspeciesId: action.subspeciesId };
    case "SELECT_OCCUPATION":
      return { ...state, occupationId: action.occupationId };
    case "TOGGLE_FAITH":
      if (state.faithIds.includes(action.faithId))
        return { ...state, faithIds: state.faithIds.filter((id) => id !== action.faithId) };
      if (state.faithIds.length >= MAX_FAITHS) return state;
      return { ...state, faithIds: [...state.faithIds, action.faithId] };
    case "SET_MARK": {
      const rest = state.marks.filter((m) => m !== action.mark);
      return { ...state, marks: action.on ? [...rest, action.mark] : rest };
    }
    case "SET_APPEARANCE":
      return { ...state, appearance: { ...state.appearance, ...action.appearance } };
    case "SET_IDENTITY":
      return { ...state, identity: { ...state.identity, ...action.identity } };
    case "RESET":
      return initialCharacter;
  }
}
