import { PainelBriefing, NaLateral } from "@/components/briefing/PainelBriefing";
import { CartaoEscolha, Opcional, GrupoCartoes } from "@/components/ui/CartaoEscolha";
import { SimboloRegiao } from "@/components/ui/SimboloRegiao";
import { getMarks, getOriginOptions, getRegion, getRegions, getSubregions } from "@/lib/catalogo";
import { evaluateRules, optionKey } from "@/lib/motor-regras";
import type { PropsEtapa } from "./types";

// Duas fases, controladas pela página: primeiro só as regiões; o Avançar confirma a região e mostra só as subregiões dela.
export function EtapaOrigem({ character, dispatch, faseOrigem = "regiao" }: PropsEtapa) {
  const region = getRegion(character.origin?.regionId);
  const options = region ? getOriginOptions(region.id) : [];
  const chosen = options.find((o) => o.id === character.origin?.subregionId);
  const textoDa = (o: (typeof options)[number]) =>
    o.andarilho ? `Personagem de ${region?.name} sem vínculo com uma subregião específica.` : o.briefing;
  const explicacaoDaRegiao = region && <PainelBriefing title={region.name} sections={[{ text: region.briefing }]} />;

  if (!region || faseOrigem === "regiao") {
    // a espécie já foi escolhida: as regiões que não a aceitam ficam indisponíveis, com o motivo
    const { blocked } = evaluateRules(character);
    return (
      <div className="space-y-6">
        <GrupoCartoes legend="Região">
          {getRegions().map((r) => (
            <CartaoEscolha
              key={r.id}
              type="radio"
              name="regiao"
              label={r.name}
              categoria="Região"
              icone="origem"
              // o card mostra a arte da região; a bandeira aparece na vitrine e no fundo ao escolher
              image={r.image}
              simbolo={<SimboloRegiao id={r.id} className="h-3/4 max-h-48" />}
              cena
              destaque={r.mainArea && `Área principal: ${r.mainArea}`}
              descricao={r.briefing}
              saibaMais={{ sections: [{ text: r.briefing }] }}
              checked={region?.id === r.id}
              blockedReasons={blocked[optionKey({ kind: "region", id: r.id })]}
              onChange={() => dispatch({ type: "SELECT_REGION", regionId: r.id })}
            />
          ))}
        </GrupoCartoes>
        <NaLateral>{explicacaoDaRegiao}</NaLateral>
      </div>
    );
  }

  // Marcas de escolha livre que a origem libera (ex.: Terceiro Olho em Man'naka oko); as obrigatórias entram sozinhas.
  const regras = evaluateRules(character);
  const marcas = getMarks().filter((m) => !regras.blocked[optionKey({ kind: "mark", id: m.id })] && !regras.required.includes(m.id));
  const secoesDa = (m: (typeof marcas)[number]) => [{ text: m.briefing }, ...(m.descricao ? [{ label: "Prós e contras", text: m.descricao }] : [])];

  return (
    <div className="space-y-6">
      <GrupoCartoes legend="Subregião">
        {options.map((o) => (
          <CartaoEscolha
            key={o.id}
            type="radio"
            name="subregiao"
            label={o.name}
            categoria="Subregião"
            icone="origem"
            image={o.image}
            simbolo={<SimboloRegiao id={region.id} className="h-3/4 max-h-48" />}
            cena={o.cena}
            descricao={textoDa(o)}
            saibaMais={{ sections: [{ text: textoDa(o) }] }}
            checked={chosen?.id === o.id}
            onChange={() => dispatch({ type: "SELECT_SUBREGION", subregionId: o.id })}
          />
        ))}
      </GrupoCartoes>
      {getSubregions(region.id).length === 0 && (
        <p role="note" className="text-sm opacity-80">
          As subregiões de {region.name} estão em definição. Por enquanto, só é possível seguir como Andarilho/Aventureiro.
        </p>
      )}

      {marcas.length > 0 && (
        <GrupoCartoes legend={<>Marcas (<Opcional />)</>}>
          {marcas.map((m) => {
            const on = character.marks.includes(m.id);
            return (
              <CartaoEscolha
                key={m.id}
                type="checkbox"
                name="marca"
                label={m.name}
                categoria="Marca"
                icone="origem"
                descricao={m.briefing}
                saibaMais={{ sections: secoesDa(m) }}
                checked={on}
                onChange={() => dispatch({ type: "SET_MARK", mark: m.id, on: !on })}
              />
            );
          })}
        </GrupoCartoes>
      )}

      <NaLateral>
        {explicacaoDaRegiao}
        {chosen && <PainelBriefing title={chosen.name} sections={[{ text: textoDa(chosen) }]} />}
        {marcas
          .filter((m) => character.marks.includes(m.id))
          .map((m) => (
            <PainelBriefing key={m.id} title={m.name} sections={secoesDa(m)} />
          ))}
      </NaLateral>
    </div>
  );
}
