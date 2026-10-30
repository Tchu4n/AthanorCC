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
  cena?: boolean; // imagem de lugar: o recorte desce para ruas e construções, em vez de guardar o alto (rostos)
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

// Selo pendente de cera, na cor da região, carimbado no card escolhido: emblema de quatro losangos (da bandeira de
// Laguardia, serve a qualquer região) e duas fitas douradas penduradas, como nos documentos medievais.
function Selo() {
  const cera = "color-mix(in oklch, var(--accent), black 35%)";
  const losango = (x: number, y: number) => <path key={`${x}${y}`} d={`M${x} ${y - 7} L${x + 5} ${y} L${x} ${y + 7} L${x - 5} ${y} Z`} />;
  return (
    <svg
      aria-hidden
      viewBox="-50 -50 100 150"
      className="pointer-events-none absolute top-[36%] -right-3 z-10 w-14 drop-shadow-[2px_4px_3px_rgb(0_0_0/0.6)] motion-safe:animate-[carimbo_250ms_ease-out]"
    >
      <defs>
        <linearGradient id="selo-fita" x1="0" x2="1">
          <stop offset="0" stopColor="#8a6424" />
          <stop offset=".5" stopColor="#e6c46f" />
          <stop offset="1" stopColor="#8a6424" />
        </linearGradient>
      </defs>
      <path d="M-14 20 L-26 92 L-19 86 L-13 96 Z" fill="url(#selo-fita)" stroke="#5a3d12" strokeWidth=".8" />
      <path d="M10 20 L24 96 L16 90 L10 98 Z" fill="url(#selo-fita)" stroke="#5a3d12" strokeWidth=".8" />
      <path
        d="M0 -44 C10 -46 18 -38 28 -38 C38 -34 44 -24 45 -12 C48 0 42 8 44 18 C40 30 32 38 20 42 C8 46 -2 42 -14 44 C-26 42 -36 36 -40 24 C-46 12 -42 0 -44 -10 C-42 -22 -34 -32 -22 -38 C-14 -42 -8 -42 0 -44 Z"
        style={{ fill: cera }}
        stroke="#1a0a04"
        strokeOpacity=".6"
        strokeWidth="1.2"
      />
      {/* brilho da cera do lado da vela e o anel em relevo */}
      <path d="M-30 20 A36 36 0 0 1 -36 -8" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="3" strokeLinecap="round" />
      <circle r="30" fill="none" stroke="#000" strokeOpacity=".35" strokeWidth="2.5" />
      <circle r="30" fill="none" stroke="#fff" strokeOpacity=".3" strokeWidth="1" transform="translate(-1 1)" />
      <g fill="#000" fillOpacity=".35">{[losango(0, -12), losango(0, 12), losango(-12, 0), losango(12, 0)]}</g>
      <g fill="#fff" fillOpacity=".3" transform="translate(-.8 1)">{[losango(0, -12), losango(0, 12), losango(-12, 0), losango(12, 0)]}</g>
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
      className="group/card relative h-full hover:drop-shadow-[0_10px_18px_color-mix(in_oklch,var(--vivo)_40%,transparent)] motion-safe:transition-[translate,filter] motion-safe:duration-200 motion-safe:hover:-translate-y-1"
    >
      {/* moldura de 2 px: o fundo do contêiner aparece entre os dois recortes */}
      <div className={`h-full p-[2px] ${marcado ? "bg-accent" : "bg-ouro-vivo"}`} style={{ clipPath: card.cantos }}>
        <div className="relative flex h-full flex-col bg-surface lg:min-h-[30rem]" style={{ clipPath: card.cantos }}>
          {/* a imagem ocupa só a área acima do texto: nada dela fica escondido atrás do véu */}
          <div className="relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:flex-1">
            {p.image ? (
              <Image
                src={p.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 26rem, calc(100vw - 2rem)"
                className={`object-cover ${p.cena ? "object-[center_65%]" : "object-[center_20%]"} motion-safe:transition-transform motion-safe:duration-[2000ms] motion-safe:ease-out motion-safe:group-hover/card:scale-110`}
              />
            ) : (
              <div data-card-placeholder className="absolute inset-0 flex items-center justify-center text-muted">
                <Icone etapa={p.icone} className="size-16" />
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
              {/* categoria numa linha só: os botões medievais são largos e, junto dela, o Escolher quebrava para baixo */}
              <span className="basis-full text-xs font-semibold uppercase tracking-wide text-muted">{p.categoria}</span>
              {p.saibaMais && (
                <button type="button" popoverTarget={`${id}-mais`} className={`${mais.className} mr-auto`} style={mais.style}>
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

      {/* fora do recorte do card: o selo passa um pouco da borda */}
      {marcado && <Selo />}

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
