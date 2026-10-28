import Image from "next/image";
import { useState } from "react";
import { botao, Button } from "@/components/ui/Button";
import { ChoiceCard, OptionGroup } from "@/components/ui/ChoiceCard";
import { getImages } from "@/lib/catalog";
import { ACCEPTED_TYPES, browserCodec, prepareUpload } from "@/lib/image-upload";
import type { StepProps } from "./types";

export function AppearanceStep({ character, dispatch }: StepProps) {
  const { image, notes } = character.appearance;
  const [erro, setErro] = useState<string | null>(null);
  const [lendo, setLendo] = useState(false);
  const upload = image?.kind === "upload" ? image : null;
  const enviarBotao = botao("secondary");

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
      {/* anexar fica no topo; "Sem imagem" abre a grade de referências */}
      <section aria-label="Imagem do personagem" className="space-y-2">
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className={`${enviarBotao.className} sm:w-56`} style={enviarBotao.style}>
            Enviar sua imagem
            <input
              type="file"
              accept={ACCEPTED_TYPES.join(",")}
              aria-describedby="enviar-aviso"
              disabled={lendo}
              onChange={(e) => enviar(e.currentTarget)}
              className="sr-only"
            />
          </label>
        </div>
        <p id="enviar-aviso" className="text-sm opacity-80">
          Arquivo PNG, JPEG ou WebP (opcional). A imagem fica salva só neste navegador.
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

      <OptionGroup legend="Imagens de referência">
        <ChoiceCard
          type="radio"
          name="imagem"
          label="Sem imagem"
          categoria="Imagem"
          icone="aparencia"
          checked={image === null}
          onChange={() => dispatch({ type: "SET_APPEARANCE", appearance: { image: null } })}
        />
        {getImages().map((img) => (
          <ChoiceCard
            key={img.id}
            type="radio"
            name="imagem"
            label={img.displayName}
            categoria="Imagem"
            icone="aparencia"
            image={img.src}
            checked={image?.kind === "catalog" && image.imageId === img.id}
            onChange={() => dispatch({ type: "SET_APPEARANCE", appearance: { image: { kind: "catalog", imageId: img.id } } })}
          />
        ))}
      </OptionGroup>

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
