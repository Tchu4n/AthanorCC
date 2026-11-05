"use client";

import { useState, type ComponentType, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { DicaRolagem } from "@/components/briefing/DicaRolagem";
import { LateralContext } from "@/components/briefing/PainelBriefing";
import { ArquivoConfidencial } from "@/components/ficha/ArquivoConfidencial";
import { PreviaFicha } from "@/components/ficha/PreviaFicha";
import { PainelPersonagem } from "@/components/ficha/PainelPersonagem";
import { EtapaAparencia } from "@/components/steps/EtapaAparencia";
import { EtapaFe } from "@/components/steps/EtapaFe";
import { EtapaIdentidade } from "@/components/steps/EtapaIdentidade";
import { EtapaOficio } from "@/components/steps/EtapaOficio";
import { EtapaOrigem } from "@/components/steps/EtapaOrigem";
import { EtapaRevisao } from "@/components/steps/EtapaRevisao";
import { EtapaEspecie } from "@/components/steps/EtapaEspecie";
import { EtapaSubespecie } from "@/components/steps/EtapaSubespecie";
import type { PropsEtapa } from "@/components/steps/types";
import type { RuleTargetKind } from "@/data/rules";
import { Botao } from "@/components/ui/Botao";
import { DialogoConfirmacao } from "@/components/ui/DialogoConfirmacao";
import { Busca, BarraFiltros, FiltroContext, type Filtro } from "@/components/ui/BarraFiltros";
import { Pergaminho } from "@/components/ui/Pergaminho";
import { BarraProgresso, useMovimentoReduzido, useVidaNoHtml, vida } from "@/components/ui/BarraProgresso";
import { BotaoSom } from "@/components/ui/BotaoSom";
import { FundoEtapa } from "@/components/ui/FundoEtapa";
import { Minimapa } from "@/components/ui/Minimapa";
import { escolhaDaEtapa, Vitrine } from "@/components/ui/Vitrine";
import { getRegion } from "@/lib/catalogo";
import { useCelular } from "@/lib/useCelular";
import { MAX_FAITHS } from "@/lib/character";
import { getVisibleSteps, STEP_LABELS, type StepId } from "@/lib/fluxo";
import { evaluateRules, optionKey } from "@/lib/motor-regras";
import { usePersonagemSalvo, type StorageNotice } from "@/lib/usePersonagemSalvo";
import { useNavegacaoEtapas } from "./useNavegacaoEtapas";

const STEPS: Record<StepId, ComponentType<PropsEtapa>> = {
  origem: EtapaOrigem,
  especie: EtapaEspecie,
  subespecie: EtapaSubespecie,
  oficio: EtapaOficio,
  fe: EtapaFe,
  aparencia: EtapaAparencia,
  identidade: EtapaIdentidade,
  revisao: EtapaRevisao,
};

// Instrução de cada etapa, logo abaixo do título. Nas etapas obrigatórias, também descreve o Avançar desabilitado.
const INSTRUCOES: Record<StepId, string> = {
  origem: "Escolha uma região e uma subregião, ou Andarilho/Aventureiro, para avançar.",
  especie: "Escolha uma espécie para avançar.",
  subespecie: "Escolha uma subespécie para avançar.",
  oficio: "Escolha um ofício, crie o seu (com nome) ou Sem ofício, para avançar.",
  fe: `Escolha até ${MAX_FAITHS} fés, ou nenhuma, para avançar.`,
  aparencia: "Escolha uma imagem de referência, envie a sua ou siga sem imagem para avançar.",
  identidade: "Preencha o nome e marque o sexo para avançar.",
  revisao: "Confira as escolhas e conclua o personagem.",
};

// Etapas com grade de cards (ganham a barra de filtros) e o tipo de alvo das regras de cada uma.
const COM_FILTRO: StepId[] = ["especie", "subespecie", "origem", "oficio", "fe", "aparencia"];
const ALVO_DA_ETAPA: Partial<Record<StepId, RuleTargetKind>> = { especie: "species", origem: "region", oficio: "occupation", fe: "faith" };

const KICKER = "text-xs font-bold uppercase tracking-[0.2em] text-muted";

const STORAGE_MESSAGES: Record<Exclude<StorageNotice, null>, string> = {
  discarded: "O personagem salvo estava em um formato inválido e foi descartado. A criação recomeça do zero.",
  unavailable:
    "O armazenamento do navegador não está disponível. O personagem fica só nesta aba e se perde ao recarregar ou fechar a página.",
};

// Voltar/Avançar: no desktop ficam no pé da coluna da direita. No celular, essa coluna é o fim da página (até 13 telas de
// rolagem); a barra vai para o body (o .pergaminho tem clip-path, que cortaria um elemento fixed) e fica sempre à vista.
// data-region: a cor do tema da região vem desse atributo num ancestral, que o portal deixa para trás.
function Navegacao({ children, regionId }: { children: ReactNode; regionId?: string | null }) {
  const celular = useCelular();
  if (!celular) return <div data-navegacao className="flex justify-between gap-3">{children}</div>;
  return createPortal(
    <div
      data-navegacao
      data-navegacao-fixa
      data-region={regionId ?? undefined}
      className="fixed inset-x-0 bottom-0 z-30 flex gap-3 border-t-2 border-[#c9a24d] bg-background px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_20px_rgb(0_0_0/0.5)] print:hidden"
    >
      {children}
    </div>,
    document.body,
  );
}

export default function CriarPage() {
  const { ready, character, dispatch: rawDispatch, step, setStep: setStepState, storageNotice, reset } = usePersonagemSalvo();
  const nav = useNavegacaoEtapas({ ready, character, step, setStepState, rawDispatch, reset });
  const { done, setDone, notices, filtro, setFiltro, fase, heading, dispatch, steps, index, ok, avancar, voltar, rotuloAvancar } = nav;
  const [confirmReset, setConfirmReset] = useState(false);
  // coluna direita onde as etapas põem a explicação da opção escolhida (via portal)
  const [lateral, setLateral] = useState<HTMLElement | null>(null);
  const reduzido = useMovimentoReduzido();
  const restart = () => {
    nav.restart();
    setConfirmReset(false);
  };

  // --vida no <html>: cinza no início, cor plena ao concluir. Só visual, derivado do progresso da BarraProgresso.
  useVidaNoHtml(ready ? vida(getVisibleSteps(character), step, done) : null);

  if (!ready) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-6">
        <p role="status">Carregando personagem…</p>
      </main>
    );
  }

  const Step = STEPS[step];

  // pílulas só quando há opção indisponível por regra nesta etapa; sem elas, o filtro de estado não vale
  // na Origem, as regras valem para as regiões; as subregiões nunca ficam bloqueadas
  const alvo = step === "origem" && fase !== "regiao" ? undefined : ALVO_DA_ETAPA[step];
  const comEstado = !!alvo && Object.keys(evaluateRules(character).blocked).some((k) => k.startsWith(`${alvo}:`));
  const filtroAtivo: Filtro = comEstado ? filtro : { ...filtro, estado: "todas" };

  const storageBanner = storageNotice && (
    <p role="alert" className="rounded-lg border-l-4 border-amber-500 bg-amber-500/10 p-3 text-sm">
      {STORAGE_MESSAGES[storageNotice]}
    </p>
  );

  // Cor da região escolhida em todas as etapas, já a partir da escolha; imagem de fundo só na etapa Origem.
  const regionId = character.origin?.regionId;
  // concluído mostra o mesmo que a Revisão
  const etapaDaVitrine: StepId = done ? "revisao" : step;
  const vitrineAtual = escolhaDaEtapa(etapaDaVitrine, character);
  // regiões que a espécie não aceita: o pino do minimapa fica desligado, como o card
  const bloqueadas = step === "origem" ? evaluateRules(character).blocked : {};
  // pinos de região só escolhem na fase das regiões; na das subregiões o mapa aproxima a região e os pinos são as subregiões
  const minimapa = (className: string) => (
    <Minimapa
      regionId={character.origin?.regionId}
      subregionId={character.origin?.subregionId}
      focarRegiao={fase === "subregiao"}
      onSelectRegiao={fase === "regiao" ? (id) => dispatch({ type: "ESCOLHER_REGIAO", regionId: id }) : undefined}
      onSelectSubregiao={fase === "subregiao" ? (id) => dispatch({ type: "ESCOLHER_SUBREGIAO", subregionId: id }) : undefined}
      bloqueio={(id) => bloqueadas[optionKey({ kind: "region", id })]}
      className={className}
    />
  );
  const regiaoEscolhida = getRegion(character.origin?.regionId);
  const background = !done && step === "origem" ? (regiaoEscolhida?.bandeira ?? regiaoEscolhida?.image ?? null) : null;

  // Ordem no DOM = ordem de foco: conteúdo (filtros e cards), coluna direita, barra superior.
  // A barra aparece no topo pela ordem do flex (order-first).
  const layout = (content: ReactNode, barra?: ReactNode, rodape?: ReactNode) => (
    // overflow-x-clip: adereços da mesa podem sair da tela sem criar rolagem horizontal (clip não quebra o sticky)
    <div data-region={regionId ?? undefined} className="flex flex-1 flex-col overflow-x-clip">
      <FundoEtapa image={background} />
      {/* a página é um pergaminho aberto sobre a mesa; sm:mt-28: faixa de mesa acima dele, com os adereços */}
      <Pergaminho className="mx-auto mt-4 mb-6 w-[calc(100%-2rem)] max-w-[76rem] sm:mt-28 sm:w-[calc(100%-10rem)] max-lg:[@media(max-height:600px)]:mt-2 max-lg:[@media(max-height:600px)]:w-[calc(100%-2rem)]">
        <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,1fr)_26rem]">
          {content}
          {/* coluna direita: vitrine e, embaixo, a explicação da escolha (etapas) ou retrato, nome e prévia (concluído).
              Presas juntas no desktop; a parte de baixo rola por dentro. */}
          {/* com o rodapé preso embaixo (etapas), a coluna termina acima dele */}
          {/* Voltar/Avançar ficam no pé desta coluna: presa no desktop, sempre à vista sem cobrir os cards; no celular, no fim da página */}
          <div data-quadros className="flex min-w-0 flex-col gap-6 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:self-start">
            {/* faixa horizontal que encolhe com a altura da tela; em telas baixas sai para o conteúdo de baixo caber */}
            {/* no concluído a vitrine sai: o retrato já está no painel e a prévia da análise precisa da altura */}
            {/* na Origem, o minimapa ocupa o lugar da vitrine (a arte da região já está nos cards e no fundo) */}
            {!done && (step === "origem" ? minimapa("hidden w-full shrink-0 lg:block [@media(max-height:600px)]:lg:hidden") : (
              <Vitrine {...vitrineAtual} placeholder={etapaDaVitrine} className="hidden aspect-video w-full shrink-0 lg:block [@media(max-height:600px)]:lg:hidden" />
            ))}
            {done ? (
              <>
                <PainelPersonagem character={character} dispatch={dispatch} idNome="nome-painel" />
                <PreviaFicha
                  character={character}
                  className="bg-background/80 shadow-[0_0_32px_-12px_var(--vivo)] lg:min-h-[26rem] lg:flex-1"
                />
              </>
            ) : (
              <div ref={setLateral} data-explicacao className="space-y-4 empty:hidden lg:min-h-0 lg:flex-1 lg:overflow-y-auto [&>section]:bg-background/80" />
            )}
            {!done && <DicaRolagem alvo={lateral} />}
            {rodape && <div className="shrink-0">{rodape}</div>}
          </div>
        </div>
      </Pergaminho>
      {/* topo sem barra: a tábua do título, as ações e o sino ficam soltos sobre a mesa */}
      <header className="order-first">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
          <p className="tabua mr-auto flex items-center gap-1 rounded-sm py-2 pr-5 pl-2 lg:-rotate-1">
            <span className="sr-only">Athanor · Criador de personagem</span>
            {/* inicial iluminada, como num manuscrito */}
            <span aria-hidden className="iluminada grid size-10 place-items-center text-3xl leading-none text-[#fff3c8]">
              A
            </span>
            <span aria-hidden className="font-(family-name:--font-rotulo) text-xl font-semibold text-[#f0d78c]">
              thanor
            </span>
            <span aria-hidden className="ml-2 text-xs tracking-widest text-[#d8c49a] uppercase max-sm:hidden">
              Criador de personagem
            </span>
          </p>
          {/* no celular: título e sons na 1ª linha, ações na 2ª */}
          {barra && (
            // ações à direita, junto do sino: busca e, longe do Voltar/Avançar, o Recomeçar (evita clique por engano)
            <nav aria-label="Navegação" className="flex flex-1 flex-wrap items-center justify-end gap-3 max-lg:order-last max-lg:basis-full max-lg:[@media(max-height:600px)]:order-none max-lg:[@media(max-height:600px)]:basis-0">
              {barra}
            </nav>
          )}
          <div className={barra ? "" : "ml-auto"}>
            <BotaoSom />
          </div>
        </div>
      </header>
    </div>
  );

  if (done) {
    return layout(
      <main className="min-w-0 space-y-4">
        {storageBanner}
        <header className="space-y-2">
          <p className={KICKER}>Criador de personagem</p>
          <BarraProgresso steps={steps} current="revisao" titulo="Arquivo confidencial" concluido reduzido={reduzido} headingRef={heading} />
        </header>
        <ArquivoConfidencial character={character} dispatch={dispatch} />
        <p>Assine a análise e exporte o PDF pela prévia.</p>
        <div className="flex flex-wrap gap-3">
          {/* volta à Revisão; dali o Voltar percorre as etapas para corrigir qualquer escolha */}
          <Botao variant="secondary" seta="esquerda" onClick={() => setDone(false)}>
            Voltar à revisão
          </Botao>
          <Botao variant="secondary" onClick={() => setConfirmReset(true)}>
            {/* apaga o personagem salvo: o triângulo vermelho avisa antes do clique */}
            <svg aria-hidden="true" viewBox="0 0 24 24" className="mr-2 inline-block size-4 align-[-0.15em]">
              <path d="M12 2.5 22.5 21h-21Z" fill="#dc2626" stroke="#7f1d1d" strokeWidth="1.2" strokeLinejoin="round" />
              <path d="M12 9v5.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
              <circle cx="12" cy="17.6" r="1.3" fill="#fff" />
            </svg>
            Criar outro personagem
          </Botao>
        </div>
        <DialogoConfirmacao
          open={confirmReset}
          title="Criar outro personagem?"
          message="O personagem atual será apagado, inclusive o que está salvo neste navegador. Exporte o PDF antes, se quiser guardá-lo."
          confirmLabel="Criar outro"
          onConfirm={restart}
          onCancel={() => setConfirmReset(false)}
        />
      </main>,
    );
  }

  return layout(
    <main className="min-w-0 space-y-6">
      {storageBanner}
      {/* fora do conteúdo que remonta: a barra anima a troca de etapa; o título dela é o h1 */}
      <header className="space-y-2">
        {/* deitado, o título já está no cabeçalho: o espaço vale mais para as cartas */}
        <p className={`${KICKER} max-lg:[@media(max-height:600px)]:hidden`}>Criador de personagem</p>
        <BarraProgresso steps={steps} current={step} titulo={STEP_LABELS[step]} reduzido={reduzido} headingRef={heading} />
        <p key={step} id="dica-avancar" className="text-muted motion-safe:animate-[step-in_250ms_ease-out]">
          {INSTRUCOES[step]}
        </p>
      </header>
      {/* key: cada etapa remonta e refaz o fade de 250 ms; com reduced-motion, troca instantânea */}
      <div key={`${step}:${fase ?? ""}`} data-step-content className="space-y-6 motion-safe:animate-[step-in_250ms_ease-out]">
        {/* no celular a vitrine fica no topo da etapa, também em 16:9 */}
        {step === "origem" ? minimapa("w-full lg:hidden [@media(max-height:600px)]:hidden") : <Vitrine {...vitrineAtual} placeholder={etapaDaVitrine} className={`aspect-video w-full lg:hidden [@media(max-height:600px)]:hidden ${vitrineAtual.src || vitrineAtual.simbolo ? "" : "max-lg:hidden"}`} />}

        <div role="status">
          {notices.length > 0 && (
            <ul className="space-y-1 rounded-lg border-l-4 border-amber-500 bg-amber-500/10 p-3 text-sm">
              {notices.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          )}
        </div>

        {comEstado && <BarraFiltros filtro={filtroAtivo} onChange={setFiltro} />}
        <FiltroContext value={filtroAtivo}>
          <LateralContext value={lateral}>
            <Step character={character} dispatch={dispatch} faseOrigem={fase} />
          </LateralContext>
        </FiltroContext>
      </div>

      <DialogoConfirmacao
        open={confirmReset}
        title="Recomeçar o personagem?"
        message="Todas as escolhas serão apagadas, inclusive o que está salvo neste navegador."
        confirmLabel="Recomeçar"
        onConfirm={restart}
        onCancel={() => setConfirmReset(false)}
      />
    </main>,
    <>
      {COM_FILTRO.includes(step) && <Busca filtro={filtroAtivo} onChange={setFiltro} className="max-lg:flex-1 lg:w-64" />}
      <Botao variant="secondary" onClick={() => setConfirmReset(true)}>
        Recomeçar
      </Botao>
    </>,
    // escolher não avança sozinho: Avançar confirma; no desktop fica sempre à vista no pé da coluna da direita
    <Navegacao regionId={regionId}>
      <Botao variant="secondary" seta="esquerda" disabled={index === 0 && fase !== "subregiao"} onClick={voltar} className="flex-1">
        Voltar
      </Botao>
      <Botao disabled={!ok} aria-describedby={!ok ? "dica-avancar" : undefined} onClick={avancar} className="flex-1">
        {rotuloAvancar}
      </Botao>
    </Navegacao>,
  );
}
