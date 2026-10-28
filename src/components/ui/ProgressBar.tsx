"use client";

import { useState, useSyncExternalStore, type CSSProperties, type Ref } from "react";
import { STEP_LABELS, type StepId } from "@/lib/flow";

// Fração de etapas concluídas (as anteriores à atual, como na barra); 1 quando o personagem foi concluído.
export function vida(steps: StepId[], current: StepId, concluido = false) {
  if (concluido || steps.length === 0) return 1;
  return Math.max(0, steps.indexOf(current)) / steps.length;
}

// Largura do preenchimento: 0 na primeira etapa, 1 na última (a Revisão enche a barra).
export function preenchimento(steps: StepId[], current: StepId) {
  return steps.length > 1 ? Math.max(0, steps.indexOf(current)) / (steps.length - 1) : 1;
}

const REDUZIDO = "(prefers-reduced-motion: reduce)";
// no servidor, sem movimento; a barra só aparece no cliente (a página espera o personagem carregar)
export const useMovimentoReduzido = () =>
  useSyncExternalStore(
    (avisar) => {
      const mq = matchMedia(REDUZIDO);
      mq.addEventListener("change", avisar);
      return () => mq.removeEventListener("change", avisar);
    },
    () => matchMedia(REDUZIDO).matches,
    () => true,
  );

type Props = {
  steps: StepId[];
  current: StepId;
  titulo: string; // texto do h1 (o nome da etapa, ou "Personagem concluído")
  concluido?: boolean;
  reduzido?: boolean; // prefers-reduced-motion: sem classes de animação
  headingRef?: Ref<HTMLHeadingElement>;
};

// Uma camada de conteúdo do trilho: título atual e, logo depois, as próximas etapas, alinhados à esquerda.
// A etapa anterior não é desenhada: some na troca, sem sobrepor o título novo.
// Desenhada duas vezes: por cima do trilho (cores do texto) e recortada no preenchimento (texto sobre --accent).
function Camada({ titulo, proximas, chave, animar, noPreenchimento, headingRef }: {
  titulo: string;
  proximas: StepId[];
  chave: string;
  animar: boolean;
  noPreenchimento?: boolean;
  headingRef?: Ref<HTMLHeadingElement>;
}) {
  const tituloCls = `whitespace-nowrap text-xl font-bold sm:text-2xl focus:outline-none ${noPreenchimento ? "text-accent-text" : ""}`;
  const entra = animar ? "animate-[barra-entra_500ms_ease-out_both]" : "";
  return (
    <div className="absolute inset-0 flex items-center gap-3 px-5">
      {noPreenchimento ? (
        <span key={chave} aria-hidden className={`shrink-0 ${tituloCls} ${entra}`}>
          {titulo}
        </span>
      ) : (
        <h1 key={chave} ref={headingRef} tabIndex={-1} className={`shrink-0 ${tituloCls} ${entra}`}>
          {titulo}
        </h1>
      )}
      {/* próximas etapas: só o texto, cada uma depois de um tracinho (inclusive a primeira, depois do título) */}
      <ul key={`${chave}:proximas`} aria-hidden data-barra-proximas className={`flex min-w-0 gap-3 overflow-hidden ${entra}`}>
        {proximas.map((s, i) => (
          <li
            key={s}
            data-barra-proxima={s}
            className={`flex shrink-0 items-center gap-3 whitespace-nowrap text-sm ${i > 0 ? "max-sm:hidden" : ""} ${
              noPreenchimento ? "text-accent-text opacity-75" : "text-muted"
            }`}
          >
            <span className="h-px w-4 shrink-0 bg-current" />
            {STEP_LABELS[s]}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ProgressBar({ steps, current, titulo, concluido = false, reduzido = false, headingRef }: Props) {
  const index = Math.max(0, steps.indexOf(current));
  // sentido da última troca: 1 ao avançar, -1 ao voltar
  const [vista, setVista] = useState({ index, dir: 1 });
  if (vista.index !== index) setVista({ index, dir: index > vista.index ? 1 : -1 });

  const animar = !reduzido;
  const p = concluido ? 1 : preenchimento(steps, current);
  const proximas = concluido ? [] : steps.slice(index + 1);
  const transicao = animar ? "transition-[width,clip-path] duration-600 ease-out" : "";
  const camada = { titulo, proximas, chave: `${current}:${concluido}`, animar };

  return (
    // a posição ("Etapa X de Y") fica só no aria-label do progressbar; na tela, o preenchimento e as próximas etapas
    <div style={{ "--dir": vista.dir } as CSSProperties}>
      <div data-barra className="relative h-12 sm:h-14">
        <div
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-valuenow={index + 1}
          aria-label={`Etapa ${index + 1} de ${steps.length}: ${titulo}`}
          className="absolute inset-0 overflow-hidden rounded-full border border-border bg-background/70"
        >
          <div
            data-barra-preenchimento
            className={`h-full bg-accent ${transicao} ${concluido && animar ? "animate-[barra-pulso_300ms_ease-out]" : ""}`}
            style={{ width: `${p * 100}%` }}
          />
        </div>
        {/* a mesma camada duas vezes, recortadas na borda do preenchimento: o texto troca de cor exatamente nela */}
        <div className={`absolute inset-0 ${transicao}`} style={{ clipPath: `inset(0 0 0 ${p * 100}%)` }}>
          <Camada {...camada} headingRef={headingRef} />
        </div>
        <div aria-hidden className={`absolute inset-0 ${transicao}`} style={{ clipPath: `inset(0 ${100 - p * 100}% 0 0)` }}>
          <Camada {...camada} noPreenchimento />
        </div>
      </div>
    </div>
  );
}
