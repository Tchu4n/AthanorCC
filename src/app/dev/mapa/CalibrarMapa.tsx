"use client";

import { useMemo, useRef, useState, type PointerEvent } from "react";
import { MAPA, PINOS, type Pino } from "@/data/mapa";
import { getRegions } from "@/lib/catalogo";
import { texto } from "@/lib/ficha";
import { agruparPinos } from "./agrupar";
import { serializarMapa } from "./serializar";

const arred = (v: number) => Math.round(Math.min(1, Math.max(0, v)) * 1000) / 1000;

const COR: Record<Pino["status"], string> = { estimado: "#f2c14e", calibrado: "#5fd17a", "sem posição": "#9aa0a6" };
const ESCALA_MAX = 6;

export function CalibrarMapa() {
  const [pinos, setPinos] = useState(PINOS);
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const [arrastando, setArrastando] = useState<string | null>(null);
  const [foco, setFoco] = useState<string | null>(null); // região em foco: só ela e as subregiões dela aparecem no mapa
  const [mostrarRegioes, setMostrarRegioes] = useState(true);
  const [mostrarSubs, setMostrarSubs] = useState(true);
  const [aviso, setAviso] = useState("");
  const mapa = useRef<HTMLDivElement>(null);

  const regioes = useMemo(() => getRegions(), []);
  const { grupos, soltos } = useMemo(() => agruparPinos(pinos, regioes), [pinos, regioes]);

  // id -> o que é (região ou subregião de qual região) e o texto de lore, para conferir a descrição contra a posição
  const info = useMemo(() => {
    const m = new Map<string, { nome: string; tipo: string; regiaoId: string; briefing: string }>();
    for (const r of regioes) {
      m.set(r.id, { nome: r.name, tipo: "Região", regiaoId: r.id, briefing: r.briefing });
      for (const s of r.subregions) m.set(s.id, { nome: s.name, tipo: `Subregião de ${r.name}`, regiaoId: r.id, briefing: s.briefing });
    }
    return m;
  }, [regioes]);
  const ehRegiao = (id: string) => info.get(id)?.tipo === "Região";
  const nomeDe = (id: string) => info.get(id)?.nome ?? id;

  const posicaoDo = (e: PointerEvent) => {
    const r = mapa.current!.getBoundingClientRect();
    return { x: arred((e.clientX - r.left) / r.width), y: arred((e.clientY - r.top) / r.height) };
  };
  // mover marca como calibrado: só esta página promove um pino a "calibrado"
  const mover = (id: string, pos: { x: number; y: number }) =>
    setPinos((ps) => ps.map((p) => (p.id === id ? { ...p, ...pos, status: "calibrado" } : p)));

  async function copiar() {
    const conteudo = serializarMapa(pinos);
    try {
      await navigator.clipboard.writeText(conteudo);
      setAviso("Copiado. Cole no lugar de todo o conteúdo de src/data/mapa.ts e rode npm run validate:data.");
    } catch {
      setAviso("A área de transferência foi bloqueada: copie o texto da caixa abaixo.");
    }
  }

  const visivel = (p: Pino) => {
    if (p.id === selecionado) return true;
    if (foco) return info.get(p.id)?.regiaoId === foco;
    return ehRegiao(p.id) ? mostrarRegioes : mostrarSubs;
  };
  // Com foco, o mapa aproxima a região: enquadra os pinos dela (com folga) para as subregiões vizinhas não se amontoarem.
  const vista = useMemo(() => {
    const pts = foco ? pinos.filter((p) => p.x !== undefined && info.get(p.id)?.regiaoId === foco) : [];
    if (pts.length === 0) return { s: 1, x0: 0, y0: 0 };
    const xs = pts.map((p) => p.x!);
    const ys = pts.map((p) => p.y!);
    const [x1, x2, y1, y2] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
    const s = Math.min(ESCALA_MAX, Math.max(1, Math.min(0.68 / Math.max(x2 - x1, 0.06), 0.68 / Math.max(y2 - y1, 0.06))));
    const limitar = (v: number, max: number) => Math.min(max, Math.max(0, v));
    return { s, x0: limitar((x1 + x2) / 2 - 0.5 / s, 1 - 1 / s), y0: limitar((y1 + y2) / 2 - 0.5 / s, 1 - 1 / s) };
  }, [foco, pinos, info]);
  const atual = pinos.find((p) => p.id === selecionado);
  const dadosAtual = selecionado ? info.get(selecionado) : undefined;
  const semPosicao = pinos.filter((p) => p.x === undefined).length;

  const selecionar = (id: string) => {
    setSelecionado(id);
    const regiaoId = info.get(id)?.regiaoId;
    if (foco && regiaoId && regiaoId !== foco) setFoco(regiaoId);
  };

  const linha = (id: string, pino: Pino | undefined, filha = false) => (
    <label key={id} className={`flex cursor-pointer items-center gap-2 rounded px-1 py-0.5 text-sm hover:bg-white/10 ${filha ? "ml-4" : "font-semibold"} ${id === selecionado ? "bg-white/15" : ""}`}>
      <input type="radio" name="pino" checked={id === selecionado} onChange={() => selecionar(id)} disabled={!pino} />
      <span
        aria-hidden
        className={`inline-block shrink-0 border border-black ${filha ? "size-3 rounded-full" : "size-3 rotate-45 rounded-[2px]"}`}
        style={{ background: pino ? COR[pino.status] : "transparent", borderStyle: pino ? "solid" : "dashed", borderColor: pino ? "black" : "#9aa0a6" }}
      />
      <span className={pino ? "" : "opacity-60"}>{nomeDe(id)}</span>
      <span className="ml-auto text-xs opacity-60">{pino ? (pino.x === undefined ? "sem posição" : pino.status) : "sem registro"}</span>
    </label>
  );

  return (
    <main className="space-y-4 bg-[#1b1d22] p-6 text-white">
      <h1 className="text-xl font-semibold">Calibração do minimapa</h1>
      <p className="max-w-3xl text-sm">
        Escolha um lugar na lista (ou clique no pino) e clique no mapa para pôr o pino ali; também dá para arrastar. Pinos movidos viram
        &quot;calibrado&quot;. Losango é <strong>região</strong>, círculo é <strong>subregião</strong>. Use &quot;Focar&quot; para ver só uma região com as
        subregiões dela e o texto de lore ao lado. No fim, &quot;Copiar JSON&quot; gera o novo src/data/mapa.ts.
      </p>
      <div className="flex flex-wrap items-start gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <label className="flex items-center gap-1">
              <input type="checkbox" checked={mostrarRegioes} disabled={!!foco} onChange={(e) => setMostrarRegioes(e.target.checked)} /> Regiões (losango)
            </label>
            <label className="flex items-center gap-1">
              <input type="checkbox" checked={mostrarSubs} disabled={!!foco} onChange={(e) => setMostrarSubs(e.target.checked)} /> Subregiões (círculo)
            </label>
            {foco && (
              <button type="button" onClick={() => setFoco(null)} className="rounded bg-white/15 px-2 py-0.5">
                Em foco: {nomeDe(foco)} ✕ mostrar tudo
              </button>
            )}
            <span className="opacity-70">{semPosicao} sem posição</span>
          </div>
          {/* moldura com o formato do mapa; o mapa aproxima por dentro (transform), e getBoundingClientRect já devolve o tamanho ampliado */}
          <div className="relative w-[900px] max-w-full shrink-0 overflow-hidden" style={{ aspectRatio: `${MAPA.largura} / ${MAPA.altura}` }}>
          <div
            ref={mapa}
            data-calibrar-mapa
            data-escala={vista.s.toFixed(2)}
            className="absolute top-0 left-0 w-full origin-top-left cursor-crosshair touch-none select-none"
            style={{ transform: `scale(${vista.s}) translate(${-vista.x0 * 100}%, ${-vista.y0 * 100}%)` }}
            onPointerDown={(e) => {
              if (selecionado && !arrastando) mover(selecionado, posicaoDo(e));
            }}
            onPointerMove={(e) => arrastando && mover(arrastando, posicaoDo(e))}
            onPointerUp={() => setArrastando(null)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- ferramenta de dev; precisa do tamanho real sem otimização */}
            <img src={MAPA.src} alt="Mapa do continente de Athanor" draggable={false} className="block w-full" />
            {/* eslint-disable-next-line @next/next/no-img-element -- vinhetas do lore por cima, como no minimapa */}
            <img src={MAPA.vinhetas} alt="" aria-hidden draggable={false} className="pointer-events-none absolute inset-0 w-full" />
            {pinos
              .filter((p) => p.x !== undefined && p.y !== undefined && visivel(p))
              .map((p) => {
                const regiao = ehRegiao(p.id);
                const sel = p.id === selecionado;
                return (
                  <button
                    key={p.id}
                    type="button"
                    aria-pressed={sel}
                    title={`${nomeDe(p.id)} · ${info.get(p.id)?.tipo ?? ""} · ${p.status}`}
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      selecionar(p.id);
                      setArrastando(p.id);
                      mapa.current?.setPointerCapture(e.pointerId);
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-move"
                    // contra-escala: aproximado, pinos e rótulos mantêm o tamanho
                    style={{ left: `${p.x! * 100}%`, top: `${p.y! * 100}%`, scale: 1 / vista.s }}
                  >
                    <span className="sr-only">{nomeDe(p.id)}</span>
                    <span
                      aria-hidden
                      className={`block border-2 ${regiao ? "rotate-45 rounded-[3px] border-white" : "rounded-full border-black"} ${
                        sel ? "size-5 outline-2 outline-white" : regiao ? "size-4" : "size-3.5"
                      }`}
                      style={{ background: COR[p.status] }}
                    />
                    {/* sem foco só o selecionado mostra o nome (os rótulos de todos se amontoam); com foco, todos da região */}
                    {(sel || foco) && (
                      <span aria-hidden className="absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black/80 px-1 text-[11px]">
                        {nomeDe(p.id)}
                      </span>
                    )}
                  </button>
                );
              })}
          </div>
          </div>
        </div>

        <div className="sticky top-4 w-96 max-w-full space-y-3">
          {atual && dadosAtual && (
            <div className="space-y-1 rounded border border-white/20 bg-black/30 p-3 text-sm">
              <p className="font-semibold">
                {dadosAtual.nome} <span className="font-normal opacity-70">· {dadosAtual.tipo}</span>
              </p>
              <p>
                <strong>Pista:</strong> {atual.pista}
                {atual.x !== undefined ? ` (x ${atual.x}, y ${atual.y})` : " (sem posição: clique no mapa para pôr)"}
              </p>
              <p className="max-h-40 overflow-y-auto opacity-90">
                <strong>Lore:</strong> {texto(dadosAtual.briefing)}
              </p>
            </div>
          )}
          <div className="max-h-[60vh] space-y-2 overflow-y-auto pr-1">
            {grupos.map((g) => (
              <section key={g.regiaoId} aria-label={g.nome} className={`rounded border p-1 ${foco === g.regiaoId ? "border-white/60" : "border-white/15"}`}>
                <div className="flex items-center gap-1">
                  <div className="min-w-0 flex-1">
                    {linha(g.regiaoId, g.regiao)}
                  </div>
                  {g.subs.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setFoco(foco === g.regiaoId ? null : g.regiaoId)}
                      aria-pressed={foco === g.regiaoId}
                      className="shrink-0 rounded bg-white/15 px-2 py-0.5 text-xs"
                    >
                      {foco === g.regiaoId ? "Tirar foco" : "Focar"}
                    </button>
                  )}
                </div>
                {g.subs.map((s) => linha(s.id, s.pino, true))}
              </section>
            ))}
            {soltos.length > 0 && (
              <section aria-label="Sem região" className="rounded border border-white/15 p-1">
                <p className="text-sm font-semibold">Sem região no catálogo</p>
                {soltos.map((p) => linha(p.id, p, true))}
              </section>
            )}
          </div>
          <button type="button" onClick={copiar} className="rounded bg-white px-3 py-2 font-semibold text-black">
            Copiar JSON
          </button>
          <p role="status" className="text-sm">
            {aviso}
          </p>
        </div>
      </div>
      <textarea readOnly aria-label="Novo conteúdo de src/data/mapa.ts" value={serializarMapa(pinos)} rows={12} className="w-full font-mono text-xs text-black" />
    </main>
  );
}
