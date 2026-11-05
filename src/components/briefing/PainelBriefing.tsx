import { createContext, Fragment, useContext, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { glossary } from "@/data/glossary";
import { isPending } from "@/lib/catalogo";
import { useCelular } from "@/lib/useCelular";
import { Termo } from "./Termo";

// A página reserva a coluna direita para a explicação da escolha; as etapas mandam os briefings para lá.
// Sem a coluna (testes unitários, página concluída), o conteúdo fica no lugar.
export const LateralContext = createContext<HTMLElement | null>(null);

// Abaixo de lg a coluna da direita vai para o fim da página; ali a explicação fica colada à carta marcada.
// Sem coluna (testes unitários, página concluída) ou sem matchMedia, nada muda: o conteúdo fica no lugar.
export function useExplicacaoNoCartao() {
  const coluna = useContext(LateralContext);
  const celular = useCelular();
  return !!coluna && celular;
}

export function NaLateral({ children }: { children: ReactNode }) {
  const alvo = useContext(LateralContext);
  const noCartao = useExplicacaoNoCartao();
  if (noCartao) return null;
  return alvo ? createPortal(children, alvo) : <>{children}</>;
}

export type BriefingSection = { label?: string; text: string };

// [[Termo]] casa com o term ou um alias do glossário (como em validate-data); sem par, o Termo acusa o erro.
const glossaryId = (text: string) =>
  glossary.find((g) => [g.term, ...(g.aliases ?? [])].some((t) => t.toLowerCase() === text.toLowerCase()))?.id ?? text;

function BriefingText({ text }: { text: string }) {
  if (isPending(text)) return <p className="italic opacity-70">Em definição.</p>;
  const parts = text.split(/\[\[([^\]]+)\]\]/);
  return (
    <p>
      {parts.map((part, i) =>
        i % 2 ? (
          <Termo key={i} id={glossaryId(part)}>
            {part}
          </Termo>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </p>
  );
}

export function PainelBriefing({
  title,
  sections,
  warnings = [],
}: {
  title: string;
  sections: BriefingSection[];
  warnings?: string[];
}) {
  return (
    <section aria-live="polite" className="rounded-lg border border-foreground/20 bg-foreground/5 p-4 space-y-3">
      <h2 className="text-2xl font-bold leading-tight">{title}</h2>
      {sections.map((s, i) =>
        s.label ? (
          // seção nova (Você no mundo, Vindo de...): o destaque e o pulso ao trocar a escolha avisam que há o que ler
          <div key={`${title}|${i}`} data-briefing-novo className="space-y-1 rounded-md border-l-4 border-accent bg-accent/10 p-3">
            <h3 className="inline-block rounded bg-accent px-2.5 py-1 text-base font-bold uppercase tracking-wide text-accent-text">{s.label}</h3>
            <BriefingText text={s.text} />
          </div>
        ) : (
          <div key={i}>
            <BriefingText text={s.text} />
          </div>
        ),
      )}
      {warnings.map((w) => (
        <p key={w} className="rounded-md border-l-4 border-amber-500 bg-amber-500/10 p-2 text-sm">
          <strong>Atenção: </strong>
          {w}
        </p>
      ))}
    </section>
  );
}
