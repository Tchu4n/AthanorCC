import { BriefingPanel } from "@/components/briefing/BriefingPanel";
import { OptionCard, OptionGroup } from "@/components/ui/OptionCard";
import { getOriginOptions, getRegion, getRegions, getSubregions } from "@/lib/catalog";
import type { StepProps } from "./types";

export function OriginStep({ character, dispatch }: StepProps) {
  const region = getRegion(character.origin?.regionId);
  const options = region ? getOriginOptions(region.id) : [];
  const chosen = options.find((o) => o.id === character.origin?.subregionId);

  return (
    <div className="space-y-6">
      <OptionGroup legend="Região">
        {getRegions().map((r) => (
          <OptionCard
            key={r.id}
            type="radio"
            name="regiao"
            label={r.name}
            checked={region?.id === r.id}
            onChange={() => dispatch({ type: "SELECT_REGION", regionId: r.id })}
          />
        ))}
      </OptionGroup>

      {region && (
        <>
          <BriefingPanel title={region.name} sections={[{ text: region.briefing }]} />

          <OptionGroup legend="Subregião">
            {options.map((o) => (
              <OptionCard
                key={o.id}
                type="radio"
                name="subregiao"
                label={o.name}
                checked={chosen?.id === o.id}
                onChange={() => dispatch({ type: "SELECT_SUBREGION", subregionId: o.id })}
              />
            ))}
          </OptionGroup>
          {getSubregions(region.id).length === 0 && (
            <p role="note" className="text-sm opacity-80">
              As subregiões de {region.name} estão em definição. Por enquanto, só é possível seguir como Andarilho/Aventureiro.
            </p>
          )}

          {chosen && (
            <BriefingPanel
              title={chosen.name}
              sections={[
                {
                  text: chosen.andarilho
                    ? `Personagem de ${region.name} sem vínculo com uma subregião específica.`
                    : chosen.briefing,
                },
              ]}
            />
          )}
        </>
      )}
    </div>
  );
}
