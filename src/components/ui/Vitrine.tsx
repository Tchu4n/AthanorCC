"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import { getFaith, getImages, getMark, getOccupation, getRegion, getSpecies, getSubregion, getSubspecies } from "@/lib/catalog";
import type { Character } from "@/lib/character";
import { imagemDoPersonagem } from "@/lib/ficha";
import type { StepId } from "@/lib/flow";
import { vitrine } from "@/styles/theme";

export type Escolha = { src: string | null; alt: string; legenda?: string };

// alt vem do displayName do catálogo; imagens fora dele (upload) usam o nome da escolha.
const altDe = (src: string, nome: string) => getImages().find((i) => i.src === src)?.displayName ?? nome;
const escolha = (src: string | undefined, nome: string | undefined): Escolha =>
  src ? { src, alt: altDe(src, nome ?? ""), legenda: nome } : { src: null, alt: "", legenda: nome };

// Imagem da escolha atual em cada etapa (só leitura dos dados).
export function escolhaDaEtapa(step: StepId, c: Character): Escolha {
  const regiao = getRegion(c.origin?.regionId);
  const sub = regiao && c.origin?.subregionId ? getSubregion(regiao.id, c.origin.subregionId) : undefined;
  const especie = getSpecies(c.speciesId);
  const aparencia = () => {
    const img = imagemDoPersonagem(c.appearance.image);
    return img ? { src: img.src, alt: img.displayName, legenda: img.displayName } : { src: null, alt: "" };
  };
  switch (step) {
    case "origem": {
      const nome = regiao && (sub ? `${regiao.name}, ${sub.name}` : regiao.name);
      // escolhida a subregião, a imagem dela (ou a da região); antes disso, a bandeira, se houver
      return escolha(sub ? (sub.image ?? regiao?.image) : (regiao?.bandeira ?? regiao?.image), nome);
    }
    case "especie":
      return escolha(especie?.image, especie?.name);
    case "subespecie": {
      const s = getSubspecies(c.speciesId).find((x) => x.id === c.subspeciesId);
      return escolha(s?.image ?? especie?.image, s?.name ?? especie?.name);
    }
    case "oficio": {
      const o = getOccupation(c.occupationId);
      return escolha(o?.image, o?.name);
    }
    case "fe": {
      const id = c.faithIds.at(-1);
      const f = id ? getFaith(id) : undefined;
      return escolha(f?.image, f?.name);
    }
    case "marcas": {
      const id = c.marks.at(-1); // a última marcada fica no fim da lista
      // marcas ainda não têm campo de imagem nos dados: sempre placeholder, com o nome na legenda
      return escolha(undefined, id ? getMark(id)?.name : undefined);
    }
    case "aparencia":
    case "identidade": // [Decisão de design] Identidade mostra o retrato escolhido na Aparência
      return aparencia();
    case "revisao":
      return escolha(regiao?.image, regiao?.name);
  }
}

// Ícones simples (traço) para o placeholder de cada etapa.
export const ICONES: Record<StepId, string> = {
  origem: "M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12zM12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  especie: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0",
  subespecie: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2 20a7 7 0 0 1 14 0M16 4.5a3.5 3.5 0 0 1 0 6.5M18 13.5a7 7 0 0 1 4 6.5",
  oficio: "M3 8h18v12H3zM9 8V5h6v3M3 13h18",
  fe: "M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1",
  marcas: "M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4l-5.3 3 1.2-6L3.4 9.3l6-.7z",
  aparencia: "M3 4h18v16H3zM8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM21 15l-5-5L5 20",
  identidade: "M3 5h18v14H3zM9 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM14 10h4M14 14h4",
  revisao: "M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01",
};

// fade sempre (é só opacidade); o zoom 1.02 → 1 só sem prefers-reduced-motion
const ENTRADA = "animate-[vitrine-fade_400ms_ease-out] motion-safe:animate-[vitrine-fade_400ms_ease-out,vitrine-zoom_400ms_ease-out]";
// Quadro fixo em 16:9, o meio-termo escolhido para o acervo (quadradas, largas ~1.8:1 e algumas em pé).
// As largas aparecem quase inteiras; nas outras, o corte guarda o alto da imagem (20%), onde ficam os rostos.
const SIZES = "(min-width: 1024px) 26rem, calc(100vw - 2rem)";

function Foto({ src, alt, className, onAnimationEnd }: { src: string; alt: string; className?: string; onAnimationEnd?: () => void }) {
  return (
    <Image
      src={src}
      alt={alt}
      aria-hidden={alt === "" || undefined}
      fill
      sizes={SIZES}
      loading="lazy"
      decoding="async"
      unoptimized={src.startsWith("data:")}
      className={`object-cover object-[center_20%] ${className ?? ""}`}
      onAnimationEnd={onAnimationEnd}
    />
  );
}

// Imagem da escolha em cor plena: sem filter e com --vida fixo em 1. Só a sombra segue a --vida (--vivo vem resolvido de cima).
export function Vitrine({ src, alt, legenda, placeholder, className = "" }: Escolha & { placeholder: StepId; className?: string }) {
  // a imagem anterior fica por baixo durante o crossfade e sai quando a nova termina de entrar
  const [vistas, setVistas] = useState<{ atual: string | null; anterior: string | null }>({ atual: src, anterior: null });
  if (vistas.atual !== src) setVistas({ atual: src, anterior: vistas.atual });
  const fimDaEntrada = () => setVistas((v) => (v.anterior ? { ...v, anterior: null } : v));

  return (
    <figure
      data-vitrine
      className={`relative m-0 overflow-hidden bg-surface ${className}`}
      style={{ borderRadius: vitrine.radius, boxShadow: vitrine.shadow, "--vida": 1 } as CSSProperties}
    >
      {vistas.anterior && <Foto key={`anterior:${vistas.anterior}`} src={vistas.anterior} alt="" />}
      {src ? (
        <Foto key={src} src={src} alt={alt} className={ENTRADA} onAnimationEnd={fimDaEntrada} />
      ) : (
        <div
          key="placeholder"
          data-vitrine-placeholder
          className={`absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface p-4 text-center text-muted ${ENTRADA}`}
          onAnimationEnd={fimDaEntrada}
        >
          <svg aria-hidden viewBox="0 0 24 24" className="size-12" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d={ICONES[placeholder]} />
          </svg>
          <p className="text-sm">Sem imagem para esta escolha</p>
        </div>
      )}
      {legenda && (
        <figcaption className="absolute inset-x-0 bottom-0 px-4 py-2 font-semibold text-foreground" style={{ background: vitrine.captionBg }}>
          {legenda}
        </figcaption>
      )}
    </figure>
  );
}
