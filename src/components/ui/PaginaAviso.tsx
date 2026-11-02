import type { ReactNode } from "react";
import { Pergaminho } from "./Pergaminho";
import { FundoEtapa } from "./FundoEtapa";

/** Página de aviso no visual do site (pergaminho sobre a mesa): usada pela página de erro e pela de "não encontrado". */
export function PaginaAviso({ titulo, children, acoes }: { titulo: string; children: ReactNode; acoes: ReactNode }) {
  return (
    <>
      {/* o mesmo fundo de mesa e pano do criador */}
      <FundoEtapa image={null} />
      <Pergaminho className="mx-auto my-16 w-[calc(100%-2rem)] max-w-xl">
        <main className="space-y-4 p-8 text-center">
          <p className="text-xs font-bold tracking-[0.2em] text-muted uppercase">Criador de personagem</p>
          <h1 className="font-[family-name:var(--font-titulo)] text-3xl font-bold">{titulo}</h1>
          <div className="space-y-2">{children}</div>
          <div className="flex flex-wrap justify-center gap-3 pt-2">{acoes}</div>
        </main>
      </Pergaminho>
    </>
  );
}
