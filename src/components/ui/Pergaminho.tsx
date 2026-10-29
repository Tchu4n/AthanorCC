import type { ReactNode } from "react";
import { Aderecos } from "./Aderecos";

// Pergaminho em volta das escolhas da etapa, com borda rasgada, fibras, bordas queimadas,
// cantoneiras douradas. Tudo em CSS e SVG, sem imagens.

// Borda rasgada: polígono com pequenas variações determinísticas (mesmo desenho a cada render).
function bordaRasgada() {
  let semente = 7;
  const acaso = () => ((semente = (semente * 16807) % 2147483647) / 2147483647);
  const pts: string[] = [];
  const N = 48;
  const M = 36;
  for (let i = 0; i <= N; i++) pts.push(`${(i / N) * 100}% ${(acaso() * 7).toFixed(1)}px`);
  for (let i = 1; i <= M; i++) pts.push(`calc(100% - ${(acaso() * 7).toFixed(1)}px) ${(i / M) * 100}%`);
  for (let i = N - 1; i >= 0; i--) pts.push(`${(i / N) * 100}% calc(100% - ${(acaso() * 8).toFixed(1)}px)`);
  for (let i = M - 1; i >= 1; i--) pts.push(`${(acaso() * 7).toFixed(1)}px ${(i / M) * 100}%`);
  return `polygon(${pts.join(", ")})`;
}
const BORDA = bordaRasgada();

// Fibras e manchas do papel: ruído fractal do SVG, tingido de marrom.
const FIBRAS = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='320' height='320'>
    <filter id='f'><feTurbulence type='fractalNoise' baseFrequency='.9 .035' numOctaves='3' seed='4'/>
      <feColorMatrix values='0 0 0 0 .35  0 0 0 0 .22  0 0 0 0 .08  0 0 0 .55 0'/></filter>
    <rect width='100%' height='100%' filter='url(#f)'/></svg>`,
)}")`;
const MANCHAS = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600'>
    <filter id='m'><feTurbulence type='fractalNoise' baseFrequency='.012' numOctaves='4' seed='11'/>
      <feColorMatrix values='0 0 0 0 .45  0 0 0 0 .28  0 0 0 0 .1  0 0 0 -1.6 .9'/></filter>
    <rect width='100%' height='100%' filter='url(#m)'/></svg>`,
)}")`;

function Cantoneira({ className }: { className: string }) {
  return (
    <svg aria-hidden viewBox="0 0 96 96" className={`pointer-events-none absolute size-16 sm:size-24 ${className}`}>
      <defs>
        <linearGradient id="ouro" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6e3a1" />
          <stop offset=".45" stopColor="#c9a24d" />
          <stop offset=".7" stopColor="#8a6424" />
          <stop offset="1" stopColor="#e6c46f" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#ouro)" strokeLinecap="round">
        <path d="M6 90 V22 Q6 6 22 6 H90" strokeWidth="3.5" />
        <path d="M14 90 V28 Q14 14 28 14 H90" strokeWidth="1.2" />
        {/* volutas */}
        <path d="M22 22 q14 2 18 14 q2 8 -6 10 q-7 1 -7 -6 q0 -5 5 -5" strokeWidth="2" />
        <path d="M30 6 q-2 10 6 14 M6 30 q10 -2 14 6" strokeWidth="1.6" />
        <path d="M46 14 q8 -6 16 0 q-8 6 -16 0 Z M14 46 q-6 8 0 16 q6 -8 0 -16 Z" strokeWidth="1.3" fill="#c9a24d" fillOpacity=".35" />
      </g>
      <circle cx="22" cy="22" r="4" fill="url(#ouro)" stroke="#5a3d12" strokeWidth=".8" />
      <circle cx="22" cy="22" r="1.4" fill="#fff4c8" />
    </svg>
  );
}

export function Pergaminho({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {/* sombra projetada fora do recorte */}
      <div aria-hidden className="absolute inset-0 translate-y-2 rounded-sm bg-black/60 blur-xl" />
      <div
        data-pergaminho
        className="pergaminho relative"
        style={{
          clipPath: BORDA,
          backgroundImage: `${MANCHAS}, ${FIBRAS}, radial-gradient(ellipse at 30% 15%, #fbf1d3 0%, transparent 55%), radial-gradient(ellipse at 75% 85%, #c9a466 0%, transparent 60%), linear-gradient(160deg, #ecdcae, #dcc38c 50%, #cfb276)`,
          boxShadow: "inset 0 0 70px 6px rgba(92,52,16,.65), inset 0 0 14px 2px rgba(60,30,8,.55)",
        }}
      >
        {/* fio dourado duplo por dentro da borda */}
        <div aria-hidden className="pointer-events-none absolute inset-3 border border-[#a8822f]/70 sm:inset-5" />
        <div aria-hidden className="pointer-events-none absolute inset-4 border border-[#a8822f]/40 sm:inset-6" />
        <Cantoneira className="left-1 top-1" />
        <Cantoneira className="right-1 top-1 -scale-x-100" />
        <Cantoneira className="bottom-1 left-1 -scale-y-100" />
        <Cantoneira className="bottom-1 right-1 -scale-100" />
        <div className="relative">{children}</div>
      </div>
      {/* depois do papel: os adereços ficam por cima da borda dele */}
      <Aderecos />
    </div>
  );
}
