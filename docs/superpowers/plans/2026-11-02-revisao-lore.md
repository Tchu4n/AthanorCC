# Revisão dos textos de lore — plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dar a cada escolha do criador uma camada "Você no mundo" e um cruzamento "Vindo de <região>", com textos fiéis ao lore, claros para quem não conhece Athanor e sem perder o tom lírico.

**Architecture:** Um campo opcional novo, `implications`, entra em espécie, subespécie, região e ofício; a fé já tem esse campo. Os cruzamentos ficam em `src/data/cruzamentos.ts`, e a interface só os lê por `catalogo.ts`. Cada etapa monta as seções do `PainelBriefing` com um helper comum. O `validate:data` confere frases, termos, fontes e ids, e informa quantos pares de cruzamento ainda faltam.

**Tech Stack:** Next 16, TypeScript, Vitest, Playwright, `node scripts/validate-data.ts`.

**Spec:** `docs/superpowers/specs/2026-11-02-revisao-lore-design.md`

## Global Constraints

- **Fontes, em ordem:**
  1. Os .docx de `~/Downloads/RPG-20261025T134400Z-1-001/RPG/lore/`. Na dúvida sobre o texto de `lore/_texto/`, abrir o .docx.
  2. A memória `lore-athanor-decisoes-usuario`, com `source: "decisão do usuário"`.
  3. Dedução, com `"dedução"` no `source`, junto dos documentos em que se apoia.
- **Não contradizer os .docx.** Não apresentar dedução como certeza.
- **Rótulos exatos:** `"Você no mundo"` e `` `Vindo de ${regiao.name}` ``.
- **`briefing`:** voz do cenário, lírica, 2 a 4 frases.
- **`implications`:** segunda pessoa ("você"), concreto, 2 a 4 frases. Cobre como você é recebido, que portas se abrem ou fecham e o que pesa no combate (narrativo, sem mecânica).
- **Cruzamento:** 1 a 3 frases, da perspectiva de quem chega àquele lugar.
- **Termos do cenário:** o primeiro uso de cada termo leva `[[Termo]]`, que precisa existir no glossário.
- **Cruzamento por região**, nunca por subregião. Identidade = `subspeciesId ?? speciesId`.
- **Fora do escopo:** `src/data/apuracao.ts` e o PDF.
- **Não commitar:** o usuário commita. Os passos de "Commit" deste plano viram "conferir `git status`".
- **Verificação a cada tarefa:** `npm run validate:data && npx vitest run`. No fim, rodar também `npm run typecheck`, `npm run lint` e `npx playwright test`.

## Review Focus

1. **Etapa sem região escolhida** (ofício ou fé com um save antigo sem origem): o painel aparece sem a seção "Vindo de" e sem erro. Teste na Task 1.
2. **Escolha sem `implications`** durante a transição: o painel mostra só o briefing, sem um rótulo vazio. Teste na Task 1.
3. **Ofício personalizado** (`OFICIO_PROPRIO`): nunca tem cruzamento, e o helper não pode quebrar. Teste na Task 1.
4. **Subespécie escolhida:** o cruzamento usa o id da subespécie, e não o da espécie. Teste na Task 1.
5. **Mais de uma fé:** cada painel de fé mostra o seu próprio cruzamento. Teste na Task 1.

---

### Task 1: Infraestrutura (campo, cruzamentos, validação, painéis)

**Files:**
- Modify: `src/lib/character.ts`. Adicionar `implications?: string` a `Region`, `Species`, `Subspecies` e `Occupation`.
- Modify: `src/data/types.ts`. Adicionar `"dedução"` a `SOURCES` e criar `export type CruzamentoData = { escolha: string; regiao: string; texto: string; source: Source[] }`.
- Create: `src/data/cruzamentos.ts`, com `export const cruzamentos: CruzamentoData[] = []`.
- Modify: `src/lib/catalogo.ts`.
- Modify: `scripts/validate-data.ts`.
- Modify: `src/components/steps/EtapaEspecie.tsx`, `EtapaSubespecie.tsx`, `EtapaOrigem.tsx`, `EtapaOficio.tsx` e `EtapaFe.tsx`.
- Test: `src/lib/catalogo.test.ts`, `src/data/data.test.ts`.

**Interfaces:**
- Produces, em `catalogo.ts`:
  - `identidadeDe(c: Character): string | undefined`, que devolve `c.subspeciesId ?? c.speciesId ?? undefined`.
  - `getCruzamento(escolhaId: string | null | undefined, regiaoId: string | null | undefined): string | undefined`.
  - `secoesDe(item: { briefing: string; implications?: string }, cruzamento?: { regiao: string; texto: string }): BriefingSection[]`. Devolve `[{text: briefing}]`, mais `{label: "Você no mundo", text: implications}` se houver `implications`, mais `{label: \`Vindo de ${regiao}\`, text}` se houver cruzamento. Aqui `regiao` é o **nome** da região.
  - `cruzamentoDe(escolhaId, c: Character): { regiao: string; texto: string } | undefined`. Busca a região de `c.origin?.regionId` e o texto, e devolve `undefined` se faltar qualquer um dos dois.
