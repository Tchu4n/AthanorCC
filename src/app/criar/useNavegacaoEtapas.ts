import { useEffect, useRef, useState } from "react";
import type { FaseOrigem } from "@/components/steps/types";
import { SEM_FILTRO, type Filtro } from "@/components/ui/BarraFiltros";
import type { Character } from "@/lib/character";
import { canAdvance, getVisibleSteps, type StepId } from "@/lib/fluxo";
import type { CharacterAction } from "@/lib/reducer";
import { noticesFor } from "@/lib/motor-regras";
import { playClick, playConfirm } from "@/lib/som";

type Opcoes = {
  ready: boolean;
  character: Character;
  step: StepId;
  setStepState: (step: StepId) => void;
  rawDispatch: (action: CharacterAction) => void;
  reset: () => void;
};

/**
 * Navegação entre as etapas do criador: etapa e fase da Origem, Avançar/Voltar/Concluir, foco no título a cada troca,
 * avisos das correções feitas pelas regras e o filtro dos cards (que volta ao padrão ao trocar de etapa).
 */
export function useNavegacaoEtapas({ ready, character, step, setStepState, rawDispatch, reset }: Opcoes) {
  const [done, setDone] = useState(false);
  const [notices, setNotices] = useState<string[]>([]);
  const [filtro, setFiltro] = useState<Filtro>(SEM_FILTRO);
  // fase da Origem; null = deduz do personagem (com região escolhida, abre nas subregiões)
  const [faseOrigem, setFaseOrigem] = useState<FaseOrigem | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  // fase efetiva: o foco só vai para o título quando ela muda de fato (não quando a escolha só a confirma)
  const fase: FaseOrigem | undefined =
    step === "origem" ? (faseOrigem ?? (character.origin?.regionId ? "subregiao" : "regiao")) : undefined;

  useEffect(() => {
    if (ready) heading.current?.focus();
  }, [ready, step, done, fase]);

  // O reducer já corrige as escolhas; aqui só guardamos o aviso das correções para mostrar ao usuário.
  const dispatch = (action: CharacterAction) => {
    setNotices(noticesFor(character, action));
    // escolher a região não avança: a grade de regiões fica até o Avançar confirmar
    if (action.type === "ESCOLHER_REGIAO") setFaseOrigem("regiao");
    rawDispatch(action);
  };
  const setStep = (next: StepId) => {
    setNotices([]);
    setFiltro(SEM_FILTRO);
    setFaseOrigem(null);
    setStepState(next);
  };
  const restart = () => {
    reset();
    setFaseOrigem(null);
    setNotices([]);
    setDone(false);
  };

  const steps = getVisibleSteps(character);
  const index = steps.indexOf(step);
  // nas regiões, basta a região para confirmar e ir às subregiões
  const ok = fase === "regiao" ? !!character.origin?.regionId : canAdvance(step, character);

  const concluir = () => {
    playConfirm();
    setDone(true);
  };
  const avancar = () => {
    if (step === "revisao") return concluir();
    playClick();
    if (fase === "regiao") return setFaseOrigem("subregiao");
    setStep(steps[index + 1]);
  };
  const voltar = () => {
    playClick();
    if (fase === "subregiao") return setFaseOrigem("regiao");
    setStep(steps[index - 1]);
  };
  const rotuloAvancar = step === "revisao" ? "Concluir" : "Avançar";

  return { done, setDone, notices, filtro, setFiltro, fase, heading, dispatch, restart, steps, index, ok, avancar, voltar, rotuloAvancar };
}
