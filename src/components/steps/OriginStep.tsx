import { BriefingPanel, NaLateral } from "@/components/briefing/BriefingPanel";
import { ChoiceCard, OptionGroup } from "@/components/ui/ChoiceCard";
import { getOriginOptions, getRegion, getRegions, getSubregion, getSubregions } from "@/lib/catalog";
import type { StepProps } from "./types";

// Duas fases, controladas pela página: primeiro só as regiões; o Avançar confirma a região e mostra só as subregiões dela.
export function OriginStep({ character, dispatch, faseOrigem = "regiao" }: StepProps) {
  const region = getRegion(character.origin?.regionId);
  const options = region ? getOriginOptions(region.id) : [];
  const chosen = options.find((o) => o.id === character.origin?.subregionId);
  const textoDa = (o: (typeof options)[number]) =>
    o.andarilho ? `Personagem de ${region?.name} sem vínculo com uma subregião específica.` : o.briefing;
  const explicacaoDaRegiao = region && <BriefingPanel title={region.name} sections={[{ text: region.briefing }]} />;

  if (!region || faseOrigem === "regiao") {
    return (
      <div className="space-y-6">
        <OptionGroup legend="Região">
          {getRegions().map((r) => (
            <ChoiceCard
              key={r.id}
              type="radio"
              name="regiao"
              label={r.name}
              categoria="Região"
              icone="origem"
              // o card mostra a arte da região; a bandeira aparece na vitrine e no fundo ao escolher
              image={r.image}
              cena
              destaque={r.mainArea && `Área principal: ${r.mainArea}`}
              descricao={r.briefing}
              saibaMais={{ sections: [{ text: r.briefing }] }}
              checked={region?.id === r.id}
              onChange={() => dispatch({ type: "SELECT_REGION", regionId: r.id })}
            />
          ))}
        </OptionGroup>
        <NaLateral>{explicacaoDaRegiao}</NaLateral>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <OptionGroup legend="Subregião">
        {options.map((o) => (
          <ChoiceCard
            key={o.id}
            type="radio"
            name="subregiao"
            label={o.name}
            categoria="Subregião"
            icone="origem"
            // sem imagem própria, a subregião (e o Andarilho) usa a imagem da região
            image={getSubregion(region.id, o.id)?.image ?? region.image}
            // recorte de cena só na arte da região; a imagem própria da subregião costuma ser retrato
            cena={!getSubregion(region.id, o.id)?.image}
            descricao={textoDa(o)}
            saibaMais={{ sections: [{ text: textoDa(o) }] }}
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

      <NaLateral>
        {explicacaoDaRegiao}
        {chosen && <BriefingPanel title={chosen.name} sections={[{ text: textoDa(chosen) }]} />}
      </NaLateral>
    </div>
  );
}
