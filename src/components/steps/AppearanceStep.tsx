import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { OptionCard, OptionGroup } from "@/components/ui/OptionCard";
import { getImages } from "@/lib/catalog";
import { ACCEPTED_TYPES, browserCodec, prepareUpload } from "@/lib/image-upload";
import type { StepProps } from "./types";

export function AppearanceStep({ character, dispatch }: StepProps) {
  const { image, notes } = character.appearance;
  const [erro, setErro] = useState<string | null>(null);
  const [lendo, setLendo] = useState(false);
  const upload = image?.kind === "upload" ? image : null;

  async function enviar(input: HTMLInputElement) {
    const file = input.files?.[0];
    input.value = ""; // permite escolher o mesmo arquivo de novo
    if (!file) return;
    setLendo(true);
    const result = await prepareUpload(file, browserCodec);
    setLendo(false);
    if (!result.ok) return setErro(result.error);
    setErro(null);
    dispatch({ type: "SET_APPEARANCE", appearance: { image: result.image } });
  }

  return (
    <div className="space-y-6">
      <OptionGroup legend="Imagens de referência">
        <OptionCard
          type="radio"
          name="imagem"
          label="Sem imagem"
          checked={image === null}
          onChange={() => dispatch({ type: "SET_APPEARANCE", appearance: { image: null } })}
        />
        {getImages().map((img) => (
          <OptionCard
            key={img.id}
            type="radio"
            name="imagem"
            label={img.displayName}
            checked={image?.kind === "catalog" && image.imageId === img.id}
            onChange={() => dispatch({ type: "SET_APPEARANCE", appearance: { image: { kind: "catalog", imageId: img.id } } })}
          >
            <span className="relative block aspect-square w-full overflow-hidden rounded">
              <Image src={img.src} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
            </span>
          </OptionCard>
        ))}
      </OptionGroup>

      <section aria-labelledby="enviar-titulo" className="space-y-2">
        <h2 id="enviar-titulo" className="font-semibold">
          Enviar sua imagem
        </h2>
        <label htmlFor="enviar-imagem" className="block text-sm">
          Escolha um arquivo PNG, JPEG ou WebP (opcional)
        </label>
        <input
          id="enviar-imagem"
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          aria-describedby="enviar-aviso"
          disabled={lendo}
          onChange={(e) => enviar(e.currentTarget)}
          className="block w-full text-sm file:mr-3 file:rounded-md file:border file:border-foreground/40 file:bg-transparent file:px-3 file:py-2 file:font-medium focus-visible:outline-3 focus-visible:outline-blue-500"
        />
        <p id="enviar-aviso" className="text-sm opacity-80">
          A imagem fica salva só neste navegador.
        </p>
        <p role="alert" className="text-sm font-medium">
          {lendo ? "Preparando a imagem…" : erro}
        </p>
        {upload && (
          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-foreground/20 p-3">
            <span className="relative block size-24 overflow-hidden rounded">
              <Image src={upload.dataUrl} alt={upload.name} fill sizes="6rem" unoptimized className="object-cover" />
            </span>
            <span className="min-w-0 flex-1 break-words font-medium">{upload.name}</span>
            <Button variant="secondary" onClick={() => dispatch({ type: "SET_APPEARANCE", appearance: { image: null } })}>
              Remover imagem
            </Button>
          </div>
        )}
      </section>

      <div className="space-y-1">
        <label htmlFor="notas-aparencia" className="font-semibold">
          Notas de aparência
        </label>
        <textarea
          id="notas-aparencia"
          rows={3}
          value={notes}
          onChange={(e) => dispatch({ type: "SET_APPEARANCE", appearance: { notes: e.target.value } })}
          className="w-full rounded-md border border-foreground/30 bg-transparent p-2 focus-visible:outline-3 focus-visible:outline-blue-500"
        />
      </div>
    </div>
  );
}
