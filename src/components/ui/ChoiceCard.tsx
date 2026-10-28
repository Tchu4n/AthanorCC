import Image from "next/image";
import { useId, type ReactNode } from "react";
import { BriefingPanel, type BriefingSection } from "@/components/briefing/BriefingPanel";
import { isPending } from "@/lib/catalog";
import type { StepId } from "@/lib/flow";
import { card } from "@/styles/theme";
import { botao } from "./Button";
import { useCombina } from "./FilterBar";
import { ICONES } from "./Vitrine";

type Props = {
  type: "radio" | "checkbox";
  name: string;
  label: string;
  categoria: string; // texto discreto do rodapé ("Região", "Espécie"...)
  icone: StepId;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  image?: string;
  descricao?: string; // briefing; vira texto simples, cortado em `linhas`
  linhas?: 1 | 2;
  destaque?: string; // linha extra com um campo dos dados; sem valor, não ocupa espaço
  tags?: string[];
  saibaMais?: { sections: BriefingSection[]; warnings?: string[] };
  // Quando há mensagens, a opção fica desabilitada e o motivo aparece no cartão.
  blockedReasons?: string[];
  // Quando há mensagens, a opção fica marcada e travada.
  lockedReasons?: string[];
};

const textoSimples = (t: string) => t.replace(/\[\[([^\]]+)\]\]/g, "$1");
const FAIXA = "polygon(0 0, 100% 0, calc(100% - 0.75rem) 100%, 0 100%)";

function Icone({ etapa, className }: { etapa: StepId; className: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <path d={ICONES[etapa]} />
    </svg>
  );
}

// "Escolher" é uma label com o input nativo por cima: teclado (setas, espaço) e leitores de tela funcionam sem código extra.
export function ChoiceCard(p: Props) {
  const id = useId();
  const blocked = !!p.blockedReasons?.length;
  const locked = !!p.lockedReasons?.length;
  const visivel = useCombina(p.label, blocked);
  if (!visivel) return null;

  const marcado = p.checked || locked;
  const indisponivel = !!p.disabled || blocked;
  const note = blocked
    ? { title: "Indisponível para esta escolha", reasons: p.blockedReasons! }
    : locked
      ? { title: "Obrigatória para esta escolha", reasons: p.lockedReasons! }
      : null;
  const descricao = p.descricao && !isPending(p.descricao) ? textoSimples(p.descricao) : "";
  const escolher = botao("primary");
  const mais = botao("secondary");

  return (
    <article
      data-escolha={p.label}
      data-indisponivel={blocked || undefined}
      className="group/card h-full hover:drop-shadow-[0_10px_18px_color-mix(in_oklch,var(--vivo)_40%,transparent)] motion-safe:transition-[translate,filter] motion-safe:duration-200 motion-safe:hover:-translate-y-1"
    >
      {/* moldura de 2 px: o fundo do contêiner aparece entre os dois recortes */}
      <div className={`h-full p-[2px] ${marcado ? "bg-accent" : "bg-ouro-vivo"}`} style={{ clipPath: card.cantos }}>
        <div className="relative flex h-full flex-col bg-surface lg:min-h-[30rem]" style={{ clipPath: card.cantos }}>
          <div className="relative aspect-[4/3] overflow-hidden lg:absolute lg:inset-0 lg:aspect-auto">
            {p.image ? (
              <Image
                src={p.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 26rem, calc(100vw - 2rem)"
                className="object-cover object-[center_20%] motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover/card:scale-[1.02]"
              />
            ) : (
              <div data-card-placeholder className="absolute inset-0 flex items-center justify-center text-muted">
                <Icone etapa={p.icone} className="size-16 lg:-translate-y-16" />
              </div>
            )}
          </div>
          {indisponivel && <div aria-hidden className="absolute inset-0 bg-background/60" />}

          <span aria-hidden data-faixa-card className="absolute left-0 top-0 flex h-9 w-14 items-center pl-3 bg-vivo text-accent-text" style={{ clipPath: FAIXA }}>
            <Icone etapa={p.icone} className="size-5" />
          </span>

          {/* o texto fica sobre o véu sólido; o degradê acima dele faz a passagem para a imagem */}
          <div className="relative mt-auto flex flex-1 flex-col gap-2 p-4 lg:flex-none" style={{ background: card.veil }}>
            <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-full hidden h-24 lg:block" style={{ background: `linear-gradient(to top, ${card.veil}, transparent)` }} />
            <h2 id={`${id}-titulo`} className="text-lg font-bold leading-tight">
              {p.label}
            </h2>
            {p.destaque && <p className="text-sm font-semibold">{p.destaque}</p>}
            {descricao && <p className={`text-sm text-muted ${p.linhas === 1 ? "line-clamp-1" : "line-clamp-2"}`}>{descricao}</p>}
            {!!p.tags?.length && (
              <ul aria-label="Características" className="flex flex-wrap gap-1">
                {p.tags.map((t) => (
                  <li key={t} className="rounded-sm bg-surface px-2 py-0.5 text-xs">
                    {t}
                  </li>
                ))}
              </ul>
            )}
            {note && (
              <p id={`${id}-nota`} className="text-sm">
                <span className="block font-semibold">{note.title}</span>
                {note.reasons.join(" ")}
              </p>
            )}
            <div className="mt-auto flex flex-wrap items-center justify-end gap-2 pt-2">
              <span className="mr-auto text-xs font-semibold uppercase tracking-wide text-muted">{p.categoria}</span>
              {p.saibaMais && (
                <button type="button" popoverTarget={`${id}-mais`} className={mais.className} style={mais.style}>
                  Saiba mais<span className="sr-only"> sobre {p.label}</span>
                </button>
              )}
              <label className={escolher.className} style={escolher.style}>
                <input
                  type={p.type}
                  name={p.name}
                  checked={marcado}
                  disabled={indisponivel || locked}
                  onChange={p.onChange}
                  aria-labelledby={`${id}-titulo`}
                  aria-describedby={note ? `${id}-nota` : undefined}
                  className="absolute inset-0 z-10 m-0 cursor-[inherit] opacity-0"
                />
                {marcado ? (
                  <>
                    <span aria-hidden>✓</span> Escolhido
                  </>
                ) : (
                  "Escolher"
                )}
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* "Saiba mais": popover nativo (Esc e clique fora fecham) com o mesmo briefing de sempre */}
      {p.saibaMais && (
        <div
          id={`${id}-mais`}
          popover="auto"
          className="m-auto max-h-[85vh] w-[min(36rem,calc(100vw-2rem))] overflow-y-auto rounded-lg border border-border bg-background p-4 text-foreground backdrop:bg-black/60"
        >
          <BriefingPanel title={p.label} sections={p.saibaMais.sections} warnings={p.saibaMais.warnings} />
          <div className="mt-4 flex justify-end">
            <button type="button" popoverTarget={`${id}-mais`} popoverTargetAction="hide" className={mais.className} style={mais.style}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

// Grade de 2 colunas (1 no celular); com tudo filtrado, mostra o aviso no lugar.
export function OptionGroup({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-2">
      <legend className="mb-2 font-semibold">{legend}</legend>
      <div data-cards className="peer grid grid-cols-1 gap-6 sm:grid-cols-2">
        {children}
      </div>
      <p className="hidden text-muted peer-empty:block">Nenhuma opção corresponde ao filtro.</p>
    </fieldset>
  );
}
