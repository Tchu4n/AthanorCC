import { BriefingPanel, NaLateral } from "@/components/briefing/BriefingPanel";
import { ChoiceCard, OptionGroup } from "@/components/ui/ChoiceCard";
import { getSpecies, getSubspecies } from "@/lib/catalog";
import type { StepProps } from "./types";

export function SubspeciesStep({ character, dispatch }: StepProps) {
  const options = getSubspecies(character.speciesId);
  const chosen = options.find((s) => s.id === character.subspeciesId);
  const species = getSpecies(character.speciesId);
  return (
    <div className="space-y-6">
      <OptionGroup legend={`Subespécie de ${species?.name ?? ""}`}>
        {options.map((s) => (
          <ChoiceCard
            key={s.id}
            type="radio"
            name="subespecie"
            label={s.name}
            categoria="Subespécie"
            icone="subespecie"
            image={s.image ?? species?.image}
            descricao={s.briefing}
            saibaMais={{ sections: [{ text: s.briefing }] }}
            checked={chosen?.id === s.id}
            onChange={() => dispatch({ type: "SELECT_SUBSPECIES", subspeciesId: s.id })}
          />
        ))}
      </OptionGroup>
      <NaLateral>{chosen && <BriefingPanel title={chosen.name} sections={[{ text: chosen.briefing }]} />}</NaLateral>
    </div>
  );
}
