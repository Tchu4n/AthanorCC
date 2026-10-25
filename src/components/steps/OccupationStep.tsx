import { BriefingPanel } from "@/components/briefing/BriefingPanel";
import { OptionCard, OptionGroup } from "@/components/ui/OptionCard";
import { getOccupation, getOccupations } from "@/lib/catalog";
import { evaluateRules, optionKey } from "@/lib/rules-engine";
import type { StepProps } from "./types";

export function OccupationStep({ character, dispatch }: StepProps) {
  const chosen = getOccupation(character.occupationId);
  const { blocked, warnings } = evaluateRules(character);
  return (
    <div className="space-y-6">
      <OptionGroup legend="Ofício (opcional)">
        <OptionCard
          type="radio"
          name="oficio"
          label="Sem ofício"
          checked={!chosen}
          onChange={() => dispatch({ type: "SELECT_OCCUPATION", occupationId: null })}
        />
        {getOccupations().map((o) => (
          <OptionCard
            key={o.id}
            type="radio"
            name="oficio"
            label={o.name}
            checked={chosen?.id === o.id}
            blockedReasons={blocked[optionKey({ kind: "occupation", id: o.id })]}
            onChange={() => dispatch({ type: "SELECT_OCCUPATION", occupationId: o.id })}
          />
        ))}
      </OptionGroup>
      {chosen && (
        <BriefingPanel
          title={chosen.name}
          sections={[{ text: chosen.briefing }]}
          warnings={warnings[optionKey({ kind: "occupation", id: chosen.id })]}
        />
      )}
    </div>
  );
}
