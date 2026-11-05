import { IMAGES } from "./images.ts";
import type { SpeciesData } from "./types.ts";

export const species: SpeciesData[] = [
  {
    id: "humano",
    name: "Humano",
    image: IMAGES["species/humanos-de-athanor"].src,
    source: ["Contexto basico de faccoes.docx", "União das Províncias (UP).docx", "COMPÊNDIO DE APARÊNCIA E BIOLOGIA — ATHANOR.docx", "A terra de Man_naka oko.docx", "dedução"],
    briefing:
      "Os humanos são o povo mais espalhado de Athanor: fundaram as províncias que viraram a [[UP]], acendem as forjas de [[Laguardia]] e governam reinos menores por todo o continente. Sob o mesmo nome cabem barões de orelhas pontudas, guerreiros mutados da [[Irmandade de São Ferdinand]] e gente comum que só quer chegar viva ao fim do inverno.",
    implications:
      "Ser humano é passar despercebido: quase toda cidade de Athanor tem gente como você, e ninguém estranha seu rosto. Isso não garante respeito, porque o que pesa é de onde você vem, a quem serve e quanto dinheiro carrega. Sem dons próprios da espécie, sua força está no que aprendeu e nas armas que consegue pagar.",
    subspecies: [
      {
        id: "humano-comum",
        name: "Humano comum",
        source: ["União das Províncias (UP).docx", "Regras Globais do Cenário.docx", "decisão do usuário", "dedução"],
        briefing:
          "Nem barão, nem mutante: apenas um humano, como a maioria dos que lavram, comerciam, rezam e lutam em Athanor. Nasceu sem privilégio de sangue e sem marca no corpo, e o que vier a ser será por conta própria.",
        implications:
          "Você não chama atenção em quase lugar nenhum, o que é uma vantagem para quem precisa passar despercebido. Em compensação, ninguém lhe deve nada: na [[UP]], por exemplo, a magia é monopólio legal da elite, e um humano comum que conjure sem pertencer a ela vira criminoso.",
      },
      {
        id: "elite-orelhas-pontudas",
        name: "Elite de orelhas pontudas",
        image: IMAGES["species/elite-orelhas-pontudas"].src,
        source: ["COMPÊNDIO DE APARÊNCIA E BIOLOGIA — ATHANOR.docx", "Regras Globais do Cenário.docx", "União das Províncias (UP).docx", "O Sistema de Magia e a Engenharia dos Cajados em Athanor.docx", "decisão do usuário", "dedução"],
        briefing:
          "Humanos aristocráticos de orelhas longas e pontudas, pálidos e de traços refinados e frios, que formam boa parte da elite governante da [[UP]], onde o povo os chama de barões. Vestem a alta-costura colonial de golas franzidas e veludo escuro, e cada nobre conjurador leva ao cinto uma [[Gaiola de bateria]] com pequenos animais vivos: para eles, a magia é uma arma, e o coelho é a munição.",
        implications:
          "Na [[UP]] você pertence à casta que governa e que detém o monopólio legal da magia, e portas que se fecham para os outros se abrem para você. Fora dela, suas orelhas denunciam sua origem antes de qualquer palavra, e quem sofre com as leis da União sabe muito bem quem as escreveu. Se aprendeu a conjurar, como é costume da sua casta, em combate você é artilharia: lento para fincar o [[Cajado]], letal quando ele dispara.",
      },
      {
        id: "mutante-sao-ferdinand",
        name: "Mutante da Irmandade de São Ferdinand",
        image: IMAGES["species/mutante-da-irmandade"].src,
        source: ["Contexto basico de faccoes.docx", "Minor Powers.docx", "decisão do usuário"],
        briefing:
          "Guerreiros da [[Irmandade de São Ferdinand]], herdeiros do santo que ganhou dois braços extras e lutou com quatro espadas contra as criaturas do deserto. Buscam o mesmo milagre em aprimoramentos genéticos, acumulando mutações como quem acumula cicatrizes, e se veem como a prova viva da doutrina de [[Activum]]. Com mosquetes, lanças e armas contundentes, guardam os fortes que cercam [[Crick]].",
        implications:
          "A mutação somada a um treino brutal lhe deu força e agilidade fora do comum, e quem já viu a Irmandade lutar respeita isso. Comerciantes e peregrinos que sua ordem protege costumam recebê-lo bem, mas em [[Midland]] os tradicionalistas devotos de [[Umbra]] chamam vocês de hereges transumanistas, mesmo com a corte pagando pela sua guerra. Seu corpo é uma bandeira: ninguém confunde você com outra coisa.",
      },
    ],
  },
  {
    id: "homens-galho",
    name: "Homens-Galho",
    image: IMAGES["species/homem-galho"].src,
    source: ["Raça_ Homens-Galho.docx", "COMPÊNDIO DE APARÊNCIA E BIOLOGIA — ATHANOR.docx", "Regras Globais do Cenário.docx", "Os centauros.docx", "União das Províncias (UP).docx", "A noite maldita.docx", "dedução"],
    briefing:
      "Insetos humanoides de corpo quitinoso, capazes de regenerar ferimentos, que escavam cidades-fortalezas na rocha das montanhas. A colmeia é mantida pelos [[feromônios]] da rainha, e quem passa tempo demais longe deles ganha livre-arbítrio e corre o risco de cair no niilismo e na loucura, muitas vezes a serviço de [[Nilos]]. Dividem-se em duas nações inimigas: a disciplinada [[Kruk]] e a monstruosa [[Crick]].",
    implications:
      "Para boa parte do mundo, sua espécie é mercadoria: centauros caçam homens-galho nas montanhas para vendê-los como escravos, e a [[UP]] os usa como mão de obra e até como combustível de magia. Os humanos ainda lembram da [[Noite Maldita]], quando Crick devorou uma cidade inteira, e muitos não distinguem um homem-galho de outro. Longe da colmeia, cada dia sem feromônio é um passo rumo à liberdade ou à loucura.",
    subspecies: [
      {
        id: "principe",
        name: "Príncipe",
        image: IMAGES["species/homens-galho-principe"].src,
        source: ["Raça_ Homens-Galho.docx", "COMPÊNDIO DE APARÊNCIA E BIOLOGIA — ATHANOR.docx", "decisão do usuário"],
        briefing:
          "Governantes periféricos da colmeia e seu maior risco: com a idade, ficam resistentes aos [[feromônios]] e descobrem a ambição. Fora a rainha, são os únicos que falam e que podem estudar magia, e por isso foram moldados para a diplomacia e o comércio, com uma aparência que muda conforme o povo estrangeiro com que lidam.",
        implications:
          "Você é a voz da sua espécie: fala, negocia e foi feito pela rainha para lidar com estrangeiros, o que lhe abre portas que nenhum outro homem-galho atravessaria. É também o único da sua espécie que pode aprender magia. Em [[Kruk]], porém, príncipes velhos são executados antes que a resistência aos feromônios os torne perigosos, e seu tempo lá tem prazo.",
      },
      {
        id: "princesa",
        name: "Princesa",
        source: ["Raça_ Homens-Galho.docx", "COMPÊNDIO DE APARÊNCIA E BIOLOGIA — ATHANOR.docx", "A noite maldita.docx", "dedução"],
        briefing:
          "Reprodutoras secundárias, as únicas além da rainha capazes de fundar uma nova colônia. São tesouros de Estado, protegidas pelos seus e cobiçadas por todas as nações vizinhas, e foi roubando princesas de [[Kruk]] que o fundador de [[Crick]] ergueu seu reino.",
        implications:
          "Onde quer que vá, quem sabe o que você é enxerga uma colmeia inteira em potencial. Há quem pague, ou mate, para tê-la, e sua segurança depende de quem caminha ao seu lado. Você não estuda magia e, como só a rainha e os príncipes falam, conversa com os seus pelas antenas e pelos [[feromônios]], e com o resto do mundo por gestos.",
      },
      {
        id: "trabalhador",
        name: "Trabalhador",
        source: ["Raça_ Homens-Galho.docx", "Regras Globais do Cenário.docx", "Os centauros.docx", "dedução"],
        briefing:
          "A base da colmeia: os que cavam e constroem sem descanso, sem individualidade, sob o efeito químico dos [[feromônios]]. Em [[Kruk]], os que envelhecem são levados aos centros de processamento, onde sua vida vira o feitiço que mantém a nação de pé, e em [[Crick]] nascem já deformados para uma única função.",
        implications:
          "Para quem caça escravos, você é o \"escravo perfeito\", e centauros, a [[UP]] e a [[Companhia de Comércio do Mar do Arauto]] sabem disso. Você não fala nem pode estudar magia, então suas armas são o corpo quitinoso, a regeneração e uma resistência incansável ao trabalho. Se está longe da colmeia, os feromônios estão se apagando em você, e o que vem depois pode ser vontade própria ou loucura.",
      },
    ],
  },
  {
    id: "centauros",
    name: "Centauros",
    image: IMAGES["species/centauros"].src,
    source: ["Os centauros.docx", "Regras Globais do Cenário.docx", "COMPÊNDIO DE APARÊNCIA E BIOLOGIA — ATHANOR.docx", "decisão do usuário"],
    briefing:
      "Homens-cavalo das estepes, o Povo de [[Gorturk]], que crescem depressa e morrem de velhice por volta dos 30 anos. A vida breve os enche de uma fome por glória que nenhuma batalha sacia, e vivem da pilhagem, do trabalho mercenário e da captura de escravos sob o comando do [[Cavalga-mundos]]. Para eles, a magia é a maior das trapaças: a guerra se vence com força e braço, ou não se vence.",
    implications:
      "Sua força física é avassaladora, e centauros são contratados como mercenários em todo o continente, então em lugares como [[Laguardia]] ninguém estranha sua presença. Seu povo despreza os homens-galho como bichos de carga e presa de caça, e eles, com razão, o odeiam à primeira vista. Você abomina a magia, e usá-la seria a maior desonra diante do seu povo. Sua vida dura uns 30 anos e, se for fêmea, seu povo tentará protegê-la até que você prove pela força que não precisa.",
  },
  {
    id: "homens-do-deserto",
    name: "Homens do Deserto",
    image: IMAGES["species/homens-do-deserto"].src,
    source: ["Os homens do deserto.docx", "COMPÊNDIO DE APARÊNCIA E BIOLOGIA — ATHANOR.docx", "decisão do usuário"],
    briefing:
      "Gigantes de pelagem espessa, entre 2 e 2,5 metros, com traços de camelo: cílios duplos contra a areia, narinas que se fecham e uma corcova onde guardam água e alimento. O tamanho e a envergadura dão a seus golpes no combate marcial uma força poderosa. Vivem muito e nascem pouco, e quanto mais velhos, maiores a corcunda, o casco de tartaruga preso às costas e a sabedoria que lhes atribuem. Reclusos em oásis e [[Dojos]] escondidos, devotos de [[Logan]], estudam a magia pela matemática e quase nunca a usam.",
    implications:
      "Em qualquer canto do mundo você pode ser encontrado, pois todo jovem do seu povo sai em jornada, mas fora do deserto quase ninguém viu alguém como você, e sua presença atrai olhares e curiosidade. Seu povo trata a magia como tabu e a estuda como matemática: quando um dos seus conjura, é raro, preciso e quase sem custo. Os Dojos o ensinaram a lutar de forma limpa, defensiva e geométrica, e sua envergadura dá peso a cada golpe. A jornada sozinho pelo mundo para conquistar o primeiro casco é a tradição do seu povo.",
  },
  {
    id: "vampiros",
    name: "Vampiros",
    image: IMAGES["species/vampiros"].src,
    source: ["Vampiros de Athanor_ Regras e Fisiologia.docx", "decisão do usuário"],
    briefing:
      "Raríssimos, inteligentes, rápidos e sedutores, vivem misturados às sociedades sem que quase ninguém saiba que existem. Bebem energia vital pelo sangue e, bem alimentados, conjuram sem bateria, queimando as próprias reservas, mas quem se deixa enfraquecer demais desperta uma fome que não controla. Suas origens se perdem antes do [[Antigo Império]], em rituais com criaturas de outro mundo.",
    implications:
      "A maioria das pessoas nem conhece a ideia de um vampiro, e só em culturas remotas sobra uma lenda parecida, que quase ninguém conhece. Isso faz de você um mestre da persuasão e da infiltração, desde que ninguém repare que você foge do sol. Suas unhas metálicas são armas letais e servem para conjurar direto das mãos. O sol causa dano irreversível, e a prata que rompa sua pele e chegue ao sangue provoca [[Intoxicação por prata]], que o destrói por dentro.",
  },
];
