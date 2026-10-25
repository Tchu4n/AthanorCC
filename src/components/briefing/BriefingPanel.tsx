import { Fragment } from "react";
import { isPending } from "@/lib/catalog";

export type BriefingSection = { label?: string; text: string };

// Ponto de extensão da fase 1.6: cada [[Termo]] vira um <span data-term>, pronto para receber hover do glossário.
function BriefingText({ text }: { text: string }) {
  if (isPending(text)) return <p className="italic opacity-70">Em definição.</p>;
  const parts = text.split(/\[\[([^\]]+)\]\]/);
  return (
    <p>
      {parts.map((part, i) =>
        i % 2 ? (
          <span key={i} data-term={part} className="font-semibold">
            {part}
          </span>
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
