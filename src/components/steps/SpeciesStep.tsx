import { BriefingPanel, NaLateral } from "@/components/briefing/BriefingPanel";
import { ChoiceCard, OptionGroup } from "@/components/ui/ChoiceCard";
import { getSpecies, getSpeciesList } from "@/lib/catalog";
import { evaluateRules, optionKey } from "@/lib/rules-engine";
import type { StepProps } from "./types";

export function SpeciesStep({ character, dispatch }: StepProps) {
  const chosen = getSpecies(character.speciesId);
  const { blocked } = evaluateRules(character);
  return (
    <div className="space-y-6">
      <OptionGroup legend="Espécie">
        {getSpeciesList().map((s) => (
          <ChoiceCard
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
      </OptionGroup>
      <NaLateral>{chosen && <BriefingPanel title={chosen.name} sections={[{ text: chosen.briefing }]} />}</NaLateral>
    </div>
  );
}
