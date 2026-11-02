import Link from "next/link";
import { botao } from "@/components/ui/Botao";
import { PaginaAviso } from "@/components/ui/PaginaAviso";

// Qualquer URL que não existe (e as páginas de desenvolvimento, em produção) cai aqui, em pt-BR.
export default function NaoEncontrada() {
  const voltar = botao("primary");
  return (
    <PaginaAviso
      titulo="Página não encontrada"
      acoes={
        <Link href="/criar" className={voltar.className} style={voltar.style}>
          Ir para o criador
        </Link>
      }
    >
      <p>Este endereço não consta nos arquivos de Athanor.</p>
    </PaginaAviso>
  );
}
