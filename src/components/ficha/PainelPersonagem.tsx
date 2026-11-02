import { PortraitFrame } from "@/components/ui/PortraitFrame";
import { limpar, LIMITES_TEXTO, type Character } from "@/lib/character";
import { imagemDoPersonagem } from "@/lib/ficha";
import type { CharacterAction } from "@/lib/reducer";

// Retrato e nome do personagem, só na página de concluído (na coluna direita, acima da prévia).
export function PainelPersonagem({ character, dispatch, idNome }: { character: Character; dispatch: (a: CharacterAction) => void; idNome: string }) {
  const img = imagemDoPersonagem(character.appearance.image);
  // p-4: a moldura dourada é desenhada por dentro (globals.css); sem espaço, retrato e campo passavam dela
  return (
    <section aria-label="Personagem" className="grid grid-cols-[7rem_minmax(0,1fr)] items-start gap-4 p-4">
      <PortraitFrame retrato={img && { src: img.src, alt: `Retrato do personagem: ${img.displayName}` }} />
      <div className="space-y-1">
        <label htmlFor={idNome} className="text-sm font-semibold">
          Nome do personagem
        </label>
        <input
          id={idNome}
          type="text"
          maxLength={LIMITES_TEXTO.name}
          value={character.identity.name}
          onChange={(e) => dispatch({ type: "SET_IDENTITY", identity: { name: limpar.nome(e.target.value) } })}
          className="min-h-11 w-full rounded-md border border-border bg-surface px-3 focus-visible:outline-3 focus-visible:outline-blue-500"
        />
      </div>
    </section>
  );
}
