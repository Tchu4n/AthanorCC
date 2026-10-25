# Como editar os dados de Athanor

Este guia é para quem quer mudar o conteúdo do criador de personagem (regiões, espécies, fés, glossário…) sem precisar entender o resto do código.

Todo o conteúdo fica em arquivos dentro da pasta `src/data/`. Cada arquivo é uma lista de registros escritos entre chaves `{ … }`, separados por vírgula. Para adicionar algo, o caminho mais seguro é **copiar um registro que já existe, colar logo abaixo e trocar os valores**.

Depois de qualquer mudança, rode no terminal, dentro da pasta do projeto:

```
npm run validate:data
```

Se aparecer `✓ dados válidos`, está tudo certo. Se aparecer `✗`, veja a seção [Quando o validate:data avisa um erro](#quando-o-validatedata-avisa-um-erro).

---

## Regras que valem para tudo

- **`id`**: o identificador interno. Só letras minúsculas sem acento, números e hífens. Exemplo: `"costa-afogada"`. Não pode repetir dentro do mesmo arquivo. Depois que um personagem foi salvo com um id, **não troque esse id**, ou o personagem salvo será descartado ao abrir.
- **`name`** (ou `term`, no glossário): o nome que aparece na tela, com acentos normais.
- **`source`**: de onde veio a informação. É uma lista entre colchetes com o nome exato do documento `.docx`, ou `"decisão do usuário"` quando a regra foi confirmada em conversa. Exemplo: `source: ["Subregioes.docx", "decisão do usuário"]`.
  - Os nomes aceitos estão em `src/data/types.ts`, na lista `SOURCES`. Para usar um documento novo, acrescente o nome dele nessa lista primeiro.
- **`"A_DEFINIR"`**: use quando o documento ainda não diz nada. Na tela aparece "Em definição.". Nunca invente texto para preencher.
- Textos ficam entre aspas `"…"`. Se o texto tiver aspas duplas dentro, troque por aspas tipográficas (“ ”) ou simples.

---

## Como escrever um briefing

O briefing é o texto curto que explica uma opção.

- **2 a 4 frases** (subregiões podem ter 1). Cada frase termina com ponto, `!` ou `?`.
- Português simples, sem inventar nada que não esteja no documento de origem.
- **Termos do glossário vão entre colchetes duplos**: `[[Termo]]`. Exemplo:

  ```
  "A colmeia é mantida pelos [[feromônios]] da rainha, que atua como [[Arauto]] de Mui."
  ```

  Na tela os colchetes somem e o termo aparece em destaque. O termo precisa existir no glossário, pelo `term` ou por um dos `aliases`. `[[feromônios]]` funciona porque o termo "Feromônio" tem o alias "feromônios".

---

## Adicionar uma região

Arquivo: `src/data/regions.ts`.

```ts
{
  id: "nome-da-regiao",
  name: "Nome da Região",
  mainArea: "Nome da subregião principal",   // opcional; precisa ser igual ao name de uma subregião abaixo
  image: IMAGES["regions/exemplo"].src,       // opcional; veja "Adicionar uma imagem"
  source: ["Documento.docx"],
  briefing: "Primeira frase. Segunda frase.",
  subregions: [
    { id: "subregiao-um", name: "Subregião Um", briefing: "Uma ou mais frases." },
  ],
  pendencias: [],                             // o que falta definir, em texto livre
},
```

- **Subregião**: é um item dentro de `subregions`. Tem `id`, `name` e `briefing`; `source` e `image` são opcionais (sem `source`, vale o da região).
- **Região sem subregiões conhecidas**: deixe `subregions: []` e escreva em `pendencias` algo como `"Subregiões: A_DEFINIR."`. A tela oferece só "Andarilho/Aventureiro".
- "Andarilho/Aventureiro" é criado pela interface. **Não** cadastre como subregião.

## Adicionar uma espécie ou subespécie

Arquivo: `src/data/species.ts`.

```ts
{
  id: "nome-da-especie",
  name: "Nome da Espécie",
  source: ["Documento.docx"],
  briefing: "Duas a quatro frases.",
  subspecies: [                               // opcional; sem esta lista, a etapa Subespécie é pulada
    { id: "nome-da-subespecie", name: "Nome", source: ["Documento.docx"], briefing: "Duas a quatro frases." },
  ],
},
```

Uma subespécie é um item dentro de `subspecies` da espécie certa. Cada subespécie tem seu próprio `source`.

## Adicionar um ofício

Arquivo: `src/data/occupations.ts`. Ofícios valem para qualquer espécie; restrições ficam nas regras (`src/data/rules.ts`).

```ts
{ id: "nome-do-oficio", name: "Nome do ofício", source: ["Documento.docx"], briefing: "Duas a quatro frases." },
```

## Adicionar uma fé

Arquivo: `src/data/faiths.ts`. Além do `briefing` (o que a fé ensina), toda fé tem `implications` (o que ela significa para a sociedade), também com 2 a 4 frases.

```ts
{
  id: "nome-da-fe",
  name: "Nome",
  source: ["Panteao.docx"],
  briefing: "O que a fé ensina.",
  implications: "O que ela muda na sociedade.",
},
```

O personagem pode ter no máximo 3 fés. Esse limite não depende de quantas fés existem.

## Adicionar uma marca

Arquivo: `src/data/marks.ts`. `descricao` é opcional e serve para os prós e contras da marca; quando falta, a ficha mostra o briefing.

```ts
{
  id: "nome-da-marca",
  name: "Nome da marca",
  source: ["Documento.docx"],
  briefing: "Duas a quatro frases.",
  descricao: "A favor: … Contra: …",          // opcional
},
```

## Adicionar um termo do glossário

Arquivo: `src/data/glossary.ts`.

```ts
{
  id: "nome-do-termo",
  term: "Nome do Termo",
  category: "lugar",                          // ex.: lugar, povo, facção, religião, magia, biologia, evento
  aliases: ["Outro jeito de escrever"],       // opcional; plurais e nomes alternativos
  source: ["Documento.docx"],
  briefing: "Duas a quatro frases.",
},
```

Todo `[[Termo]]` usado em qualquer briefing precisa estar aqui.

## Adicionar uma imagem de referência

São três passos.

1. Copie o arquivo `.jpg` ou `.png` para a pasta certa em `public/athanor/` (`regions/`, `species/`, `occupations/`, `factions/` ou `misc/`). Use nome em minúsculas, sem espaço e sem acento. Exemplo: `public/athanor/regions/porto-imperial-cais.jpg`.
2. Registre a cópia em `public/athanor/MANIFEST.md`, na seção **Copiadas**: `| Nome original do arquivo.jpg | regions/porto-imperial-cais.jpg |`.
3. Acrescente a imagem em `src/data/images.ts`, com um nome de exibição:

   ```ts
   "regions/porto-imperial-cais": { src: "/athanor/regions/porto-imperial-cais.jpg", displayName: "Cais de Porto Imperial" },
   ```

A imagem já aparece na etapa Aparência. Para ligá-la a uma região, espécie ou ofício, use `image: IMAGES["regions/porto-imperial-cais"].src` no registro.

---

## Quando o validate:data avisa um erro

Cada erro aparece numa linha começando com `✗`, dizendo **o arquivo, o id do registro e o problema**. Exemplo:

```
✗ regions.ts/oakhaven/floresta-do-uivo: 5 frases (esperado 1 a 4)
```

Quer dizer: no arquivo `regions.ts`, região `oakhaven`, subregião `floresta-do-uivo`, o briefing tem frases demais.

| Mensagem | O que fazer |
|---|---|
| `id duplicado "x"` | Dois registros no mesmo arquivo usam o mesmo `id`. Troque um deles. |
| `sem source` / `source vazio` | Preencha `source` com pelo menos um documento. |
| `source desconhecido "x"` | O nome do documento está escrito diferente da lista `SOURCES` em `src/data/types.ts`. Corrija o nome ou acrescente o documento à lista. |
| `N frases (esperado 2 a 4)` | Reescreva o briefing com a quantidade certa de frases. Confira se não há ponto final sobrando no meio da frase. |
| `termo "X" não existe em glossary.ts` | Crie o termo no glossário, acrescente um `aliases` com essa grafia, ou tire os `[[ ]]`. |
| `imagem fora de images.ts` | A imagem usada no registro não está em `src/data/images.ts`. Veja "Adicionar uma imagem". |
| `arquivo ausente /athanor/…` | O arquivo não está em `public/athanor/`. Confira a pasta e o nome. |
| `não está em Copiadas no MANIFEST.md` | Acrescente a linha da imagem na seção Copiadas do manifesto. |
| `sem displayName` | Dê um nome de exibição à imagem em `src/data/images.ts`. |
| `mainArea "x" não é uma subregião` | O `mainArea` precisa ser igual, letra por letra, ao `name` de uma subregião da mesma região. |
| `rules.ts/R0X: … "x" não existe` | Uma regra cita um id que não existe (espécie, ofício, fé, marca, região). Corrija o id na regra. |

Se o erro não fizer sentido, desfaça a última mudança e rode `npm run validate:data` de novo para ver se ele some.

Também vale rodar `npm run typecheck`: ele avisa vírgulas e chaves faltando, campos com nome errado e nomes de documento fora da lista `SOURCES`.
