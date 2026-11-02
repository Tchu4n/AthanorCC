import { MAX_FAITHS, type ANDARILHO, type Character, type Periculosidade, type Sexo } from "./character";
import { personagemInicial } from "./personagemInicial";

export type CharacterAction =
  | { type: "ESCOLHER_REGIAO"; regionId: string | null }
  | { type: "ESCOLHER_SUBREGIAO"; subregionId: string | typeof ANDARILHO }
  | { type: "ESCOLHER_ESPECIE"; speciesId: string | null }
  | { type: "ESCOLHER_SUBESPECIE"; subspeciesId: string | null }
  | { type: "ESCOLHER_OFICIO"; occupationId: string | null }
  | { type: "DEFINIR_OFICIO_PROPRIO"; customOccupation: Partial<Character["customOccupation"]> }
  | { type: "ALTERNAR_FE"; faithId: string }
  | { type: "DEFINIR_MARCA"; mark: string; on: boolean }
  | { type: "DEFINIR_APARENCIA"; appearance: Partial<Character["appearance"]> }
  | { type: "DEFINIR_IDENTIDADE"; identity: Partial<Character["identity"]> }
  | { type: "DEFINIR_ASSINATURA"; assinatura: string | null }
  | { type: "DEFINIR_SEXO"; sexo: Sexo | null }
  | { type: "DEFINIR_PERICULOSIDADE"; periculosidade: Periculosidade | null }
  | { type: "REINICIAR" };

export function characterReducer(state: Character, action: CharacterAction): Character {
  switch (action.type) {
    case "ESCOLHER_REGIAO":
      return { ...state, origin: action.regionId ? { regionId: action.regionId, subregionId: null } : null };
    case "ESCOLHER_SUBREGIAO":
      if (!state.origin) return state;
      return { ...state, origin: { ...state.origin, subregionId: action.subregionId } };
    case "ESCOLHER_ESPECIE":
      if (action.speciesId === state.speciesId) return state;
      return { ...state, speciesId: action.speciesId, subspeciesId: null };
    case "ESCOLHER_SUBESPECIE":
      return { ...state, subspeciesId: action.subspeciesId };
    case "ESCOLHER_OFICIO":
      return { ...state, occupationId: action.occupationId };
    case "DEFINIR_OFICIO_PROPRIO":
      return { ...state, customOccupation: { ...state.customOccupation, ...action.customOccupation } };
    case "ALTERNAR_FE":
      if (state.faithIds.includes(action.faithId))
        return { ...state, faithIds: state.faithIds.filter((id) => id !== action.faithId) };
      if (state.faithIds.length >= MAX_FAITHS) return state;
      return { ...state, faithIds: [...state.faithIds, action.faithId] };
    case "DEFINIR_MARCA": {
      const rest = state.marks.filter((m) => m !== action.mark);
      return { ...state, marks: action.on ? [...rest, action.mark] : rest };
    }
    case "DEFINIR_APARENCIA":
      return { ...state, appearance: { ...state.appearance, ...action.appearance } };
    case "DEFINIR_IDENTIDADE":
      return { ...state, identity: { ...state.identity, ...action.identity } };
    case "DEFINIR_PERICULOSIDADE":
      return { ...state, periculosidade: action.periculosidade };
    case "DEFINIR_SEXO":
      return { ...state, sexo: action.sexo };
    case "DEFINIR_ASSINATURA":
      return { ...state, assinatura: action.assinatura };
    case "REINICIAR":
      return personagemInicial;
  }
}
