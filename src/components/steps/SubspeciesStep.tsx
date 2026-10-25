import { BriefingPanel } from "@/components/briefing/BriefingPanel";
import { OptionCard, OptionGroup } from "@/components/ui/OptionCard";
import { getSpecies, getSubspecies } from "@/lib/catalog";
import type { StepProps } from "./types";

export function SubspeciesStep({ character, dispatch }: StepProps) {
  const options = getSubspecies(character.speciesId);
  const chosen = options.find((s) => s.id === character.subspeciesId);
  return (
    <div className="space-y-6">
      <OptionGroup legend={`Subespécie de ${getSpecies(character.speciesId)?.name ?? ""}`}>
        {options.map((s) => (
          <OptionCard
            key={s.id}
            type="radio"
            name="subespecie"
            label={s.name}
            checked={chosen?.id === s.id}
            onChange={() => dispatch({ type: "SELECT_SUBSPECIES", subspeciesId: s.id })}
          />
        ))}
      </OptionGroup>
      {chosen && <BriefingPanel title={chosen.name} sections={[{ text: chosen.briefing }]} />}
    </div>
  );
}
