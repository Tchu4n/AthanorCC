// Textos da apuração da Agência de Inteligência e Detetives de Highbridge (tela final e PDF).
// A agência é sigilosa e não está na lore; os fatos citados vêm dos briefings de species.ts, regions.ts e
// occupations.ts. O texto é montado na ordem espécie, subespécie, origem, andarilho e ofício.
// scripts/validate-data.ts exige um texto para cada espécie, região e ofício.
// {masculino|feminino}: palavras que concordam com o sexo do personagem (lib/ficha.ts, flexiona).

export const APURACAO_ESPECIE: Record<string, string> = {
  humano:
    "{Humano|Humana}: a espécie mais comum nas filas da Ponte Matriz e, por isso mesmo, a mais difícil de vigiar, porque some na multidão com facilidade.",
  "homens-galho":
    "Homem-Galho: corpo quitinoso, regeneração rápida e, longe dos feromônios da rainha, risco real de livre-arbítrio e insanidade. Insetoides que deixam a colmeia raramente o fazem por bons motivos.",
  centauros:
    "{Centauro|Centaura} do Povo de Gorturk: vive pouco, por volta de trinta anos, e quer glória antes do fim. Pilhagem, trabalho mercenário e captura de escravos estão no sangue; magia, jamais.",
  "homens-do-deserto":
    "Homem do Deserto: gigante de corcova e casco, longevo e de nascimento raro, devoto de Logan e desconfiado da magia. {Vê-lo|Vê-la} tão longe dos Dojos já é, por si só, um dado relevante.",
  vampiros:
    "{Vampiro|Vampira}. A existência desses seres é quase desconhecida fora destes arquivos, e assim deve continuar. Alimenta-se de energia vital, conjura sem bateria e teme o sol e a prata; discrição máxima exigida dos agentes.",
};

// Complementa a espécie; subespécies sem texto ficam só com o da espécie.
export const APURACAO_SUBESPECIE: Record<string, string> = {
  "humano-comum": "Não tem traço algum que chame atenção, o que, para esta Agência, já é motivo de atenção.",
  "elite-orelhas-pontudas":
    "Pertence à elite de orelhas pontudas da UP: gente de berço, que costuma ter conta aberta no Quarteirão Dourado e amigos demais na Ala das Embaixadas.",
  "mutante-sao-ferdinand":
    "Carrega as mutações da Irmandade de São Ferdinand. Highbridge financia a Irmandade para manter Crick longe das pontes, mas um transumanista armado dentro dos nossos muros é outra conversa.",
  principe:
    "É um príncipe, e príncipes ficam resistentes aos feromônios com a idade: exatamente o tipo que funda reinos rebeldes. Foi assim que Crick nasceu.",
  princesa:
    "É uma princesa, recurso estratégico cobiçado por todas as nações vizinhas. Onde ela estiver, haverá quem tente sequestrá-la ou comprá-la.",
  trabalhador:
    "É um trabalhador, sem individualidade sob os feromônios e cobiçado como escravo perfeito. Se age por conta própria, algo na colmeia já se rompeu.",
};

