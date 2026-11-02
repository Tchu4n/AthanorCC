import type { CSSProperties, ReactNode } from "react";

// cor da região com um pouco da cor do texto: contraste mesmo quando a região é clara (Midland é quase branca)
const COR: CSSProperties = { color: "color-mix(in oklch, var(--accent) 70%, var(--foreground))" };

/** Aro do medalhão (ofícios, fés e brasões de região) com o desenho no meio, na cor da região. */
export function Medalhao({ tipo, id, desenho, className = "" }: { tipo: "oficio" | "fe" | "regiao"; id: string; desenho: ReactNode; className?: string }) {
  return (
    <svg
      aria-hidden
      {...{ [`data-simbolo-${tipo}`]: id }}
      viewBox="0 0 64 64"
      className={className}
      style={COR}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="32" cy="32" r="30.5" fill="currentColor" fillOpacity=".08" strokeWidth={1.2} />
      <circle cx="32" cy="32" r="28" strokeWidth={0.6} strokeDasharray="1.5 2.5" />
      {[0, 90, 180, 270].map((a) => (
        <path key={a} d="M32 0 L34 2 L32 4 L30 2 Z" fill="currentColor" stroke="none" transform={`rotate(${a} 32 32)`} />
      ))}
      <g transform="translate(6.4 6.4) scale(.8)">{desenho}</g>
    </svg>
  );
}
