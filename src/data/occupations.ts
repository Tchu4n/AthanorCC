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
    image: IMAGES["factions/mercenarios"].src,
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
    id: "mago-dissidente",
    name: "Mago Dissidente",
    source: ["decisão do usuário"],
    briefing:
      "Mago que segue os próprios estudos, fora das academias e das forças militares. Trabalha para si mesmo, sem servir a governos ou patronos. Costuma viver como andarilho, levando a pesquisa de um lugar a outro.",
  },
  {
    id: "medico",
    name: "Médico",
    source: ["decisão do usuário", "Panteao.docx", "Minor Powers.docx"],
    briefing:
      "Estudioso do corpo que cura com bisturi, sutura e anatomia, e não com dons ou milagres. Formado nas universidades de [[Highbridge]] ou nas academias da [[UP]], costuma seguir [[Activum]], para quem só vale o que se pode medir. Os melhores são disputados pela [[Irmandade de São Ferdinand]], que depende de cirurgiões para os seus aprimoramentos.",
  },
  {
    id: "alquimista",
    name: "Alquimista",
    source: ["decisão do usuário", "O Sistema de Magia e a Engenharia dos Cajados em Athanor.docx", "A origem do deserto de Marranol.docx"],
    briefing:
      "Estudioso da transmutação e da combustão das substâncias, a base química por trás da magia ortodoxa. Prepara reagentes, ligas e fluidos de resfriamento sob encomenda para cada [[Cajado]], sem precisar conjurar nada. Os mais obstinados ainda caçam a [[Pedra filosofal]], perdida no deserto de [[Marranol]] desde a queda do seu mago tirano.",
  },
  {
    id: "acolito",
    name: "Acólito",
    source: ["decisão do usuário", "Panteao.docx", "Minor Powers.docx"],
    briefing:
      "Servo leigo de um templo ou mosteiro, que cuida dos ritos, das velas e dos arquivos enquanto aprende a fé por dentro. Os acólitos de [[Umbra]] sonham ser aceitos no [[Mosteiro de Itelonomeu]], de onde sai o [[Arauto]] da deusa, e os de [[Activum]] acendem as velas que simbolizam o progresso. Muitos servem a quem se diz Arauto, sem jamais ter certeza de que ele é verdadeiro.",
  },
  {
    id: "astrologo",
    name: "Astrólogo",
    source: ["decisão do usuário", "Panteao.docx", "Subregioes.docx"],
    briefing:
      "Leitor do céu que calcula, pelas fases da lua e pelo caminho do sol, o destino de reinos e pessoas. As cortes de [[Midland]] e de [[Sunfield]] pagam caro por mapas de nascimento e por datas propícias para casamentos e guerras, ligando a lua a [[Umbra]] e o sol a [[Gorturk]]. Os [[Dedutivos]] desprezam essas previsões e preferem a matemática pura.",
  },
  {
    id: "apotecario",
    name: "Apotecário",
    source: ["decisão do usuário", "Contexto basico de faccoes.docx", "Vampiros de Athanor_ Regras e Fisiologia.docx"],
    briefing:
      "Preparador de remédios, unguentos, tinturas e venenos, que vende de tudo em balcões discretos. Em [[Blackwater]] e nos portos do [[Mar do Arauto]], muitos negociam substâncias proibidas com a [[Companhia de Comércio do Mar do Arauto]]. Alguns vendem pó de prata como amuleto contra criaturas da noite, sem saber que a superstição tem fundamento.",
  },
  {
    id: "ferreiro",
    name: "Ferreiro",
    source: ["decisão do usuário", "O Sistema de Magia e a Engenharia dos Cajados em Athanor.docx"],
    briefing:
      "Artesão do metal, das armas e das ferramentas, presente em toda vila de Athanor. Os ferreiros de [[Laguardia]], sede das maiores forjas do mundo, fundem os chassis dos cajados e lapidam lentes sob contratos de sigilo, sem entender a magia que ajudam a criar. Fora dali, martelam os cajados de série da [[Magia de Trincheira]], pesados e cheios de falhas.",
  },
];
