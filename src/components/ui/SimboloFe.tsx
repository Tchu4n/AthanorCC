import type { ReactNode } from "react";
import { Medalhao } from "./Medalhao";

// Símbolos das fés, tirados do Panteão e das Regras Globais: o lore dá a espiral de Logan, a lua de Umbra,
// a vela de Activum e o sol de Gorturk; os demais saem dos domínios de cada deus. viewBox 64 x 64, desenho entre 8 e 56.

const n = (v: number) => Math.round(v * 10) / 10;

// espiral de Arquimedes a partir do centro (Logan: razão pura, geométrica e causal)
const espiral = Array.from({ length: 90 }, (_, i) => {
  const t = (i / 89) * Math.PI * 5;
  const r = 1 + t * 1.15;
  return `${i ? "L" : "M"}${n(32 + Math.cos(t) * r)} ${n(32 + Math.sin(t) * r)}`;
}).join(" ");

// favo: um hexágono no centro e seis em volta (Mui: o coletivo; a colmeia de Kruk é devota dele)
const hexagono = (cx: number, cy: number, r: number) =>
  Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i;
    return `${i ? "L" : "M"}${n(cx + Math.cos(a) * r)} ${n(cy + Math.sin(a) * r)}`;
  }).join(" ") + " Z";
const favo = [[0, 0], ...Array.from({ length: 6 }, (_, i) => [Math.cos(Math.PI / 6 + (Math.PI / 3) * i) * 12.1, Math.sin(Math.PI / 6 + (Math.PI / 3) * i) * 12.1])];

// raios em ponta de lança (Gorturk: sol, destino e expansão sem fim)
const lancas = Array.from({ length: 8 }, (_, i) => {
  const a = (Math.PI / 4) * i;
  const p = (r: number, d = 0) => `${n(32 + Math.cos(a + d) * r)} ${n(32 + Math.sin(a + d) * r)}`;
  return `M${p(12, -0.16)} L${p(23)} L${p(12, 0.16)}`;
}).join(" ");

export const SIMBOLOS_FE: Record<string, ReactNode> = {
  logan: (
    <>
      <rect x="11" y="11" width="42" height="42" strokeWidth={1.2} />
      <path d={espiral} />
    </>
  ),
  umbra: (
    <>
      {/* lua crescente e lua cheia em equilíbrio no mesmo travessão: forças opostas e complementares */}
      <path d="M24 22 A10 10 0 1 0 24 42 A8 8 0 1 1 24 22 Z" fill="currentColor" fillOpacity=".25" />
      <circle cx="42" cy="32" r="8" fill="currentColor" fillOpacity=".25" />
      <path d="M12 46 H52 M32 46 L27 54 H37 Z" />
    </>
  ),
  activum: (
    <>
      <path d="M32 9 Q38 17 32 22 Q26 17 32 9 Z" fill="currentColor" fillOpacity=".3" />
      <path d="M32 22 V25 M26 25 H38 V50 H26 Z M22 50 H42 M20 14 l-4 -3 M44 14 l4 -3 M19 22 h-5 M45 22 h5" />
    </>
  ),
  mui: (
    <>
      {favo.map(([dx, dy], i) => (
        <path key={i} d={hexagono(32 + dx, 32 + dy, 6.6)} fill={i ? "none" : "currentColor"} fillOpacity={i ? undefined : 0.3} />
      ))}
    </>
  ),
  gorturk: (
    <>
      <circle cx="32" cy="32" r="9" fill="currentColor" fillOpacity=".3" />
      <path d={lancas} />
    </>
  ),
  tamem: (
    <>
      {/* espada erguida com labaredas subindo pela lâmina: guerra, força e fogo */}
      <path d="M32 8 L35.5 13 V39 H28.5 V13 Z" fill="currentColor" fillOpacity=".2" />
      <path d="M22 39 H42 M32 39 V50" strokeWidth={2.4} />
      <circle cx="32" cy="53" r="2.5" />
      <path d="M27 37 C19 32 22 24 19 15 C24 20 26 24 27 28 M37 37 C45 32 42 24 45 15 C40 20 38 24 37 28" />
      <path d="M26 30 C22 27 23 23 22 20 M38 30 C42 27 41 23 42 20" strokeWidth={1.2} />
    </>
  ),
  nilos: (
    <>
      {/* corrente partida: todo poder, estado ou dogma é uma prisão; o último elo se abre */}
      <rect x="9" y="38" width="16" height="10" rx="5" transform="rotate(-35 17 43)" />
      <rect x="19" y="29" width="16" height="10" rx="5" transform="rotate(-35 27 34)" />
      <g transform="rotate(-35 40 24)">
        <path d="M37 19 H35 A5 5 0 0 0 35 29 H37" />
        <path d="M43 19 H45 A5 5 0 0 1 45 29 H43" transform="translate(5 -2)" />
      </g>
      <path d="M44 31 l3 3 M49 27 l4 0 M41 13 l-1 -4 M47 16 l3 -3" strokeWidth={1.4} />
    </>
  ),
  "deus-oculto": (
    <>
      {/* a Forma das Formas: quadrado, círculo e losango encaixados, e o olho que ainda não despertou */}
      <rect x="12" y="12" width="40" height="40" strokeWidth={1} />
      <circle cx="32" cy="32" r="20" strokeWidth={1.2} />
      <path d="M32 14 L50 32 L32 50 L14 32 Z" />
      <path d="M24 31 Q32 37 40 31 M27 34 l-1.5 3 M32 35.5 v3 M37 34 l1.5 3" />
    </>
  ),
};

/** Medalhão com o símbolo da fé; null se a fé não tem símbolo. */
export function SimboloFe({ id, className = "" }: { id: string; className?: string }) {
  const desenho = SIMBOLOS_FE[id];
  return desenho ? <Medalhao tipo="fe" id={id} desenho={desenho} className={className} /> : null;
}
