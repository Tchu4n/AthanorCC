import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { MAPA, PINOS, type Pino } from "@/data/mapa";
import { getOriginOptions, getRegion } from "@/lib/catalogo";
import { ANDARILHO } from "@/lib/character";
import { vitrine } from "@/styles/theme";

type Props = {
  regionId: string | null | undefined;
  subregionId: string | null | undefined;
  // fase das subregiões: aproxima a região escolhida e mostra os pinos das subregiões dela
  focarRegiao?: boolean;
  // sem o callback, os pinos daquele nível não selecionam
  onSelectRegiao?: (regionId: string) => void;
  onSelectSubregiao?: (subregionId: string) => void;
  // motivos de a região estar indisponível (regras da espécie); o pino fica desligado com o motivo
  bloqueio?: (regionId: string) => string[] | undefined;
  className?: string;
};

type Ponto = Pino & { x: number; y: number };
const pino = (id: string | null | undefined): Pino | undefined => PINOS.find((p) => p.id === id);
const temPosicao = (p: Pino | undefined): p is Ponto => p?.x !== undefined && p.y !== undefined;
const nomeDaRegiao = (id: string) => getRegion(id)?.name ?? id;
const PINOS_DE_REGIAO = PINOS.filter((p) => getRegion(p.id)).filter(temPosicao);

/** Lugar escolhido: nome para o rótulo e posição (a da subregião, se tiver registro; senão a da região-mãe). */
export function lugarEscolhido(regionId: string | null | undefined, subregionId: string | null | undefined) {
  const regiao = getRegion(regionId);
  if (!regiao) return null;
  const sub = subregionId && subregionId !== ANDARILHO ? getOriginOptions(regiao.id).find((o) => o.id === subregionId) : undefined;
  // subregião com registro próprio decide; "sem posição" nela não herda o pino da região
  const fonte = (sub && pino(sub.id)) ?? pino(regiao.id);
  return { regionId: regiao.id, nome: sub?.name ?? regiao.name, pos: temPosicao(fonte) ? { x: fonte.x, y: fonte.y } : null };
}

/** Subregiões da região com posição no mapa, com o nome. */
export const pinosDasSubregioes = (regionId: string) =>
  getOriginOptions(regionId)
    .map((o) => ({ ...pino(o.id), nome: o.name }))
    .filter((p): p is Ponto & { nome: string } => temPosicao(p as Pino));

// Moldura 16:9 (a mesma da vitrine). Vista = centro (cx, cy) no mapa e escala s = largura da imagem / largura da moldura.
const ALTURA = 9 / 16; // altura da moldura em larguras da moldura
const PROPORCAO = MAPA.altura / MAPA.largura;
export const ESCALA_CONTINENTE = (0.88 * ALTURA) / PROPORCAO; // o continente inteiro cabe na altura, com folga
const ESCALA_MAX = 4;
type Vista = { cx: number; cy: number; s: number };
const limitar = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

// o alfinete sobe a partir do ponto: a vista desce o conteúdo esta fração da altura da moldura
const FOLGA_DO_ALFINETE = 0.06;
const descer = (s: number) => (FOLGA_DO_ALFINETE * ALTURA) / (s * PROPORCAO); // em unidades do mapa

/** Enquadra os pontos com folga; a imagem nunca deixa borda vazia quando é maior que a moldura. */
export function vistaPara(pontos: { x: number; y: number }[]): Vista {
  if (pontos.length < 2) return { cx: 0.5, cy: 0.5 - descer(ESCALA_CONTINENTE), s: ESCALA_CONTINENTE };
  const xs = pontos.map((p) => p.x);
  const ys = pontos.map((p) => p.y);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const s = limitar(Math.min(0.7 / Math.max(x1 - x0, 0.05), (0.62 * ALTURA) / (Math.max(y1 - y0, 0.05) * PROPORCAO)), ESCALA_CONTINENTE, ESCALA_MAX);
  const alturaDaImagem = (s * PROPORCAO) / ALTURA; // em alturas da moldura
  return {
    cx: s >= 1 ? limitar((x0 + x1) / 2, 0.5 / s, 1 - 0.5 / s) : 0.5,
    cy: alturaDaImagem >= 1 ? limitar((y0 + y1) / 2 - descer(s), 0.5 / alturaDaImagem, 1 - 0.5 / alturaDaImagem) : 0.5 - descer(s),
    s,
  };
}
/** Mantém a vista dentro do mapa: escala entre `min` e o máximo, sem borda vazia quando a imagem é maior que a moldura. */
function enquadrar(v: Vista, min: number): Vista {
  const s = limitar(v.s, min, ESCALA_MAX);
  const alturaDaImagem = (s * PROPORCAO) / ALTURA;
  return {
    s,
    cx: s >= 1 ? limitar(v.cx, 0.5 / s, 1 - 0.5 / s) : 0.5,
    cy: alturaDaImagem >= 1 ? limitar(v.cy, 0.5 / alturaDaImagem, 1 - 0.5 / alturaDaImagem) : 0.5 - descer(s),
  };
}
const PASSO_ZOOM = 1.5;
const LIMIAR_ARRASTO = 6; // px: abaixo disso o toque ainda é um clique no pino