- Produces, em `validate-data.ts`:
  - `validarCruzamentos(lista: CruzamentoData[], ids: { escolhas: Set<string>; regioes: Set<string> }): string[]`. Acusa escolha ou região inexistente, par repetido e texto fora de 1 a 3 frases (pelo `checkText` existente). Também confere o source.
  - Exportar também `paresFaltando(): { especie: number; oficio: number; fe: number }`. É só informativo: o `main` o imprime e ele não vira erro.

- [ ] **Step 1: Escrever os testes que falham** (`catalogo.test.ts`)
  - `secoesDe({briefing:"A."})` → `[{text:"A."}]`
  - `secoesDe({briefing:"A.", implications:"B."}, {regiao:"UP", texto:"C."})` → as três seções, com os rótulos `"Você no mundo"` e `"Vindo de UP"`
  - `identidadeDe({...personagemInicial, speciesId:"humano", subspeciesId:"elite-orelhas-pontudas"})` → `"elite-orelhas-pontudas"`
  - `cruzamentoDe("x", {...personagemInicial, origin:null})` → `undefined`
  - `cruzamentoDe(OFICIO_PROPRIO, personagemComRegiao)` → `undefined`

  Em `data.test.ts`, testar o `validarCruzamentos`:
  - escolha inexistente vira erro;
  - par repetido vira erro;
  - um item válido com `source:["dedução"]` passa.
- [ ] **Step 2:** Rodar `npx vitest run src/lib/catalogo.test.ts src/data/data.test.ts`. Esperado: FAIL, porque as funções ainda não existem.
- [ ] **Step 3:** Implementar os tipos, `cruzamentos.ts`, os helpers do catálogo e a validação.
  - No `validateData()`, chamar `checkText` para `implications` quando o campo existir em região, espécie, subespécie e ofício.
  - Chamar `validarCruzamentos(cruzamentos, …)`. As escolhas válidas são a união dos ids de espécie, subespécie, ofício e fé.
- [ ] **Step 4:** Ligar as etapas.
  - Nas etapas, trocar `sections={[{ text: x.briefing }]}` e o `saibaMais` por `secoesDe(x)`.
  - Na Fé, trocar `{label:"Implicações", …}` por `secoesDe(f, cruzamentoDe(f.id, character))`.
  - No Ofício, usar `secoesDe(chosen, cruzamentoDe(chosen.id, character))` no painel lateral.
  - Na Origem, `explicacaoDaRegiao` passa a usar `secoesDe(region, cruzamentoDe(identidadeDe(character), character))`. O texto do cruzamento da espécie aparece no painel da região.
  - Os cards ("Saiba mais") usam `secoesDe(x)`, sem o cruzamento.
- [ ] **Step 5:** Rodar `npm run validate:data && npx vitest run && npm run typecheck`. Esperado: tudo passa. Se algum teste da Fé procurava o rótulo "Implicações", atualizar para "Você no mundo".
- [ ] **Step 6:** Rodar `npx playwright test e2e/criar.e2e.ts`. Esperado: PASS.

### Task 2: Espécies e subespécies

**Files:** Modify `src/data/species.ts`. Fontes: `Raça_ Homens-Galho`, `Os centauros`, `Os homens do deserto`, `Vampiros…`, `COMPÊNDIO…`, `Regras Globais…`, `Contexto basico de faccoes`, `A noite maldita`, `Os Bardos…` e a memória do usuário.

- [ ] **Step 1:** Para cada espécie e subespécie, reler a fonte e reescrever o `briefing` (fiel, claro, lírico). Trocar `A_DEFINIR` (Humano comum) por texto de verdade.
- [ ] **Step 2:** Escrever o `implications` de cada uma. Pontos que precisam aparecer:
  - **Centauro:** força avassaladora, abominação da magia, vida de cerca de 30 anos, mercenário comum pelo mundo.
  - **Homem do deserto:** estranhamento fora do deserto, magia tabu, rito de peregrinação.
  - **Vampiro:** sol, prata no sangue, fome, persuasão e infiltração; quase ninguém conhece o conceito.
  - **Homem-galho:** caçado como escravo, feromônios e risco de Nilos.
  - **Príncipe:** fala e diplomacia, e o expurgo em Kruk.
  - **Princesa:** cobiçada.
  - **Trabalhador:** sem individualidade; "escravo perfeito".
  - **Elite:** monopólio da magia na UP, e a Gaiola.
  - **Mutante:** força e agilidade; herege para os tradicionalistas de Midland.
- [ ] **Step 3:** Ajustar o `source` (acrescentar `"decisão do usuário"` ou `"dedução"` quando usados).
- [ ] **Step 4:** Rodar `npm run validate:data && npx vitest run`. Esperado: PASS.

### Task 3: Regiões e subregiões

**Files:** Modify `src/data/regions.ts`. Fontes: `Minor Powers`, `Subregioes`, `União das Províncias (UP)`, `Contexto basico de faccoes`, `Regras Globais…`, `A terra de Man_naka oko` e a memória do usuário.

