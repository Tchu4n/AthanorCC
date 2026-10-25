"use client";

import { useEffect, useReducer, useRef, useState, type ComponentType } from "react";
import { AppearanceStep } from "@/components/steps/AppearanceStep";
import { FaithStep } from "@/components/steps/FaithStep";
import { IdentityStep } from "@/components/steps/IdentityStep";
import { MarksStep } from "@/components/steps/MarksStep";
import { OccupationStep } from "@/components/steps/OccupationStep";
import { OriginStep } from "@/components/steps/OriginStep";
import { ReviewStep } from "@/components/steps/ReviewStep";
import { SpeciesStep } from "@/components/steps/SpeciesStep";
import { SubspeciesStep } from "@/components/steps/SubspeciesStep";
import type { StepProps } from "@/components/steps/types";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { canAdvance, getVisibleSteps, STEP_LABELS, type StepId } from "@/lib/flow";
import { initialCharacter } from "@/lib/initialCharacter";
import { characterReducer, type CharacterAction } from "@/lib/reducer";
import { applyRules, reducerWithRules } from "@/lib/rules-engine";

const STEPS: Record<StepId, ComponentType<StepProps>> = {
  origem: OriginStep,
  especie: SpeciesStep,
  subespecie: SubspeciesStep,
  oficio: OccupationStep,
  fe: FaithStep,
  marcas: MarksStep,
  aparencia: AppearanceStep,
  identidade: IdentityStep,
  revisao: ReviewStep,
};

const BLOCKED_HINT: Partial<Record<StepId, string>> = {
  origem: "Escolha uma região e uma subregião, ou Andarilho/Aventureiro, para avançar.",
  especie: "Escolha uma espécie para avançar.",
  subespecie: "Escolha uma subespécie para avançar.",
  identidade: "Preencha o nome para avançar.",
};

export default function CriarPage() {
  const [character, rawDispatch] = useReducer(reducerWithRules, initialCharacter);
  const [step, setStepState] = useState<StepId>("origem");
  const [done, setDone] = useState(false);
  const [notices, setNotices] = useState<string[]>([]);
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => heading.current?.focus(), [step, done]);

  // O reducer já corrige as escolhas; aqui só guardamos o aviso das correções para mostrar ao usuário.
  const dispatch = (action: CharacterAction) => {
    setNotices(applyRules(characterReducer(character, action)).notices);
    rawDispatch(action);
  };
  const setStep = (next: StepId) => {
    setNotices([]);
    setStepState(next);
  };

  const steps = getVisibleSteps(character);
  const index = steps.indexOf(step);
  const ok = canAdvance(step, character);
  const Step = STEPS[step];

  if (done) {
    return (
      <main className="mx-auto w-full max-w-3xl space-y-4 px-4 py-8">
        <h1 ref={heading} tabIndex={-1} className="text-2xl font-bold focus:outline-none">
          Personagem concluído
        </h1>
        <p>{character.identity.name} está pronto. A ficha e a exportação chegam em uma próxima etapa do projeto.</p>
        <Button
          variant="secondary"
          onClick={() => {
            dispatch({ type: "RESET" });
            setStep("origem");
            setDone(false);
          }}
        >
          Criar outro personagem
        </Button>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl space-y-6 px-4 py-6">
      <ProgressBar steps={steps} current={step} />
      <h1 ref={heading} tabIndex={-1} className="text-2xl font-bold focus:outline-none">
        {STEP_LABELS[step]}
      </h1>

      <div role="status">
        {notices.length > 0 && (
          <ul className="space-y-1 rounded-lg border-l-4 border-amber-500 bg-amber-500/10 p-3 text-sm">
            {notices.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        )}
      </div>

      <Step character={character} dispatch={dispatch} />

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-foreground/20 pt-4">
        <Button variant="secondary" disabled={index === 0} onClick={() => setStep(steps[index - 1])}>
          Voltar
        </Button>
        {!ok && BLOCKED_HINT[step] && (
          <p id="dica-avancar" className="order-last w-full text-sm opacity-80 sm:order-none sm:w-auto">
            {BLOCKED_HINT[step]}
          </p>
        )}
        <Button
          disabled={!ok}
          aria-describedby={!ok ? "dica-avancar" : undefined}
          onClick={() => (step === "revisao" ? setDone(true) : setStep(steps[index + 1]))}
        >
          {step === "revisao" ? "Concluir" : "Avançar"}
        </Button>
      </div>
    </main>
  );
}