export const APURACAO_ORIGEM: Record<string, string> = {
  "protetorado-de-morrow":
    "Vem do Protetorado de Morrow, estado fantoche da UP e barreira de carne contra Vargarf. Gente durona e ressentida, acostumada a pedir permissão para tudo, menos para guardar rancor.",
  "chiefdom-de-vargarf":
    "Vem do Chiefdom de Vargarf, onde vale a lei do mais forte. Quando há fome, as tribos descem em incursões; convém saber se {este|esta} veio {sozinho|sozinha} ou na frente de uma horda.",
  oakhaven:
    "Vem de Oakhaven: {taciturno|taciturna}, {endurecido|endurecida} pelo frio, de lança e cães. Os de lá são intermediários tolerados pelos insetoides de Kruk, o que faz {deste|desta} uma fonte valiosa, ou um canal perigoso.",
  "planicies-de-sunfield":
    "Vem das Planícies de Sunfield, ninho de cobras entre vassalos e castelões, onde a paranoia de espionagem é regra. Quem sobrevive lá sabe guardar segredos, e vendê-los.",
  midland:
    "Vem de Midland, monarquia em ascensão dividida entre os dogmas de Umbra e o dinheiro que financia a Irmandade de São Ferdinand. Qualquer súdito de Midland pode ser peça desse tabuleiro.",
  blackwater:
    "Vem de Blackwater, onde a lei quase não se aplica e a pólvora de Laguardia enfrenta a Magia de Trincheira da UP. Quem sai vivo de lá aprendeu a atirar primeiro.",
  "grao-ducado-de-highbridge":
    "É cria de Highbridge: conhece as pontes, as taxas e as portas dos fundos do Quarteirão Dourado. Por isso mesmo, merece o dobro de atenção.",
  "uniao-das-provincias":
    "Vem da União das Províncias, onde a magia é monopólio da elite, as armas de fogo são proibidas e a escravidão é lei. {Cidadão|Cidadã} ou {fugitivo|fugitiva}, traz consigo as dívidas e os rancores da UP.",
  "reino-de-laguardia":
    "Vem do Reino de Laguardia, terra vulcânica das forjas, da pólvora e dos mercenários mais famosos do continente. Laguardia exporta armas e gente que sabe usá-las.",
  "reino-de-kruk":
    "Vem de Kruk, o Reino Fronteiriço, onde a rainha é Arauto de Mui e príncipes envelhecidos são expurgados. Quem deixa Kruk fugiu do expurgo ou foi enviado; as duas hipóteses interessam à Agência.",
  "reino-de-crick":
    "Vem de Crick, a Horda de Southgarden, devota de Tamem e responsável pela Noite Maldita. Highbridge paga caro à Irmandade justamente para que gente de Crick não chegue às pontes, e {este|esta} chegou.",
  "irmandade-de-sao-ferdinand":
    "Vem das terras da Irmandade de São Ferdinand, onde a lei é a da junta militar. Pode ter servido nos fortes ou só pagado os impostos deles; nos dois casos, já viu de perto o que a horda de Crick faz, e o que a Irmandade faz para detê-la.",
  "companhia-de-comercio":
    "Vem da Companhia de Comércio do Mar do Arauto, que comercia com todas as nações e liga centauros e UP. Highbridge cobra pedágio de todo comércio; a Companhia é quem o transporta, e as duas se entendem melhor do que admitem.",
  "imperio-das-estepes":
    "Vem do Império das Estepes, a horda de Ayalaal, o Cavalga-mundos, onde pilhagem, extorsão e captura de escravos são ofício nacional. Convém contar as moedas depois que {ele|ela} sai.",
  "reclusos-do-deserto":
    "Vem dos oásis escondidos de Marranol, entre juízes da lei, anciãos e Dojos devotos de Logan. Comunidades reclusas raramente mandam alguém para fora sem motivo.",
  "mannaka-oko":
    "Vem de Man'naka oko, deserto de sucata governado pelos shoguns e pela lei do mais forte. A Companhia de Comércio do Mar do Arauto compra a sucata ancestral de lá; a Agência quer saber o que mais veio no porão.",
};

