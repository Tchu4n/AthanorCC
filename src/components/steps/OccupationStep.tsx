import { BriefingPanel, NaLateral } from "@/components/briefing/BriefingPanel";
import { ChoiceCard, OptionGroup } from "@/components/ui/ChoiceCard";
import { getOccupation, getOccupations } from "@/lib/catalog";
import { evaluateRules, optionKey } from "@/lib/rules-engine";
import type { StepProps } from "./types";

export function OccupationStep({ character, dispatch }: StepProps) {
  const chosen = getOccupation(character.occupationId);
  const { blocked, warnings } = evaluateRules(character);
  return (
    <div className="space-y-6">
      <OptionGroup legend="Ofício (opcional)">
        <ChoiceCard
          type="radio"
          name="oficio"
          label="Sem ofício"
          categoria="Ofício"
          icone="oficio"
          checked={!chosen}
          onChange={() => dispatch({ type: "SELECT_OCCUPATION", occupationId: null })}
        />
        {getOccupations().map((o) => (
          <ChoiceCard
            key={o.id}
            type="radio"
            name="oficio"
            label={o.name}
            categoria="Ofício"
            icone="oficio"
            image={o.image}
            descricao={o.briefing}
            saibaMais={{ sections: [{ text: o.briefing }], warnings: warnings[optionKey({ kind: "occupation", id: o.id })] }}
            checked={chosen?.id === o.id}
            blockedReasons={blocked[optionKey({ kind: "occupation", id: o.id })]}
            onChange={() => dispatch({ type: "SELECT_OCCUPATION", occupationId: o.id })}
          />
        ))}
      </OptionGroup>
      <NaLateral>
        {chosen && (
          <BriefingPanel
            title={chosen.name}
            sections={[{ text: chosen.briefing }]}
            warnings={warnings[optionKey({ kind: "occupation", id: chosen.id })]}
          />
        )}
      </NaLateral>
    </div>
  );
}
