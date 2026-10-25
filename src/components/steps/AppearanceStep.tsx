import Image from "next/image";
import { OptionCard, OptionGroup } from "@/components/ui/OptionCard";
import { getImages } from "@/lib/catalog";
import type { StepProps } from "./types";

export function AppearanceStep({ character, dispatch }: StepProps) {
  const { imageId, notes } = character.appearance;
  return (
    <div className="space-y-6">
      <OptionGroup legend="Imagem de referência (opcional)">
        <OptionCard
          type="radio"
          name="imagem"
          label="Sem imagem"
          checked={imageId === null}
          onChange={() => dispatch({ type: "SET_APPEARANCE", appearance: { imageId: null } })}
        />
        {getImages().map((img) => (
          <OptionCard
            key={img.id}
            type="radio"
            name="imagem"
            label={img.displayName}
            checked={imageId === img.id}
            onChange={() => dispatch({ type: "SET_APPEARANCE", appearance: { imageId: img.id } })}
          >
            <span className="relative block aspect-square w-full overflow-hidden rounded">
              <Image src={img.src} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
            </span>
          </OptionCard>
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
