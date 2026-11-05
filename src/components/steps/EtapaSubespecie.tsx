import { PainelBriefing, NaLateral } from "@/components/briefing/PainelBriefing";
import { CartaoEscolha, GrupoCartoes } from "@/components/ui/CartaoEscolha";
import { getSpecies, getSubspecies, secoesDe } from "@/lib/catalogo";
import type { PropsEtapa } from "./types";

export function EtapaSubespecie({ character, dispatch }: PropsEtapa) {
  const options = getSubspecies(character.speciesId);
  const chosen = options.find((s) => s.id === character.subspeciesId);
  const species = getSpecies(character.speciesId);
  return (
    <div className="space-y-6">
      <GrupoCartoes legend={`Subespécie de ${species?.name ?? ""}`}>
        {options.map((s) => (
          <CartaoEscolha
            key={s.id}
            type="radio"
            name="subespecie"
            label={s.name}
            categoria="Subespécie"
            icone="subespecie"
            image={s.image ?? species?.image}
            descricao={s.briefing}
            saibaMais={{ sections: secoesDe(s) }}
            checked={chosen?.id === s.id}
            explicacao={chosen?.id === s.id && <PainelBriefing title={s.name} sections={secoesDe(s)} />}
            onChange={() => dispatch({ type: "ESCOLHER_SUBESPECIE", subspeciesId: s.id })}
          />
        ))}
      </GrupoCartoes>
      <NaLateral>{chosen && <PainelBriefing title={chosen.name} sections={secoesDe(chosen)} />}</NaLateral>
    </div>
  );
}
