import { BriefingPanel } from "@/components/briefing/BriefingPanel";
import { OptionCard, OptionGroup } from "@/components/ui/OptionCard";
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
          <OptionCard
            key={s.id}
            type="radio"
            name="especie"
            label={s.name}
            checked={chosen?.id === s.id}
            blockedReasons={blocked[optionKey({ kind: "species", id: s.id })]}
            onChange={() => dispatch({ type: "SELECT_SPECIES", speciesId: s.id })}
          />
        ))}
      </OptionGroup>
      {chosen && <BriefingPanel title={chosen.name} sections={[{ text: chosen.briefing }]} />}
    </div>
  );
}
