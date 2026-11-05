import { useSyncExternalStore } from "react";

const DESKTOP = "(min-width: 1024px)";
const assinar = (cb: () => void) => {
  const m = window.matchMedia(DESKTOP);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};

/** Abaixo de lg (1024 px, o breakpoint do Tailwind). No servidor e sem matchMedia (testes unitários) vale false. */
export function useCelular() {
  return useSyncExternalStore(
    assinar,
    () => typeof window.matchMedia === "function" && !window.matchMedia(DESKTOP).matches,
    () => false,
  );
}
