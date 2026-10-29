"use client";

import { useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import { LateralContext } from "@/components/briefing/BriefingPanel";
import { FichaPreview } from "@/components/ficha/FichaPreview";
import { AppearanceStep } from "@/components/steps/AppearanceStep";
import { FaithStep } from "@/components/steps/FaithStep";
import { IdentityStep } from "@/components/steps/IdentityStep";
import { MarksStep } from "@/components/steps/MarksStep";
import { OccupationStep } from "@/components/steps/OccupationStep";
import { OriginStep } from "@/components/steps/OriginStep";
import { ReviewStep } from "@/components/steps/ReviewStep";
import { SpeciesStep } from "@/components/steps/SpeciesStep";
import { SubspeciesStep } from "@/components/steps/SubspeciesStep";
import type { FaseOrigem, StepProps } from "@/components/steps/types";
import type { RuleTargetKind } from "@/data/rules";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Busca, FilterBar, FiltroContext, SEM_FILTRO, type Filtro } from "@/components/ui/FilterBar";
import { Pergaminho } from "@/components/ui/Pergaminho";
import { PortraitFrame } from "@/components/ui/PortraitFrame";
import { ProgressBar, useMovimentoReduzido, vida } from "@/components/ui/ProgressBar";
import { SoundToggle } from "@/components/ui/SoundToggle";
import { StepBackground } from "@/components/ui/StepBackground";
import { escolhaDaEtapa, Vitrine } from "@/components/ui/Vitrine";
import { getRegion } from "@/lib/catalog";
import { MAX_FAITHS, type Character } from "@/lib/character";
import { imagemDoPersonagem } from "@/lib/ficha";
import { canAdvance, getVisibleSteps, STEP_LABELS, type StepId } from "@/lib/flow";
import type { CharacterAction } from "@/lib/reducer";
import { evaluateRules, noticesFor } from "@/lib/rules-engine";
import { playClick, playConfirm } from "@/lib/sound";
import { usePersistentCharacter, type StorageNotice } from "@/lib/usePersistentCharacter";

const STEPS: Record<StepId, ComponentType<StepProps>> = {
  origem: OriginStep,
  especie: SpeciesStep,
  subespecie: SubspeciesStep,
  oficio: OccupationStep,
  fe: FaithStep,
  marcas: MarksStep,
  aparencia: AppearanceStep,
  identidade: IdentityStep,
  revisao: ReviewStep,
};

// Instrução de cada etapa, logo abaixo do título. Nas etapas obrigatórias, também descreve o Avançar desabilitado.
const INSTRUCOES: Record<StepId, string> = {
  origem: "Escolha uma região e uma subregião, ou Andarilho/Aventureiro, para avançar.",
  especie: "Escolha uma espécie para avançar.",
  subespecie: "Escolha uma subespécie para avançar.",
  oficio: "Escolha um ofício, ou Sem ofício, para avançar.",
  fe: `Escolha até ${MAX_FAITHS} fés, ou nenhuma, para avançar.`,
  marcas: "Escolha as marcas do personagem, ou nenhuma, para avançar.",
  aparencia: "Escolha uma imagem de referência, envie a sua ou siga sem imagem para avançar.",
  identidade: "Preencha o nome para avançar.",
  revisao: "Confira as escolhas e conclua o personagem.",
};

// Etapas com grade de cards (ganham a barra de filtros) e o tipo de alvo das regras de cada uma.
const COM_FILTRO: StepId[] = ["origem", "especie", "subespecie", "oficio", "fe", "marcas", "aparencia"];
const ALVO_DA_ETAPA: Partial<Record<StepId, RuleTargetKind>> = { especie: "species", oficio: "occupation", fe: "faith", marcas: "mark" };

const KICKER = "text-xs font-bold uppercase tracking-[0.2em] text-muted";

