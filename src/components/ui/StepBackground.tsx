import Image from "next/image";
import { backgrounds } from "@/styles/theme";

// Fundo fixo atrás de toda a página. Com imagem, o véu escuro cobre a imagem inteira; o texto nunca fica direto sobre ela.
export function StepBackground({ image }: { image: string | null }) {
  return (
    // saturate(--vida): imagem e brilho começam em cinza e ganham cor com o progresso
    <div
      aria-hidden
      data-step-background={image ?? ""}
      className="pointer-events-none fixed inset-0 -z-10 bg-background"
      style={{ filter: "saturate(var(--vida))" }}
    >
      {image && <Image src={image} alt="" fill sizes="100vw" className="object-cover" />}
      <div className="absolute inset-0" style={{ backgroundImage: image ? backgrounds.veil : backgrounds.solid }} />
    </div>
  );
}
