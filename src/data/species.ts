import { IMAGES } from "./images.ts";
import { A_DEFINIR, type SpeciesData } from "./types.ts";

export const species: SpeciesData[] = [
  {
    id: "humano",
    name: "Humano",
    source: ["Contexto basico de faccoes.docx", "União das Províncias (UP).docx", "COMPÊNDIO DE APARÊNCIA E BIOLOGIA — ATHANOR.docx", "A terra de Man_naka oko.docx"],
    briefing:
      "Várias nações humanas exercem influência regional e comercial em Athanor, e a [[UP]] foi constituída por províncias originalmente humanas. Entre os humanos há variações marcantes, como a elite de orelhas pontudas da UP, os mutantes da [[Irmandade de São Ferdinand]] e os portadores do [[Terceiro Olho]].",
    subspecies: [
      { id: "humano-comum", name: "Humano comum", source: ["decisão do usuário"], briefing: A_DEFINIR },
      {
        id: "elite-orelhas-pontudas",
        name: "Elite de orelhas pontudas",
        image: IMAGES["factions/up-mago-alto"].src,
        source: ["COMPÊNDIO DE APARÊNCIA E BIOLOGIA — ATHANOR.docx", "Regras Globais do Cenário.docx"],
        briefing:
          "Humanos aristocráticos de orelhas longas e pontudas, geralmente pálidos, de traços refinados e frios. Formam boa parte da elite governante da [[UP]], onde são chamados de barões, e vestem a alta-costura da Espanha colonial. Cada nobre conjurador costuma levar ao cinto uma [[Gaiola de bateria]] com pequenos animais vivos.",
      },
      {
        id: "mutante-sao-ferdinand",
        name: "Mutante da Irmandade de São Ferdinand",
        source: ["Contexto basico de faccoes.docx"],
        briefing:
          "Guerreiros da [[Irmandade de São Ferdinand]] que recorrem a aprimoramentos genéticos transumanistas e acumulam mutações. Consideram-se a prova viva da superioridade da doutrina de [[Activum]]. Usam mosquetes, lanças e armas contundentes para conter o avanço de [[Crick]].",
      },
      {
        id: "terceiro-olho",
        name: "Terceiro Olho de Man'naka oko",
        source: ["A terra de Man_naka oko.docx"],
        briefing:
          "Descendentes da linhagem do herdeiro de Susanoo, que carregam na testa a fenda hereditária do [[Terceiro Olho]]. Quando aberto, o olho revela almas, espíritos, a agonia dos escravizados e rastros de magia, mas causa fadiga física. São chamados de marcados, maculados ou abençoados, conforme quem os vê.",
      },
    ],
  },
  {
    id: "homens-galho",
    name: "Homens-Galho",
    image: IMAGES["species/homens-galho-principe"].src,
    source: ["Raça_ Homens-Galho.docx", "COMPÊNDIO DE APARÊNCIA E BIOLOGIA — ATHANOR.docx", "Regras Globais do Cenário.docx"],
    briefing:
      "Insetos humanoides de corpo quitinoso e com regeneração, que vivem em cidades-fortalezas subterrâneas escavadas na rocha. A colmeia é controlada pelos [[feromônios]] da rainha, e quem fica muito tempo longe deles pode ganhar livre-arbítrio e cair na insanidade, muitas vezes servindo a [[Nilos]]. Formam duas nações rivais: [[Kruk]] e [[Crick]].",
    subspecies: [
      {
        id: "principe",
        name: "Príncipe",
        image: IMAGES["species/homens-galho-principe"].src,
        source: ["Raça_ Homens-Galho.docx", "COMPÊNDIO DE APARÊNCIA E BIOLOGIA — ATHANOR.docx"],
        briefing:
          "Governantes periféricos e o maior risco de falha da colmeia, pois o envelhecimento os torna resistentes aos [[feromônios]]. Fora a rainha, são os únicos com acesso à magia e capazes de falar, o que os torna diplomatas e comerciantes. Sua aparência varia conforme a cultura estrangeira com que lidam.",
      },
      {
        id: "princesa",
        name: "Princesa",
        source: ["Raça_ Homens-Galho.docx"],
        briefing:
          "Reprodutoras secundárias, essenciais para fundar novas colônias. São muito cobiçadas pelas nações vizinhas e protegidas como recursos estratégicos.",
      },
      {
        id: "trabalhador",
        name: "Trabalhador",
        source: ["Raça_ Homens-Galho.docx"],
        briefing:
          "A base operacional da colmeia, sem individualidade sob o efeito químico dos [[feromônios]]. São cobiçados por serem considerados os escravos perfeitos.",
      },
    ],
  },
  {
    id: "centauros",
    name: "Centauros",
    source: ["Os centauros.docx", "Regras Globais do Cenário.docx", "COMPÊNDIO DE APARÊNCIA E BIOLOGIA — ATHANOR.docx"],
    briefing:
      "Homens-cavalo das estepes, conhecidos como o Povo de [[Gorturk]], de crescimento acelerado e que morrem de velhice por volta dos 30 anos. A vida breve alimenta uma fome por glória em batalha, e vivem de pilhagem, trabalho mercenário e captura de escravos. Abominam a magia, que veem como trapaça e ausência de honra.",
  },
  {
    id: "homens-do-deserto",
    name: "Homens do Deserto",
    image: IMAGES["species/homens-do-deserto"].src,
    source: ["Os homens do deserto.docx", "COMPÊNDIO DE APARÊNCIA E BIOLOGIA — ATHANOR.docx", "decisão do usuário"],
    briefing:
      "Humanoides de grande porte, entre 2 e 2,5 metros de altura, semelhantes a camelos, cobertos de pelagem espessa, com corcova e capazes de armazenar água e nutrientes. Têm vidas longas e nascimentos raros, e quanto mais velhos, maiores a corcunda e o casco de tartaruga que carregam nas costas. Vivem de forma reclusa em torno dos [[Dojos]], devotos de [[Logan]], e tratam a magia como tabu estudado pela matemática.",
  },
  {
    id: "vampiros",
    name: "Vampiros",
    image: IMAGES["species/vampiros"].src,
    source: ["Vampiros de Athanor_ Regras e Fisiologia.docx"],
    briefing:
      "Seres extremamente raros, inteligentes, rápidos e sedutores, que vivem misturados às sociedades e cuja existência é quase desconhecida. Alimentam-se de energia vital por meio de sangue e podem conjurar magia sem baterias, queimando as próprias reservas. São vulneráveis à luz do sol e à [[Intoxicação por prata]].",
  },
];