- [ ] **Step 1:** Revisar o `briefing` das 15 regiões e das 74 subregiões quanto a fidelidade e clareza. As subregiões continuam com 1 a 4 frases.
- [ ] **Step 2:** Escrever o `implications` das 15 regiões, cobrindo o que vale para qualquer espécie vinda dali:
  - **UP:** armas de fogo proibidas, escravidão legal, magia só da elite.
  - **Vargarf:** hospitaleiros mas desconfiados.
  - **Man'naka oko:** vale o guerreiro e sobrevivente; gente de fora é rara.
  - **Morrow:** ressentimento com a UP.
  - **Blackwater:** sem lei.
  - **Highbridge:** neutra.
  - **Oakhaven:** despreza os sulistas.
  - **Laguardia:** pólvora; "acolhe quem se comporta".
- [ ] **Step 3:** Rodar `npm run validate:data && npx vitest run`. Esperado: PASS.

### Task 4: Ofícios

**Files:** Modify `src/data/occupations.ts`. Fontes: `O Sistema de Magia…`, `Os Bardos…` e os documentos de facção.

- [ ] **Step 1:** Revisar o `briefing` dos 20 ofícios.
- [ ] **Step 2:** Escrever o `implications` de cada um.
  - **Mago:** artilharia, lento e letal; aterramento; custo de bateria; o orçamento define o poder.
  - **Bardo:** dom raro, acolhido com reverência.
  - Seguir o mesmo espírito para os demais ofícios.
- [ ] **Step 3:** Rodar `npm run validate:data && npx vitest run`. Esperado: PASS.

### Task 5: Fés, marcas e glossário (só revisão)

**Files:** Modify `src/data/faiths.ts`, `src/data/marks.ts` e `src/data/glossary.ts`.

- [ ] **Step 1:** Fés: revisar o `briefing` e o `implications`. O `implications` deve ficar em segunda pessoa, no padrão da Task 2.
- [ ] **Step 2:** Marcas: revisar o `briefing` e a `descricao`. O rótulo "Prós e contras" continua.
- [ ] **Step 3:** Glossário: revisar os 51 termos quanto a fidelidade e clareza para o leitor novo.
- [ ] **Step 4:** Rodar `npm run validate:data && npx vitest run`. Esperado: PASS.

### Task 6: Cruzamento espécie × região

**Files:** Modify `src/data/cruzamentos.ts`.

- [ ] **Step 1:** Escrever primeiro os pares descritos pelo lore:
  - homem-galho (as três subespécies) na UP, no Império das Estepes, em Kruk, em Crick, em Oakhaven e na Irmandade;
  - elite na UP;
  - mutante na Irmandade;
  - os pares de Crick contra todos.
- [ ] **Step 2:** Escrever os pares que vêm das decisões do usuário:
  - centauro em Laguardia e como mercenário;
  - homem do deserto em todas as regiões fora dos Reclusos;
  - vampiro em todas;
  - todas as identidades em Man'naka oko e em Vargarf.
- [ ] **Step 3:** Escrever o restante por dedução, marcado como `"dedução"`. Pular os pares que as regras de `rules.ts` bloqueiam.
- [ ] **Step 4:** Rodar `npm run validate:data`. Esperado: `✓ dados válidos`, com o contador de faltantes em `especie` no mínimo.

### Task 7: Cruzamento ofício × região

**Files:** Modify `src/data/cruzamentos.ts`.

- [ ] **Step 1:** Escrever primeiro os pares óbvios:
  - mago na UP (só a elite), em Laguardia (forjas) e entre os centauros (desonra);
  - os ofícios de pólvora na UP (crime);
  - o bardo entre os centauros (cantos guturais).

  Depois, o restante, por dedução.
- [ ] **Step 2:** Rodar `npm run validate:data`. Esperado: PASS.

### Task 8: Cruzamento fé × região

**Files:** Modify `src/data/cruzamentos.ts`.

- [ ] **Step 1:** Escrever primeiro os pares óbvios:
  - Activum em Midland (herege para a corte de Umbra) e na Irmandade;
  - Umbra na UP e em Midland;
  - Logan nos Reclusos e fora deles;
  - Nilos em qualquer lugar (infiltrado);
  - Mui em Kruk; Tamem em Crick; Gorturk nas Estepes.

  Depois, o restante.
- [ ] **Step 2:** Rodar `npm run validate:data`. Esperado: PASS.

### Task 9: Fechamento

**Files:** Modify `scripts/validate-data.ts`, `docs/DADOS.md` e `docs/DESENVOLVIMENTO.md`.

- [ ] **Step 1:** O `validate:data` passa a exigir `implications` em espécie, subespécie, região e ofício (erro `sem implications`).
- [ ] **Step 2:** Documentar `implications`, `cruzamentos.ts` e o source `"dedução"` em `docs/DADOS.md`. Acrescentar `cruzamentos.ts` à tabela de dados de `docs/DESENVOLVIMENTO.md`.
- [ ] **Step 3:** Rodar `npm run validate:data && npm run typecheck && npm run lint && npx vitest run && npx playwright test`. Esperado: tudo PASS.
- [ ] **Step 4:** Gerar para o usuário a lista dos textos marcados como `"dedução"`, para ele revisar no site.
