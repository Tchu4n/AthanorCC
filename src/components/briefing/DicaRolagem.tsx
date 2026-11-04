"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

// Avisa, no pé da coluna de explicação, que há mais texto abaixo; some quando a rolagem chega ao fim.
export function DicaRolagem({ alvo }: { alvo: HTMLElement | null }) {
  const [temMais, setTemMais] = useState(false);

  useEffect(() => {
    if (!alvo) return;
    const atualizar = () => setTemMais(alvo.scrollTop + alvo.clientHeight < alvo.scrollHeight - 8);
    atualizar();
    alvo.addEventListener("scroll", atualizar, { passive: true });
    // o conteúdo troca a cada escolha (portal) e a janela pode mudar de tamanho
    const resize = new ResizeObserver(atualizar);
    resize.observe(alvo);
    const mutacao = new MutationObserver(atualizar);
    mutacao.observe(alvo, { childList: true, subtree: true, characterData: true });
    return () => {
      alvo.removeEventListener("scroll", atualizar);
      resize.disconnect();
      mutacao.disconnect();
    };
  }, [alvo]);

  if (!alvo || !temMais) return null;
  // sticky de altura zero: o degradê cola no fundo da área visível sem ocupar espaço no texto
  return createPortal(
    <div aria-hidden="true" data-dica-rolagem className="pointer-events-none sticky bottom-0 -mt-4 h-0">
      <div className="absolute inset-x-0 bottom-0 flex h-20 items-end justify-center bg-gradient-to-t from-black/85 to-transparent pb-2">
        <span className="rounded-full bg-accent px-3 py-1 text-sm font-bold text-accent-text shadow-md">↓ Role para ler mais</span>
      </div>
    </div>,
    alvo,
  );
}
