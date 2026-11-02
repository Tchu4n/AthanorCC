import type { FaithData } from "./types.ts";

export const faiths: FaithData[] = [
  {
    id: "logan",
    name: "Logan",
    source: ["Panteao.docx", "Regras Globais do Cenário.docx", "Os homens do deserto.docx", "decisão do usuário"],
    briefing:
      "A espiral nos lembra que tudo tem causa e tudo volta à ordem. Logan não promete consolo: ensina a suportar a dor de pé e a cumprir o dever mesmo quando ninguém está olhando. Chamam-no de deus da morte, mas para nós a morte é só a última regra, e quem a aceita deixa de temê-la.",
    implications:
      "Seu culto está em acentuada decadência e sobrevive em bolsões isolados. É a divindade mais debatida entre os [[Homens do Deserto]], cujos [[Dojos]] unem filosofia, debate e artes marciais. Dele brotaram os [[Dedutivos]].",
  },
  {
    id: "umbra",
    name: "Umbra",
    source: ["Panteao.docx", "Regras Globais do Cenário.docx", "União das Províncias (UP).docx", "Minor Powers.docx", "Contexto basico de faccoes.docx"],
    briefing:
      "Sob a luz da Lua, nada está fora do lugar: cada força tem seu oposto, e cada pessoa tem seu degrau na grande hierarquia. Honramos os ritos antigos porque eles guardam um equilíbrio que nenhuma geração sozinha saberia inventar. Quem aceita o próprio lugar encontra paz, e quem não interfere no curso das coisas nunca é arrastado por ele.",
    implications:
      "É religião oficial da [[UP]], ao lado de [[Activum]]. Domina a corte de [[Midland]] pela proximidade com o [[Mosteiro de Itelonomeu]], de onde, segundo a lenda, sempre sai o [[Arauto]] de Umbra. Seus dogmas pregam subordinação, tradição e obediência.",
  },
  {
    id: "activum",
    name: "Activum",
    source: ["Panteao.docx", "Regras Globais do Cenário.docx", "União das Províncias (UP).docx", "Contexto basico de faccoes.docx", "Minor Powers.docx"],
    briefing:
      "Acendemos a vela para ver o mundo como ele é, e não como gostaríamos que fosse. Nada é sagrado antes de ser medido, e toda escolha se pesa pelo bem que produz e pelo custo que exige. Onde outros rezam por milagres, nós calculamos, testamos e melhoramos, e é assim que o progresso chega a todos.",
    implications:
      "É religião oficial da [[UP]], onde seu pragmatismo ampara a escravidão legalizada. A [[Irmandade de São Ferdinand]] luta sob sua bandeira e se vê como prova viva de sua doutrina. Nobres tradicionalistas de [[Midland]] chamam esses guerreiros de hereges transumanistas.",
  },
  {
    id: "mui",
    name: "Mui",
    source: ["Panteao.docx", "Regras Globais do Cenário.docx", "Raça_ Homens-Galho.docx"],
    briefing:
      "Nenhuma operária vive sozinha, e nenhum de nós precisa carregar o peso de ser só um. Em Mui, o que é meu é de todos, e o que é de todos me sustenta: ninguém passa fome enquanto a colmeia trabalha. Entregar-se ao coletivo não é perder-se, é finalmente ter um propósito.",
    implications:
      "É a divindade regente de [[Kruk]], onde a rainha atua como seu [[Arauto]]. A fé sustenta um Estado que suprime o indivíduo e provê tudo em troca de trabalho perpétuo. Trabalhadores obsoletos são processados para alimentar a magia do reino.",
  },
  {
    id: "gorturk",
    name: "Gorturk",
    source: ["Panteao.docx", "Os centauros.docx", "Regras Globais do Cenário.docx", "decisão do usuário"],
    briefing:
      "O sol nunca para no céu, e quem para debaixo dele começa a morrer. Gorturk escreveu o destino do mundo, e esse destino aponta sempre para o próximo horizonte, que nossa civilização tem o dever de alcançar. A glória é curta como a vida de um centauro, por isso deve ser vivida a galope.",
    implications:
      "É o deus regente do [[Império das Estepes]], onde a força bruta prova o direito de governar. Seu [[Arauto]], [[Ayalaal]], lidera os [[Centauros]] há mais de 200 anos. A fé legitima a pilhagem e a captura de escravos.",
  },
  {
    id: "tamem",
    name: "Tamem",
    source: ["Panteao.docx", "Regras Globais do Cenário.docx", "Raça_ Homens-Galho.docx"],
    briefing:
      "O fogo de Tamem tempera: o que sobrevive a ele sai mais forte. A vida é uma luta, e fingir que não é condena os fracos a uma morte lenta e sem sentido; nós lhes damos um lugar na guerra e um nome na memória da linhagem. Quem obedece ao mais forte nunca luta sozinho, e nenhuma ofensa contra os nossos fica sem resposta.",
    implications:
      "É o deus regente de [[Crick]], que pratica eugenia e mutações forçadas. Linhagens inteiras nascem para serem sacrificadas no esforço de guerra. Os inaptos são tratados como descartáveis.",
  },
  {
    id: "nilos",
    name: "Nilos",
    source: ["Panteao.docx", "Regras Globais do Cenário.docx", "Raça_ Homens-Galho.docx"],
    briefing:
      "Toda muralha que nos protege também nos prende. Nilos não pede templos nem obediência, pede coragem para quebrar o que apodreceu, para que o novo e o belo possam nascer das ruínas. Seus milagres cobram caro, mas quem já viu um deles sabe que o impossível é só uma regra que ninguém ousou romper.",
    implications:
      "Não tem raça, território nem nação: seus seguidores estão infiltrados em todas as sociedades como agentes do colapso. Sua magia exige sacrifícios caóticos e perdas imediatas em troca de milagres imprevisíveis. [[Homens-Galho]] que ficam muito tempo sem [[feromônios]] muitas vezes acabam a seu serviço.",
  },
  {
    id: "deus-oculto",
    name: "Deus Oculto",
    source: ["A Seita do Deus Oculto (Os Dedutivos).docx"],
    briefing:
      "Os outros deuses são sombras; nós buscamos a Forma de todas as formas. Não a encontramos em visões, mas em deduções: cada demonstração nos aproxima do Motor Imóvel, que ainda dorme e logo há de despertar. Não precisamos de reinos nem de convertidos, só de silêncio, rigor e mentes limpas.",
    implications:
      "Seus seguidores veem todos os outros deuses como falsas divindades, e [[Logan]] apenas como um arauto conceitual. Rejeitam fundar reinos e fazer proselitismo. Vivem em mosteiros e [[Dojos]] restritos, dedicados ao debate, à matemática e à purificação mental.",
  },
];
