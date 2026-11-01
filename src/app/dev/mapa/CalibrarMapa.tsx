"use client";

import { useRef, useState, type PointerEvent } from "react";
import { MAPA, PINOS, type Pino } from "@/data/mapa";
import { serializarMapa } from "./serializar";
import { getRegions } from "@/lib/catalog";

const nomes = new Map(getRegions().flatMap((r) => [[r.id, r.name] as const, ...r.subregions.map((s) => [s.id, `${s.name} (${r.name})`] as const)]));
const nome = (id: string) => nomes.get(id) ?? id;
const arred = (v: number) => Math.round(Math.min(1, Math.max(0, v)) * 1000) / 1000;

const COR: Record<Pino["status"], string> = { estimado: "#f2c14e", calibrado: "#5fd17a", "sem posição": "#9aa0a6" };

export function CalibrarMapa() {
  const [pinos, setPinos] = useState(PINOS);
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const [arrastando, setArrastando] = useState<string | null>(null);
  const [aviso, setAviso] = useState("");
  const mapa = useRef<HTMLDivElement>(null);

  const posicaoDo = (e: PointerEvent) => {
    const r = mapa.current!.getBoundingClientRect();
    return { x: arred((e.clientX - r.left) / r.width), y: arred((e.clientY - r.top) / r.height) };
  };
  // mover marca como calibrado: só esta página promove um pino a "calibrado"
  const mover = (id: string, pos: { x: number; y: number }) =>
    setPinos((ps) => ps.map((p) => (p.id === id ? { ...p, ...pos, status: "calibrado" } : p)));

  async function copiar() {
    const texto = serializarMapa(pinos);
    try {
      await navigator.clipboard.writeText(texto);
      setAviso("Copiado. Cole no lugar de todo o conteúdo de src/data/mapa.ts e rode npm run validate:data.");
    } catch {
      setAviso("A área de transferência foi bloqueada: copie o texto da caixa abaixo.");
    }
  }

  const atual = pinos.find((p) => p.id === selecionado);
  return (
    <main className="space-y-4 bg-[#1b1d22] p-6 text-white">
      <h1 className="text-xl font-semibold">Calibração do minimapa</h1>
      <p className="max-w-3xl text-sm">
        Escolha um lugar na lista (ou clique no pino) e clique no mapa para pôr o pino ali; também dá para arrastar. Pinos movidos viram
        &quot;calibrado&quot;. No fim, &quot;Copiar JSON&quot; gera o novo src/data/mapa.ts.
      </p>
      <div className="flex flex-wrap items-start gap-6">
        <div
          ref={mapa}
          data-calibrar-mapa
          className="relative w-[900px] max-w-full shrink-0 cursor-crosshair touch-none select-none"
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
            .filter((p) => p.x !== undefined && p.y !== undefined)
            .map((p) => (
              <button
                key={p.id}
                type="button"
                aria-pressed={p.id === selecionado}
                title={`${nome(p.id)} (${p.status})`}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  setSelecionado(p.id);
                  setArrastando(p.id);
                  mapa.current?.setPointerCapture(e.pointerId);
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-move"
                style={{ left: `${p.x! * 100}%`, top: `${p.y! * 100}%` }}
              >
                <span className="sr-only">{nome(p.id)}</span>
                <span
                  aria-hidden
                  className={`block rounded-full border-2 border-black ${p.id === selecionado ? "size-5 outline-2 outline-white" : "size-3.5"}`}
                  style={{ background: COR[p.status] }}
                />
                {/* só o selecionado mostra o nome: com as subregiões, os rótulos de todos se amontoam (os outros têm title) */}
                {p.id === selecionado && (
                  <span aria-hidden className="absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black/80 px-1 text-[11px]">
                    {nome(p.id)}
                  </span>
                )}
              </button>
            ))}
        </div>

        <div className="w-80 space-y-3">
          <fieldset className="space-y-1">
            <legend className="font-semibold">Lugares</legend>
            {pinos.map((p) => (
              <label key={p.id} className="flex cursor-pointer items-center gap-2 text-sm">
                <input type="radio" name="pino" checked={p.id === selecionado} onChange={() => setSelecionado(p.id)} />
                <span className="inline-block size-3 rounded-full border border-black" style={{ background: COR[p.status] }} />
                <span>
                  {nome(p.id)} <span className="opacity-70">({p.status})</span>
                </span>
              </label>
            ))}
          </fieldset>
          {atual && (
            <p className="text-sm">
              <strong>Pista:</strong> {atual.pista}
              {atual.x !== undefined && ` (x ${atual.x}, y ${atual.y})`}
            </p>
          )}
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
