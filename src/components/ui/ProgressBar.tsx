import { STEP_LABELS, type StepId } from "@/lib/flow";

// Fração de etapas concluídas (as anteriores à atual, como na barra); 1 quando o personagem foi concluído.
export function vida(steps: StepId[], current: StepId, concluido = false) {
  if (concluido || steps.length === 0) return 1;
  return Math.max(0, steps.indexOf(current)) / steps.length;
}

export function ProgressBar({ steps, current }: { steps: StepId[]; current: StepId }) {
  const currentIndex = steps.indexOf(current);
  return (
    <nav aria-label="Progresso">
      <p className="mb-2 text-sm opacity-70">
        Etapa {currentIndex + 1} de {steps.length}
      </p>
      <ol className="flex flex-wrap gap-1">
        {steps.map((step, i) => {
          const state = i < currentIndex ? "done" : i === currentIndex ? "current" : "todo";
          return (
            <li
              key={step}
              aria-current={state === "current" ? "step" : undefined}
              className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs ${
                state === "current"
                  ? "bg-vivo text-accent-text"
                  : state === "done"
                    ? "bg-vivo/25"
                    : "border border-foreground/20 opacity-60"
              }`}
            >
              <span aria-hidden>{state === "done" ? "✓" : i + 1}</span>
              <span className="max-sm:sr-only">{STEP_LABELS[step]}</span>
              {state === "done" && <span className="sr-only">(concluída)</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
