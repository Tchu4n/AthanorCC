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
  "imperio-das-estepes":
    "Vem do Império das Estepes, a horda de Ayalaal, o Cavalga-mundos, onde pilhagem, extorsão e captura de escravos são ofício nacional. Convém contar as moedas depois que {ele|ela} sai.",
  "reclusos-do-deserto":
    "Vem dos oásis escondidos de Marranol, entre juízes da lei, anciãos e Dojos devotos de Logan. Comunidades reclusas raramente mandam alguém para fora sem motivo.",
  "mannaka-oko":
    "Vem de Man'naka oko, deserto de sucata governado pelos shoguns e pela lei do mais forte. A Companhia de Comércio do Mar do Arauto compra a sucata ancestral de lá; a Agência quer saber o que mais veio no porão.",
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
