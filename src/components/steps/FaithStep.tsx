import { BriefingPanel, NaLateral } from "@/components/briefing/BriefingPanel";
import { ChoiceCard, Opcional, OptionGroup } from "@/components/ui/ChoiceCard";
import { SimboloFe } from "@/components/ui/SimboloFe";
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
      <OptionGroup
        legend={
          <>
            Fés (<Opcional />, até {MAX_FAITHS}) — {count} de {MAX_FAITHS} escolhidas
          </>
        }
      >
        {getFaiths().map((f) => (
          <ChoiceCard
            key={f.id}
            type="checkbox"
            name="fe"
            label={f.name}
            categoria="Fé"
            icone="fe"
            image={f.image}
            simbolo={<SimboloFe id={f.id} className="h-3/4 max-h-48" />}
            descricao={f.briefing}
            saibaMais={{ sections: [{ text: f.briefing }, { label: "Implicações", text: f.implications }] }}
            checked={character.faithIds.includes(f.id)}
            disabled={isFaithDisabled(character, f.id)}
            disabledReason={`Limite de ${MAX_FAITHS} fés atingido. Desmarque uma para escolher outra.`}
            blockedReasons={blocked[optionKey({ kind: "faith", id: f.id })]}
            onChange={() => dispatch({ type: "TOGGLE_FAITH", faithId: f.id })}
          />
        ))}
      </OptionGroup>
      <p role="status" className="text-sm font-medium">
        {count >= MAX_FAITHS && `Limite de ${MAX_FAITHS} fés atingido. Desmarque uma para escolher outra.`}
      </p>
      <NaLateral>
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
      </NaLateral>
    </div>
  );
}
