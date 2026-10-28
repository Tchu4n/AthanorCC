"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { glossary } from "@/data/glossary";
import { texto } from "@/lib/ficha";

const HOVER_DELAY_MS = 150;
const MARGEM = 16; // distância mínima das bordas da tela
const DESKTOP = "(min-width: 640px)";

// No desktop, o briefing fica junto ao termo: embaixo, ou em cima se não couber; sempre inteiro dentro da tela.
// No celular, as classes o prendem na base da tela e não há o que calcular.
function posicionar(tip: HTMLElement, termo: HTMLElement) {
  if (!matchMedia(DESKTOP).matches) return;
  const r = termo.getBoundingClientRect();
  const { offsetWidth: w, offsetHeight: h } = tip;
  const left = Math.min(Math.max(r.left, MARGEM), innerWidth - w - MARGEM);
  const top = r.bottom + 4 + h <= innerHeight - MARGEM ? r.bottom + 4 : Math.max(MARGEM, r.top - 4 - h);
  tip.style.left = `${left}px`;
  tip.style.top = `${top}px`;
}

export function Term({ id, children }: { id: string; children?: ReactNode }) {
  const entry = glossary.find((g) => g.id === id);
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const wrapper = useRef<HTMLSpanElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const tip = useRef<HTMLSpanElement>(null);
  const tooltipId = useId();

  // popover: o briefing vai para a camada do topo, por cima de tudo, sem ser cortado nem criar rolagem
  // na coluna ou no card onde está o termo. Acompanha o termo enquanto a página ou a coluna rolam.
  // useLayoutEffect: posiciona antes da pintura, sem piscar no canto da tela.
  useLayoutEffect(() => {
    const el = tip.current;
    if (!open || !el || !button.current) return;
    el.showPopover();
    const atualizar = () => button.current && posicionar(el, button.current);
    atualizar();
    addEventListener("scroll", atualizar, true);
    addEventListener("resize", atualizar);
    return () => {
      removeEventListener("scroll", atualizar, true);
      removeEventListener("resize", atualizar);
      if (el.isConnected) el.hidePopover();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onOutside = (e: PointerEvent) => !wrapper.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onOutside);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onOutside);
    };
  }, [open]);

  useEffect(() => () => clearTimeout(timer.current), []);

  if (!entry) {
    if (process.env.NODE_ENV !== "production") throw new Error(`Termo "${id}" não existe em glossary.ts`);
    return <>{children ?? id}</>;
  }

  return (
    <span
      ref={wrapper}
      className="relative"
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse") return; // toque abre pelo clique
        timer.current = setTimeout(() => setOpen(true), HOVER_DELAY_MS);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== "mouse") return;
        clearTimeout(timer.current);
        if (document.activeElement !== button.current) setOpen(false);
      }}
    >
      <button
        ref={button}
        type="button"
        aria-describedby={tooltipId}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen(true)}
        className="cursor-help font-semibold underline decoration-dotted underline-offset-4"
      >
        {children ?? entry.term}
      </button>
      <span
        ref={tip}
        id={tooltipId}
        role="tooltip"
        popover="manual"
        className="fixed inset-x-4 top-auto bottom-4 m-0 w-auto open:block rounded-md border border-foreground/20 bg-background p-3 text-left text-sm font-normal text-foreground shadow-lg motion-safe:animate-[term-in_150ms_ease-out] sm:bottom-auto sm:right-auto sm:w-72"
      >
        <span className="block font-semibold">{entry.term}</span>
        <span className="block text-xs uppercase tracking-wide opacity-70">{entry.category}</span>
        <span className="mt-1 block">{texto(entry.briefing)}</span>
      </span>
      <span role="status" className="sr-only">
        {open ? `Briefing aberto: ${entry.term}` : ""}
      </span>
    </span>
  );
}
