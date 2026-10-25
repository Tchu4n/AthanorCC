import type { Source } from "./types.ts";

// descricao: prós e contras da marca, só descritivo (sem efeito nas regras).
export type MarkData = { id: string; name: string; briefing: string; descricao?: string; source: Source[] };

export const marks: MarkData[] = [
  {
    id: "terceiro-olho",
    name: "Terceiro Olho",
    source: ["A terra de Man_naka oko.docx"],
    briefing:
      "Fenda hereditária na testa da linhagem do herdeiro de Susanoo, de [[Man'naka oko]]. Quando aberto, o [[Terceiro Olho]] revela almas, espíritos e rastros de magia, mas manter o olho aberto gera fadiga física.",
    descricao:
      "A favor: aberto, o olho revela as almas dos vivos e dos mortos, espíritos à espreita, a aura de tristeza e agonia dos escravizados e as cicatrizes deixadas por rastros de magia, e para alguns é uma dádiva dos deuses que guia e ajuda a compreender o mundo. Contra: é o estigma hereditário de uma maldição, expõe o verdadeiro terror do mundo e manter o olho aberto gera fadiga física, e muitos chamam seus portadores de maculados.",
  },
  {
    id: "mutacao-da-irmandade",
    name: "Mutação da Irmandade",
    source: ["Contexto basico de faccoes.docx", "Minor Powers.docx"],
    briefing:
      "Mutações adquiridas pelos guerreiros da [[Irmandade de São Ferdinand]], que recorrem a aprimoramentos genéticos transumanistas para se fortalecer. Para eles, o corpo modificado é a prova viva da superioridade da doutrina de [[Activum]].",
    descricao:
      "A favor: os aprimoramentos genéticos fortalecem o guerreiro para o combate contra as criaturas de [[Crick]], seguindo a lenda de São Ferdinand, que teria ganhado dois braços extras para lutar com quatro espadas. Contra: o corpo acumula diversas mutações, e nobres tradicionalistas de [[Midland]] tratam os mutantes como hereges transumanistas.",
  },
  {
    id: "gaiola-de-bateria",
    name: "Gaiola de bateria",
    source: ["O Sistema de Magia e a Engenharia dos Cajados em Athanor.docx", "COMPÊNDIO DE APARÊNCIA E BIOLOGIA — ATHANOR.docx", "decisão do usuário"],
    briefing:
      "Pequena gaiola de metal presa ao cinto, com animais vivos, normalmente coelhos, que serve de [[Bateria Vital]] para os feitiços do [[Cajado]]. Magos ortodoxos de [[Laguardia]] e da [[UP]] usam a gaiola, com exceções.",
  },
];
