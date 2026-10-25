import { BriefingPanel } from "@/components/briefing/BriefingPanel";
import { OptionCard, OptionGroup } from "@/components/ui/OptionCard";
import { getFaith, getFaiths } from "@/lib/catalog";
import { MAX_FAITHS } from "@/lib/character";
import { isFaithDisabled } from "@/lib/flow";
import { evaluateRules, optionKey } from "@/lib/rules-engine";
import type { StepProps } from "./types";

export function FaithStep({ character, dispatch }: StepProps) {
  const count = character.faithIds.length;
  const { blocked } = evaluateRules(character);
  return (
    <div className="space-y-6">
      <OptionGroup legend={`Fés (opcional, até ${MAX_FAITHS}) — ${count} de ${MAX_FAITHS} escolhidas`}>
        {getFaiths().map((f) => (
          <OptionCard
            key={f.id}
            type="checkbox"
            name="fe"
            label={f.name}
            checked={character.faithIds.includes(f.id)}
            disabled={isFaithDisabled(character, f.id)}
            blockedReasons={blocked[optionKey({ kind: "faith", id: f.id })]}
            onChange={() => dispatch({ type: "TOGGLE_FAITH", faithId: f.id })}
          />
        ))}
      </OptionGroup>
      <p role="status" className="text-sm font-medium">
        {count >= MAX_FAITHS && `Limite de ${MAX_FAITHS} fés atingido. Desmarque uma para escolher outra.`}
      </p>
      {character.faithIds.map((id) => {
        const f = getFaith(id);
        return (
          f && (
            <BriefingPanel
              key={f.id}
              title={f.name}
              sections={[{ text: f.briefing }, { label: "Implicações", text: f.implications }]}
            />
          )
        );
      })}
    </div>
  );
}
