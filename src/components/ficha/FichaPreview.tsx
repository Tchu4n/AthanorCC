"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import type { Character } from "@/lib/character";
import { montarFicha, nomeArquivoFicha, VAZIO } from "@/lib/ficha";

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="py-2">
      <dt className="text-xs font-semibold uppercase tracking-wide opacity-70">{label}</dt>
      <dd className="whitespace-pre-wrap break-words">{children}</dd>
    </div>
  );
}

function Items({ items }: { items: { title: string; text: string }[] }) {
  if (items.length === 0) return <>{VAZIO}</>;
  return (
    <ul className="space-y-2">
      {items.map((it) => (
        <li key={it.title}>
          <span className="font-semibold">{it.title}</span>
          <span className="block text-sm">{it.text}</span>
        </li>
      ))}
    </ul>
  );
}

export function FichaPreview({ character, className = "" }: { character: Character; className?: string }) {
  const ficha = montarFicha(character);
  const [status, setStatus] = useState<"idle" | "gerando" | "erro">("idle");
  const semNome = character.identity.name.trim() === "";
  // a análise só sai completa: nome, sexo, grau de periculosidade e assinatura; a dica diz o que falta, na ordem
  const falta = semNome
    ? "Dê um nome ao personagem para exportar"
    : !character.sexo
      ? "Marque o sexo do indivíduo para exportar"
      : !character.periculosidade
        ? "Marque o grau de periculosidade para exportar"
        : !character.assinatura
          ? "Assine a análise para exportar"
          : null;
  const { imagem } = ficha.aparencia;
  // guarda o src que falhou ao carregar; trocar de imagem tira o aviso sozinho
  const [srcQuebrado, setImagemQuebrada] = useState<string | null>(null);
  const imagemQuebrada = !!imagem && srcQuebrado === imagem.src;

  async function exportar() {
    setStatus("gerando");
    try {
      // carregado só ao exportar: o react-pdf é pesado e só roda no navegador
      const { gerarFichaPdf } = await import("@/lib/ficha-pdf");
      const url = URL.createObjectURL(await gerarFichaPdf(character));
      const link = document.createElement("a");
      link.href = url;
      link.download = nomeArquivoFicha(character);
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
      setStatus("idle");
    } catch (e) {
      // a pessoa vê só a mensagem amigável; o detalhe fica no console para investigar
      console.error(e);
      setStatus("erro");
    }
  }

  return (
    <aside aria-labelledby="previa-titulo" className={`flex flex-col rounded-lg border border-foreground/20 p-4 ${className}`}>
      {/* no desktop só o resumo rola; o cabeçalho com o Exportar fica fora da rolagem (sticky deixava o texto
          passar pela margem de cima e por trás dele) */}
      <div className="shrink-0 space-y-2 border-b border-foreground/20 pb-3">
        <h2 id="previa-titulo" className="text-lg font-semibold">
          Prévia da análise
        </h2>
        <Button onClick={exportar} disabled={!!falta || status === "gerando"} aria-describedby={falta ? "dica-exportar" : undefined}>
          {status === "gerando" ? "Gerando PDF…" : "Exportar análise em PDF"}
        </Button>
        {falta && (
          <p id="dica-exportar" className="text-sm opacity-80">
            {falta}
          </p>
        )}
        <p role="status" className="text-sm">
          {status === "erro" && "Não foi possível gerar o PDF. Tente de novo."}
        </p>
      </div>
      <dl data-previa-resumo className="divide-y divide-foreground/10 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-2">
        <Row label="Nome">{ficha.nome}</Row>
        <Row label="Sexo">{ficha.sexo}</Row>
        <Row label="Idade">{ficha.idade}</Row>
        <Row label="Origem">{ficha.origem}</Row>
        <Row label="Espécie">{ficha.especie}</Row>
        <Row label="Ofício">{ficha.oficio}</Row>
        <Row label="Fés">
          <Items items={ficha.fes.map((f) => ({ title: f.nome, text: f.implicacoes }))} />
        </Row>
        <Row label="Marcas">
          <Items items={ficha.marcas.map((m) => ({ title: m.nome, text: m.descricao }))} />
        </Row>
        <Row label="Aparência">
          {imagem && !imagemQuebrada && (
            <span className="relative mb-1 block aspect-square w-full max-w-48 overflow-hidden rounded">
              <Image
                src={imagem.src}
                alt={imagem.displayName}
                fill
                sizes="12rem"
                unoptimized={imagem.src.startsWith("data:")}
                onError={() => setImagemQuebrada(imagem.src)}
                className="object-cover"
              />
            </span>
          )}
          {ficha.aparencia.notas}
        </Row>
        <Row label="História curta">{ficha.historia}</Row>
        <Row label="Personalidade">{ficha.personalidade}</Row>
      </dl>

    </aside>
  );
}
