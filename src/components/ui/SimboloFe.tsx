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
      {/* feixe de galhos amarrado: cada galho sozinho se quebra, juntos não (o bem-comum acima do indivíduo) */}
      <path d="M32 52 V11 M32 24 l-5 -5 M32 32 l6 -6" />
      <path d="M29 52 C27 40 24 28 22 14 M25 31 l-5 -4" />
      <path d="M35 52 C37 40 40 28 42 14 M39 31 l5 -4" />
      <path d="M26 52 C22 42 17 33 13 22 M18 34 l-4 -1" />
      <path d="M38 52 C42 42 47 33 51 22 M46 34 l4 -1" />
      {/* a atadura e a base cortada rente */}
      <path d="M24 43 H40 M23.5 47 H40.5" strokeWidth={2.4} />
      <path d="M24 52 H40" />
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
      {/* farol com a chama fora de controle: a luz que devia guiar transborda da lanterna, escorre pela torre e a consome */}
      <path d="M26 56 L29 34 H35 L38 56 Z" fill="currentColor" fillOpacity=".2" />
      <path d="M24 56 H40 M27.4 48 H36.6 M28.2 41 H35.8" />
      <path d="M27 34 H37 M28.5 34 V28 H35.5 V34" />
      <path d="M32 28 C20 24 27 16 24 6 C31 10 34 15 33 19 C37 14 39 10 38 5 C46 14 44 24 36 28 Z" fill="currentColor" fillOpacity=".3" />
      <path d="M29 30 C18 30 18 21 12 17 C20 17 24 21 26 25 M35 30 C46 30 46 21 52 17 C44 17 40 21 38 25" />
      <path d="M29.5 34 C26 38 29 41 27 45 M34.5 34 C38 38 35 41 37 45" />
      <path d="M16 12 l-2 -3 M48 12 l2 -3 M12 28 l-3 -1 M52 28 l3 -1" strokeWidth={1.4} />
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