// Complementa a origem; o andarilho, que não tem subregião, usa APURACAO_ANDARILHO.
export const APURACAO_SUBREGIAO: Record<string, string> = {
  // Protetorado de Morrow
  ironmud: "Cresceu entre os escritórios de Ironmud, onde a burocracia fantoche da UP carimba tudo e não resolve nada; sabe que um formulário pode ser uma arma.",
  "costa-afogada": "É da Costa Afogada, onde se vive da pesca e se morre nos ataques navais de Vargarf; não espera que ninguém venha {salvá-lo|salvá-la}.",
  lamacal: "Vem do Lamaçal, campo de batalha da guerra civil não declarada, onde se luta por migalhas e ruínas; já viu coisa bem pior do que esta Agência.",
  "fosso-norte": "Vem do Fosso Norte, a trincheira mais lamacenta do protetorado; quem segurou as incursões de Vargarf ali não se assusta fácil.",
  // Companhia de Comércio
  bonita: "Cresceu em Bonita, cidade da Companhia na ilha de La Luna, onde navios de toda bandeira atracam e ninguém pergunta o que está no porão.",
  belladona: "Vem de Belladona, a outra cidade mercantil da Companhia, entreposto da Companhia numa ilha distante, ao sul das estepes, onde descansam os navios das longas viagens; o que mais acontece ali a Agência ainda investiga.",
  // Chiefdom de Vargarf
  "baia-da-boa-viagem": "Saiu da Baía da Boa Viagem, de onde partem os navios longos dos saques; convém verificar se veio a passeio ou como batedor.",
  "fiordes-cortantes": "Vem dos Fiordes Cortantes, onde vivem as tribos mais duras do continente; o inverno de Highbridge, para {ele|ela}, é primavera.",
  // Oakhaven
  "posto-das-peles": "Vem do Posto das Peles, o entreposto do degelo; sabe barganhar e conhece pelo nome cada comerciante do sul.",
  "fronteira-cinzenta": "Vem da Fronteira Cinzenta, colada em Kruk, onde mercadores rústicos tratam com príncipes formigoides; entende de feromônios mais do que muito diplomata.",
  "floresta-do-uivo": "Vem da Floresta do Uivo, de onde sai a madeira de Oakhaven; anda em silêncio e escuta o que os outros não escutam.",
  // Planícies de Sunfield
  valdourado: "Vem de Valdourado, onde a tributação dos camponeses é recolhida; sabe quanto vale cada saco de grão, e quem desviou o último.",
  justa: "Vem da Justa, terra dos festivais de cavalaria; gosta de plateia, o que facilita muito o trabalho dos nossos agentes.",
  silvernest: "Vem de Silvernest, o ninho de cobras dos bailes e da espionagem interna; presume-se que tenha mentido em pelo menos metade do que declarou.",
  rivermark: "Vem de Rivermark, às margens do Rio Rhenus, onde as cheias obedecem a quem manda; aprendeu cedo que até a água segue o dinheiro.",
  kingswheat: "Vem de Kingswheat, o celeiro que exporta trigo para meio continente; quem controla o pão controla a paciência de um reino.",
  highmeadow: "Vem dos pastos elevados de Highmeadow, onde a agricultura é cara e delicada; tem gosto refinado e a paciência de quem espera a colheita.",
  southmarch: "Vem de Southmarch, a fronteira militarizada que vigia o Rio Rhenus; conhece cada posto de guarda, e cada guarda que aceita suborno.",
  clearwater: "Vem de Clearwater, terra de moinhos e silos; sabe o que desce o rio, quando e em que quantidade.",
  farlands: "Vem de Farlands, as piores terras do feudo, entregues a quem perdeu os jogos de influência; ressentimento é combustível, e há de sobra.",
  senestra: "Vem de Senestra, domínio pessoal da família mais poderosa de Sunfield; se tem amigos lá, tem amigos demais.",
  timberborder: "Vem de Timberborder, a floresta das caçadas da nobreza; ou serviu a ela, ou caçou onde não devia.",
  // Midland
  aurelia: "Vem de Aurelia, a corte do rei e o centro do debate teológico; sabe se curvar na hora certa e citar Umbra na hora seguinte.",
  donetskai: "Vem de Donetskai, onde o boom do gado encheu os cofres do reino; cheira a dinheiro novo e a curral.",
  baddenberg: "Vem de Baddenberg, a floresta madeireira que ergue as cidades de Midland; tem mãos calejadas e pouca paciência com burocratas.",
  umbra: "Vem do território de Umbra, vizinho do Mosteiro de Itelonomeu, onde a obediência é lei de teocracia; ou é {devoto|devota} demais, ou fugiu disso.",
  warsaw: "Vem de Warsaw, terra que passou anos sob a horda de Crick até ser libertada pela Irmandade; carrega cicatrizes que não aparecem nos registros.",
  helsing: "Vem de Helsing, o porto das tarifas do lago central; sabe esconder mercadoria onde nenhum fiscal imagina.",
  sarbrucken: "Vem de Sarbrucken, terra de cabras e passagens de montanha; conhece atalhos que não estão em mapa nenhum.",
  alarsa: "Vem de Alarsa, onde nobres tradicionalistas e a Irmandade negociam em sigilo; é provável que já tenha ouvido o que não devia.",
  longhorn: "Vem de Longhorn, fronteira remota de gado rústico e ataques pontuais; dorme com uma arma ao alcance da mão.",
  koloberg: "Vem de Koloberg, a rota do ouro que financia a guerra da Irmandade; viu passar mais riqueza do que jamais terá, e isso costuma mudar uma pessoa.",
  // Blackwater
  "baia-dos-contrabandistas": "Vem da Baía dos Contrabandistas, onde a Companhia negocia na surdina; a bagagem {dele|dela} merece ser revistada duas vezes.",
  fishersound: "Vem de Fishersound, onde gangues dividem os canais sob a fachada da pesca; a Agência duvida que só tenha pescado peixe.",
  smokelands: "Vem das Smokelands, onde pólvora e sucata arcana se enfrentam todo dia; dorme mal e reage rápido.",
  "a-guilda": "Vem da Guilda, a zona neutra onde se compram e vendem alianças de curto prazo; a lealdade {dele|dela} tem prazo de validade.",
  mudcreek: "Vem de Mudcreek, lavouras sobre terra instável que alimentam as milícias; sabe que nenhum chão é firme.",
  jakarta: "Vem de Jakarta, onde a pólvora de Laguardia vira cajado pirateado da UP; se algo foi roubado, provavelmente passou por lá.",
  grip: "Vem do Grip, o gargalo do Rio Rhenus onde se cobra pedágio na base da extorsão; Highbridge reconhece um concorrente quando vê um.",
  "porto-imperial": "Vem do Porto Imperial, onde se atira para matar nos inspetores; recomenda-se que os agentes não se apresentem como inspetores.",
  // Grão-Ducado de Highbridge
  "ponte-matriz": "Cresceu à sombra da Ponte Matriz, a maior obra do Antigo Império; conhece cada vão, cada pilar e cada esconderijo da estrutura.",
  "eixo-universitario": "Passou pelo Eixo Universitário, onde estudam os filhos de meio continente; tem contatos influentes e o hábito irritante de saber mais que os agentes.",
  "quarteirao-dourado": "Vem do Quarteirão Dourado e conhece o sistema bancário por dentro, o que torna esta análise um exercício de cortesia.",
  "ala-das-embaixadas": "Vem da Ala das Embaixadas, onde se tecem os acordos sigilosos entre as nações; é possível que já trabalhe para alguém, e é certo que nega.",
  // União das Províncias
  asenov: "Vem de Asenov, a capital, sede do Parlamento da Democracia Universal; circula pelos corredores do poder e pelos templos de Umbra e Activum.",
  dragomir: "Vem de Dragomir, o comando logístico do estreito e dos maiores depósitos militares da UP; sabe onde a república guarda suas armas.",
  munteanu: "Vem de Munteanu, terra de minas e poluição; tosse quando o tempo esfria e não confia em promessa de ministro.",
  krumov: "Vem de Krumov, onde favelas e paisagens belíssimas dividem a mesma rua; conhece os dois lados da república.",
  sokolov: "Vem de Sokolov, de pesca e lavoura; gente simples, o que nem sempre quer dizer inofensiva.",
  stoyanov: "Vem de Stoyanov, a terra dos maiores campos de trabalho escravo da ilha; se esteve do lado do chicote ou das correntes, a Agência ainda apura.",
  zahariev: "Vem de Zahariev, o porto principal de Isla Prima; sabe o que entra e o que sai da ilha, e por quanto.",
  lazarescu: "Vem de Lazarescu, que adoça o mundo com seu açúcar; o sorriso é doce, as intenções seguem a apurar.",
  haller: "Vem de Haller, das florestas tropicais e dos laboratórios arcanos do governo; o que viu por lá a UP prefere que ninguém saiba.",
  "puerto-blanco": "Vem de Puerto Blanco, a ilha-prisão das minas de quartzo; se foi guarda ou prisioneiro, convém descobrir antes de contratar.",
  "puerto-nobre": "Vem de Puerto Nobre, sobre a qual os arquivos da Agência estão estranhamente vazios; isso, por si só, foi anotado.",
  "la-luna": "Vem de La Luna, ilha onde fica Bonita, cidade da Companhia; de resto a Agência sabe muito pouco, e alguém se esforçou bastante para que fosse assim.",
  "isla-de-la-vela": "Vem da Isla de la Vela, ponto de comércio e peregrinação; reza com uma mão e negocia com a outra.",
  // Reino de Laguardia
  krupp: "Vem de Krupp, o coração das fundições e dos canhões do reino; reconhece o calibre de uma arma pelo som do disparo.",
  eisenhauer: "Vem de Eisenhauer, das fundições de ferro sobre o desfiladeiro; tem braço de quem bate metal e ouvido de quem ignora explosões.",
  waldschmidt: "Vem de Waldschmidt, das forjas escondidas nos pinheirais; prefere trabalhar longe dos olhos de quem quer que seja.",
  bauer: "Vem de Bauer, a despensa do reino; parece {pacato|pacata}, mas sabe que quem alimenta as forjas tem o reino nas mãos.",
  wagner: "Vem de Wagner, a cidade dos carpinteiros de rodas; se uma caravana quebrou no caminho, é bom saber onde {ele|ela} estava.",
  fugger: "Vem de Fugger, onde se negociam crédito e contratos de mercenários; fala de juros como os outros falam do tempo.",
  hoffmann: "Vem de Hoffmann, a cidade murada das escoltas e patrulhas noturnas; conhece as estradas e quem as vigia.",
  schwarzenberg: "Vem de Schwarzenberg, a capital, à sombra do rei Ludwig von Schwarzenberg; tem acesso à corte, ou finge muito bem que tem.",
  ritter: "Vem de Ritter, cidade de artesãos e de tradição cavaleiresca; tem modos de cavaleiro e memória de comerciante.",
  krieger: "Vem de Krieger, onde se treinam os mercenários que fizeram a fama de Laguardia; provavelmente maneja uma zweihander melhor do que os nossos guardas.",
  wolf: "Vem de Wolf, o vale dos caçadores e dos cães; segue rastros com a paciência de quem nunca volta de mãos vazias.",
  muller: "Vem de Müller, terra de moinhos e feiras pacatas; resta saber se a calma é sincera ou o melhor disfarce de Laguardia.",
  vogel: "Vem de Vogel, a terra das torres de falcoaria; quem cria aves mensageiras sabe o valor de uma carta interceptada.",
  bergmann: "Vem de Bergmann, os vilarejos mineiros dos penhascos vulcânicos; não tem medo de escuro nem de lugar apertado.",
  // Irmandade de São Ferdinand (nomes dos fortes provisórios)
  "forte-norte": "Serviu ou viveu no Forte Norte, de frente para a descida da horda rumo a Midland, sob frio castigante e ataques em ondas; dorme pouco e acorda {armado|armada}.",
  "forte-sul": "Passou pelo Forte Sul, entre o calor do deserto e a horda, onde os centauros vão morrer lutando; aprendeu a não perguntar o nome de quem não vai voltar.",
  "forte-central": "Vem do Forte Central, no meio do cerco a Crick, de onde saem as patrulhas e as ordens da junta; vive em alerta e sabe mais do que diz sobre quem paga essa guerra.",
  "forte-oeste": "Vem do Forte Oeste, onde se guardam as contas, os suprimentos e os impostos da Irmandade, e por onde entram o ouro de Midland e os mosquetes; se algum carregamento sumiu, convém saber onde {ele|ela} estava.",
  // Reclusos do Deserto
  mahabam: "Passou por Mahabam, a cidade-estado onde os viajantes do deserto são recebidos com cuidado; aprendeu a ser {educado|educada} e {desconfiado|desconfiada} ao mesmo tempo.",
};

