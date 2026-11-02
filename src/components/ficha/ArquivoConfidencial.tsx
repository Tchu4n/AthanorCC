import { Assinatura } from "@/components/ui/Assinatura";
import { GrupoOpcoes } from "@/components/ui/GrupoOpcoes";
import { PERICULOSIDADE_LABEL, PERICULOSIDADES, SEXO_LABEL, SEXOS, type Character } from "@/lib/character";
import { montarFicha } from "@/lib/ficha";
import type { CharacterAction } from "@/lib/reducer";

// Conclusão: o personagem vira uma análise de periculosidade da Agência de Inteligência e Detetives de Highbridge.
// Highbridge (o ducado neutro dos banqueiros e embaixadores) vem da lore (Subregioes.docx e Minor Powers.docx);
// a agência é sigilosa e foi criada para o app. A assinatura, obrigatória para exportar, vai ao pé do PDF.
export function ArquivoConfidencial({ character, dispatch }: { character: Character; dispatch: (a: CharacterAction) => void }) {
  const ficha = montarFicha(character);
  return (
    <section aria-labelledby="dossie-titulo" className="relative space-y-4 rounded-sm border border-[#6b4a2a]/60 bg-[#f1e3bf] p-5 text-[#2b1a0e] shadow-[inset_0_0_40px_rgb(107_74_42/0.35)] sm:p-7">
      <p
        aria-hidden
        className="mb-1 inline-block -rotate-6 border-2 sm:absolute sm:top-4 sm:right-4 sm:mb-0 sm:-rotate-12 border-[#8f1d14] px-2 py-0.5 font-(family-name:--font-titulo) text-sm font-bold tracking-[0.2em] text-[#8f1d14] opacity-85"
      >
        CONFIDENCIAL
      </p>
      {/* no celular o carimbo fica acima do cabeçalho; a partir do sm, no canto */}
      <header className="space-y-1 sm:pr-44">
        <p className="font-(family-name:--font-titulo) text-xs font-bold tracking-[0.2em] text-[#6b4a2a]">AGÊNCIA DE INTELIGÊNCIA E DETETIVES DE HIGHBRIDGE</p>
        <p className="text-sm italic text-[#6b4a2a]">Divisão de Vigilância · Ala das Embaixadas · Uso restrito</p>
        <h2 id="dossie-titulo" className="pt-2 font-(family-name:--font-titulo) text-xl font-bold">
          Análise de periculosidade <span className="whitespace-nowrap">nº {ficha.dossie}</span>
        </h2>
        <p className="text-sm text-[#6b4a2a]">Processo aberto em {ficha.lavradoEm}</p>
      </header>
      <div className="space-y-3 border-y border-[#6b4a2a]/40 py-4">
        <p>
          Aos agentes de campo. Nossos detetives concluíram a apuração sobre <strong>{ficha.nome}</strong>.{" "}
          {ficha.apuracao.especie}
        </p>
        {ficha.apuracao.origem && <p>{ficha.apuracao.origem}</p>}
        <p>{ficha.apuracao.oficio}</p>
        <p>
          O indivíduo passa a constar nos arquivos da Agência e fica sob observação discreta até segunda ordem. Highbridge
          não toma partido: vigia, registra e cobra.
        </p>
      </div>
      {/* marcados aqui, saem no PDF com um X a pena */}
      <div className="space-y-3">
        <GrupoOpcoes
          legenda="Sexo (obrigatório)"
          obrigatorio
          name="dossie-sexo"
          opcoes={SEXOS}
          rotulos={SEXO_LABEL}
          valor={character.sexo}
          onChange={(sexo) => dispatch({ type: "DEFINIR_SEXO", sexo })}
        />
        <GrupoOpcoes
          legenda="Grau de periculosidade (obrigatório)"
          obrigatorio
          name="dossie-periculosidade"
          opcoes={PERICULOSIDADES}
          rotulos={PERICULOSIDADE_LABEL}
          valor={character.periculosidade}
          onChange={(periculosidade) => dispatch({ type: "DEFINIR_PERICULOSIDADE", periculosidade })}
        />
      </div>
      <div className="space-y-2 border-t border-[#6b4a2a]/40 pt-4">
        <h3 className="font-(family-name:--font-titulo) font-bold">
          Assinatura do indivíduo (obrigatória)
        </h3>
        <p id="assinatura-dica" className="text-sm">
          A assinatura que o indivíduo deixou ao abrir conta no Quarteirão Dourado ou ao pagar pedágio na Ponte Matriz,
          anexada ao processo. Desenhe com o mouse, o dedo ou a caneta. Sem sexo, grau de periculosidade e assinatura, a
          análise não pode ser exportada.
        </p>
        <Assinatura
          valor={character.assinatura}
          onChange={(assinatura) => dispatch({ type: "DEFINIR_ASSINATURA", assinatura })}
          idDescricao="assinatura-dica"
        />
      </div>
    </section>
  );
}
