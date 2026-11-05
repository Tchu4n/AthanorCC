"use client";

import { useEffect, useState } from "react";

// Folga, em pixels, para considerar que já está no topo ou no fim.
const FOLGA = 200;
const BOTAO =
  "grid size-11 cursor-pointer place-items-center rounded-full border border-border bg-surface text-lg text-foreground shadow-md hover:bg-background focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue-500";

/** Botões fixos para ir ao topo ou ao fim da página; cada um só aparece quando há para onde rolar. */
export function RolarPagina() {
  const [pos, setPos] = useState({ topo: true, fim: true });

  useEffect(() => {
    let quadro = 0;
    const atualizar = () => {
      quadro = 0;
      const el = document.documentElement;
      setPos({ topo: window.scrollY < FOLGA, fim: window.scrollY + window.innerHeight > el.scrollHeight - FOLGA });
    };
    const agendar = () => {
      if (!quadro) quadro = requestAnimationFrame(atualizar);
    };
    atualizar();
    window.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar);
    // a altura muda ao trocar de etapa sem rolar; o observer pega isso
    const obs = new ResizeObserver(agendar);
    obs.observe(document.body);
    return () => {
      window.removeEventListener("scroll", agendar);
      window.removeEventListener("resize", agendar);
      obs.disconnect();
      if (quadro) cancelAnimationFrame(quadro);
    };
  }, []);

  const rolar = (top: number) => {
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top, behavior: reduzido ? "auto" : "smooth" });
  };

  if (pos.topo && pos.fim) return null;
  return (
    <nav aria-label="Rolagem da página" data-rolagem className="fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-20 flex flex-col gap-2 print:hidden">
      {!pos.topo && (
        <button type="button" className={BOTAO} aria-label="Ir para o topo" title="Ir para o topo" onClick={() => rolar(0)}>
          <span aria-hidden="true">↑</span>
        </button>
      )}
      {!pos.fim && (
        <button
          type="button"
          className={BOTAO}
          aria-label="Ir para o fim da página"
          title="Ir para o fim da página"
          onClick={() => rolar(document.documentElement.scrollHeight)}
        >
          <span aria-hidden="true">↓</span>
        </button>
      )}
    </nav>
  );
}
