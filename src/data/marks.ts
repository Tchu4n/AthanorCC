import type { Source } from "./types.ts";

export type MarkData = { id: string; name: string; briefing: string; source: Source[] };

export const marks: MarkData[] = [
  {
    id: "terceiro-olho",
    name: "Terceiro Olho",
    source: ["A terra de Man_naka oko.docx"],
    briefing:
      "Fenda hereditária na testa da linhagem do herdeiro de Susanoo, de [[Man'naka oko]]. Quando aberto, o [[Terceiro Olho]] revela almas, espíritos e rastros de magia, mas manter o olho aberto gera fadiga física.",
  },
  {
    id: "mutacao-da-irmandade",
    name: "Mutação da Irmandade",
    source: ["Contexto basico de faccoes.docx"],
    briefing:
      "Mutações adquiridas pelos guerreiros da [[Irmandade de São Ferdinand]], que recorrem a aprimoramentos genéticos transumanistas para se fortalecer. Para eles, o corpo modificado é a prova viva da superioridade da doutrina de [[Activum]].",
  },
  {
    id: "gaiola-de-bateria",
    name: "Gaiola de bateria",
    source: ["O Sistema de Magia e a Engenharia dos Cajados em Athanor.docx", "COMPÊNDIO DE APARÊNCIA E BIOLOGIA — ATHANOR.docx", "decisão do usuário"],
    briefing:
      "Pequena gaiola de metal presa ao cinto, com animais vivos, normalmente coelhos, que serve de [[Bateria Vital]] para os feitiços do [[Cajado]]. Magos ortodoxos de [[Laguardia]] e da [[UP]] usam a gaiola, com exceções.",
  },
];