/** Posição de um ponto do mapa na moldura, em %. */
export const naMoldura = (v: Vista, x: number, y: number) => ({
  left: 50 + (x - v.cx) * v.s * 100,
  top: 50 + ((y - v.cy) * v.s * PROPORCAO * 100) / ALTURA,
});
const pos = (v: Vista, x: number, y: number): CSSProperties => {
  const p = naMoldura(v, x, y);
  return { left: `${p.left}%`, top: `${p.top}%` };
};

// tinta e papel da carta
const TINTA = "#3b2412";
const PAPEL = "#efdfb6";
// bordas da carta esfumadas nos quatro lados, para ela se fundir ao mapa borrado de fundo
const FADE = (dir: string) => `linear-gradient(to ${dir}, transparent, black 16%, black 84%, transparent)`;
const ESFUMADO: CSSProperties = {
  maskImage: `${FADE("right")}, ${FADE("bottom")}`,
  maskComposite: "intersect",
  WebkitMaskImage: `${FADE("right")}, ${FADE("bottom")}`,
  WebkitMaskComposite: "source-in",
};
// com a região aproximada a carta cobre a moldura toda: o esfumado radial de sempre
const RADIAL = "radial-gradient(ellipse at center, black 72%, transparent 100%)";
const MOVE = "motion-safe:transition-[left,top,width] motion-safe:duration-[400ms] motion-safe:ease-out";

// rótulo ao lado da cabeça do alfinete, não embaixo: embaixo ele cobria a vinheta do próprio lugar.
// Do lado com mais espaço; nomes longos quebram em duas linhas em vez de sair da moldura.
const lado = (left: number) => (left > 50 ? "right-3.5" : "left-3.5");

function RosaDosVentos() {
  return (
    <svg aria-hidden viewBox="-20 -20 40 40" className="pointer-events-none absolute top-2 right-2 size-11 opacity-80" fill={TINTA} stroke={TINTA}>
      <circle r="13" fill="none" strokeWidth=".6" />
      <circle r="10.5" fill="none" strokeWidth=".4" strokeDasharray="1 1.2" />
      <path d="M0 -18 L3 -3 L0 0 Z M0 18 L-3 3 L0 0 Z M18 0 L3 3 L0 0 Z M-18 0 L-3 -3 L0 0 Z" strokeWidth=".4" />
      <path d="M0 -18 L-3 -3 L0 0 Z M0 18 L3 3 L0 0 Z M18 0 L3 -3 L0 0 Z M-18 0 L-3 3 L0 0 Z" fill={PAPEL} strokeWidth=".4" />
      <text y="-14.5" x="0" fontSize="5" textAnchor="middle" stroke="none" fontFamily="serif" fontWeight="700" transform="translate(0 -5)">
        N
      </text>
    </svg>
  );
}

// Distância (em larguras da moldura) do pino mais próximo: a área de toque não passa disso, ou o vizinho roubaria o toque.
function vizinhoMaisPerto(i: number, todos: { left: number; top: number }[]) {
  let d = Infinity;
  todos.forEach((o, j) => {
    if (j !== i) d = Math.min(d, Math.hypot((o.left - todos[i].left) / 100, ((o.top - todos[i].top) / 100) * ALTURA));
  });
  return d;
}

