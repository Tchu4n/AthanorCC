import { IMAGES } from "./images.ts";
import type { OccupationData } from "./types.ts";

// Ofícios são livres para qualquer espécie.
export const occupations: OccupationData[] = [
  {
    id: "soldado",
    name: "Soldado",
    image: IMAGES["factions/up-soldado-regular"].src,
    source: ["Regras Globais do Cenário.docx", "União das Províncias (UP).docx", "Minor Powers.docx", "dedução"],
    briefing:
      "Soldados servem aos exércitos das nações de Athanor, cada um com seu estilo. Na [[UP]] usam capacetes morion com plumas e cajados padronizados, já que as armas de fogo são proibidas; em [[Midland]], capacetes com asas e espada reta. Em [[Highbridge]], o alto pagamento atrai os guerreiros mais gloriosos.",
    implications:
      "Você sabe marchar, obedecer e lutar em formação, e em qualquer lugar reconhecem um soldado pela postura. Seu uniforme abre portas no território de quem você serve e as fecha nas terras dos inimigos dele. Desertores, por outro lado, são caçados em quase toda parte.",
  },
  {
    id: "mago-ortodoxo",
    name: "Mago ortodoxo",
    image: IMAGES["factions/up-mago-alto"].src,
    source: ["O Sistema de Magia e a Engenharia dos Cajados em Athanor.docx", "União das Províncias (UP).docx", "decisão do usuário", "dedução"],
    briefing:
      "Conjurador que trata a magia como engenharia: drena energia de uma [[Bateria Vital]] e a dispara por um [[Cajado]] fincado no solo para o [[Aterramento]]. Pelos custos de pesquisa e materiais, a alta magia é reservada aos abastados, e o poder de um mago depende do seu orçamento. Na [[UP]], a prática é monopólio da elite e das forças militares.",
    implications:
      "Em combate você é artilharia: lento para preparar, fincar o cajado e mirar, mas letal quando o feitiço dispara. Cada feitiço custa vida, a da sua bateria ou a sua, e conjurar sem aterramento pode matá-lo. Seu poder depende do seu orçamento, e na [[UP]] conjurar sem pertencer à elite ou às forças militares é crime.",
  },
  {
    id: "bardo",
    name: "Bardo",
    source: ["Os Bardos de Athanor.docx", "dedução"],
    briefing:
      "Músico raro cujas melodias curam ferimentos e ampliam o vigor dos aliados, um dom que nenhum estudo ensina. Costuma viver como viajante e contador de histórias, acolhido com reverência por onde passa. Entre os [[Centauros]], há bardos que usam cantos guturais para fortalecer a horda.",
    implications:
      "Seu dom é raro e reconhecido: vilas e acampamentos o recebem com reverência e curiosidade, e sua chegada costuma afastar o desespero. Em combate, sua música cura ferimentos e fortalece você e seus aliados, sem bateria, cajado ou estudo. Ninguém sabe de onde vem esse poder, e há quem fale de uma divindade esquecida da música.",
  },
  {
    id: "monge-de-dojo",
    name: "Monge de dojo",
    image: IMAGES["misc/dojo-deserto"].src,
    source: ["Os homens do deserto.docx", "dedução"],
    briefing:
      "Membro dos [[Dojos]], onde contemplação filosófica, debate rigoroso e disciplina física são inseparáveis. A maioria é formada por lutadores formidáveis, com artes marciais geométricas, limpas e defensivas. Diferentes Dojos representam diferentes escolas de pensamento sobre [[Logan]].",
    implications:
      "Você luta com precisão geométrica: limpo, defensivo e difícil de acertar, sem desperdiçar um movimento. Fora do deserto, sua calma e seus debates intermináveis podem parecer frieza ou arrogância. A magia, para você, é tabu, e só numa emergência se recorre a ela, com a própria exaustão como preço.",
  },
  {
    id: "mercenario",
    name: "Mercenário",
    image: IMAGES["factions/mercenarios"].src,
    source: ["Minor Powers.docx", "Contexto basico de faccoes.docx", "O Sistema de Magia e a Engenharia dos Cajados em Athanor.docx", "Os centauros.docx", "dedução"],
    briefing:
      "Guerreiro de aluguel, contratado por senhores locais e mosteiros, e ofício de muitos [[Centauros]], que vivem em parte desse trabalho. Os mercenários de [[Laguardia]] são famosos por suas espadas montantes, pistolas de pederneira e capacetes sallet, e são figuras comuns em [[Blackwater]]. Muitos usam cajados de série, pesados e sujeitos a falhas.",
    implications:
      "Seu valor é o seu contrato: em [[Blackwater]], em [[Laguardia]] e em qualquer guerra, há sempre alguém disposto a pagar pela sua espada. Isso também significa que ninguém confia muito em você, porque quem luta por dinheiro pode mudar de lado. Mercenários centauros e laguardianos são os mais procurados do continente.",
  },
  {
    id: "contrabandista",
    name: "Contrabandista",
    source: ["Minor Powers.docx", "Subregioes.docx", "dedução"],
    briefing:
      "Contrabandistas movimentam bens ilegais pelo [[Mar do Arauto]], e [[Blackwater]] é o principal centro desse comércio. Na Baía dos Contrabandistas, a [[Companhia de Comércio do Mar do Arauto]] negocia na surdina, longe das regras de [[Laguardia]].",
    implications:
      "Você conhece rotas, portos e pessoas que não aparecem em nenhum mapa oficial, e sabe a quem pagar para uma carga passar. Para guardas e inspetores você é suspeito por natureza, e na [[UP]], onde armas de fogo são proibidas, uma única pistola na bagagem vira crime. Em [[Blackwater]], porém, você está em casa.",
  },
  {
    id: "cacador",
    name: "Caçador",
    source: ["Minor Powers.docx", "Os centauros.docx", "dedução"],
    briefing:
      "Caçadores sustentam povos de clima duro, como [[Vargarf]], que vive da caça de bestas, e [[Oakhaven]], que comercia peles de animais selvagens. Os [[Centauros]] também são caçadores letais.",
    implications:
      "Você sabe rastrear, sobreviver em terreno hostil e matar a distância, e isso vale ouro em terras de clima duro. Em [[Vargarf]] e [[Oakhaven]], caçar é sobreviver, e seu ofício é respeitado. Nas cidades o veem como rústico, mas ninguém quer ficar perdido no mato sem você.",
  },
  {
    id: "mago-dissidente",
    name: "Mago Dissidente",
    source: ["decisão do usuário", "União das Províncias (UP).docx", "dedução"],
    briefing:
      "Mago que segue os próprios estudos, fora das academias e das forças militares. Trabalha para si mesmo, sem servir a governos ou patronos. Costuma viver como andarilho, levando a pesquisa de um lugar a outro.",
    implications:
      "Sem patrono nem academia, você pesquisa por conta própria, o que o torna livre e vulnerável ao mesmo tempo. Na [[UP]], onde a magia é monopólio da elite, sua prática é crime, e em outras terras você recebe a desconfiança que se dá a qualquer conjurador sem dono. Em combate, como todo mago, você é artilharia, lento e letal, e seu cajado vale o que você conseguiu pagar por ele.",
  },
  {
    id: "medico",
    name: "Médico",
    source: ["decisão do usuário", "Panteao.docx", "Minor Powers.docx", "dedução"],
    briefing:
      "Estudioso do corpo que cura com bisturi, sutura e anatomia, e não com dons ou milagres. Formado nas universidades de [[Highbridge]] ou nas academias da [[UP]], costuma seguir [[Activum]], para quem só vale o que se pode medir. Os melhores são disputados pela [[Irmandade de São Ferdinand]], que depende de cirurgiões para os seus aprimoramentos.",
    implications:
      "Você salva vidas com as mãos e o conhecimento, e quase todo mundo um dia precisa de alguém como você. A [[Irmandade de São Ferdinand]] e exércitos de toda parte pagam bem por bons cirurgiões. Onde a fé fala mais alto, como na corte de [[Midland]], sua ciência à moda de Activum pode soar como heresia.",
  },
  {
    id: "alquimista",
    name: "Alquimista",
    source: ["decisão do usuário", "O Sistema de Magia e a Engenharia dos Cajados em Athanor.docx", "A origem do deserto de Marranol.docx", "dedução"],
    briefing:
      "Estudioso da transmutação e da combustão das substâncias, a base química por trás da magia ortodoxa. Prepara reagentes, ligas e fluidos de resfriamento sob encomenda para cada [[Cajado]], sem precisar conjurar nada. Os mais obstinados ainda caçam a [[Pedra filosofal]], perdida no deserto de [[Marranol]] desde a queda do seu mago tirano.",
    implications:
      "Você entende a química por trás da magia sem precisar conjurar, e magos de toda parte precisam dos seus reagentes, ligas e fluidos. Isso lhe dá clientes ricos e também inimigos, porque você conhece segredos que muitos gostariam de manter guardados. Onde a magia é suspeita, como entre os [[Homens do Deserto]] e os [[Centauros]], seu ofício desperta desconfiança.",
  },
  {
    id: "acolito",
    name: "Acólito",
    source: ["decisão do usuário", "Panteao.docx", "Minor Powers.docx", "dedução"],
    briefing:
      "Servo leigo de um templo ou mosteiro, que cuida dos ritos, das velas e dos arquivos enquanto aprende a fé por dentro. Os acólitos de [[Umbra]] sonham ser aceitos no [[Mosteiro de Itelonomeu]], de onde sai o [[Arauto]] da deusa, e os de [[Activum]] acendem as velas que simbolizam o progresso. Muitos servem a quem se diz Arauto, sem jamais ter certeza de que ele é verdadeiro.",
    implications:
      "Você conhece os ritos, os templos e quem os frequenta, e onde sua fé é forte isso lhe dá abrigo e respeito. Onde ela é minoria ou malvista, sua devoção à mostra pode virar alvo. Você serve, mas também observa: poucos sabem tanto dos bastidores de um templo quanto um acólito.",
  },
  {
    id: "astrologo",
    name: "Astrólogo",
    source: ["decisão do usuário", "Panteao.docx", "Subregioes.docx", "dedução"],
    briefing:
      "Leitor do céu que calcula, pelas fases da lua e pelo caminho do sol, o destino de reinos e pessoas. As cortes de [[Midland]] e de [[Sunfield]] pagam caro por mapas de nascimento e por datas propícias para casamentos e guerras, ligando a lua a [[Umbra]] e o sol a [[Gorturk]]. Os [[Dedutivos]] desprezam essas previsões e preferem a matemática pura.",
    implications:
      "Nobres pagam bem para saber o dia certo de casar, viajar ou guerrear, e um astrólogo de confiança tem acesso às cortes mais fechadas. Os racionalistas de [[Activum]] e os [[Dedutivos]] o tratam como charlatão. Se uma previsão falha com a pessoa errada, você vai precisar de uma boa explicação ou de um cavalo rápido.",
  },
  {
    id: "apotecario",
    name: "Apotecário",
    source: ["decisão do usuário", "Contexto basico de faccoes.docx", "Vampiros de Athanor_ Regras e Fisiologia.docx", "dedução"],
    briefing:
      "Preparador de remédios, unguentos, tinturas e venenos, que vende de tudo em balcões discretos. Em [[Blackwater]] e nos portos do [[Mar do Arauto]], muitos negociam substâncias proibidas com a [[Companhia de Comércio do Mar do Arauto]]. Alguns vendem pó de prata como amuleto contra criaturas da noite, sem saber que a superstição tem fundamento.",
    implications:
      "Quase todo mundo precisa de um remédio, e quase ninguém pergunta de onde ele veio, o que lhe dá clientes em todas as classes. Quem sabe fazer remédios sabe fazer venenos, e essa fama o acompanha. Em portos como os de [[Blackwater]] você encontra os ingredientes raros, e também quem os quer para fins piores.",
  },
  {
    id: "ferreiro",
    name: "Ferreiro",
    source: ["decisão do usuário", "O Sistema de Magia e a Engenharia dos Cajados em Athanor.docx", "dedução"],
    briefing:
      "Artesão do metal, das armas e das ferramentas, presente em toda vila de Athanor. Os ferreiros de [[Laguardia]], sede das maiores forjas do mundo, fundem os chassis dos cajados e lapidam lentes sob contratos de sigilo, sem entender a magia que ajudam a criar. Fora dali, martelam os cajados de série da [[Magia de Trincheira]], pesados e cheios de falhas.",
    implications:
      "Toda vila precisa de um ferreiro, e você nunca fica sem trabalho nem sem respeito. Se aprendeu em [[Laguardia]], sabe forjar peças de cajado sob sigilo, e os magos pagam bem pela sua habilidade e pelo seu silêncio. Seus braços fortes e seu martelo também servem quando a conversa acaba em briga.",
  },
  {
    id: "paladino",
    name: "Paladino",
    source: ["decisão do usuário", "Panteao.docx", "Minor Powers.docx", "dedução"],
    briefing:
      "Guerreiro consagrado a um deus, que luta em nome da fé e se vê como o braço armado dela. Os paladinos de [[Umbra]] guardam mosteiros e ritos em [[Midland]]; os de [[Activum]] costumam acabar na [[Irmandade de São Ferdinand]], aceitando mutações para conter [[Crick]]. Todos sonham ser escolhidos como [[Arauto]], e poucos admitem que isso talvez nunca aconteça.",
    implications:
      "Você luta em nome de um deus, e isso lhe dá abrigo e respeito onde sua fé domina. Onde ela é rival, você é visto como um fanático armado, e sua presença pode ser entendida como provocação. A fé lhe dá convicção em combate, mas também inimigos que você nunca escolheu.",
  },
  {
    id: "cacador-de-monstros",
    name: "Caçador de monstros",
    source: ["decisão do usuário", "Vampiros de Athanor_ Regras e Fisiologia.docx", "Regras Globais do Cenário.docx", "dedução"],
    briefing:
      "Especialista em abater o que não deveria existir: as abominações mutantes de [[Crick]] e, para quem acredita, os [[Vampiros]]. Carrega lâminas e balas de prata, já que a [[Intoxicação por prata]] é a única arma garantida contra os sugadores. Vive de recompensas pagas por vilas desesperadas, que ainda lembram da [[Noite Maldita]].",
    implications:
      "Vilas assombradas por [[Crick]] ou por medos sem nome pagam bem por quem resolve o problema, mesmo que olhem torto para você depois. Como quase ninguém acredita em vampiros, quem fala deles parece louco, então seu ofício exige discrição. Lâminas e balas de prata são seu equipamento mais caro e mais precioso.",
  },
  {
    id: "detetive",
    name: "Detetive",
    source: ["decisão do usuário", "Subregioes.docx", "Minor Powers.docx", "dedução"],
    briefing:
      "Investigador que apura crimes, dívidas e segredos por contrato. Os melhores trabalham para a Agência de [[Highbridge]], que registra cada cliente e cada devedor do continente; os demais vendem a mesma habilidade a nobres ciumentos, guildas e famílias de [[Laguardia]]. A regra do ofício é simples: toda informação tem um comprador.",
    implications:
      "Você sabe fazer perguntas, ler pessoas e encontrar o que foi escondido, e quem tem segredos o trata com cautela. Seu trabalho abre as portas de nobres, guildas e bancos, desde que você saiba guardar o que descobre. Em combate, sua melhor arma é chegar antes, já sabendo de tudo.",
  },
  {
    id: "nobre",
    name: "Nobre",
    source: ["decisão do usuário", "Subregioes.docx", "Contexto basico de faccoes.docx", "Minor Powers.docx", "dedução"],
    briefing:
      "Herdeiro de título e terras, que vive de rendas, vassalos e favores da corte. Em [[Midland]] e [[Sunfield]], disputa influência em bailes, festivais de cavalaria e intrigas entre vassalos; em [[Laguardia]], divide o poder com as guildas de artesãos e industriais. Muitos estudam nas universidades de [[Highbridge]], o que ajuda a manter o grão-ducado longe das guerras.",
    implications:
      "Seu título abre portas, salões e bolsas, e muita gente se curva antes mesmo de saber seu nome. Ele também atrai inimigos, invejosos e pedintes, e cada palavra sua é observada e lembrada. Longe das suas terras, o nome ainda pesa, mas vale bem menos, e um nobre sem escolta é alvo fácil.",
  },
  {
    id: "filosofo",
    name: "Filósofo",
    source: ["decisão do usuário", "Panteao.docx", "Subregioes.docx", "A Seita do Deus Oculto (Os Dedutivos).docx", "dedução"],
    briefing:
      "Pensador que discute a natureza da realidade, da moral e dos deuses. Nas cortes de [[Midland]], debate teologia sob a vigilância de [[Umbra]]; nas universidades de [[Highbridge]], disputa alunos com os seguidores de [[Activum]], para quem só existe o que se pode medir. Os mais radicais acabam entre os [[Dedutivos]], à espera do [[Deus Oculto]] entre debates e equações.",
    implications:
      "Você argumenta, questiona e conhece as grandes ideias sobre os deuses e o mundo, o que impressiona nas cortes e universidades. Onde a obediência vale mais que a dúvida, como na corte de [[Midland]], perguntas demais podem soar como heresia. Em combate, sua arma costuma ser a palavra, e às vezes ela basta.",
  },
  {
    id: "cientista",
    name: "Cientista",
    source: ["decisão do usuário", "Panteao.docx", "Minor Powers.docx", "O Sistema de Magia e a Engenharia dos Cajados em Athanor.docx", "dedução"],
    briefing:
      "Estudioso que mede, testa e registra tudo, fiel ao método científico de [[Activum]]. Trabalha nas universidades de [[Highbridge]], nos laboratórios arcanos do governo da [[UP]] ou para a [[Irmandade de São Ferdinand]], que financia pesquisas em mutação e aprimoramento. Para muitos deles, a magia é só engenharia que ainda não foi totalmente calculada.",
    implications:
      "Você mede, testa e registra, e isso o torna valioso para universidades, governos e para a [[Irmandade de São Ferdinand]]. Onde a tradição manda, como na corte de [[Midland]], seu método pode soar como afronta aos deuses. Entre povos que veem a magia como trapaça, como os [[Centauros]], seu interesse pelos mecanismos arcanos é malvisto.",
  },
];