// Andarilho com texto próprio da região; as demais usam APURACAO_ANDARILHO.
export const APURACAO_ANDARILHO_REGIAO: Record<string, string> = {
  "protetorado-de-morrow":
    "Vaga pelo protetorado sem a permissão que ali se exige para quase tudo; {é um infrator ambulante|é uma infratora ambulante} que se mantém {vivo|viva} na lama por pura teimosia, e que esta Agência prefere não prender por falta de cela seca.",
  "chiefdom-de-vargarf":
    "Anda pelo gelo de Vargarf sem tribo nem chefe, o que ali equivale a andar sem proteção. Sobrevive caçando e pagando hospitalidade em carne, e esta Agência registra que nenhuma incursão lhe pôde ser atribuída, ainda.",
  "oakhaven":
    "Caça e comercia peles pelos postos de Oakhaven sem vila fixa e conhece trilhas que nenhum mapa registra, o que esta Agência considera interessante e, para fins de arquivo, preocupante.",
  "planicies-de-sunfield":
    "Vende a espada pelos castelos de Sunfield sem jurar a nenhum senhor e sorri nos bailes enquanto conta as saídas do salão. Em terra de espiões, a Agência nota que quem faz isso tem muito a esconder, ou muito a vender.",
  "midland":
    "Luta por aluguel nas estradas de Midland, escolta comboios e vigia pastos sem discutir a fé de quem paga. Sabe, por experiência, o que a horda de Crick deixou para trás, e nunca foi {condecorado|condecorada} por isso.",
  "blackwater":
    "Cruza o pântano sem jurar a senhor, gangue ou milícia, o que em Blackwater é talento ou milagre. Esta Agência ainda não decidiu qual dos dois.",
  "grao-ducado-de-highbridge":
    "Escolta cargas e cobradores pelas pontes de Highbridge e lê cada contrato antes de assinar, hábito que o ducado aprecia e que esta Agência tem motivos para observar.",
  "uniao-das-provincias":
    "{Cidadão|Cidadã} de província nenhuma, passou por Asenov e pelas ilhas sem se fixar e mantém os papéis em dia, a forma mais discreta que a União conhece de desconfiar de si mesma.",
  "reino-de-laguardia":
    "{Aventureiro|Aventureira} de Laguardia, já carregou pólvora e escoltou cargas para os estaleiros da Companhia, e sabe a diferença entre o que o rei decreta e o que as forjas entregam.",
  "reino-de-kruk":
    "Longe da colmeia e dos feromônios da rainha, já tem cabeça própria, fato que esta Agência registra com interesse e Kruk, com desconfiança.",
  "reino-de-crick":
    "Longe de Crick e da linhagem que o moldou para a guerra, escolhe pela primeira vez a quem obedecer, e esta Agência ainda não descobriu quem.",
  "imperio-das-estepes":
    "Cavalga sem tropa e sem Cavalga-mundos à vista, algo raro nas estepes. Segue o próximo horizonte, como Gorturk manda, e a Agência não sabe se {ele|ela} foge de alguma coisa ou anda atrás de outra.",
  "reclusos-do-deserto":
    "{Peregrino|Peregrina} em busca do primeiro casco, observa mais do que fala e debate quando provocado, o que {o|a} torna, por ora, a menor das preocupações desta Agência.",
  "mannaka-oko":
    "Escapou da terra de sucata e de shoguns, onde ninguém dá nada de graça a quem não tem dono. Conserta, escava e cobra caro, e a Agência registra que isso é coerente.",
  "companhia-de-comercio":
    "Não se fixa em porto algum: {andarilho|andarilha} das rotas da Companhia, já passou por tantas cidades que esta Agência perdeu a conta dos carimbos. Enfrentou o povo do mar, sobreviveu à vida dura a bordo e aprendeu a negociar sem pisar no calo de ninguém poderoso, o que {o|a} torna {conhecedor|conhecedora} demais do mundo para ser {considerado|considerada} {inofensivo|inofensiva}.",
};

