import type { GlossaryData } from "./types.ts";

export const glossary: GlossaryData[] = [
  // eventos
  {
    id: "noite-maldita", term: "Noite Maldita", category: "evento",
    source: ["A noite maldita.docx", "decisão do usuário"],
    briefing: "Tragédia em que o príncipe de [[Crick]] traçou um círculo mágico ao redor da cidade de Southgarden e transformou todos os seus habitantes em alimento para a colmeia. O episódio alertou o mundo para os perigos da magia e serviu de pretexto para proibir a magia ao povo da [[UP]], deixando-a só para a elite.",
  },

  // povos
  {
    id: "homens-galho", term: "Homens-Galho", category: "povo",
    source: ["Raça_ Homens-Galho.docx"],
    briefing: "Insetos humanoides que vivem em colmeias subterrâneas controladas por [[feromônios]]. Formam as nações de [[Kruk]] e [[Crick]].",
  },
  {
    id: "centauros", term: "Centauros", category: "povo", aliases: ["Centauro"],
    source: ["Os centauros.docx", "Regras Globais do Cenário.docx"],
    briefing: "Homens-cavalo das estepes que vivem cerca de 30 anos e formam o [[Império das Estepes]]. Abominam a magia e vivem de pilhagem e captura de escravos.",
  },
  {
    id: "homens-do-deserto", term: "Homens do Deserto", category: "povo",
    source: ["Os homens do deserto.docx"],
    briefing: "Humanoides de grande porte semelhantes a camelos, de vida longa e nascimentos raros. Vivem reclusos em torno dos [[Dojos]], devotos de [[Logan]].",
  },
  {
    id: "vampiro", term: "Vampiro", category: "povo", aliases: ["Vampiros"],
    source: ["Vampiros de Athanor_ Regras e Fisiologia.docx"],
    briefing: "Ser raro que se alimenta de energia vital por meio de sangue e vive escondido entre as sociedades. Pode conjurar magia queimando as próprias reservas, mas sofre com a luz do sol e a [[Intoxicação por prata]].",
  },

  // facções
  {
    id: "irmandade-de-sao-ferdinand", term: "Irmandade de São Ferdinand", category: "facção",
    source: ["Contexto basico de faccoes.docx"],
    briefing: "Ordem inspirada em São Ferdinand, guerreiro santo de [[Activum]] que teria ganhado dois braços extras e lutado com quatro espadas. Seus guerreiros usam aprimoramentos genéticos e mutações para conter [[Crick]]. Operam a partir de fortes ao redor desse território e governam a região por uma junta militar.",
  },
  {
    id: "companhia-de-comercio", term: "Companhia de Comércio do Mar do Arauto", category: "facção",
    source: ["Contexto basico de faccoes.docx"],
    briefing: "Potência mercantil dona das cidades de Bonita e Belladona, que comercia por mar com todas as nações. Especialista em navegação no gelo, faz a ponte comercial entre os [[Centauros]] e a [[UP]].",
  },
  {
    id: "mosteiro-de-itelonomeu", term: "Mosteiro de Itelonomeu", category: "facção",
    source: ["Contexto basico de faccoes.docx"],
    briefing: "Poder regional feudal no topo de uma montanha, administrado por monges devotos de [[Umbra]] e fechado a visitantes. Segundo a lenda, o [[Arauto]] de Umbra é sempre escolhido entre seus monges.",
  },
  {
    id: "dedutivos", term: "Dedutivos", category: "facção",
    source: ["A Seita do Deus Oculto (Os Dedutivos).docx"],
    briefing: "Seita radical e ascética nascida de remanescentes do culto a [[Logan]], que aguarda o [[Deus Oculto]]. Vivem em mosteiros e dojos restritos, dedicados ao debate, à matemática e à purificação mental.",
  },

  // nações e lugares
  {
    id: "up", term: "UP", category: "lugar", aliases: ["União das Províncias"],
    source: ["União das Províncias (UP).docx", "Regras Globais do Cenário.docx"],
    briefing: "Democracia representativa num arquipélago, nascida da revolução que derrubou o [[Antigo Império]]. Tem [[Umbra]] e [[Activum]] como religiões oficiais, a magia é monopólio da elite e as armas de fogo são proibidas.",
  },
  {
    id: "antigo-imperio", term: "Antigo Império", category: "lugar",
    source: ["União das Províncias (UP).docx", "Contexto basico de faccoes.docx", "Minor Powers.docx"],
    briefing: "Império derrubado pela revolução que fundou a [[UP]], cuja queda [[Laguardia]] sobreviveu. Sua infraestrutura ainda existe, como as pontes intactas de [[Highbridge]].",
  },
  {
    id: "protetorado-de-morrow", term: "Protetorado de Morrow", category: "lugar", aliases: ["Morrow"],
    source: ["Minor Powers.docx"],
    briefing: "Estado fantoche da [[UP]], miserável e marcado por uma guerra civil. Serve de barreira contra as invasões de [[Vargarf]].",
  },
  {
    id: "vargarf", term: "Vargarf", category: "lugar", aliases: ["Chiefdom de Vargarf"],
    source: ["Minor Powers.docx"],
    briefing: "Chiefdom tribal regido pela lei do mais forte, que vive de saque marítimo, caça e pesca gélida. Faz incursões violentas no [[Protetorado de Morrow]] sempre que há fome ou crise.",
  },
  {
    id: "oakhaven", term: "Oakhaven", category: "lugar",
    source: ["Minor Powers.docx"],
    briefing: "Povo isolacionista e endurecido pelo clima, que comercia peles e madeira com reinos humanos. Troca por minérios com [[Kruk]], sendo intermediário tolerado pelos insetoides.",
  },
  {
    id: "sunfield", term: "Sunfield", category: "lugar", aliases: ["Planícies de Sunfield"],
    source: ["Minor Powers.docx"],
    briefing: "Feudo agrícola rico, dividido em 11 regiões e marcado por intrigas políticas entre vassalos. É famoso por seus festivais de cavalaria e por cavaleiros que lembram hussardos alados.",
  },
  {
    id: "midland", term: "Midland", category: "lugar",
    source: ["Minor Powers.docx"],
    briefing: "Monarquia aristocrática que vive de pecuária e madeira, influenciada pelos dogmas de [[Umbra]]. Financia a [[Irmandade de São Ferdinand]], o que gera tensão com os nobres tradicionalistas.",
  },
  {
    id: "blackwater", term: "Blackwater", category: "lugar",
    source: ["Minor Powers.docx"],
    briefing: "Território perigoso e militarizado, centro do contrabando pelo [[Mar do Arauto]]. É o mercado negro onde a pólvora de [[Laguardia]] e a [[Magia de Trincheira]] da [[UP]] se enfrentam.",
  },
  {
    id: "highbridge", term: "Highbridge", category: "lugar", aliases: ["Grão-Ducado de Highbridge"],
    source: ["Minor Powers.docx"],
    briefing: "Grão-ducado neutro de banqueiros e embaixadores, que lucra com pedágios sobre as pontes intactas do [[Antigo Império]]. Abriga as principais universidades do continente, e ninguém o ataca porque isso arruinaria o comércio de todos.",
  },
  {
    id: "laguardia", term: "Laguardia", category: "lugar", aliases: ["Reino de Laguardia"],
    source: ["Contexto basico de faccoes.docx", "O Sistema de Magia e a Engenharia dos Cajados em Athanor.docx"],
    briefing: "Monarquia estável em região vulcânica, pioneira na pólvora e sede das maiores forjas do mundo. É famosa por seus mercenários e forja cajados sob contratos de sigilo absoluto.",
  },
  {
    id: "kruk", term: "Kruk", category: "lugar", aliases: ["Reino de Kruk", "Nação de Kruk"],
    source: ["Raça_ Homens-Galho.docx", "COMPÊNDIO DE APARÊNCIA E BIOLOGIA — ATHANOR.docx"],
    briefing: "Maior e mais estável nação dos [[Homens-Galho]], devota de [[Mui]] e governada por uma rainha. Os reinos humanos a chamam de reino fronteiriço.",
  },
  {
    id: "crick", term: "Crick", category: "lugar", aliases: ["Reino de Crick"],
    source: ["Raça_ Homens-Galho.docx", "COMPÊNDIO DE APARÊNCIA E BIOLOGIA — ATHANOR.docx"],
    briefing: "Reino rebelde de [[Homens-Galho]], devoto de [[Tamem]], fundado por um príncipe que sequestrou as princesas de [[Kruk]]. As nações humanas chamam seu povo de Horda de Southgarden, ou simplesmente a Horda.",
  },
  {
    id: "imperio-das-estepes", term: "Império das Estepes", category: "lugar",
    source: ["Regras Globais do Cenário.docx", "Os centauros.docx"],
    briefing: "Império nômade dos [[Centauros]], guiado por [[Gorturk]]. É liderado há mais de 200 anos por [[Ayalaal]], o Cavalga-mundos.",
  },
  {
    id: "mannaka-oko", term: "Man'naka oko", category: "lugar", aliases: ["Mannaka oko"],
    source: ["A terra de Man_naka oko.docx"],
    briefing: "Terra distante e isolada, hoje um deserto de sucata onde vigora a lei do mais forte. Sua lenda fundadora é a de Susanoo, e dela vem a maldição do [[Terceiro Olho]].",
  },
  {
    id: "marranol", term: "Marranol", category: "lugar",
    source: ["A origem do deserto de Marranol.docx"],
    briefing: "Antigo país fértil governado por um mago tirano, que o destruiu ao liberar energia descomunal tentando criar a [[Pedra filosofal]]. Hoje é um deserto com uma área central radioativa, habitado pelos homens-camelo.",
  },
  {
    id: "mahabam", term: "Mahabam", category: "lugar",
    source: ["Os homens do deserto.docx"],
    briefing: "Cidade-estado dos [[Homens do Deserto]] que serve de parada para viajantes, peregrinos e comerciantes. Seus moradores não rejeitam estrangeiros, apenas os tratam com cuidado.",
  },
  {
    id: "ironmud", term: "Ironmud", category: "lugar",
    source: ["Subregioes.docx", "União das Províncias (UP).docx"],
    briefing: "Pântano central do [[Protetorado de Morrow]] e núcleo administrativo da burocracia imposta pela [[UP]]. O estreito de Ironmud, que separa a ilha principal da UP do continente, é o ponto mais vulnerável da União.",
  },
  {
    id: "shatterfjords", term: "Shatterfjords", category: "lugar", aliases: ["Fiordes Cortantes"],
    source: ["Subregioes.docx"],
    briefing: "Os Fiordes Cortantes, a região mais fria e isolada de [[Vargarf]]. É onde vivem as tribos mais duras.",
  },
  {
    id: "rio-rhenus", term: "Rio Rhenus", category: "lugar",
    source: ["Minor Powers.docx", "Subregioes.docx"],
    briefing: "Rio pelo qual [[Sunfield]] exporta seus grãos, protegido pelo exército do feudo. Perto de sua saída fica Grip, em [[Blackwater]], onde facções cobram taxas extorsivas.",
  },
  {
    id: "mar-do-arauto", term: "Mar do Arauto", category: "lugar",
    source: ["Contexto basico de faccoes.docx", "Minor Powers.docx"],
    briefing: "Mar navegado pela [[Companhia de Comércio do Mar do Arauto]] e rota central do contrabando de [[Blackwater]]. Em ilhas desconhecidas desse mar vive o Povo do Mar, que atormenta os marinheiros.",
  },

  // religião
  {
    id: "arauto", term: "Arauto", category: "religião",
    source: ["Panteao.docx", "Regras Globais do Cenário.docx"],
    briefing: "Mortal escolhido por um deus para executar sua vontade, recebendo poderes, favores ou autoridade divina. Na maioria das vezes, não se pode dizer com certeza se um arauto é verdadeiro.",
  },
  {
    id: "ayalaal", term: "Ayalaal", category: "religião", aliases: ["Cavalga-mundos"],
    source: ["Os centauros.docx", "Regras Globais do Cenário.docx"],
    briefing: "Arauto de [[Gorturk]] e líder sagrado dos [[Centauros]], conhecido pelo título de Cavalga-mundos. Lidera o império há pelo menos 200 anos, embora um centauro comum viva apenas 30.",
  },
  {
    id: "dojo", term: "Dojo", category: "religião", aliases: ["Dojos"],
    source: ["Os homens do deserto.docx"],
    briefing: "Recinto central da vida religiosa e intelectual dos [[Homens do Deserto]], que une contemplação filosófica, debate e artes marciais. Cada dojo representa uma escola de pensamento sobre [[Logan]].",
  },
  {
    id: "logan", term: "Logan", category: "religião",
    source: ["Panteao.docx", "Regras Globais do Cenário.docx"],
    briefing: "Deus da ordem absoluta e das regras não escritas, cujo símbolo é uma espiral. Seu culto está em decadência e sobrevive sobretudo entre os [[Homens do Deserto]].",
  },
  {
    id: "umbra", term: "Umbra", category: "religião",
    source: ["Panteao.docx", "Regras Globais do Cenário.docx"],
    briefing: "Deusa do equilíbrio, da convergência e da lua. Prega hierarquia, tradição e ritos ancestrais.",
  },
  {
    id: "activum", term: "Activum", category: "religião",
    source: ["Panteao.docx", "Regras Globais do Cenário.docx"],
    briefing: "Deus do conhecimento, dos sentidos e do progresso, cujo símbolo é uma vela. Valoriza a eficiência e o método científico acima de tudo.",
  },
  {
    id: "mui", term: "Mui", category: "religião",
    source: ["Panteao.docx", "Regras Globais do Cenário.docx"],
    briefing: "Deus do bem-comum, do coletivo e do propósito, regente de [[Kruk]]. Prega o fim da individualidade em favor do coletivo.",
  },
  {
    id: "gorturk", term: "Gorturk", category: "religião",
    source: ["Panteao.docx", "Regras Globais do Cenário.docx"],
    briefing: "Deus do destino, do sol e das estepes, regente do [[Império das Estepes]]. Prega a expansão eterna e a supremacia da força bruta.",
  },
  {
    id: "tamem", term: "Tamem", category: "religião",
    source: ["Panteao.docx", "Regras Globais do Cenário.docx"],
    briefing: "Deus da vingança, da força, da guerra e do fogo, regente de [[Crick]]. Prega que só os mais fortes têm direito de existir.",
  },
  {
    id: "nilos", term: "Nilos", category: "religião",
    source: ["Panteao.docx", "Regras Globais do Cenário.docx"],
    briefing: "Deus do caos para os críticos e dos milagres e perdas para os fiéis. Seus seguidores não têm nação e agem infiltrados em todas as sociedades como agentes do colapso.",
  },
  {
    id: "deus-oculto", term: "Deus Oculto", category: "religião",
    source: ["A Seita do Deus Oculto (Os Dedutivos).docx"],
    briefing: "Arquétipo supremo, a Forma das Formas, que segundo os [[Dedutivos]] ainda não despertou. Eles veem todos os outros deuses como falsas divindades.",
  },

  // magia e objetos
  {
    id: "cajado", term: "Cajado", category: "magia",
    source: ["O Sistema de Magia e a Engenharia dos Cajados em Athanor.docx"],
    briefing: "Motor térmico e lente de foco do mago, que leva a energia da bateria até um concentrador no topo. Precisa ser fincado no solo para o [[Aterramento]], e sua qualidade vai de modelos de série baratos a ligas de ouro caríssimas.",
  },
  {
    id: "aterramento", term: "Aterramento", category: "magia",
    source: ["O Sistema de Magia e a Engenharia dos Cajados em Athanor.docx"],
    briefing: "Etapa obrigatória da conjuração ortodoxa, em que o [[Cajado]] é fincado no solo para fechar o circuito. Conjurar sem aterramento faz o coice energético voltar ao usuário, podendo derreter o equipamento e matar o mago.",
  },
  {
    id: "bateria-vital", term: "Bateria Vital", category: "magia",
    source: ["O Sistema de Magia e a Engenharia dos Cajados em Athanor.docx"],
    briefing: "Fonte de energia vital sacrificada para alimentar a magia ortodoxa. O modelo padrão da [[UP]] usa pequenas gaiolas com animais vivos, como coelhos, presas ao cinto do mago.",
  },
  {
    id: "gaiola-de-bateria", term: "Gaiola de bateria", category: "magia",
    source: ["COMPÊNDIO DE APARÊNCIA E BIOLOGIA — ATHANOR.docx", "O Sistema de Magia e a Engenharia dos Cajados em Athanor.docx"],
    briefing: "Pequena gaiola de metal com animais vivos, normalmente coelhos, presa ao cinto dos conjuradores da [[UP]]. Os animais servem de [[Bateria Vital]] para alimentar os feitiços.",
  },
  {
    id: "efeito-spray", term: "Efeito Spray", category: "magia",
    source: ["O Sistema de Magia e a Engenharia dos Cajados em Athanor.docx"],
    briefing: "Falha de um [[Cajado]] com o cristal focador danificado, em que o feitiço sai como um cone de energia difusa. A magia perde potência, alcance e direção, e pode até sair imprevisível.",
  },
  {
    id: "magia-de-trincheira", term: "Magia de Trincheira", category: "magia", aliases: ["Magia de Garagem"],
    source: ["O Sistema de Magia e a Engenharia dos Cajados em Athanor.docx"],
    briefing: "Magia feita com cajados de série de ferro ou aço bruto, usados por mercenários, policiais e renegados. São pesados, superaquecem e enferrujam, e sob chuva podem falhar no [[Aterramento]] e ameaçar o usuário.",
  },
  {
    id: "pedra-filosofal", term: "Pedra filosofal", category: "magia",
    source: ["A origem do deserto de Marranol.docx"],
    briefing: "Artefato que permitiria o uso indefinido de magia, buscado pelo mago tirano de [[Marranol]]. Ninguém sabe se ele teve sucesso; se teve, a pedra está inerte na terra radioativa do deserto.",
  },
  {
    id: "bardo", term: "Bardo", category: "magia",
    source: ["Os Bardos de Athanor.docx"],
    briefing: "Músico raro cujas melodias curam ferimentos e fortalecem aliados, um dom que não vem de estudo. A origem desse poder é um mistério, atribuído por muitos a uma divindade esquecida da música.",
  },

  // biologia
  {
    id: "feromonio", term: "Feromônio", category: "biologia", aliases: ["feromônios"],
    source: ["Raça_ Homens-Galho.docx"],
    briefing: "Substância química emitida pela rainha que mantém a colmeia dos [[Homens-Galho]] unida e obediente. Quem fica muito tempo longe dela pode ganhar livre-arbítrio e cair na insanidade.",
  },
  {
    id: "terceiro-olho", term: "Terceiro Olho", category: "biologia",
    source: ["A terra de Man_naka oko.docx"],
    briefing: "Fenda na testa aberta pela entidade da lenda de Susanoo no herdeiro que a matou, e herdada por sua linhagem em [[Man'naka oko]]. Quando aberto, revela almas, espíritos e rastros de magia, mas causa fadiga física.",
  },
  {
    id: "intoxicacao-por-prata", term: "Intoxicação por prata", category: "biologia",
    source: ["Vampiros de Athanor_ Regras e Fisiologia.docx"],
    briefing: "Vulnerabilidade dos [[Vampiros]] à prata que rompe a pele e chega à corrente sanguínea; o simples contato é inofensivo. No sangue, a prata entra em combustão com o estoque de energia vital e destrói a rede vascular.",
  },
];
