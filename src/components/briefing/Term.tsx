"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { glossary } from "@/data/glossary";
import { texto } from "@/lib/ficha";

const HOVER_DELAY_MS = 150;

export function Term({ id, children }: { id: string; children?: ReactNode }) {
  const entry = glossary.find((g) => g.id === id);
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const wrapper = useRef<HTMLSpanElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const tooltipId = useId();

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
        id={tooltipId}
        role="tooltip"
        hidden={!open}
        className="fixed inset-x-4 bottom-4 z-20 block rounded-md border border-foreground/20 bg-background p-3 text-left text-sm font-normal shadow-lg motion-safe:animate-[term-in_120ms_ease-out] sm:absolute sm:inset-x-auto sm:bottom-auto sm:left-0 sm:top-full sm:mt-1 sm:w-72"
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
