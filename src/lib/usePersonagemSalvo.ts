import { useCallback, useEffect, useReducer, useRef, type Dispatch } from "react";
import type { Character } from "./character";
import { ALL_STEPS, canAdvance, getVisibleSteps, type StepId } from "./fluxo";
import { personagemInicial } from "./personagemInicial";
import type { CharacterAction } from "./reducer";
import { applyRules, reducerWithRules } from "./motor-regras";
import { clear, load, save, type LoadResult, type Saved } from "./armazenamento";

export type StorageNotice = "discarded" | "unavailable" | null;

const SAVE_DELAY_MS = 300;

export type PersistentState = { ready: boolean; character: Character; step: StepId; storageNotice: StorageNotice };

// Ações internas do hook (carga, etapa, falha de armazenamento). Não fazem parte de lib/reducer.ts.
type HookAction =
  | CharacterAction
  | { type: "HIDRATAR"; result: LoadResult }
  | { type: "DEFINIR_ETAPA"; step: StepId }
  | { type: "FALHA_AO_SALVAR" };

const PRIMEIRA = ALL_STEPS[0];

export const initialPersistentState: PersistentState = {
  ready: false,
  character: personagemInicial,
  step: PRIMEIRA,
  storageNotice: null,
};

export function persistentReducer(state: PersistentState, action: HookAction, now = () => new Date().toISOString()): PersistentState {
  switch (action.type) {
    case "HIDRATAR": {
      const { result } = action;
      if (result.status !== "ok") {
        const storageNotice = result.status === "invalid" ? "discarded" : result.status === "unavailable" ? "unavailable" : null;
        return { ...state, ready: true, storageNotice };
      }
      const character = applyRules(result.data.character).character;
      const steps = getVisibleSteps(character);
      const salva = steps.includes(result.data.step) ? result.data.step : PRIMEIRA;
      // saves da ordem antiga (origem antes da espécie) ou escolhas limpas pelas regras: volta à primeira etapa sem escolha
      const step = steps.slice(0, steps.indexOf(salva)).find((s) => !canAdvance(s, character)) ?? salva;
      return { ...state, ready: true, character, step };
    }
    case "DEFINIR_ETAPA":
      return { ...state, step: action.step };
    case "FALHA_AO_SALVAR":
      return { ...state, storageNotice: "unavailable" };
    case "REINICIAR":
      return { ...state, character: personagemInicial, step: PRIMEIRA };
    default: {
      const next = reducerWithRules(state.character, action);
      if (next === state.character) return state;
      // createdAt nasce na primeira ação que muda o personagem, não antes
      return { ...state, character: next.createdAt ? next : { ...next, createdAt: now() } };
    }
  }
}

export function usePersonagemSalvo() {
  const [state, dispatch] = useReducer(
    (s: PersistentState, a: HookAction) => persistentReducer(s, a),
    initialPersistentState,
  );
  const { ready, character, step } = state;
  const pending = useRef<Saved | null>(null);

  // Lê o localStorage só no cliente, depois da hidratação, para o HTML do servidor e do cliente serem iguais.
  useEffect(() => dispatch({ type: "HIDRATAR", result: load() }), []);

  useEffect(() => {
    if (!ready) return;
    // estado inicial intocado (abertura ou Recomeçar) não precisa ser salvo
    if (character === personagemInicial && step === PRIMEIRA) {
      pending.current = null;
      return;
    }
    pending.current = { character, step };
    const timer = setTimeout(() => {
      if (pending.current && !save(pending.current)) dispatch({ type: "FALHA_AO_SALVAR" });
      pending.current = null;
    }, SAVE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [character, step, ready]);

  // Fechar ou recarregar a aba antes do debounce não perde a última mudança. No celular, trocar de app ou bloquear a tela
  // pode descartar a aba sem pagehide; o visibilitychange para "hidden" é o último evento confiável.
  useEffect(() => {
    const flush = () => {
      if (pending.current) save(pending.current);
    };
    const aoMudarVisibilidade = () => {
      if (document.visibilityState === "hidden") flush();
    };
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", aoMudarVisibilidade);
    return () => {
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", aoMudarVisibilidade);
    };
  }, []);

  const setStep = useCallback((next: StepId) => dispatch({ type: "DEFINIR_ETAPA", step: next }), []);
  const reset = useCallback(() => {
    pending.current = null;
    clear();
    dispatch({ type: "REINICIAR" });
  }, []);

  return {
    ...state,
    dispatch: dispatch as Dispatch<CharacterAction>,
    setStep,
    reset,
  };
}
