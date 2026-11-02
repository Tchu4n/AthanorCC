import type { ReactNode } from "react";
import { Medalhao } from "./Medalhao";

// Símbolos minimalistas dos ofícios que ainda não têm arte: traço único dentro de um medalhão, na cor da região.
// viewBox 64 x 64; o desenho fica entre 8 e 56 para não encostar no aro.

const engrenagem = Array.from({ length: 8 }, (_, i) => <rect key={i} x="29" y="12" width="6" height="7" rx="1" transform={`rotate(${i * 45} 32 32)`} />);

export const SIMBOLOS: Record<string, ReactNode> = {
  bardo: (
    <g transform="rotate(-35 32 32)">
      <path d="M32 26 C44 26 46 40 44 46 C42 53 22 53 20 46 C18 40 20 26 32 26 Z" fill="currentColor" fillOpacity=".15" />
      <circle cx="32" cy="38" r="3.5" />
      <path d="M30 27 V11 H34 V27 M30 11 L28 6 H36 L34 11 M31 11 V48 M33 11 V48 M27 48 H37" />
    </g>
  ),
  contrabandista: (
    <>
      <rect x="16" y="24" width="32" height="24" rx="1.5" />
      <path d="M16 32 H48 M16 40 H48 M16 24 L48 48 M22 18 H42 L48 24 M22 18 L16 24" />
      <circle cx="42" cy="28" r="0.8" fill="currentColor" />
    </>
  ),
  cacador: <path d="M24 10 Q48 32 24 54 M24 10 V54 M14 32 H50 M45 27 L50 32 L45 37 M14 32 L11 28 M14 32 L11 36 M18 32 L15 28 M18 32 L15 36" />,
  "mago-dissidente": (
    <>
      <path d="M22 56 L38 20 M38 20 Q33 15 36 9 M40 22 Q46 19 46 12" />
      <path d="M41 6 L46 13 L41 21 L36 13 Z" fill="currentColor" fillOpacity=".25" />
      <path d="M50 24 l3 -2 M51 31 h4 M47 36 l3 2" />
    </>
  ),
  medico: (
    <>
      <path d="M18 52 L35 35 L38 38 L21 55 Z" />
      <path d="M35 35 L50 20 Q53 25 38 38" fill="currentColor" fillOpacity=".25" />
      <path d="M20 12 V30 M11 21 H29" strokeWidth={4} />
    </>
  ),
  alquimista: (
    <>
      <path d="M27 10 H37 M29 10 V25 L18 45 Q15 52 22 52 H42 Q49 52 46 45 L35 25 V10" />
      <path d="M21.5 41 H42.5 L46 45 Q49 52 42 52 H22 Q15 52 18 45 Z" fill="currentColor" fillOpacity=".25" stroke="none" />
      <circle cx="28" cy="46" r="1.6" />
      <circle cx="36" cy="44" r="2.2" />
      <circle cx="32" cy="33" r="1.4" />
    </>
  ),
  acolito: (
    <>
      <path d="M32 7 Q39 15 32 20 Q25 15 32 7 Z" fill="currentColor" fillOpacity=".25" />
      <path d="M32 20 V24 M26 24 H38 V48 H26 Z M37 28 q-2 4 0 7 M16 48 H48 M19 48 Q32 57 45 48" />
    </>
  ),
  astrologo: (
    <>
      <path d="M38 13 A19 19 0 1 0 50 41 A14 14 0 1 1 38 13 Z" fill="currentColor" fillOpacity=".15" />
      <path d="M46 10 l1.2 3.3 l3.3 1.2 l-3.3 1.2 l-1.2 3.3 l-1.2 -3.3 l-3.3 -1.2 l3.3 -1.2 Z" />
      <path d="M53 24 l.8 2.2 l2.2 .8 l-2.2 .8 l-.8 2.2 l-.8 -2.2 l-2.2 -.8 l2.2 -.8 Z" />
      <circle cx="49" cy="33" r="0.9" fill="currentColor" />
    </>
  ),
  apotecario: (
    <>
      <path d="M14 34 H50 Q48 51 32 51 Q16 51 14 34 Z" />
      <path d="M26 51 L24 55 H40 L38 51 M33 34 L42 12 Q45 10 47 13 L38 34" />
      <path d="M18 30 Q19 22 27 20 Q25 27 18 30 Z" fill="currentColor" fillOpacity=".25" />
    </>
  ),
  ferreiro: (
    <>
      <path d="M12 34 H44 Q50 34 53 29 V38 Q47 40 42 41 V45 L46 51 H22 L26 45 V41 Q16 40 12 34 Z" />
      <path d="M17 29 L30 16" />
      <path d="M26 9 L36 19 L32 23 L22 13 Z" fill="currentColor" fillOpacity=".25" />
    </>
  ),
  paladino: (
    <>
      <path d="M32 9 L49 15 V30 Q49 46 32 55 Q15 46 15 30 V15 Z" fill="currentColor" fillOpacity=".12" />
      <path d="M32 15 V48 M24 26 H40" />
    </>
  ),
  "cacador-de-monstros": (
    <>
      <path d="M32 7 L36 13 V37 H28 V13 Z" fill="currentColor" fillOpacity=".25" />
      <path d="M21 37 H43 M32 37 V50" />
      <circle cx="32" cy="53" r="2.5" />
      <path d="M13 18 L16 29 L19 18 M45 18 L48 29 L51 18" />
    </>
  ),
  detetive: (
    <>
      <circle cx="28" cy="28" r="13" />
      <path d="M37 37 L50 50" strokeWidth="5" />
      <path d="M19 28 Q28 20 37 28 Q28 36 19 28 Z" />
      <circle cx="28" cy="28" r="2.5" fill="currentColor" />
    </>
  ),
  nobre: (
    <>
      <path d="M13 44 L15 22 L24 32 L32 15 L40 32 L49 22 L51 44 Z" fill="currentColor" fillOpacity=".15" />
      <path d="M13 44 H51 V51 H13 Z" />
      <circle cx="15" cy="19" r="1.8" />
      <circle cx="32" cy="12" r="1.8" />
      <circle cx="49" cy="19" r="1.8" />
      <circle cx="24" cy="47.5" r="1.3" fill="currentColor" />
      <circle cx="32" cy="47.5" r="1.3" fill="currentColor" />
      <circle cx="40" cy="47.5" r="1.3" fill="currentColor" />
    </>
  ),
  filosofo: (
    <path d="M32 20 Q24 14 11 16 V46 Q24 44 32 50 Q40 44 53 46 V16 Q40 14 32 20 Z M32 20 V50 M16 24 Q22 23 28 26 M16 31 Q22 30 28 33 M16 38 Q22 37 28 40 M36 26 Q42 23 48 24 M36 33 Q42 30 48 31 M36 40 Q42 37 48 38" />
  ),
  cientista: (
    <>
      <g fill="currentColor" fillOpacity=".25">{engrenagem}</g>
      <circle cx="32" cy="32" r="13" />
      <circle cx="32" cy="32" r="5" />
    </>
  ),
};

/** Medalhão com o símbolo do ofício; null se o ofício não tem símbolo. */
export function SimboloOficio({ id, className = "" }: { id: string; className?: string }) {
  const desenho = SIMBOLOS[id];
  return desenho ? <Medalhao tipo="oficio" id={id} desenho={desenho} className={className} /> : null;
}
