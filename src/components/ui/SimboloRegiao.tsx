import type { ReactNode } from "react";
import { Medalhao } from "./Medalhao";

// Brasões das regiões que ainda não têm arte. viewBox 64 x 64, desenho entre 8 e 56.

export const SIMBOLOS_REGIAO: Record<string, ReactNode> = {
  // nenhuma região sem arte no momento; um brasão novo entra aqui como { "id-da-regiao": (<>…</>) }
};

/** Medalhão com o brasão da região; null se a região não tem brasão. */
export function SimboloRegiao({ id, className = "" }: { id: string; className?: string }) {
  const desenho = SIMBOLOS_REGIAO[id];
  return desenho ? <Medalhao tipo="regiao" id={id} desenho={desenho} className={className} /> : null;
}
