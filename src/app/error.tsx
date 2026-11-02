"use client"; // páginas de erro precisam ser Client Components

import Link from "next/link";
import { useEffect } from "react";
import { Button, botao } from "@/components/ui/Button";
import { PaginaAviso } from "@/components/ui/PaginaAviso";

// Erro inesperado ao montar a página: mensagem em pt-BR, sem detalhes internos; o erro vai para o console.
export default function PaginaErro({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => console.error(error), [error]);
  const inicio = botao("secondary");
  return (
    <PaginaAviso
      titulo="Algo deu errado"
      acoes={
        <>
          <Button onClick={() => retry()}>Tentar de novo</Button>
          <Link href="/criar" className={inicio.className} style={inicio.style}>
            Voltar ao início
          </Link>
        </>
      }
    >
      <p>Não foi possível montar esta página. Tente de novo; se o problema continuar, recarregue o navegador.</p>
    </PaginaAviso>
  );
}
