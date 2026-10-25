"use client";

import { useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import { FichaPreview } from "@/components/ficha/FichaPreview";
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
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { canAdvance, getVisibleSteps, STEP_LABELS, type StepId } from "@/lib/flow";
import type { CharacterAction } from "@/lib/reducer";
import { noticesFor } from "@/lib/rules-engine";
import { usePersistentCharacter, type StorageNotice } from "@/lib/usePersistentCharacter";

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

const STORAGE_MESSAGES: Record<Exclude<StorageNotice, null>, string> = {
  discarded: "O personagem salvo estava em um formato inválido e foi descartado. A criação recomeça do zero.",
  unavailable:
    "O armazenamento do navegador não está disponível. O personagem fica só nesta aba e se perde ao recarregar ou fechar a página.",
};

export default function CriarPage() {
  const { ready, character, dispatch: rawDispatch, step, setStep: setStepState, storageNotice, reset } = usePersistentCharacter();
  const [done, setDone] = useState(false);
  const [notices, setNotices] = useState<string[]>([]);
  const [confirmReset, setConfirmReset] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (ready) heading.current?.focus();
  }, [ready, step, done]);

  // O reducer já corrige as escolhas; aqui só guardamos o aviso das correções para mostrar ao usuário.
  const dispatch = (action: CharacterAction) => {
    setNotices(noticesFor(character, action));
    rawDispatch(action);
  };
  const setStep = (next: StepId) => {
    setNotices([]);
    setStepState(next);
  };
  const restart = () => {
    reset();
    setNotices([]);
    setDone(false);
    setConfirmReset(false);
  };

  if (!ready) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-6">
        <p role="status">Carregando personagem…</p>
      </main>
    );
  }

  const steps = getVisibleSteps(character);
  const index = steps.indexOf(step);
  const ok = canAdvance(step, character);
  const Step = STEPS[step];

  const storageBanner = storageNotice && (
    <p role="alert" className="rounded-lg border-l-4 border-amber-500 bg-amber-500/10 p-3 text-sm">
      {STORAGE_MESSAGES[storageNotice]}
    </p>
  );

  // Prévia ao lado das etapas no desktop (coluna sticky) e abaixo delas no celular.
  const layout = (content: ReactNode) => (
    <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
      {content}
      <FichaPreview
        character={character}
        className="lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:self-start lg:overflow-y-auto"
      />
    </div>
  );

  if (done) {
    return layout(
      <main className="min-w-0 space-y-4">
        {storageBanner}
        <h1 ref={heading} tabIndex={-1} className="text-2xl font-bold focus:outline-none">
          Personagem concluído
        </h1>
        <p>{character.identity.name} está pronto. Use a prévia para exportar a ficha em PDF.</p>
        <Button variant="secondary" onClick={restart}>
          Criar outro personagem
        </Button>
      </main>,
    );
  }

  return layout(
    <main className="min-w-0 space-y-6">
      {storageBanner}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <ProgressBar steps={steps} current={step} />
        <Button variant="secondary" onClick={() => setConfirmReset(true)}>
          Recomeçar
        </Button>
      </div>
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

      <ConfirmDialog
        open={confirmReset}
        title="Recomeçar o personagem?"
        message="Todas as escolhas serão apagadas, inclusive o que está salvo neste navegador."
        confirmLabel="Recomeçar"
        onConfirm={restart}
        onCancel={() => setConfirmReset(false)}
      />
    </main>,
  );
}
