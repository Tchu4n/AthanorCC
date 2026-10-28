import { BriefingPanel, NaLateral } from "@/components/briefing/BriefingPanel";
import { ChoiceCard, OptionGroup } from "@/components/ui/ChoiceCard";
import { getMarks, getRules } from "@/lib/catalog";
import { evaluateRules, optionKey, targetIds } from "@/lib/rules-engine";
import type { StepProps } from "./types";

export function MarksStep({ character, dispatch }: StepProps) {
  const { blocked, warnings, required } = evaluateRules(character);
  // mensagem das regras REQUIRE ativas, para explicar por que a marca está travada
  const requiredReasons = (markId: string) =>
    required.includes(markId)
      ? getRules()
          .filter((r) => r.efeito === "REQUIRE" && targetIds(r.alvo).includes(markId) && r.condicao(character))
          .map((r) => r.mensagem)
      : undefined;

  const secoes = (m: ReturnType<typeof getMarks>[number]) => [
    { text: m.briefing },
    ...(m.descricao ? [{ label: "Prós e contras", text: m.descricao }] : []),
  ];

  return (
    <div className="space-y-6">
      <OptionGroup legend="Marcas (opcional)">
        {getMarks().map((m) => {
          const on = character.marks.includes(m.id);
          return (
            <ChoiceCard
              key={m.id}
              type="checkbox"
              name="marca"
              label={m.name}
              categoria="Marca"
              icone="marcas"
              descricao={m.briefing}
              saibaMais={{ sections: secoes(m), warnings: warnings[optionKey({ kind: "mark", id: m.id })] }}
              checked={on}
              blockedReasons={blocked[optionKey({ kind: "mark", id: m.id })]}
              lockedReasons={requiredReasons(m.id)}
              onChange={() => dispatch({ type: "SET_MARK", mark: m.id, on: !on })}
            />
          );
        })}
      </OptionGroup>
      <NaLateral>
        {getMarks()
          .filter((m) => character.marks.includes(m.id) || warnings[optionKey({ kind: "mark", id: m.id })])
          .map((m) => (
            <BriefingPanel
              key={m.id}
              title={m.name}
              sections={secoes(m)}
              warnings={warnings[optionKey({ kind: "mark", id: m.id })]}
            />
          ))}
      </NaLateral>
    </div>
  );
}
