import { createContext, Fragment, useContext, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { glossary } from "@/data/glossary";
import { isPending } from "@/lib/catalog";
import { Term } from "./Term";

// A página reserva a coluna direita para a explicação da escolha; as etapas mandam os briefings para lá.
// Sem a coluna (testes unitários, página concluída), o conteúdo fica no lugar.
export const LateralContext = createContext<HTMLElement | null>(null);
export function NaLateral({ children }: { children: ReactNode }) {
  const alvo = useContext(LateralContext);
  return alvo ? createPortal(children, alvo) : <>{children}</>;
}

export type BriefingSection = { label?: string; text: string };

// [[Termo]] casa com o term ou um alias do glossário (como em validate-data); sem par, o Term acusa o erro.
const glossaryId = (text: string) =>
  glossary.find((g) => [g.term, ...(g.aliases ?? [])].some((t) => t.toLowerCase() === text.toLowerCase()))?.id ?? text;

function BriefingText({ text }: { text: string }) {
  if (isPending(text)) return <p className="italic opacity-70">Em definição.</p>;
  const parts = text.split(/\[\[([^\]]+)\]\]/);
  return (
    <p>
      {parts.map((part, i) =>
        i % 2 ? (
          <Term key={i} id={glossaryId(part)}>
            {part}
          </Term>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </p>
  );
}

export function BriefingPanel({
  title,
  sections,
  warnings = [],
}: {
  title: string;
  sections: BriefingSection[];
  warnings?: string[];
}) {
  return (
    <section aria-live="polite" className="rounded-lg border border-foreground/20 bg-foreground/5 p-4 space-y-2">
      <h2 className="text-lg font-semibold">{title}</h2>
      {sections.map((s, i) => (
        <div key={i}>
          {s.label && <h3 className="text-sm font-semibold uppercase tracking-wide opacity-70">{s.label}</h3>}
          <BriefingText text={s.text} />
        </div>
      ))}
      {warnings.map((w) => (
        <p key={w} className="rounded-md border-l-4 border-amber-500 bg-amber-500/10 p-2 text-sm">
          <strong>Atenção: </strong>
          {w}
        </p>
      ))}
    </section>
  );
}
