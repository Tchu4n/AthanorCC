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
  const { imagem } = ficha.aparencia;

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
    } catch {
      setStatus("erro");
    }
  }

  return (
    <aside aria-labelledby="previa-titulo" className={`rounded-lg border border-foreground/20 p-4 ${className}`}>
      <h2 id="previa-titulo" className="text-lg font-semibold">
        Prévia da ficha
      </h2>
      <dl className="divide-y divide-foreground/10">
        <Row label="Nome">{ficha.nome}</Row>
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
          {imagem && (
            <span className="relative mb-1 block aspect-square w-full max-w-48 overflow-hidden rounded">
              <Image src={imagem.src} alt={imagem.displayName} fill sizes="12rem" className="object-cover" />
            </span>
          )}
          {imagem && <span className="block font-semibold">{imagem.displayName}</span>}
          {ficha.aparencia.notas}
        </Row>
        <Row label="História curta">{ficha.historia}</Row>
        <Row label="Personalidade">{ficha.personalidade}</Row>
      </dl>

      <div className="mt-4 space-y-2 border-t border-foreground/20 pt-4">
        <Button onClick={exportar} disabled={semNome || status === "gerando"} aria-describedby={semNome ? "dica-exportar" : undefined}>
          {status === "gerando" ? "Gerando PDF…" : "Exportar PDF"}
        </Button>
        {semNome && (
          <p id="dica-exportar" className="text-sm opacity-80">
            Dê um nome ao personagem para exportar
          </p>
        )}
        <p role="status" className="text-sm">
          {status === "erro" && "Não foi possível gerar o PDF. Tente de novo."}
        </p>
      </div>
    </aside>
  );
}
