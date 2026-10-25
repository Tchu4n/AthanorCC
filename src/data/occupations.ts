import { IMAGES } from "./images.ts";
import type { OccupationData } from "./types.ts";

// Ofícios são livres para qualquer espécie.
export const occupations: OccupationData[] = [
  {
    id: "soldado",
    name: "Soldado",
    image: IMAGES["factions/up-soldado-regular"].src,
    source: ["Regras Globais do Cenário.docx", "União das Províncias (UP).docx", "Minor Powers.docx"],
    briefing:
      "Soldados servem aos exércitos das nações de Athanor, cada um com seu estilo. Na [[UP]] usam capacetes morion com plumas e cajados padronizados, já que as armas de fogo são proibidas; em [[Midland]], capacetes com asas e espada reta. Em [[Highbridge]], o alto pagamento atrai os guerreiros mais gloriosos.",
  },
  {
    id: "mago-ortodoxo",
    name: "Mago ortodoxo",
    image: IMAGES["factions/up-mago-alto"].src,
    source: ["O Sistema de Magia e a Engenharia dos Cajados em Athanor.docx", "União das Províncias (UP).docx"],
    briefing:
      "Conjurador que trata a magia como engenharia: drena energia de uma [[Bateria Vital]] e a dispara por um [[Cajado]] fincado no solo para o [[Aterramento]]. Pelos custos de pesquisa e materiais, a alta magia é reservada aos abastados, e o poder de um mago depende do seu orçamento. Na [[UP]], a prática é monopólio da elite e das forças militares.",
  },
  {
    id: "bardo",
    name: "Bardo",
    source: ["Os Bardos de Athanor.docx"],
    briefing:
      "Músico raro cujas melodias curam ferimentos e ampliam o vigor dos aliados, um dom que nenhum estudo ensina. Costuma viver como viajante e contador de histórias, acolhido com reverência por onde passa. Entre os [[Centauros]], há bardos que usam cantos guturais para fortalecer a horda.",
  },
  {
    id: "monge-de-dojo",
    name: "Monge de dojo",
    image: IMAGES["misc/dojo-deserto"].src,
    source: ["Os homens do deserto.docx"],
    briefing:
      "Membro dos [[Dojos]], onde contemplação filosófica, debate rigoroso e disciplina física são inseparáveis. A maioria é formada por lutadores formidáveis, com artes marciais geométricas, limpas e defensivas. Diferentes Dojos representam diferentes escolas de pensamento sobre [[Logan]].",
  },
  {
    id: "mercenario",
    name: "Mercenário",
    source: ["Minor Powers.docx", "Contexto basico de faccoes.docx", "O Sistema de Magia e a Engenharia dos Cajados em Athanor.docx", "Os centauros.docx"],
    briefing:
      "Guerreiro de aluguel, contratado por senhores locais, mosteiros e até pelos [[Centauros]], que vivem em parte do trabalho mercenário. Os mercenários de [[Laguardia]] são famosos por suas zweihanders, pistolas flintlock e capacetes sallet, e são figuras comuns em [[Blackwater]]. Muitos usam cajados de série, pesados e sujeitos a falhas.",
  },
  {
    id: "contrabandista",
    name: "Contrabandista",
    source: ["Minor Powers.docx", "Subregioes.docx"],
    briefing:
      "Contrabandistas movimentam bens ilegais pelo [[Mar do Arauto]], e [[Blackwater]] é o principal centro desse comércio. Na Baía dos Contrabandistas, a [[Companhia de Comércio do Mar do Arauto]] negocia na surdina, longe das regras de [[Laguardia]].",
  },
  {
    id: "cacador",
    name: "Caçador",
    source: ["Minor Powers.docx", "Os centauros.docx"],
    briefing:
      "Caçadores sustentam povos de clima duro, como [[Vargarf]], que vive da caça de bestas, e [[Oakhaven]], que comercia peles de animais selvagens. Os [[Centauros]] também são caçadores letais.",
  },
  {
    id: "pescador",
    name: "Pescador",
    source: ["Minor Powers.docx", "Subregioes.docx"],
    briefing:
      "A pesca sustenta muitos povos, da pesca gélida de [[Vargarf]] à pesca pantanosa de [[Blackwater]]. Na Costa Afogada, no [[Protetorado de Morrow]], é a única forma de subsistência, e seus pescadores sofrem com os ataques navais de Vargarf.",
  },
];
