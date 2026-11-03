import type { ReactNode } from "react";
import { Medalhao } from "./Medalhao";

// Brasões das regiões que ainda não têm arte. viewBox 64 x 64, desenho entre 8 e 56.

// espada apontada para cima, empunhadura em (0, 0)
const espada = (
  <>
    <path d="M0 -27 L1.6 -23.5 V-9 H-1.6 V-23.5 Z" fill="currentColor" fillOpacity=".35" />
    <path d="M-5.5 -9 H5.5 M0 -9 V-3" strokeWidth={2} />
    <circle cy="-1.5" r="1.6" fill="currentColor" />
  </>
);

export const SIMBOLOS_REGIAO: Record<string, ReactNode> = {
  // navio de vela quadrada sobre ondas, para o comércio por mar
  "companhia-de-comercio": (
    <>
      <path d="M32 9 V43" strokeWidth={1.6} />
      <path d="M32 11 Q47 21 45 35 H32 Z" strokeWidth={1.4} fill="currentColor" fillOpacity=".18" />
      <path d="M32 17 Q20 24 20 35 H32" strokeWidth={1.4} fill="currentColor" fillOpacity=".08" />
      <path d="M13 41 H51 Q47 50 38 51 H26 Q17 50 13 41 Z" strokeWidth={1.4} fill="currentColor" fillOpacity=".12" />
      <path d="M10 56 Q16 52 22 56 T34 56 T46 56 T54 56" strokeWidth={1.4} />
    </>
  ),
  // São Ferdinand lutou com quatro espadas, uma em cada braço, sob a vela de Activum
  "irmandade-de-sao-ferdinand": (
    <>
      <path d="M32 8 L50 13 V30 Q50 47 32 56 Q14 47 14 30 V13 Z" strokeWidth={1.4} fill="currentColor" fillOpacity=".08" />
      {/* empunhaduras afastadas na base (quatro braços) e lâminas em leque aberto */}
      {[
        [-50, 25],
        [-17, 29],
        [17, 35],
        [50, 39],
      ].map(([a, x]) => (
        <g key={a} transform={`translate(${x} 47) rotate(${a})`} strokeWidth={1.4}>
          {espada}
        </g>
      ))}
      <path d="M32 9.5 Q35.5 13.5 32 16.5 Q28.5 13.5 32 9.5 Z" fill="currentColor" />
    </>
  ),
};

/** Medalhão com o brasão da região; null se a região não tem brasão. */
export function SimboloRegiao({ id, className = "" }: { id: string; className?: string }) {
  const desenho = SIMBOLOS_REGIAO[id];
  return desenho ? <Medalhao tipo="regiao" id={id} desenho={desenho} className={className} /> : null;
}