export const APURACAO_ANDARILHO =
  "Não se fixa em lugar algum: é {andarilho|andarilha}, sem endereço para cobrança, o que o Quarteirão Dourado considera o pior tipo de cliente.";

export const APURACAO_OFICIO: Record<string, string> = {
  medico:
    "Ofício declarado: médico. Sabe fechar um ferimento e, pelo mesmo motivo, sabe exatamente onde cortar. Os aprimoramentos da Irmandade de São Ferdinand passam por mãos como as {dele|dela}; resta saber a serviço de quem elas trabalham.",
  alquimista:
    "Ofício declarado: alquimista. Domina reagentes que alimentam cajados e incendeiam armazéns com a mesma facilidade. Quem procura a Pedra filosofal e a encontra deixa de ser problema de uma nação para ser problema de todas.",
  acolito:
    "Ofício declarado: acólito. Cuida dos ritos e ouve confissões que ninguém mais ouve. Um acólito bem posicionado sabe mais segredos do que muito embaixador da Ala das Embaixadas.",
  astrologo:
    "Ofício declarado: astrólogo. Vende o futuro a nobres que pagam caro por datas de casamento e de guerra. Quem prevê quando um reino vai marchar costuma ter fontes bem menos celestes do que diz.",
  apotecario:
    "Ofício declarado: apotecário. Remédio e veneno saem do mesmo balcão, e a diferença está só na dose. A Agência recomenda aos agentes não aceitar chá preparado por este indivíduo.",
  ferreiro:
    "Ofício declarado: ferreiro. Arma metade do continente e conhece o peso de cada lâmina que vende. Se trabalhou nas forjas de Laguardia, assinou contratos de sigilo que valem mais do que a própria vida, e quebrá-los é o tipo de notícia que interessa à Agência.",
  paladino:
    "Ofício declarado: paladino. Luta por um deus e não aceita ordens de banqueiros, o que {o|a} torna difícil de contratar e impossível de subornar. Se algum Arauto declarar a Agência inimiga da fé, este é o tipo de indivíduo que bateria primeiro à nossa porta.",
  "cacador-de-monstros":
    "Ofício declarado: caçador de monstros. Sabe que vampiros existem, e quem sabe disso costuma saber também onde eles se escondem. Prata no bolso e paciência com rastros fazem {dele|dela} um bom recurso e um péssimo inimigo.",
  detetive:
    "Ofício declarado: detetive. Faz o mesmo que esta Agência, sem a licença desta Agência. Se trabalha por conta própria, é concorrência; se trabalha para outro governo, é espionagem. A ficha segue aberta nas duas hipóteses.",
  nobre:
    "Ofício declarado: nobre. Tem título, terras e, com sorte, crédito no Quarteirão Dourado; a Agência já conhece o tamanho exato das dívidas da família. Um nome importante abre portas, e cada porta que {ele|ela} abriu foi anotada.",
  filosofo:
    "Ofício declarado: filósofo. {Inofensivo|Inofensiva} até que alguém leia o que escreveu. Ideias derrubaram o Antigo Império com mais eficiência do que qualquer canhão de Laguardia, e a Agência guarda cópia de tudo o que este indivíduo publicou.",
  cientista:
    "Ofício declarado: cientista. Mede, testa e não acredita em nada que não consiga repetir. Pesquisas de mutação, de pólvora e de cajados valem fortunas, e a Agência gostaria de saber a quem {ele|ela} entrega os resultados.",
  soldado:
    "Ofício declarado: soldado. {Treinado, disciplinado|Treinada, disciplinada} e leal a alguma bandeira; resta descobrir qual. Highbridge paga bem a guerreiros gloriosos, e uma oferta de recrutamento não está descartada.",
  "mago-ortodoxo":
    "Ofício declarado: mago ortodoxo. A magia de engenharia custa caro e o poder de um mago é do tamanho do seu orçamento: as movimentações bancárias deste indivíduo dizem mais sobre sua periculosidade do que qualquer cajado.",
  bardo:
    "Ofício declarado: bardo. Suas melodias curam e fortalecem aliados, e {ele é recebido|ela é recebida} com reverência por onde passa. Um viajante bem-vindo em toda parte é o informante perfeito, ou o espião perfeito.",
  "monge-de-dojo":
    "Ofício declarado: monge de dojo. {Lutador formidável e debatedor rigoroso|Lutadora formidável e debatedora rigorosa}, de artes marciais limpas e defensivas. {Desarmado|Desarmada} não quer dizer inofensivo.",
  mercenario:
    "Ofício declarado: mercenário. Lealdade com preço de tabela. Recomenda-se descobrir quem paga o contrato atual antes que alguém pague mais.",
  contrabandista:
    "Ofício declarado: contrabandista. Conhece as rotas do Mar do Arauto e as conversas na surdina da Companhia. Toda ponte de Highbridge cobra pedágio, e {este|esta} é especialista em não pagá-lo.",
  cacador:
    "Ofício declarado: caçador. Sabe seguir rastros, esperar em silêncio e abater bestas maiores que {ele|ela}. Os agentes devem lembrar que essas habilidades também servem contra gente.",
  "mago-dissidente":
    "Ofício declarado: mago dissidente. Estuda por conta própria, sem academia, governo ou patrono a quem prestar contas. Ninguém sabe o que {ele|ela} pesquisa, e é isso que preocupa.",
};

