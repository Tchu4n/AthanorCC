import type { FaithData } from "./types.ts";

export const faiths: FaithData[] = [
  {
    id: "logan",
    name: "Logan",
    source: ["Panteao.docx", "Regras Globais do Cenário.docx", "Os homens do deserto.docx", "decisão do usuário", "dedução"],
    briefing:
      "A espiral nos lembra que tudo tem causa e tudo volta à ordem. Logan não promete consolo: ensina a suportar a dor de pé e a cumprir o dever mesmo quando ninguém está olhando. Chamam-no de deus da morte, mas para nós a morte é só a última regra, e quem a aceita deixa de temê-la.",
    implications:
      "Seguir Logan hoje é pertencer a uma fé em decadência, viva só em bolsões isolados e, sobretudo, nos [[Dojos]] dos [[Homens do Deserto]]. Fora deles, sua serenidade diante da dor e da morte pode parecer frieza, e poucos entendem sua devoção ao dever. Dessa mesma fé brotaram os [[Dedutivos]], que a levaram ao extremo.",
  },
  {
    id: "umbra",
    name: "Umbra",
    source: ["Panteao.docx", "Regras Globais do Cenário.docx", "União das Províncias (UP).docx", "Minor Powers.docx", "Contexto basico de faccoes.docx", "dedução"],
    briefing:
      "Sob a luz da Lua, nada está fora do lugar: cada força tem seu oposto, e cada pessoa tem seu degrau na grande hierarquia. Honramos os ritos antigos porque eles guardam um equilíbrio que nenhuma geração sozinha saberia inventar. Quem aceita o próprio lugar encontra paz, e quem não interfere no curso das coisas nunca é arrastado por ele.",
    implications:
      "É religião oficial da [[UP]], ao lado de [[Activum]], e domina a corte de [[Midland]], então nessas terras sua fé lhe dá lugar e respeito. Seus dogmas pedem subordinação, tradição e obediência, e você aprendeu a respeitar hierarquias, mesmo quando elas pesam sobre você. Segundo a lenda, o [[Arauto]] da deusa sai sempre do [[Mosteiro de Itelonomeu]], fechado a visitantes.",
  },
  {
    id: "activum",
    name: "Activum",
    source: ["Panteao.docx", "Regras Globais do Cenário.docx", "União das Províncias (UP).docx", "Contexto basico de faccoes.docx", "Minor Powers.docx", "dedução"],
    briefing:
      "Acendemos a vela para ver o mundo como ele é, e não como gostaríamos que fosse. Nada é sagrado antes de ser medido, e toda escolha se pesa pelo bem que produz e pelo custo que exige. Onde outros rezam por milagres, nós calculamos, testamos e melhoramos, e é assim que o progresso chega a todos.",
    implications:
      "É religião oficial da [[UP]], e seu pragmatismo é usado para justificar a escravidão legalizada. A [[Irmandade de São Ferdinand]] luta sob sua bandeira, e por isso, em [[Midland]], os tradicionalistas de [[Umbra]] podem ver você como herege. Entre cientistas, médicos e engenheiros, sua fé é quase uma língua comum.",
  },
  {
    id: "mui",
    name: "Mui",
    source: ["Panteao.docx", "Regras Globais do Cenário.docx", "Raça_ Homens-Galho.docx", "dedução"],
    briefing:
      "Nenhuma operária vive sozinha, e nenhum de nós precisa carregar o peso de ser só um. Em Mui, o que é meu é de todos, e o que é de todos me sustenta: ninguém passa fome enquanto a colmeia trabalha. Entregar-se ao coletivo não é perder-se, é finalmente ter um propósito.",
    implications:
      "É o deus de [[Kruk]], onde a rainha é seu [[Arauto]] e ninguém vive para si mesmo. Fora da colmeia, quem prega que o indivíduo não importa assusta reinos construídos sobre nobres, vassalos e heranças. Você entende o sacrifício pelo coletivo como virtude, mesmo quando o coletivo pede a sua própria vida.",
  },
  {
    id: "gorturk",
    name: "Gorturk",
    source: ["Panteao.docx", "Os centauros.docx", "Regras Globais do Cenário.docx", "decisão do usuário", "dedução"],
    briefing:
      "O sol nunca para no céu, e quem para debaixo dele começa a morrer. Gorturk escreveu o destino do mundo, e esse destino aponta sempre para o próximo horizonte, que nossa civilização tem o dever de alcançar. A glória é curta como a vida de um centauro, por isso deve ser vivida a galope.",
    implications:
      "É o deus do [[Império das Estepes]], e seu [[Arauto]], o [[Cavalga-mundos]], lidera os [[Centauros]] há mais de 200 anos. Sua fé legitima a pilhagem, a conquista e a captura de escravos, e por isso os povos saqueados a veem como a bandeira dos invasores. Para você, ficar parado é morrer devagar.",
  },
  {
    id: "tamem",
    name: "Tamem",
    source: ["Panteao.docx", "Regras Globais do Cenário.docx", "Raça_ Homens-Galho.docx", "dedução"],
    briefing:
      "O fogo de Tamem tempera: o que sobrevive a ele sai mais forte. A vida é uma luta, e fingir que não é condena os fracos a uma morte lenta e sem sentido; nós lhes damos um lugar na guerra e um nome na memória da linhagem. Quem obedece ao mais forte nunca luta sozinho, e nenhuma ofensa contra os nossos fica sem resposta.",
    implications:
      "É o deus de [[Crick]], que pratica eugenia e mutações forçadas e sacrifica linhagens inteiras na guerra. Quase ninguém fora da horda o cultua abertamente, e quem o faz é visto como aliado de monstros. Sua fé exige força, obediência ao mais forte e vingança contra cada ofensa.",
  },
  {
    id: "nilos",
    name: "Nilos",
    source: ["Panteao.docx", "Regras Globais do Cenário.docx", "Raça_ Homens-Galho.docx", "dedução"],
    briefing:
      "Toda muralha que nos protege também nos prende. Nilos não pede templos nem obediência, pede coragem para quebrar o que apodreceu, para que o novo e o belo possam nascer das ruínas. Seus milagres cobram caro, mas quem já viu um deles sabe que o impossível é só uma regra que ninguém ousou romper.",
    implications:
      "Não tem templo nem nação, e seus fiéis vivem infiltrados em todas as sociedades, então assumir essa fé em público é se declarar inimigo de toda ordem. Sua magia dispensa cajados e baterias, mas exige perdas imediatas e caóticas em troca de milagres imprevisíveis. Muitos [[Homens-Galho]] que perdem os [[feromônios]] acabam a seu serviço.",
  },
  {
    id: "deus-oculto",
    name: "Deus Oculto",
    source: ["A Seita do Deus Oculto (Os Dedutivos).docx", "dedução"],
    briefing:
      "Os outros deuses são sombras; nós buscamos a Forma de todas as formas. Não a encontramos em visões, mas em deduções: cada demonstração nos aproxima do Motor Imóvel, que ainda dorme e logo há de despertar. Não precisamos de reinos nem de convertidos, só de silêncio, rigor e mentes limpas.",
    implications:
      "Seguir o Deus Oculto é ver todos os outros deuses como falsos, até [[Logan]], que para os [[Dedutivos]] é só um degrau no caminho. A seita não funda reinos nem busca convertidos, então quase ninguém sabe o que você é, e quem sabe costuma estranhar. Sua força está no rigor da mente: debate, matemática e paciência à espera do despertar.",
  },
];
