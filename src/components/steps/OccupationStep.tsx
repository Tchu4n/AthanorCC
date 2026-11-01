import { useEffect, useRef, useState } from "react";
import { BriefingPanel, NaLateral } from "@/components/briefing/BriefingPanel";
import { Button } from "@/components/ui/Button";
import { ChoiceCard, Opcional, OptionGroup } from "@/components/ui/ChoiceCard";
import { SimboloOficio } from "@/components/ui/SimboloOficio";
import { getOccupation, getOccupations, OFICIO_PROPRIO_LABEL } from "@/lib/catalog";
import { limpar, LIMITES_TEXTO, OFICIO_PROPRIO } from "@/lib/character";
import { evaluateRules, optionKey } from "@/lib/rules-engine";
import type { StepProps } from "./types";

const INPUT = "w-full rounded-md border border-foreground/30 bg-transparent p-2 focus-visible:outline-3 focus-visible:outline-blue-500";

export function OccupationStep({ character, dispatch }: StepProps) {
  const chosen = getOccupation(character.occupationId);
  const proprio = character.occupationId === OFICIO_PROPRIO;
  const { name, description } = character.customOccupation;
  const { blocked, warnings } = evaluateRules(character);
  const editar = (campo: Partial<typeof character.customOccupation>) =>
    dispatch({ type: "SET_CUSTOM_OCCUPATION", customOccupation: campo });
  // Nome e descrição num <dialog> modal: no fim da página, os campos passavam despercebidos.
  // anterior: ofício e textos de antes de abrir, para o Cancelar desfazer.
  const [anterior, setAnterior] = useState<{ occupationId: string | null; texto: typeof character.customOccupation } | null>(null);
  const dialogo = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = dialogo.current;
    if (anterior && d && !d.open) d.showModal();
    if (!anterior && d?.open) d.close();
  }, [anterior]);
  const abrir = () => setAnterior({ occupationId: character.occupationId, texto: character.customOccupation });
  const cancelar = () => {
    if (!anterior) return;
    editar(anterior.texto);
    if (anterior.occupationId !== OFICIO_PROPRIO) dispatch({ type: "SELECT_OCCUPATION", occupationId: anterior.occupationId });
    setAnterior(null);
  };
  return (
    <div className="space-y-6">
      <OptionGroup legend={<>Ofício (<Opcional />)</>}>
        <ChoiceCard
          type="radio"
          name="oficio"
          label="Sem ofício"
          categoria="Ofício"
          icone="oficio"
          checked={!chosen && !proprio}
          onChange={() => dispatch({ type: "SELECT_OCCUPATION", occupationId: null })}
        />
        <ChoiceCard
          type="radio"
          name="oficio"
          label={OFICIO_PROPRIO_LABEL}
          categoria="Ofício"
          icone="oficio"
          destaque={proprio && name.trim() ? name.trim() : undefined}
          descricao="Crie um ofício que não está na lista, com nome e descrição próprios."
          checked={proprio}
          onChange={() => {
            abrir();
            dispatch({ type: "SELECT_OCCUPATION", occupationId: OFICIO_PROPRIO });
          }}
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
            simbolo={<SimboloOficio id={o.id} className="h-3/4 max-h-48" />}
            descricao={o.briefing}
            saibaMais={{ sections: [{ text: o.briefing }], warnings: warnings[optionKey({ kind: "occupation", id: o.id })] }}
            checked={chosen?.id === o.id}
            blockedReasons={blocked[optionKey({ kind: "occupation", id: o.id })]}
            onChange={() => dispatch({ type: "SELECT_OCCUPATION", occupationId: o.id })}
          />
        ))}
      </OptionGroup>
      {proprio && !anterior && (
        <Button variant="secondary" onClick={abrir}>
          Editar ofício personalizado
        </Button>
      )}
      <dialog
        ref={dialogo}
        aria-labelledby="oficio-proprio-titulo"
        onCancel={(e) => {
          e.preventDefault();
          cancelar();
        }}
        className="m-auto w-[min(32rem,calc(100vw-2rem))] rounded-lg border border-foreground/20 bg-background p-6 text-foreground backdrop:bg-black/60"
      >
        <h2 id="oficio-proprio-titulo" className="text-lg font-semibold">
          {OFICIO_PROPRIO_LABEL}
        </h2>
        <div className="mt-4 space-y-4">
          <div className="space-y-1">
            <label htmlFor="oficio-nome" className="font-semibold">
              Nome do ofício (obrigatório)
            </label>
            <input
              id="oficio-nome"
              type="text"
              required
              autoFocus
              maxLength={LIMITES_TEXTO.oficioNome}
              value={name}
              onChange={(e) => editar({ name: limpar.nome(e.target.value) })}
              className={INPUT}
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="oficio-descricao" className="font-semibold">
              Descrição (<Opcional />)
            </label>
            <textarea
              id="oficio-descricao"
              rows={4}
              maxLength={LIMITES_TEXTO.oficioDescricao}
              aria-describedby="oficio-descricao-limite"
              value={description}
              onChange={(e) => editar({ description: e.target.value })}
              className={INPUT}
            />
            <p id="oficio-descricao-limite" className="text-right text-xs opacity-70">
              {description.length}/{LIMITES_TEXTO.oficioDescricao} caracteres
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <Button variant="secondary" onClick={cancelar}>
            Cancelar
          </Button>
          <Button onClick={() => setAnterior(null)} disabled={!name.trim()}>
            Salvar ofício
          </Button>
        </div>
      </dialog>
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
