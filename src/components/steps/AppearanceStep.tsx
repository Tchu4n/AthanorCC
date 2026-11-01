import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { botao, Button } from "@/components/ui/Button";
import { ChoiceCard, Opcional, OptionGroup } from "@/components/ui/ChoiceCard";
import { RecorteImagem } from "@/components/ui/RecorteImagem";
import { getRetratos } from "@/lib/catalog";
import { LIMITES_TEXTO } from "@/lib/character";
import { ACCEPTED_TYPES, browserCodec, codificarRecorte, lerImagem, type ImagemLida, type Recorte } from "@/lib/image-upload";
import type { StepProps } from "./types";

export function AppearanceStep({ character, dispatch }: StepProps) {
  const { image, notes } = character.appearance;
  const [erro, setErro] = useState<string | null>(null);
  const [lendo, setLendo] = useState(false);
  // imagem lida esperando o recorte; src é um object URL só para a moldura
  const [aRecortar, setARecortar] = useState<{ imagem: ImagemLida<ImageBitmap>; src: string } | null>(null);
  const upload = image?.kind === "upload" ? image : null;
  const enviarBotao = botao("secondary");
  // Notas num <dialog> modal que abre ao escolher a imagem: no fim da página, o campo passava despercebido
  const [notasAbertas, setNotasAbertas] = useState(false);
  const dialogoNotas = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = dialogoNotas.current;
    if (notasAbertas && d && !d.open) d.showModal();
    if (!notasAbertas && d?.open) d.close();
  }, [notasAbertas]);
  const escolher = (img: (typeof character.appearance)["image"]) => {
    dispatch({ type: "SET_APPEARANCE", appearance: { image: img } });
    setNotasAbertas(true);
  };

  async function enviar(input: HTMLInputElement) {
    const file = input.files?.[0];
    input.value = ""; // permite escolher o mesmo arquivo de novo
    if (!file) return;
    setLendo(true);
    const lida = await lerImagem(file, browserCodec);
    setLendo(false);
    if (!lida.ok) return setErro(lida.error);
    setErro(null);
    setARecortar({ imagem: lida.imagem, src: URL.createObjectURL(file) });
  }

  function fecharRecorte() {
    if (!aRecortar) return;
    URL.revokeObjectURL(aRecortar.src);
    aRecortar.imagem.source.close();
    setARecortar(null);
  }

  function usarRecorte(recorte: Recorte) {
    if (!aRecortar) return;
    const result = codificarRecorte(aRecortar.imagem, recorte, browserCodec);
    fecharRecorte();
    if (!result.ok) return setErro(result.error);
    escolher(result.image);
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
              disabled={lendo || !!aRecortar}
              onChange={(e) => enviar(e.currentTarget)}
              className="sr-only"
            />
          </label>
          <Button variant="secondary" onClick={() => setNotasAbertas(true)} className="sm:w-56">
            Notas de aparência
          </Button>
        </div>
        <p id="enviar-aviso" className="text-sm opacity-80">
          Arquivo PNG, JPEG ou WebP (<Opcional />). Você enquadra o retrato antes de usar. A imagem fica salva só neste navegador.
        </p>
        {aRecortar && (
          <RecorteImagem
            src={aRecortar.src}
            nome={aRecortar.imagem.name}
            width={aRecortar.imagem.width}
            height={aRecortar.imagem.height}
            onConfirm={usarRecorte}
            onCancel={fecharRecorte}
          />
        )}
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

      <OptionGroup legend={<>Imagens de referência (<Opcional />)</>}>
        <ChoiceCard
          type="radio"
          name="imagem"
          label="Sem imagem"
          categoria="Imagem"
          icone="aparencia"
          checked={image === null}
          onChange={() => escolher(null)}
        />
        {getRetratos().map((img) => (
          <ChoiceCard
            key={img.id}
            type="radio"
            name="imagem"
            label={img.displayName}
            categoria="Imagem"
            icone="aparencia"
            image={img.src}
            checked={image?.kind === "catalog" && image.imageId === img.id}
            onChange={() => escolher({ kind: "catalog", imageId: img.id })}
          />
        ))}
      </OptionGroup>

      <dialog
        ref={dialogoNotas}
        aria-labelledby="notas-aparencia-titulo"
        onCancel={(e) => {
          e.preventDefault();
          setNotasAbertas(false);
        }}
        className="m-auto w-[min(32rem,calc(100vw-2rem))] space-y-2 rounded-lg border border-foreground/20 bg-background p-6 text-foreground backdrop:bg-black/60"
      >
        <h2 id="notas-aparencia-titulo" className="text-lg font-semibold">
          Notas de aparência
        </h2>
        <p id="notas-aparencia-dica" className="text-sm">
          Cicatrizes, roupas, cabelo, marcas: o que a imagem não mostra (<Opcional />).
        </p>
        <textarea
          id="notas-aparencia"
          aria-labelledby="notas-aparencia-titulo"
          autoFocus
          rows={5}
          maxLength={LIMITES_TEXTO.notes}
          aria-describedby="notas-aparencia-dica notas-aparencia-limite"
          value={notes}
          onChange={(e) => dispatch({ type: "SET_APPEARANCE", appearance: { notes: e.target.value } })}
          className="w-full rounded-md border border-foreground/30 bg-transparent p-2 focus-visible:outline-3 focus-visible:outline-blue-500"
        />
        <p id="notas-aparencia-limite" className="text-right text-xs opacity-70">
          {notes.length}/{LIMITES_TEXTO.notes} caracteres
        </p>
        <div className="flex justify-end">
          <Button onClick={() => setNotasAbertas(false)}>Pronto</Button>
        </div>
      </dialog>
    </div>
  );
}
