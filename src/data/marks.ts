import type { Source } from "./types.ts";

// descricao: "Impacto no mundo" da marca, só descritivo (sem efeito nas regras).
export type MarkData = { id: string; name: string; briefing: string; descricao?: string; source: Source[] };

export const marks: MarkData[] = [
  {
    id: "terceiro-olho",
    name: "Terceiro Olho",
    source: ["A terra de Man_naka oko.docx", "dedução"],
    briefing:
      "Fenda hereditária na testa da linhagem do herdeiro de Susanoo, de [[Man'naka oko]]. Quando aberto, o [[Terceiro Olho]] revela almas, espíritos e rastros de magia, mas manter o olho aberto gera fadiga física.",
    descricao:
      "Com o olho aberto, você vê as almas dos vivos e dos mortos, os espíritos à espreita, a agonia dos escravizados e as cicatrizes deixadas pela magia, mas mantê-lo aberto cansa o corpo. Uns o chamam de abençoado, recompensa dos deuses pela morte da criatura vil, e outros de marcado ou maculado, herdeiro de uma maldição. Fora de [[Man'naka oko]], quase ninguém sabe o que é a fenda na sua testa.",
  },
  {
    id: "mutacao-da-irmandade",
    name: "Mutação da Irmandade",
    source: ["Contexto basico de faccoes.docx", "Minor Powers.docx", "dedução"],
    briefing:
      "Mutações adquiridas pelos guerreiros da [[Irmandade de São Ferdinand]], que recorrem a aprimoramentos genéticos transumanistas para se fortalecer. Para eles, o corpo modificado é a prova viva da superioridade da doutrina de [[Activum]].",
    descricao:
      "Seu corpo modificado lhe dá força e resistência para enfrentar as criaturas de [[Crick]], à imagem do santo que ganhou dois braços extras para lutar com quatro espadas. As mutações se acumulam e não se escondem, e quem as vê sabe de onde você vem. Para os tradicionalistas de [[Midland]], você é um herege transumanista.",
  },
];
