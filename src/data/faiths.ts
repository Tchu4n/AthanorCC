import type { FaithData } from "./types.ts";

export const faiths: FaithData[] = [
  {
    id: "logan",
    name: "Logan",
    source: ["Panteao.docx", "Regras Globais do Cenário.docx", "Os homens do deserto.docx", "decisão do usuário"],
    briefing:
      "Deus da ordem absoluta, da causalidade, do dever inflexível e dos axiomas, cujo símbolo é uma espiral. Ensina que o universo segue uma razão pura e geométrica, e que o dever supremo é suportar a realidade de forma estoica. É chamado de deus da morte e das regras não escritas, mas a morte é um domínio simbólico.",
    implications:
      "Seu culto está em acentuada decadência e sobrevive em bolsões isolados. É a divindade mais debatida entre os [[Homens do Deserto]], cujos [[Dojos]] unem filosofia, debate e artes marciais. Dele brotaram os [[Dedutivos]].",
  },
  {
    id: "umbra",
    name: "Umbra",
    source: ["Panteao.docx", "Regras Globais do Cenário.docx", "União das Províncias (UP).docx", "Minor Powers.docx", "Contexto basico de faccoes.docx"],
    briefing:
      "Deusa do equilíbrio, da convergência e da lua, com domínios sobre hierarquia cósmica, tradição, equilíbrio passivo e ritos. Ensina que a realidade é uma corrente de forças opostas e complementares. A paz exige hierarquia, ritos ancestrais e não interferência no curso natural dos eventos.",
    implications:
      "É religião oficial da [[UP]], ao lado de [[Activum]]. Domina a corte de [[Midland]] pela proximidade com o [[Mosteiro de Itelonomeu]], de onde, segundo a lenda, sempre sai o [[Arauto]] de Umbra. Seus dogmas pregam subordinação, tradição e obediência.",
  },
  {
    id: "activum",
    name: "Activum",
    source: ["Panteao.docx", "Regras Globais do Cenário.docx", "União das Províncias (UP).docx", "Contexto basico de faccoes.docx", "Minor Powers.docx"],
    briefing:
      "Deus do conhecimento, dos sentidos e do progresso, cujo símbolo é uma vela. Ensina que a realidade é apenas material e mensurável, sem verdades inatas. Toda ação vale pela sua eficiência e pela relação custo-benefício.",
    implications:
      "É religião oficial da [[UP]], onde seu pragmatismo ampara a escravidão legalizada. A [[Irmandade de São Ferdinand]] luta sob sua bandeira e se vê como prova viva de sua doutrina. Nobres tradicionalistas de [[Midland]] chamam esses guerreiros de hereges transumanistas.",
  },
  {
    id: "mui",
    name: "Mui",
    source: ["Panteao.docx", "Regras Globais do Cenário.docx", "Raça_ Homens-Galho.docx"],
    briefing:
      "Deus do bem-comum, do coletivo e do propósito. Ensina que a individualidade é uma anomalia prejudicial. Recursos e vidas pertencem ao coletivo em prol do bem comum.",
    implications:
      "É a divindade regente de [[Kruk]], onde a rainha atua como seu [[Arauto]]. A fé sustenta um Estado que suprime o indivíduo e provê tudo em troca de trabalho perpétuo. Trabalhadores obsoletos são processados para alimentar a magia do reino.",
  },
  {
    id: "gorturk",
    name: "Gorturk",
    source: ["Panteao.docx", "Os centauros.docx", "Regras Globais do Cenário.docx", "decisão do usuário"],
    briefing:
      "Deus do destino, do sol e das estepes, chamado de Destino Manifesto e Conquistador, com domínios sobre destino, guerra e pilhagem. Ensina que a estagnação equivale à morte e que o cosmos exige expansão implacável sobre os povos periféricos. O sol é um título simbólico.",
    implications:
      "É o deus regente do [[Império das Estepes]], onde a força bruta prova o direito de governar. Seu [[Arauto]], [[Ayalaal]], lidera os [[Centauros]] há mais de 200 anos. A fé legitima a pilhagem e a captura de escravos.",
  },
  {
    id: "tamem",
    name: "Tamem",
    source: ["Panteao.docx", "Regras Globais do Cenário.docx", "Raça_ Homens-Galho.docx"],
    briefing:
      "Deus da vingança, da força, da guerra e do fogo. Ensina que a história é uma guerra biológica em que só os mais fortes têm direito de existir. A ordem se funda na pureza genética, na força bruta e na obediência total a um líder.",
    implications:
      "É o deus regente de [[Crick]], que pratica eugenia e mutações forçadas. Linhagens inteiras nascem para serem sacrificadas no esforço de guerra. Os inaptos são tratados como descartáveis.",
  },
  {
    id: "nilos",
    name: "Nilos",
    source: ["Panteao.docx", "Regras Globais do Cenário.docx", "Raça_ Homens-Galho.docx"],
    briefing:
      "Deus do caos para os críticos e dos milagres e perdas para os fiéis. Ensina que todo poder, estado ou dogma é uma prisão, e que a liberdade só vem da destruição das instituições. Não há propósito inerente, apenas vontade de agir.",
    implications:
      "Não tem raça, território nem nação: seus seguidores estão infiltrados em todas as sociedades como agentes do colapso. Sua magia exige sacrifícios caóticos e perdas imediatas em troca de milagres imprevisíveis. [[Homens-Galho]] que ficam muito tempo sem [[feromônios]] muitas vezes acabam a seu serviço.",
  },
  {
    id: "deus-oculto",
    name: "Deus Oculto",
    source: ["A Seita do Deus Oculto (Os Dedutivos).docx"],
    briefing:
      "A Forma das Formas e o Motor Imóvel, um arquétipo supremo que, segundo seus seguidores, ainda não despertou. Os [[Dedutivos]] chegaram a ele por deduções lógicas e cálculos metafísicos. Acreditam que está prestes a voltar de forma profética.",
    implications:
      "Seus seguidores veem todos os outros deuses como falsas divindades, e [[Logan]] apenas como um arauto conceitual. Rejeitam fundar reinos e fazer proselitismo. Vivem em mosteiros e [[Dojos]] restritos, dedicados ao debate, à matemática e à purificação mental.",
  },
];
