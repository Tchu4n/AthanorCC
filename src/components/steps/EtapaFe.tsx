import { PainelBriefing, NaLateral } from "@/components/briefing/PainelBriefing";
import { CartaoEscolha, Opcional, GrupoCartoes } from "@/components/ui/CartaoEscolha";
import { SimboloFe } from "@/components/ui/SimboloFe";
import { getFaith, getFaiths } from "@/lib/catalog";
import { MAX_FAITHS } from "@/lib/character";
import { isFaithDisabled } from "@/lib/flow";
import { evaluateRules, optionKey } from "@/lib/rules-engine";
import type { PropsEtapa } from "./types";

export function EtapaFe({ character, dispatch }: PropsEtapa) {
  const count = character.faithIds.length;
  const { blocked } = evaluateRules(character);
  return (
    <div className="space-y-6">
      <GrupoCartoes
        legend={
          <>
            Fés (<Opcional />, até {MAX_FAITHS}) — {count} de {MAX_FAITHS} escolhidas
          </>
        }
      >
        {getFaiths().map((f) => (
          <CartaoEscolha
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
      </GrupoCartoes>
      <p role="status" className="text-sm font-medium">
        {count >= MAX_FAITHS && `Limite de ${MAX_FAITHS} fés atingido. Desmarque uma para escolher outra.`}
      </p>
      <NaLateral>
        {character.faithIds.map((id) => {
          const f = getFaith(id);
          return (
            f && (
              <PainelBriefing
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