// {oficio}: nome dado pelo usuário ao ofício personalizado.
export const APURACAO_OFICIO_PROPRIO =
  "Ofício declarado: {oficio}. A atividade não consta nos registros de guildas e bancos de Highbridge; os detetives seguem apurando o que ela envolve de fato, e quem a financia.";

export const APURACAO_SEM_OFICIO =
  "Ofício declarado: nenhum. {Vagabundo|Vagabunda} sem renda conhecida, vive de expedientes que ninguém registra. Quem não tem ofício tem tempo de sobra, e tempo de sobra, para esta Agência, é sempre suspeito.";

// Sinais particulares cômicos: o PDF sorteia um a cada geração (lib/ficha-pdf.tsx). Pelo menos 30.
export const SINAIS_COMICOS: string[] = [
  "Toma café sem açúcar, o que em Lazarescu seria considerado ofensa grave.",
  "Põe o arroz por cima do feijão e defende o hábito com argumentos que fariam um Dedutivo chorar.",
  "Conversa com a própria arma quando acha que ninguém está vendo.",
  "Conta as moedas três vezes antes de pagar o pedágio da Ponte Matriz, e reclama nas três.",
  "Tem medo declarado de galinhas.",
  "Assobia sempre a mesma música de bardo, e sempre {desafinado|desafinada}.",
  "Foi visto pedindo desconto num templo de Activum, alegando que a fé também tem custo-benefício.",
  "Dorme de botas, por precaução.",
  "Coleciona tampas de frascos de apotecário e se ofende quando alguém chama isso de lixo.",
  "Dá nome aos cavalos dos outros.",
  "Recusa-se a comer qualquer coisa que ainda tenha olhos olhando de volta.",
  "Perdeu uma aposta para um Centauro e até hoje jura que foi trapaça.",
  "Senta sempre de costas para a parede, inclusive na casa de banhos.",
  "Corrige a pronúncia dos nomes de Laguardia, mesmo quando ninguém perguntou.",
  "Guarda pão no bolso para emergências; a Agência registrou ao menos três emergências por dia.",
  "Acredita que pó de prata espanta pernilongo.",
  "Tentou pagar uma conta em Highbridge com um coelho vivo, alegando que era uma Bateria Vital.",
  "Sabe de cor a tabela de juros do Quarteirão Dourado, mas esquece o próprio aniversário.",
  "Chora em casamento de desconhecidos.",
  "Discute com gaivotas, e perde.",
  "Lambe o dedo para virar a página e para testar o vento, sem lavar entre um e outro.",
  "Insiste, em voz alta e dentro de Midland, que a comida de Midland é sem sal.",
  "Nunca devolveu um livro do Eixo Universitário; a multa já vale uma casa.",
  "Usa meias de pares diferentes de propósito, porque diz que confunde os espíritos.",
  "Faz careta toda vez que ouve a palavra imposto.",
  "Ronca alto o bastante para denunciar uma emboscada inteira.",
  "Pede o chá de Mahabam bem fraquinho, o que os Homens do Deserto consideram heresia.",
  "Molha o pão no vinho e chama isso de alta culinária.",
  "Jura ter visto um Homem-Galho dançando, mas não tem testemunhas.",
  "Separa a comida no prato para que nada encoste em nada.",
  "Fala sozinho em três idiomas e erra a gramática em dois deles.",
  "Gasta mais com chapéus do que com armas.",
  "Tem pavor de pombos-correio desde que um deles levou embora uma carta de amor.",
  "Tentou subornar um guarda de Highbridge com uma torta caseira, e quase funcionou.",
  "Pede a conta antes de pedir a comida, por desconfiança.",
];