// Retrato e nome do personagem, só na página de concluído (na coluna direita, acima da prévia).
function PainelPersonagem({ character, dispatch, idNome }: { character: Character; dispatch: (a: CharacterAction) => void; idNome: string }) {
  const img = imagemDoPersonagem(character.appearance.image);
  return (
    <section aria-label="Personagem" className="grid grid-cols-[7rem_minmax(0,1fr)] items-start gap-4">
      <PortraitFrame retrato={img && { src: img.src, alt: `Retrato do personagem: ${img.displayName}` }} />
      <div className="space-y-1">
        <label htmlFor={idNome} className="text-sm font-semibold">
          Nome do personagem
        </label>
        <input
          id={idNome}
          type="text"
          value={character.identity.name}
          onChange={(e) => dispatch({ type: "SET_IDENTITY", identity: { name: e.target.value } })}
          className="min-h-11 w-full rounded-md border border-border bg-surface px-3 focus-visible:outline-3 focus-visible:outline-blue-500"
        />
      </div>
    </section>
  );
}

const STORAGE_MESSAGES: Record<Exclude<StorageNotice, null>, string> = {
  discarded: "O personagem salvo estava em um formato inválido e foi descartado. A criação recomeça do zero.",
  unavailable:
    "O armazenamento do navegador não está disponível. O personagem fica só nesta aba e se perde ao recarregar ou fechar a página.",
};

