import { PainelBriefing, NaLateral } from "@/components/briefing/PainelBriefing";
import { CartaoEscolha, GrupoCartoes } from "@/components/ui/CartaoEscolha";
import { getSpecies, getSpeciesList } from "@/lib/catalogo";
import { evaluateRules, optionKey } from "@/lib/motor-regras";
import type { PropsEtapa } from "./types";

export function EtapaEspecie({ character, dispatch }: PropsEtapa) {
  const chosen = getSpecies(character.speciesId);
  const { blocked } = evaluateRules(character);
  return (
    <div className="space-y-6">
      <GrupoCartoes legend="Espécie">
        {getSpeciesList().map((s) => (
          <CartaoEscolha
            key={s.id}
            type="radio"
            name="especie"
            label={s.name}
            categoria="Espécie"
            icone="especie"
            image={s.image}
            descricao={s.briefing}
            linhas={1}
            saibaMais={{ sections: [{ text: s.briefing }] }}
            checked={chosen?.id === s.id}
            blockedReasons={blocked[optionKey({ kind: "species", id: s.id })]}
            onChange={() => dispatch({ type: "SELECT_SPECIES", speciesId: s.id })}
          />
        ))}
      </GrupoCartoes>
      <NaLateral>{chosen && <PainelBriefing title={chosen.name} sections={[{ text: chosen.briefing }]} />}</NaLateral>
    </div>
  );
}
