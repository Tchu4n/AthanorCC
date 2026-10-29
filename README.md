# Criador de Personagem — Athanor

Criador de personagem para RPG de mesa no cenário de Athanor. A ficha é para roleplay, sem mecânica de regras de jogo. Tudo roda no navegador: não há backend, o personagem fica salvo no `localStorage` (um único slot) e a ficha é exportada em PDF no próprio navegador.

Stack: Next.js 16 (App Router), TypeScript estrito, Tailwind CSS 4, zod, @react-pdf/renderer. Testes com Vitest e Playwright.

## Instalar

Precisa de Node.js 22.18 ou mais novo (o script `validate:data` roda arquivos `.ts` direto no Node, sem compilar). Foi desenvolvido no Node 26.

```bash
npm install
npx playwright install chromium   # só para os testes e2e
```

## Rodar em desenvolvimento

```bash
npm run dev
```

Abra <http://localhost:3000> (a página inicial redireciona para `/criar`).

Build de produção:

```bash
npm run build
npm start
```

## Testes e verificações

| Comando | O que faz |
|---|---|
| `npm run typecheck` | Checa os tipos do TypeScript. |
| `npm run validate:data` | Confere os dados de `src/data/`: ids únicos, `source` em todo registro, briefings de 2 a 4 frases, termos `[[…]]` no glossário, imagens existentes e listadas no manifesto, ids citados nas regras. |
| `npm run lint` | ESLint. |
| `npm test` | Testes unitários (Vitest). |
| `npm run test:e2e` | Testes de ponta a ponta (Playwright), em desktop (1280 px) e celular (375 px). Faz o build de produção antes, na porta 3100. |

## Onde está cada coisa

### Dados (conteúdo do cenário)

Tudo em `src/data/`. Para editar sem programar, veja **[docs/DADOS.md](docs/DADOS.md)**.

| Arquivo | Conteúdo |
|---|---|
| `regions.ts` | Regiões e subregiões (origem). |
| `species.ts` | Espécies e subespécies. |
| `occupations.ts` | Ofícios. |
| `faiths.ts` | Fés, com briefing e implicações. |
| `marks.ts` | Marcas do personagem. |
| `glossary.ts` | Termos do glossário citados como `[[Termo]]`. |
| `images.ts` | Imagens de referência, com nome de exibição. Os arquivos ficam em `public/athanor/`, registrados em `public/athanor/MANIFEST.md`. |
| `rules.ts` | Regras de coerência (bloqueio, aviso, marca obrigatória), cada uma com `source`. |
| `types.ts` | Tipos dos dados e a lista de documentos aceitos em `source`. |

O que ainda falta definir está em **[docs/PENDENCIAS.md](docs/PENDENCIAS.md)**.

### Código

| Pasta / arquivo | Papel |
|---|---|
| `src/app/criar/page.tsx` | O fluxo de criação. |
| `src/components/steps/` | Uma etapa por arquivo (Origem, Espécie, …, Revisão). |
| `src/components/ficha/FichaPreview.tsx` | Prévia da ficha e botão de exportar PDF. |
| `src/components/briefing/`, `src/components/ui/` | Painel de briefing e componentes de interface. |
| `src/lib/character.ts`, `reducer.ts`, `initialCharacter.ts` | Modelo do personagem e reducer. |
| `src/lib/catalog.ts` | Único ponto que lê `src/data/` para a interface. |
| `src/lib/flow.ts` | Etapas visíveis e quando é possível avançar. |
| `src/lib/rules-engine.ts` | Aplica as regras de `rules.ts`. |
| `src/lib/storage.ts`, `character-schema.ts`, `usePersistentCharacter.ts` | Salvamento no `localStorage`, validação com zod e hook de persistência. |
| `src/lib/image-upload.ts` | Upload de imagem própria: redimensiona para 512 px e salva como JPEG de até 400 KB. |
| `src/lib/ficha.ts`, `ficha-pdf.tsx` | Conteúdo da ficha e geração do PDF (fonte Noto Sans em `public/fonts/`). |
| `scripts/validate-data.ts` | O validador dos dados. |
| `e2e/` | Testes Playwright. |

## Origem do conteúdo

O lore vem dos documentos `.docx` do cenário, que não fazem parte do repositório. Cada registro em `src/data/` cita o documento de origem no campo `source`, ou `"decisão do usuário"` quando a informação foi confirmada fora dos documentos.