export default function CriarPage() {
  const { ready, character, dispatch: rawDispatch, step, setStep: setStepState, storageNotice, reset } = usePersistentCharacter();
  const [done, setDone] = useState(false);
  const [notices, setNotices] = useState<string[]>([]);
  const [confirmReset, setConfirmReset] = useState(false);
  const [pulso, setPulso] = useState(0);
  const [filtro, setFiltro] = useState<Filtro>(SEM_FILTRO);
  // coluna direita onde as etapas põem a explicação da opção escolhida (via portal)
  const [lateral, setLateral] = useState<HTMLElement | null>(null);
  // fase da Origem; null = deduz do personagem (com região escolhida, abre nas subregiões)
  const [faseOrigem, setFaseOrigem] = useState<FaseOrigem | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const reduzido = useMovimentoReduzido();
  // fase efetiva: o foco só vai para o título quando ela muda de fato (não quando a escolha só a confirma)
  const fase: FaseOrigem | undefined =
    step === "origem" ? (faseOrigem ?? (character.origin?.regionId ? "subregiao" : "regiao")) : undefined;

  useEffect(() => {
    if (ready) heading.current?.focus();
  }, [ready, step, done, fase]);

  // O reducer já corrige as escolhas; aqui só guardamos o aviso das correções para mostrar ao usuário.
  const dispatch = (action: CharacterAction) => {
    setNotices(noticesFor(character, action));
    // escolher a região não avança: a grade de regiões fica até o Avançar confirmar
    if (action.type === "SELECT_REGION") setFaseOrigem("regiao");
    rawDispatch(action);
  };
  const setStep = (next: StepId) => {
    setNotices([]);
    setFiltro(SEM_FILTRO);
    setFaseOrigem(null);
    setStepState(next);
  };
  const restart = () => {
    reset();
    setFaseOrigem(null);
    setNotices([]);
    setDone(false);
    setConfirmReset(false);
  };

  // --vida no <html>: cinza no início, cor plena ao concluir. Só visual, derivado do progresso da ProgressBar.
  const vidaAtual = ready ? vida(getVisibleSteps(character), step, done) : null;
  useEffect(() => {
    if (vidaAtual === null) return;
    const root = document.documentElement;
    root.style.setProperty("--vida", String(vidaAtual));
    if (!("vidaPronta" in root.dataset)) {
      // aplica o primeiro valor sem transição (recarregar não anima) e só então liga a transição
      void getComputedStyle(root).getPropertyValue("--vida");
      root.dataset.vidaPronta = "";
    }
  }, [vidaAtual]);

  if (!ready) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-6">
        <p role="status">Carregando personagem…</p>
      </main>
    );
  }

  const steps = getVisibleSteps(character);
  const index = steps.indexOf(step);
  // nas regiões, basta a região para confirmar e ir às subregiões
  const ok = fase === "regiao" ? !!character.origin?.regionId : canAdvance(step, character);
  const Step = STEPS[step];

  // pílulas só quando há opção indisponível por regra nesta etapa; sem elas, o filtro de estado não vale
  const alvo = ALVO_DA_ETAPA[step];
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
  const regiaoEscolhida = getRegion(character.origin?.regionId);
  const background = !done && step === "origem" ? (regiaoEscolhida?.bandeira ?? regiaoEscolhida?.image ?? null) : null;

  const avancar = () => {
    if (step === "revisao") return concluir();
    playClick();
    if (fase === "regiao") return setFaseOrigem("subregiao");
    setPulso((p) => p + 1);
    setStep(steps[index + 1]);
  };
  const voltar = () => {
    playClick();
    if (fase === "subregiao") return setFaseOrigem("regiao");
    setStep(steps[index - 1]);
  };
  function concluir() {
    playConfirm();
    setPulso((p) => p + 1);
    setDone(true);
  }
  const rotuloAvancar = step === "revisao" ? "Concluir" : "Avançar";

  // Ordem no DOM = ordem de foco: conteúdo (filtros e cards), coluna direita, barra superior.
  // A barra aparece no topo pela ordem do flex (order-first).
  const layout = (content: ReactNode, barra?: ReactNode, rodape?: ReactNode) => (
    // overflow-x-clip: adereços da mesa podem sair da tela sem criar rolagem horizontal (clip não quebra o sticky)
    <div data-region={regionId ?? undefined} className="flex flex-1 flex-col overflow-x-clip">
      <StepBackground image={background} />
      <div
        key={pulso}
        aria-hidden
        data-faixa
        className={`h-1 bg-linear-to-r from-accent via-accent-2 to-accent ${pulso ? "motion-safe:animate-[vida-pulso_600ms_ease-out]" : ""}`}
      />
      {/* a página é um pergaminho aberto sobre a mesa; sm:mt-28: faixa de mesa acima dele, com os adereços */}
      <Pergaminho className="mx-auto mt-4 mb-6 w-[calc(100%-2rem)] max-w-[76rem] sm:mt-28 sm:w-[calc(100%-10rem)]">
        <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,1fr)_26rem]">
          {content}
          {/* coluna direita: vitrine e, embaixo, a explicação da escolha (etapas) ou retrato, nome e prévia (concluído).
              Presas juntas no desktop; a parte de baixo rola por dentro. */}
          {/* com o rodapé preso embaixo (etapas), a coluna termina acima dele */}
          <div data-quadros className={`flex min-w-0 flex-col gap-6 lg:sticky lg:top-6 lg:self-start ${barra ? "lg:max-h-[calc(100vh-8rem)]" : "lg:max-h-[calc(100vh-3rem)]"}`}>
            {/* faixa horizontal que encolhe com a altura da tela; em telas baixas sai para o conteúdo de baixo caber */}
            <Vitrine {...vitrineAtual} placeholder={etapaDaVitrine} className="hidden aspect-video w-full shrink-0 lg:block [@media(max-height:600px)]:lg:hidden" />
            {done ? (
              <>
                <PainelPersonagem character={character} dispatch={dispatch} idNome="nome-painel" />
                <FichaPreview
                  character={character}
                  className="bg-background/80 shadow-[0_0_32px_-12px_var(--vivo)] lg:min-h-0 lg:flex-1 lg:overflow-y-auto"
                />
              </>
            ) : (
              <div ref={setLateral} data-explicacao className="space-y-4 empty:hidden lg:min-h-0 lg:flex-1 lg:overflow-y-auto [&>section]:bg-background/80" />
            )}
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
            <nav aria-label="Navegação" className="flex flex-1 flex-wrap items-center gap-3 max-lg:order-last max-lg:basis-full">
              {barra}
            </nav>
          )}
          <div className="ml-auto">
            <SoundToggle />
          </div>
        </div>
      </header>
      {/* sticky no fim da coluna da página: fica preso na base da tela ao rolar e não cobre o fim do conteúdo.
          Sem barra: os botões ficam sobre um esfumado escuro. */}
      {rodape && <div className="sticky bottom-0 z-20 mt-auto bg-linear-to-b from-transparent to-[rgb(10_5_2/0.85)] pt-6">{rodape}</div>}
    </div>
  );

  if (done) {
    return layout(
      <main className="min-w-0 space-y-4">
        {storageBanner}
        <header className="space-y-2">
          <p className={KICKER}>Criador de personagem</p>
          <ProgressBar steps={steps} current="revisao" titulo="Personagem concluído" concluido reduzido={reduzido} headingRef={heading} />
        </header>
        <p>{character.identity.name} está pronto. Use a prévia para exportar a ficha em PDF.</p>
        <Button variant="secondary" onClick={restart}>
          Criar outro personagem
        </Button>
      </main>,
    );
  }

  return layout(
    <main className="min-w-0 space-y-6">
      {storageBanner}
      {/* fora do conteúdo que remonta: a barra anima a troca de etapa; o título dela é o h1 */}
      <header className="space-y-2">
        <p className={KICKER}>Criador de personagem</p>
        <ProgressBar steps={steps} current={step} titulo={STEP_LABELS[step]} reduzido={reduzido} headingRef={heading} />
        <p key={step} id="dica-avancar" className="text-muted motion-safe:animate-[step-in_250ms_ease-out]">
          {INSTRUCOES[step]}
        </p>
      </header>
      {/* key: cada etapa remonta e refaz o fade de 250 ms; com reduced-motion, troca instantânea */}
      <div key={`${step}:${fase ?? ""}`} data-step-content className="space-y-6 motion-safe:animate-[step-in_250ms_ease-out]">
        {/* no celular a vitrine fica no topo da etapa, também em 16:9 */}
        <Vitrine {...vitrineAtual} placeholder={etapaDaVitrine} className="aspect-video w-full lg:hidden" />

        <div role="status">
          {notices.length > 0 && (
            <ul className="space-y-1 rounded-lg border-l-4 border-amber-500 bg-amber-500/10 p-3 text-sm">
              {notices.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          )}
        </div>

        {comEstado && <FilterBar filtro={filtroAtivo} onChange={setFiltro} />}
        <FiltroContext value={filtroAtivo}>
          <LateralContext value={lateral}>
            <Step character={character} dispatch={dispatch} faseOrigem={fase} />
          </LateralContext>
        </FiltroContext>
      </div>

      <ConfirmDialog
        open={confirmReset}
        title="Recomeçar o personagem?"
        message="Todas as escolhas serão apagadas, inclusive o que está salvo neste navegador."
        confirmLabel="Recomeçar"
        onConfirm={restart}
        onCancel={() => setConfirmReset(false)}
      />
    </main>,
    <>
      <Button variant="secondary" onClick={() => setConfirmReset(true)} className="max-lg:flex-1">
        Recomeçar
      </Button>
      {COM_FILTRO.includes(step) && <Busca filtro={filtroAtivo} onChange={setFiltro} className="max-lg:flex-1 lg:w-64" />}
    </>,
    // escolher não avança sozinho: Avançar confirma; rodapé sempre à vista
    <div className="mx-auto flex w-full max-w-7xl justify-between gap-3 p-3">
      <Button variant="secondary" disabled={index === 0 && fase !== "subregiao"} onClick={voltar} className="max-lg:flex-1 lg:min-w-40">
        Voltar
      </Button>
      <Button disabled={!ok} aria-describedby={!ok ? "dica-avancar" : undefined} onClick={avancar} className="max-lg:flex-1 lg:min-w-40">
        {rotuloAvancar}
      </Button>
    </div>,
  );
}