function Marca({ nome, left, top, vizinho, escolhido, motivos, onClick }: { nome: string; left: number; top: number; vizinho: number; escolhido: boolean; motivos?: string[]; onClick?: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={escolhido}
      disabled={!onClick || !!motivos?.length}
      title={motivos?.length ? `${nome}: ${motivos.join(" ")}` : nome}
      onClick={onClick}
      className={`absolute grid size-6 pointer-coarse:size-[clamp(1.5rem,var(--alvo),2.75rem)] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full focus-visible:outline-3 focus-visible:outline-offset-1 focus-visible:outline-blue-500 disabled:cursor-default ${MOVE}`}
      style={{ left: `${left}%`, top: `${top}%`, "--alvo": `${Math.min(vizinho * 100, 100).toFixed(2)}cqw` } as CSSProperties}
    >
      <span className="sr-only">{nome}</span>
      {/* marca de cidade das cartas antigas: anel de tinta com miolo de papel */}
      <span aria-hidden className="size-3 rounded-full border-2 shadow-[0_0_0_1px_rgb(239_223_182/0.7)]" style={{ borderColor: TINTA, background: PAPEL }} />
    </button>
  );
}

function BotaoZoom({ rotulo, sinal, desligado, onClick }: { rotulo: string; sinal: string; desligado: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={rotulo}
      title={rotulo}
      disabled={desligado}
      onClick={onClick}
      className="grid size-8 pointer-coarse:size-11 cursor-pointer place-items-center rounded-full border text-xl leading-none shadow-md focus-visible:outline-3 focus-visible:outline-offset-1 focus-visible:outline-blue-500 disabled:cursor-default disabled:opacity-40"
      style={{ background: PAPEL, color: TINTA, borderColor: TINTA }}
    >
      <span aria-hidden>{sinal}</span>
    </button>
  );
}

// regiões que ficam fora deste mapa de propósito: no lugar do "ainda não definida", o motivo
const ALEM_DO_MAPA: Record<string, string> = {
  "mannaka-oko": "Man'naka oko é uma terra muito distante, além das bordas deste mapa.",
};

