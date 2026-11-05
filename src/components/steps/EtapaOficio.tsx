import { useEffect, useRef, useState } from "react";
import { PainelBriefing, NaLateral } from "@/components/briefing/PainelBriefing";
import { Botao } from "@/components/ui/Botao";
import { CartaoEscolha, Opcional, GrupoCartoes } from "@/components/ui/CartaoEscolha";
import { SimboloOficio } from "@/components/ui/SimboloOficio";
import { cruzamentoDe, getOccupation, getOccupations, OFICIO_PROPRIO_LABEL, secoesDe } from "@/lib/catalogo";
import { limpar, LIMITES_TEXTO, OFICIO_PROPRIO } from "@/lib/character";
import { evaluateRules, optionKey } from "@/lib/motor-regras";
import type { PropsEtapa } from "./types";

const INPUT = "w-full rounded-md border border-foreground/30 bg-transparent p-2 focus-visible:outline-3 focus-visible:outline-blue-500";

const SEM_OFICIO = {
  briefing:
    "Vagabundo de nascença ou de escolha: dorme onde der, come o que aparece e vive de bicos, favores e muita lábia. Não tem patrão, nem renda, nem lugar certo, só a trouxa nas costas e o tempo todo do mundo.",
  implications:
    "Você sabe se virar com pouco: achar abrigo, pedir comida sem humilhação e sumir antes que a conversa vire problema. Ninguém espera nada de você, o que é uma liberdade, e ninguém lhe deve nada, o que é um risco. Em compensação, quem não tem ofício ouve de tudo nas estalagens e nas estradas, e quase sempre sabe quem está pagando bem por quê.",
};

export function EtapaOficio({ character, dispatch }: PropsEtapa) {
  const chosen = getOccupation(character.occupationId);
  const proprio = character.occupationId === OFICIO_PROPRIO;
  const { name, description } = character.customOccupation;
  const { blocked, warnings } = evaluateRules(character);
  const editar = (campo: Partial<typeof character.customOccupation>) =>
    dispatch({ type: "DEFINIR_OFICIO_PROPRIO", customOccupation: campo });
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
    if (anterior.occupationId !== OFICIO_PROPRIO) dispatch({ type: "ESCOLHER_OFICIO", occupationId: anterior.occupationId });
    setAnterior(null);
  };
  return (
    <div className="space-y-6">
      <GrupoCartoes legend={<>Ofício (<Opcional />)</>}>
        <CartaoEscolha
          type="radio"
          name="oficio"
          label="Sem ofício"
          categoria="Ofício"
          icone="oficio"
          simbolo={<SimboloOficio id="sem-oficio" className="h-3/4 max-h-48" />}
          descricao={SEM_OFICIO.briefing}
          checked={!chosen && !proprio}
          explicacao={!chosen && !proprio && <PainelBriefing title="Sem ofício" sections={secoesDe(SEM_OFICIO)} />}
          onChange={() => dispatch({ type: "ESCOLHER_OFICIO", occupationId: null })}
        />
        <CartaoEscolha
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
            dispatch({ type: "ESCOLHER_OFICIO", occupationId: OFICIO_PROPRIO });
          }}
        />
        {getOccupations().map((o) => (
          <CartaoEscolha
            key={o.id}
            type="radio"
            name="oficio"
            label={o.name}
            categoria="Ofício"
            icone="oficio"
            image={o.image}
            simbolo={<SimboloOficio id={o.id} className="h-3/4 max-h-48" />}
            descricao={o.briefing}
            saibaMais={{ sections: secoesDe(o), warnings: warnings[optionKey({ kind: "occupation", id: o.id })] }}
            checked={chosen?.id === o.id}
            explicacao={
              chosen?.id === o.id && (
                <PainelBriefing
                  title={o.name}
                  sections={secoesDe(o, cruzamentoDe(o.id, character))}
                  warnings={warnings[optionKey({ kind: "occupation", id: o.id })]}
                />
              )
            }
            blockedReasons={blocked[optionKey({ kind: "occupation", id: o.id })]}
            onChange={() => dispatch({ type: "ESCOLHER_OFICIO", occupationId: o.id })}
          />
        ))}
      </GrupoCartoes>
      {proprio && !anterior && (
        <Botao variant="secondary" onClick={abrir}>
          Editar ofício personalizado
        </Botao>
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
          <Botao variant="secondary" onClick={cancelar}>
            Cancelar
          </Botao>
          <Botao onClick={() => setAnterior(null)} disabled={!name.trim()}>
            Salvar ofício
          </Botao>
        </div>
      </dialog>
      <NaLateral>
        {!chosen && !proprio && <PainelBriefing title="Sem ofício" sections={secoesDe(SEM_OFICIO)} />}
        {chosen && (
          <PainelBriefing
            title={chosen.name}
            sections={secoesDe(chosen, cruzamentoDe(chosen.id, character))}
            warnings={warnings[optionKey({ kind: "occupation", id: chosen.id })]}
          />
        )}
      </NaLateral>
    </div>
  );
}
