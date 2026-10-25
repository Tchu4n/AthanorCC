import { useCallback, useEffect, useReducer, useRef, type Dispatch } from "react";
import type { Character } from "./character";
import { getVisibleSteps, type StepId } from "./flow";
import { initialCharacter } from "./initialCharacter";
import type { CharacterAction } from "./reducer";
import { applyRules, reducerWithRules } from "./rules-engine";
import { clear, load, save, type LoadResult, type Saved } from "./storage";

export type StorageNotice = "discarded" | "unavailable" | null;

const SAVE_DELAY_MS = 300;

export type PersistentState = { ready: boolean; character: Character; step: StepId; storageNotice: StorageNotice };

// Ações internas do hook (carga, etapa, falha de armazenamento). Não fazem parte de lib/reducer.ts.
type HookAction =
  | CharacterAction
  | { type: "HYDRATE"; result: LoadResult }
  | { type: "SET_STEP"; step: StepId }
  | { type: "STORAGE_FAILED" };

export const initialPersistentState: PersistentState = {
  ready: false,
  character: initialCharacter,
  step: "origem",
  storageNotice: null,
};

export function persistentReducer(state: PersistentState, action: HookAction, now = () => new Date().toISOString()): PersistentState {
  switch (action.type) {
    case "HYDRATE": {
      const { result } = action;
      if (result.status !== "ok") {
        const storageNotice = result.status === "invalid" ? "discarded" : result.status === "unavailable" ? "unavailable" : null;
        return { ...state, ready: true, storageNotice };
      }
      const character = applyRules(result.data.character).character;
      const step = getVisibleSteps(character).includes(result.data.step) ? result.data.step : "origem";
      return { ...state, ready: true, character, step };
    }
    case "SET_STEP":
      return { ...state, step: action.step };
    case "STORAGE_FAILED":
      return { ...state, storageNotice: "unavailable" };
    case "RESET":
      return { ...state, character: initialCharacter, step: "origem" };
    default: {
      const next = reducerWithRules(state.character, action);
      if (next === state.character) return state;
      // createdAt nasce na primeira ação que muda o personagem, não antes
      return { ...state, character: next.createdAt ? next : { ...next, createdAt: now() } };
    }
  }
}

export function usePersistentCharacter() {
  const [state, dispatch] = useReducer(
    (s: PersistentState, a: HookAction) => persistentReducer(s, a),
    initialPersistentState,
  );
  const { ready, character, step } = state;
  const pending = useRef<Saved | null>(null);

  // Lê o localStorage só no cliente, depois da hidratação, para o HTML do servidor e do cliente serem iguais.
  useEffect(() => dispatch({ type: "HYDRATE", result: load() }), []);

  useEffect(() => {
    if (!ready) return;
    // estado inicial intocado (abertura ou Recomeçar) não precisa ser salvo
    if (character === initialCharacter && step === "origem") {
      pending.current = null;
      return;
    }
    pending.current = { character, step };
    const timer = setTimeout(() => {
      if (pending.current && !save(pending.current)) dispatch({ type: "STORAGE_FAILED" });
      pending.current = null;
    }, SAVE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [character, step, ready]);

  // Fechar ou recarregar a aba antes do debounce não perde a última mudança.
  useEffect(() => {
    const flush = () => {
      if (pending.current) save(pending.current);
    };
    window.addEventListener("pagehide", flush);
    return () => window.removeEventListener("pagehide", flush);
  }, []);

  const setStep = useCallback((next: StepId) => dispatch({ type: "SET_STEP", step: next }), []);
  const reset = useCallback(() => {
    pending.current = null;
    clear();
    dispatch({ type: "RESET" });
  }, []);

  return {
    ...state,
    dispatch: dispatch as Dispatch<CharacterAction>,
    setStep,
    reset,
  };
}