export function Minimapa({ regionId, subregionId, focarRegiao = false, onSelectRegiao, onSelectSubregiao, bloqueio, className = "" }: Props) {
  const atual = lugarEscolhido(regionId, subregionId);
  const subs = focarRegiao && atual ? pinosDasSubregioes(atual.regionId) : [];
  const regiaoAtual = atual ? pino(atual.regionId) : undefined;
  const base = subs.length ? vistaPara([...subs, ...(temPosicao(regiaoAtual) ? [regiaoAtual] : [])]) : vistaPara([]);

  // Aproximar (botões, pinça) e arrastar: reforço para pinos vizinhos; as cartas seguem como alternativa. `ajuste` vale
  // até a moldura voltar ao enquadramento automático (trocar de fase ou de região na fase das subregiões).
  const [ajuste, setAjuste] = useState<Vista | null>(null);
  const [gesto, setGesto] = useState(false);
  const chave = focarRegiao ? `foco:${atual?.regionId}` : "continente";
  const [chaveDoAjuste, setChaveDoAjuste] = useState(chave);
  if (chave !== chaveDoAjuste) {
    setChaveDoAjuste(chave);
    setAjuste(null);
  }
  const vista = ajuste ?? base;
  const aproximado = vista.s > base.s + 1e-6;
  // vários eventos de ponteiro chegam antes do próximo render: cada um parte da vista que o anterior deixou, não da do render
  const vistaAgora = useRef(vista);
  useEffect(() => {
    vistaAgora.current = vista;
  }, [vista]);
  const mudar = (v: Vista) => {
    const n = enquadrar(v, base.s);
    const aprox = n.s > base.s + 1e-6;
    vistaAgora.current = aprox ? n : base;
    setAjuste(aprox ? n : null);
  };
  const ponteiros = useRef(new Map<number, { x: number; y: number; x0: number; y0: number }>());
  const arrastou = useRef(false);
  const aoPressionar = (e: PointerEvent<HTMLElement>) => {
    arrastou.current = false;
    ponteiros.current.set(e.pointerId, { x: e.clientX, y: e.clientY, x0: e.clientX, y0: e.clientY });
  };
  const aoMover = (e: PointerEvent<HTMLElement>) => {
    const p = ponteiros.current.get(e.pointerId);
    if (!p) return;
    if (e.pointerType === "mouse" && !e.buttons) return void ponteiros.current.delete(e.pointerId); // soltou fora da moldura
    const largura = e.currentTarget.getBoundingClientRect().width;
    const outros = [...ponteiros.current.entries()].filter(([id]) => id !== e.pointerId).map(([, o]) => o);
    if (outros.length) {
      // pinça: a razão entre as distâncias dos dois dedos, antes e depois deste movimento, vira zoom no centro da moldura
      const antes = Math.hypot(p.x - outros[0].x, p.y - outros[0].y);
      const depois = Math.hypot(e.clientX - outros[0].x, e.clientY - outros[0].y);
      if (antes > 0) mudar({ ...vistaAgora.current, s: vistaAgora.current.s * (depois / antes) });
      arrastou.current = true;
      setGesto(true);
    } else if (vistaAgora.current.s > base.s + 1e-6 && Math.hypot(e.clientX - p.x0, e.clientY - p.y0) > LIMIAR_ARRASTO) {
      if (!arrastou.current) e.currentTarget.setPointerCapture(e.pointerId);
      arrastou.current = true;
      setGesto(true);
      const v = vistaAgora.current;
      mudar({ ...v, cx: v.cx - (e.clientX - p.x) / (largura * v.s), cy: v.cy - (e.clientY - p.y) / (largura * v.s * PROPORCAO) });
    }
    p.x = e.clientX;
    p.y = e.clientY;
  };
  const aoSoltar = (e: PointerEvent<HTMLElement>) => {
    ponteiros.current.delete(e.pointerId);
    if (!ponteiros.current.size) setGesto(false);
  };
  const distante = atual && !atual.pos ? ALEM_DO_MAPA[atual.regionId] : undefined;
  const alt = atual?.pos
    ? `Mapa do continente de Athanor. Pino na posição de ${atual.nome}`
    : distante
      ? `Mapa do continente de Athanor. ${distante}`
      : atual
        ? `Mapa do continente de Athanor. Localização de ${atual.nome} ainda não definida`
        : "Mapa do continente de Athanor";
  const mascara: CSSProperties = vista.s < 1 ? ESFUMADO : { maskImage: RADIAL, WebkitMaskImage: RADIAL };
  const marcador = atual?.pos && naMoldura(vista, atual.pos.x, atual.pos.y);
  const pinos = subs.length
    ? subs.map((p) => ({
        id: p.id,
        nome: p.nome,
        ...naMoldura(vista, p.x, p.y),
        escolhido: subregionId === p.id,
        motivos: undefined,
        onClick: onSelectSubregiao && (() => onSelectSubregiao(p.id)),
      }))
    : PINOS_DE_REGIAO.map((p) => ({
        id: p.id,
        nome: nomeDaRegiao(p.id),
        ...naMoldura(vista, p.x, p.y),
        escolhido: atual?.regionId === p.id,
        motivos: bloqueio?.(p.id),
        onClick: onSelectRegiao && (() => onSelectRegiao(p.id)),
      }));

  return (
    <figure
      data-minimapa
      aria-label="Minimapa de Athanor"
      // aproximado, o dedo arrasta o mapa; no enquadramento inicial a página rola na vertical e a pinça chega aqui
      className={`relative m-0 aspect-video overflow-hidden [container-type:inline-size] ${gesto ? "[&_*]:!transition-none" : ""} ${className}`}
      style={{ borderRadius: vitrine.radius, boxShadow: vitrine.shadow, background: `radial-gradient(ellipse at center, ${PAPEL}, #d9c08a)`, touchAction: aproximado ? "none" : "pan-y" }}
      onPointerDown={aoPressionar}
      onPointerMove={aoMover}
      onPointerUp={aoSoltar}
      onPointerCancel={aoSoltar}
      onClickCapture={(e) => {
        // depois de arrastar, o dedo que sobe sobre um pino não é uma escolha
        if (arrastou.current) {
          e.stopPropagation();
          e.preventDefault();
          arrastou.current = false;
        }
      }}
    >
      {/* a carta é quase quadrada e a moldura é 16:9: no continente inteiro sobram faixas nos lados; o próprio mapa, borrado, preenche */}
      <Image
        src={MAPA.src}
        alt=""
        aria-hidden
        width={MAPA.largura}
        height={MAPA.altura}
        sizes="(min-width: 1024px) 60rem, 200vw"
        className="pointer-events-none absolute top-1/2 left-0 h-auto w-full max-w-none -translate-y-1/2 scale-110 [filter:sepia(.8)_saturate(.7)_contrast(.95)_brightness(1.12)_blur(12px)]"
      />
      {/* a carta: imagem em sépia, enquadrada pela vista (continente inteiro ou a região escolhida) */}
      <Image
        src={MAPA.src}
        alt={alt}
        width={MAPA.largura}
        height={MAPA.altura}
        sizes="(min-width: 1024px) 60rem, 200vw"
        // sépia clara e laterais esfumadas no mapa borrado de fundo: a carta não fica como um retângulo de foto sobre o pergaminho
        className={`absolute h-auto max-w-none [filter:sepia(.8)_saturate(.7)_contrast(.95)_brightness(1.12)] ${MOVE}`}
        style={{ ...pos(vista, 0, 0), ...mascara, width: `${vista.s * 100}%` }}
      />
      {/* vinhetas a tinta do lore (Ponte Matriz, forjas, colmeias...), no mesmo enquadramento da carta; gera scripts/gerar-vinhetas-mapa.mjs */}
      {/* eslint-disable-next-line @next/next/no-img-element -- SVG estático e decorativo; next/image não otimiza SVG */}
      <img
        src={MAPA.vinhetas}
        alt=""
        aria-hidden
        decoding="async"
        draggable={false}
        className={`pointer-events-none absolute h-auto max-w-none ${MOVE}`}
        style={{ ...pos(vista, 0, 0), ...mascara, width: `${vista.s * 100}%` }}
      />
      {/* papel por cima: tom de pergaminho, linhas de meridiano e bordas queimadas */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-multiply"
        style={{
          background: `repeating-linear-gradient(90deg, transparent 0 calc(12.5% - 1px), rgb(59 36 18 / 0.18) calc(12.5% - 1px) 12.5%),
            repeating-linear-gradient(0deg, transparent 0 calc(22% - 1px), rgb(59 36 18 / 0.18) calc(22% - 1px) 22%),
            linear-gradient(rgb(226 200 150 / 0.35), rgb(226 200 150 / 0.35))`,
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ boxShadow: "inset 0 0 40px 8px rgb(70 40 15 / 0.55)" }} />
      <RosaDosVentos />
      {/* alternativa de um toque só à pinça e ao arrasto */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1" onPointerDown={(e) => e.stopPropagation()}>
        <BotaoZoom rotulo="Aproximar o mapa" sinal="+" desligado={vista.s >= ESCALA_MAX - 1e-6} onClick={() => mudar({ ...vistaAgora.current, s: vistaAgora.current.s * PASSO_ZOOM })} />
        <BotaoZoom rotulo="Afastar o mapa" sinal="−" desligado={!aproximado} onClick={() => mudar({ ...vistaAgora.current, s: vistaAgora.current.s / PASSO_ZOOM })} />
      </div>

      {pinos.map((p, i) => (
        <Marca key={p.id} {...p} vizinho={vizinhoMaisPerto(i, pinos)} />
      ))}

      {marcador && (
        // um só alfinete que desliza entre os lugares; o rótulo troca (sai o anterior, entra o novo)
        <div aria-hidden data-pino-atual className={`pointer-events-none absolute ${MOVE}`} style={{ left: `${marcador.left}%`, top: `${marcador.top}%` }}>
          <svg viewBox="0 0 24 32" className="absolute bottom-0 h-8 w-6 -translate-x-1/2 drop-shadow-[0_2px_2px_rgb(0_0_0/0.55)]">
            <path d="M12 31 C12 31 2 18 2 11 A10 10 0 0 1 22 11 C22 18 12 31 12 31 Z" fill="var(--accent)" stroke={TINTA} strokeWidth="2" />
            <circle cx="12" cy="11" r="4" fill={PAPEL} stroke={TINTA} strokeWidth="1.5" />
          </svg>
          <span
            key={atual.nome}
            data-rotulo-pino
            className={`absolute -top-7 w-max max-w-40 rounded-sm border px-2 py-0.5 font-[family-name:var(--font-rotulo)] text-sm leading-tight shadow-md motion-safe:animate-[rotulo-entra_400ms_ease-out] ${lado(marcador.left)}`}
            style={{ background: PAPEL, color: TINTA, borderColor: TINTA }}
          >
            {atual.nome}
          </span>
        </div>
      )}

      {atual && !atual.pos && (
        <figcaption role="note" className="absolute inset-x-0 bottom-0 px-4 py-2 text-sm font-semibold text-foreground" style={{ background: vitrine.captionBg }}>
          {distante ?? "Localização no mapa ainda não definida."}
        </figcaption>
      )}
    </figure>
  );
}
