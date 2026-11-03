# Revisão dos textos de lore — design

Data: 2026-11-02.

## Por quê

Quem cria um personagem sem conhecer Athanor não percebe o peso das escolhas. Os textos de hoje dizem **o que** cada coisa é, mas não **o que muda para quem a escolhe**. A espécie, por exemplo, muda como o personagem é tratado em cada região e por cada facção, tanto no social quanto no combate. O objetivo é que cada texto seja:

- **fiel ao lore**;
- **claro para quem nunca viu o cenário**;
- **lírico**: a voz do cenário não pode se perder.

## Objetivos

1. Toda escolha do fluxo passa a ter duas camadas de texto:
   - **Voz do cenário** (`briefing`, campo que já existe). É um texto lírico, como as fés já fazem hoje.
   - **Você no mundo** (`implications`). É um texto direto que diz como o personagem é visto e tratado, e em que é forte ou frágil no social e no combate.
2. Escrever o **cruzamento** com a região de origem, isto é, o que muda para o personagem por ter vindo de lá:
   - espécie × região, primeiro;
   - ofício × região e fé × região, depois.

## Fora do escopo

- **Textos da Agência** (`src/data/apuracao.ts`) e **PDF**: ficam para uma fase seguinte, que vai usar os textos finais desta.
- **Subregiões no cruzamento**: o cruzamento é por região. As subregiões mantêm o briefing próprio e só passam por revisão de clareza e fidelidade.
- **Mecânica de jogo**: a ficha é de roleplay. "Combate" aqui é narrativo, por exemplo "força avassaladora" ou "a prata é uma ameaça real".

## Anti-objetivos

O trabalho falha, mesmo que tecnicamente funcione, se:
- inventar lore que contradiga os .docx;
- apresentar como certo algo que é dedução;
- trocar a voz do cenário por linguagem de manual;
- usar jargão que o leitor novo não entende (um termo do cenário sem explicação ou sem link `[[…]]` para o glossário).

## Fontes, em ordem de autoridade

1. Os `.docx` em `~/Downloads/RPG-20261025T134400Z-1-001/RPG/lore/`. O texto de `lore/_texto/` foi conferido contra eles em 2026-11-02 e não perdeu nada. Na dúvida, abrir o .docx.
2. O que o usuário disse, registrado na memória `lore-athanor-decisoes-usuario`, com `source: "decisão do usuário"`. Pontos principais:
   - centauro mercenário é comum e normal em Laguardia;
   - homem do deserto causa estranhamento fora do deserto;
   - Vargarf é hospitaleiro mas desconfiado;
   - vampiro é desconhecido, no máximo uma lenda remota;
   - em Man'naka oko vale ser guerreiro e sobrevivente, não a espécie;
   - centauro tem força avassaladora;
   - mutante tem força e agilidade;
   - mago é artilharia, lento e letal;
   - vampiro é bom em persuasão e infiltração;
   - príncipe é feito para a diplomacia.
3. **Dedução** no mesmo espírito. É permitida, mas fica marcada para o usuário conferir (ver Rastreabilidade).

## Conteúdo

### Fase 1 — textos base

Para cada espécie, subespécie, região, subregião, ofício, fé, marca e termo do glossário, fazer duas coisas:
- revisar o `briefing` quanto a fidelidade, clareza e voz;
- escrever `implications`, exceto nas subregiões e no glossário, que só são revisados.

As fés já têm `implications` e só passam por revisão. Os textos `A_DEFINIR` (ex.: Humano comum) recebem texto de verdade.

### Fase 2 — espécie × região

Há 9 identidades (subespécie quando existe, senão a espécie) e 15 regiões. Combinações bloqueadas pelas regras de `rules.ts` ficam de fora. A ordem de escrita vai das óbvias para as sutis:
1. Os pares que o lore descreve diretamente. Exemplos: homem-galho na UP e entre os centauros; Crick contra todos; elite na UP; mutante em Midland; homem do deserto fora do deserto; Man'naka oko.
2. Os pares que saem das decisões do usuário.
3. O restante, deduzido.

### Fase 3 — ofício × região e fé × região

Mesma ordem: óbvios primeiro (ex.: mago na UP, Activum em Midland, Logan fora dos dojos).

## Como aparece no site

- **`implications`** entra como seção do painel de briefing (`PainelBriefing`), no mesmo formato que a Fé já usa (`{ label, text }`), no painel lateral e no "Saiba mais". O rótulo é "Você no mundo". A Fé passa a usar o mesmo rótulo, para ficar consistente.
- **Cruzamento** (decisão minha): entra como uma seção a mais no painel lateral da escolha, com o rótulo "Vindo de <região>".
  - Na Origem, aparece o cruzamento da espécie com a região escolhida.
  - No Ofício e na Fé, que vêm depois da Origem no fluxo, aparece o cruzamento da escolha com a região.
  - Sem texto para o par, a seção não aparece.
- **Dados**: os cruzamentos vão num arquivo novo, `src/data/cruzamentos.ts`. Cada entrada leva `{ escolha: id, regiao: id, texto, source }`. A interface lê o arquivo por meio de `catalogo.ts`, como todo o resto.

## Rastreabilidade e validação

- Todo texto novo tem `source`. Uma dedução leva `source` com `"dedução"` junto dos documentos em que se apoia, e o `validate:data` passa a aceitar esse valor.
- O `validate:data` passa a conferir também:
  - `implications` com 2 a 4 frases, como o briefing;
  - termos `[[…]]` existentes no glossário;
  - nos cruzamentos, ids válidos e nenhum par repetido.
- O `validate:data` lista quantos pares ainda faltam. O número é informativo e não faz a validação falhar.

## Tom (guia de escrita)

- **`briefing`**: voz do cenário, lírica, 2 a 4 frases. Pode ser na voz de quem pertence ao lugar, como nas fés.
- **`implications`**: segunda pessoa ("você"), concreto, 2 a 4 frases. Cobre como você é recebido, que portas se abrem ou fecham e o que pesa no combate. Sem jargão solto: o primeiro uso de um termo do cenário leva `[[…]]`.
- **Cruzamento**: 1 a 3 frases, concretas, ditas da perspectiva de quem chega àquele lugar.

## Processo

O usuário delegou a escrita e vai revisar tudo no site ao final. Os erros que ele achar viram correções. A cada fase, rodar `npm run validate:data`, `npx vitest run` e `npx playwright test`. Nada é commitado: o usuário commita.

## Decisões minhas (para o usuário conferir)

- Os rótulos "Você no mundo" e "Vindo de <região>".
- O cruzamento é por região, não por subregião.
- As deduções levam `"dedução"` no `source`.
- Nas fases 2 e 3 cabem pares com texto genérico curto quando o lore não sugere nada específico. Nesses casos, o texto genérico apenas reforça a implicação da região.
