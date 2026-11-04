import { IMAGES } from "./images.ts";
import { A_DEFINIR, type RegionData, type Source } from "./types.ts";

// As 14 famílias na ordem de "Contexto basico de faccoes.docx"; Schwarzenberg é a capital, as outras 13 só têm o nome.
const FAMILIAS_LAGUARDIA = [
  "Krupp", "Eisenhauer", "Waldschmidt", "Bauer", "Wagner", "Fugger", "Hoffmann",
  "Schwarzenberg", "Ritter", "Krieger", "Wolf", "Müller", "Vogel", "Bergmann",
];

// a capital, sede do rei, usa o quartel; as demais, a arte da família (as de 2026-11-01 completam as 14)
const ARTE_FAMILIA: Partial<Record<string, string>> = {
  Schwarzenberg: IMAGES["regions/laguardia-quartel"].src,
  Bauer: IMAGES["regions/laguardia-bauer"].src,
  Eisenhauer: IMAGES["regions/laguardia-eisenhauer"].src,
  Bergmann: IMAGES["regions/laguardia-bergmann"].src,
  Fugger: IMAGES["regions/laguardia-fugger"].src,
  Hoffmann: IMAGES["regions/laguardia-hoffmann"].src,
  Krieger: IMAGES["regions/laguardia-krieger"].src,
  Krupp: IMAGES["regions/laguardia-krupp"].src,
  "Müller": IMAGES["regions/laguardia-muller"].src,
  Ritter: IMAGES["regions/laguardia-ritter"].src,
  Vogel: IMAGES["regions/laguardia-vogel"].src,
  Wagner: IMAGES["regions/laguardia-wagner"].src,
  Waldschmidt: IMAGES["regions/laguardia-waldschmidt"].src,
  Wolf: IMAGES["regions/laguardia-wolf"].src,
};

// Perfil de cada família tirado das artes conceituais (o documento só lista os nomes); a confirmar na lore.
const PERFIL_FAMILIA: Partial<Record<string, string>> = {
  Bauer:
    "Vale agrícola de terraços e plantações às margens do rio, cercado pelos vulcões do reino. É a despensa de [[Laguardia]], e a família Bauer cuida para que as cidades das forjas nunca passem fome.",
  Eisenhauer:
    "Fundições de ferro coladas a uma fortaleza, sobre um desfiladeiro cruzado por uma ponte de pedra. O ferro bruto que sai das minas vira ali o metal das armas e dos cajados forjados no reino.",
  Bergmann:
    "Vilarejos de mineração agarrados aos penhascos vulcânicos, de onde sai o minério que alimenta as forjas do reino. Trilhas de carrinhos e a fumaça das fornalhas cortam a montanha dia e noite.",
  Fugger:
    "Praça mercantil de casas enxaimel onde a família Fugger negocia crédito, mercadorias e contratos de mercenários. Os capacetes sallet dos guardas lembram que, em [[Laguardia]], todo negócio anda com escolta.",
  Hoffmann:
    "Cidade murada de ruas estreitas, patrulhada à noite por mercenários com tochas e espadas. Os Hoffmann cuidam da guarda das estradas e das escoltas que cruzam o reino.",
  Krieger:
    "Terra de fortalezas e torres de vigia aos pés do vulcão, onde se treinam os mercenários que fizeram a fama do reino. Krieger quer dizer guerreiro, e a família faz jus ao nome.",
  Krupp:
    "O coração industrial do reino, com fundições de chaminés altas, oficinas de pólvora e canhões saindo das forjas dia e noite. É ali que nascem as armas que os mercenários de [[Laguardia]] levam ao mundo.",
  Müller:
    "Região de rios e moinhos d'água que moem o grão e alimentam o reino. As feiras ao ar livre dão à terra dos Müller um ar mais pacato do que o resto de [[Laguardia]].",
  Ritter:
    "Cidade de vida civil movimentada, com mercados, oficinas e famílias de artesãos. A família Ritter, de tradição cavaleiresca, mantém ali a ordem em nome do rei.",
  Vogel:
    "Terra das torres de falcoaria, onde aves de rapina são criadas para a caça da nobreza e para levar mensagens pelo reino. Os falcoeiros dos Vogel são disputados por cortes de todo o continente.",
  Wagner:
    "Cidade de carpinteiros e fabricantes de rodas, carroças e carroções. Boa parte das caravanas e da artilharia de [[Laguardia]] anda sobre rodas feitas pelos Wagner.",
  Waldschmidt:
    "Forjas escondidas entre florestas de pinheiros, onde a madeira farta alimenta as fornalhas. Os ferreiros dos Waldschmidt fazem ferramentas e lâminas longe da fumaça das grandes fundições.",
  Wolf:
    "Vale de caçadores e estábulos à beira da floresta, onde se criam cães e cavalos de caça. Os caçadores dos Wolf conhecem as trilhas da montanha melhor do que qualquer patrulha.",
};

export const regions: RegionData[] = [
  {
    id: "protetorado-de-morrow",
    name: "Protetorado de Morrow",
    mainArea: "Ironmud",
    image: IMAGES["regions/morrow-vila"].src,
    andarilho: IMAGES["regions/morrow-andarilho"].src,
    source: ["Minor Powers.docx", "Subregioes.docx", "dedução"],
    briefing:
      "Um pântano de ruínas imperiais onde se vive de pesca, coleta e teimosia. Estado fantoche da [[UP]], o protetorado precisa pedir permissão para quase tudo e trava, dentro das próprias fronteiras, uma guerra civil que ninguém declarou. Seu povo, durão e ressentido, sabe o papel que lhe deram: ser a barreira de carne entre as nações ricas e as incursões de [[Vargarf]].",
    implications:
      "Vir de Morrow é carregar a lama no sotaque: os ricos o veem como bucha de canhão, e os políticos da UP usam sua miséria em discursos de campanha. Você cresceu entre ruínas, saques e escaramuças, e sabe sobreviver com quase nada. Diante de qualquer coisa que venha da UP, seu povo guarda um ressentimento antigo.",
    subregions: [
      { id: "ironmud", name: "Ironmud", image: IMAGES["regions/morrow-ironmud"].src, briefing: "Pântano central pontilhado por infraestrutura imperial antiga que mal funciona. É o núcleo administrativo da burocracia fantoche imposta pela [[UP]]." },
      { id: "costa-afogada", name: "Costa Afogada", image: IMAGES["regions/morrow-costa-afogada"].src, briefing: "Região litorânea onde a pesca é a única forma de subsistência. Sua população é a que mais sofre com os ataques navais de [[Vargarf]]." },
      { id: "lamacal", name: "Lamaçal", image: IMAGES["regions/morrow-lamacal"].src, briefing: "Epicentro da miséria e principal campo de batalha da guerra civil não declarada. Ali os locais lutam por migalhas e pela posse das ruínas que ainda têm algum valor." },
      { id: "fosso-norte", name: "Fosso Norte", image: IMAGES["regions/morrow-fosso-norte"].src, briefing: "Trincheira natural e principal linha de defesa, a mais lamacenta do protetorado. Ali os soldados miseráveis absorvem as incursões de [[Vargarf]] e outros perigos." },
    ],
    pendencias: [`Quinta subregião: ${A_DEFINIR} (o cabeçalho de Subregioes.docx diz 5, mas o texto lista 4).`],
  },
  {
    id: "chiefdom-de-vargarf",
    name: "Chiefdom de Vargarf",
    mainArea: "Os Fiordes Cortantes (Shatterfjords)",
    image: IMAGES["regions/vargarf-povoado"].src,
    andarilho: IMAGES["regions/vargarf-andarilho"].src,
    source: ["Minor Powers.docx", "Subregioes.docx", "decisão do usuário", "dedução"],
    briefing:
      "Tribos do norte gelado que vivem do saque no mar, da caça de bestas e da pesca entre o gelo, sob a lei do mais forte. Quando surge um chefe capaz de uni-las, viram uma horda temida; no resto do tempo, descem em incursões sobre o [[Protetorado de Morrow]] sempre que a fome aperta. Para elas, fraqueza é sentença de morte, e a agressão é o preço de atravessar o inverno.",
    implications:
      "Seu povo é hospitaleiro, mas desconfiado: não deixa ninguém morrer no frio, e também não entrega confiança sem motivo. Fora do Chiefdom, você é visto como saqueador antes de abrir a boca, sobretudo em Morrow e entre os marinheiros da [[Companhia de Comércio do Mar do Arauto]]. Em combate, você luta com roupas leves de couro e peles e com qualquer arma tomada num saque.",
    subregions: [
      { id: "baia-da-boa-viagem", name: "Baía da Boa Viagem", image: IMAGES["regions/vargarf-baia-da-boa-viagem"].src, briefing: "Assentamento costeiro de onde partem os botes e navios longos. É o ponto de saída para os ataques marítimos e para a pesca." },
      { id: "fiordes-cortantes", name: "Os Fiordes Cortantes (Shatterfjords)", image: IMAGES["regions/vargarf-fiordes-cortantes"].src, source: ["Subregioes.docx", "decisão do usuário"], briefing: "A região mais fria e isolada de Vargarf. É onde vivem as tribos mais duras." },
    ],
    pendencias: [`Entrada "Território repleto de tribos" está incompleta em Subregioes.docx: ${A_DEFINIR}.`],
  },
  {
    id: "oakhaven",
    name: "Oakhaven",
    image: IMAGES["regions/oakhaven-vila"].src,
    andarilho: IMAGES["regions/oakhaven-andarilho"].src,
    source: ["Minor Powers.docx", "Subregioes.docx", "dedução"],
    briefing:
      "Gente do frio, calada e endurecida pelo clima, que caça com lanças, cria cães e arranca da terra colheitas magras entre um inverno e outro. Vive de peles e madeira vendidas aos reinos humanos e do minério trocado com [[Kruk]], cujos homens-galho a toleram como intermediária. Sem o grão do feudo do sul, nenhum inverno seria atravessado.",
    implications:
      "Para você, os sulistas são fracos, e seu povo não esconde esse desprezo. Você conhece os príncipes de Kruk melhor que quase qualquer humano, porque Oakhaven é dos poucos que negociam com eles, na Fronteira Cinzenta. Fora dali, sua aparência de povo da tundra, as lanças e os cães denunciam de onde você veio.",
    subregions: [
      { id: "posto-das-peles", name: "Posto das Peles", image: IMAGES["regions/oakhaven-posto-das-peles"].src, briefing: "Assentamento focado no comércio sazonal com os reinos humanos do sul. Serve de entreposto logístico durante o degelo." },
      { id: "fronteira-cinzenta", name: "Fronteira Cinzenta (Greywatch)", image: IMAGES["regions/oakhaven-fronteira-cinzenta"].src, briefing: "Região limite que faz fronteira direta com [[Kruk]]. É habitada por mercadores rústicos que lidam com a diplomacia dos príncipes formigoides." },
      { id: "floresta-do-uivo", name: "Floresta do Uivo", image: IMAGES["regions/oakhaven-floresta-do-uivo"].src, briefing: "A vasta região florestal de onde Oakhaven extrai sua madeira." },
    ],
    pendencias: [],
  },
  {
    id: "planicies-de-sunfield",
    name: "Planícies de Sunfield",
    image: IMAGES["regions/sunfield-cidade"].src,
    andarilho: IMAGES["regions/sunfield-andarilho"].src,
    bandeira: IMAGES["regions/sunfield-bandeira"].src,
    source: ["Minor Powers.docx", "Subregioes.docx", "dedução"],
    briefing:
      "Campos de trigo a perder de vista ao longo do [[Rio Rhenus]], que enriquecem um feudo inteiro. Por trás dos festivais de cavalaria e dos bailes, onze regiões de vassalos e castelões vivem num ninho de cobras de intrigas, impostos pesados e medo de espiões. O senhor feudal gasta mais força mantendo a ordem em casa do que olhando para fora, e seus cavaleiros parecem hussardos alados.",
    implications:
      "Em Sunfield, quem você conhece vale mais do que o que você sabe fazer: alianças, favores e segredos decidem destinos. Se nasceu camponês, cresceu sob impostos pesados, e se nasceu nobre, aprendeu cedo a desconfiar de todos. O feudo evita qualquer guerra que possa queimar suas plantações, então seus guerreiros, em armaduras de placas, existem para proteger o rio e as fronteiras.",
    subregions: [
      { id: "valdourado", name: "Valdourado (Goldshire)", image: IMAGES["regions/sunfield-valdourado"].src, briefing: "Celeiro administrativo do feudo. É onde a tributação pesada da base camponesa é recolhida e processada." },
      { id: "justa", name: "Justa (Jousting Fields)", image: IMAGES["regions/sunfield-justa"].src, briefing: "Região plana e rica dedicada aos famosos festivais de cavalaria e jogos. Ali a nobreza faz demonstrações de força e influência." },
      { id: "silvernest", name: "Silvernest", image: IMAGES["regions/sunfield-silvernest"].src, briefing: "Região de diplomacia, grandes bailes, burocracia e espionagem interna. É o ninho de cobras político dos castelões e vassalos mais antigos." },
      { id: "rivermark", name: "Rivermark", image: IMAGES["regions/sunfield-rivermark"].src, briefing: "Faixa de terra paralela ao [[Rio Rhenus]], a zona mais fértil do feudo. É também a mais vulnerável às inundações controladas usadas no plantio." },
      { id: "kingswheat", name: "Kingswheat", image: IMAGES["regions/sunfield-kingswheat"].src, briefing: "Maior centro produtor e exportador de trigo da região." },
      { id: "highmeadow", name: "Highmeadow", image: IMAGES["regions/sunfield-highmeadow"].src, briefing: "Região de pastos elevados. Ali se empregam as técnicas agrícolas mais eficientes e caras, para plantações delicadas." },
      { id: "southmarch", name: "Southmarch", image: IMAGES["regions/sunfield-southmarch"].src, briefing: "Fronteira sul militarizada e um dos acessos ao reino. Tem postos de guarda que vigiam o fluxo do [[Rio Rhenus]]." },
      { id: "clearwater", name: "Clearwater", image: IMAGES["regions/sunfield-clearwater"].src, briefing: "Território de moinhos aquáticos e silos. Prepara a produção para descer o rio." },
      { id: "farlands", name: "Farlands", image: IMAGES["regions/sunfield-farlands"].src, briefing: "As piores terras férteis do feudo. São administradas por famílias de vassalos que perderam os jogos de influência." },
      { id: "senestra", name: "Senestra", image: IMAGES["regions/sunfield-senestra"].src, briefing: "Extensos domínios pessoais sob proteção direta da família governante mais poderosa." },
      { id: "timberborder", name: "Timberborder", image: IMAGES["regions/sunfield-timberborder"].src, briefing: "Zona florestal reservada à caça e ao entretenimento privado da nobreza feudal." },
    ],
    pendencias: [],
  },
  {
    id: "midland",
    name: "Midland",
    mainArea: "Aurelia",
    image: IMAGES["regions/midland-centro"].src,
    andarilho: IMAGES["regions/midland-andarilho"].src,
    bandeira: IMAGES["regions/midland-bandeira"].src,
    source: ["Minor Powers.docx", "Subregioes.docx", "dedução"],
    briefing:
      "Reino de grandes pastos e florestas, em ascensão desde que o bom preço dos grãos fez explodir sua pecuária. A corte segue os dogmas de [[Umbra]] por influência do vizinho [[Mosteiro de Itelonomeu]], mas paga a guerra da [[Irmandade de São Ferdinand]], os hereges que libertaram suas terras de [[Crick]]. Essa contradição divide nobres, ouro e consciências.",
    implications:
      "Em Midland, tradição, hierarquia e obediência abrem portas, e questionar a ordem é malvisto, sobretudo perto da corte. Você vem de um reino que ainda lembra a ocupação da horda e que discute, com raiva, cada moeda enviada à Irmandade. Os soldados da sua terra são conhecidos pelos capacetes alados e pela espada reta.",
    subregions: [
      { id: "aurelia", name: "Aurelia", image: IMAGES["regions/midland-aurelia"].src, source: ["Subregioes.docx", "decisão do usuário"], briefing: "Domínio do rei e coração aristocrático do reino, com a corte central e os palácios. É também o núcleo do debate teológico." },
      { id: "donetskai", name: "Donetskai", image: IMAGES["regions/midland-donetskai"].src, briefing: "Planícies gigantescas onde ocorreu o boom da pecuária bovina. Gera enorme receita para o reino e alimenta a capital." },
      { id: "baddenberg", name: "Baddenberg", image: IMAGES["regions/midland-baddenberg"].src, briefing: "Densa região florestal de extração de madeira. Abastece a construção civil." },
      { id: "umbra", name: "Umbra", image: IMAGES["regions/midland-umbra"].src, briefing: "Território do sul que faz fronteira direta com o [[Mosteiro de Itelonomeu]]. Ali os dogmas de subordinação, tradição e obediência cega são aplicados com a severidade de uma teocracia. É a base eleitoral dos nobres tradicionalistas." },
      { id: "warsaw", name: "Warsaw", image: IMAGES["misc/batalha-warsaw"].src, briefing: "Terras que ficaram anos sob domínio da horda de [[Crick]]. Recém-libertadas pela [[Irmandade de São Ferdinand]], são foco de tensão sobre financiamento e reconstrução." },
      { id: "helsing", name: "Helsing", image: IMAGES["regions/midland-helsing"].src, briefing: "Região mercantil e portuária. Vive das tarifas alfandegárias cobradas no comércio pelo lago central." },
      { id: "sarbrucken", name: "Sarbrucken", image: IMAGES["regions/midland-sarbrucken"].src, briefing: "Região montanhosa menor, dedicada à criação de cabras e à proteção de passagens." },
      { id: "alarsa", name: "Alarsa", image: IMAGES["regions/midland-alarsa"].src, briefing: "Assentamento comercial. Ali nobres tradicionalistas e representantes da [[Irmandade de São Ferdinand]] costumam negociar em sigilo." },
      { id: "longhorn", name: "Longhorn", image: IMAGES["regions/midland-longhorn"].src, briefing: "Região fronteiriça remota, focada em pecuária rústica. Resiste a ataques pontuais." },
      { id: "koloberg", name: "Koloberg", image: IMAGES["regions/midland-koloberg"].src, briefing: "Rota por onde passam recursos, gado e ouro destinados a financiar a guerra da [[Irmandade de São Ferdinand]]. É alvo de constante protesto político." },
    ],
    pendencias: [],
  },
  {
    id: "blackwater",
    name: "Blackwater",
    image: IMAGES["regions/blackwater-vila"].src,
    andarilho: IMAGES["regions/blackwater-andarilho"].src,
    source: ["Minor Powers.docx", "Subregioes.docx", "dedução"],
    briefing:
      "Pântanos onde a lei é coisa que se ouve falar, divididos entre senhores feudais em guerra constante, gangues e milícias. Por ali passa o grande contrabando do [[Mar do Arauto]], e ali as potências travam suas guerras por procuração: a pólvora de [[Laguardia]] contra a [[Magia de Trincheira]] da [[UP]].",
    implications:
      "Quem vem de Blackwater cresceu sabendo que a bala resolve antes da justiça, e todos lembram disso quando ouvem de onde você é. Você conhece o mercado negro, as armas de fogo e os cajados pirateados, e reconhece um contrabandista de longe. Para autoridades de outras terras, sua origem já é motivo de suspeita.",
    subregions: [
      { id: "baia-dos-contrabandistas", name: "A Baía dos Contrabandistas (Smuggler's Bay)", image: IMAGES["regions/blackwater-baia-dos-contrabandistas"].src, briefing: "Principal porto não oficial, nas margens pantanosas, onde as regras de [[Laguardia]] não chegam. Ali a [[Companhia de Comércio do Mar do Arauto]] negocia na surdina." },
      { id: "fishersound", name: "Fishersound (Estuário Pescador)", image: IMAGES["regions/blackwater-fishersound"].src, briefing: "Canais e áreas de aquicultura, fortemente armados. São divididos entre gangues locais sob a fachada da pesca." },
      { id: "smokelands", name: "Smokelands", image: IMAGES["regions/blackwater-smokelands"].src, briefing: "Fronteira de escaramuças constantes. Ali a pólvora mercenária de [[Laguardia]] colide com a sucata arcana e táticas ilegais rivais." },
      { id: "a-guilda", name: "A Guilda", image: IMAGES["regions/blackwater-a-guilda"].src, briefing: "Assentamento fortificado e zona neutra, mantida na bala. Ali espiões, mercenários desertores e senhores locais compram e vendem alianças de curto prazo." },
      { id: "mudcreek", name: "Mudcreek (Riacho de Lama)", image: IMAGES["regions/blackwater-mudcreek"].src, briefing: "Zona agrícola intensiva e compactada sobre terrenos instáveis. Alimenta as gangues e milícias locais." },
      { id: "jakarta", name: "Jakarta", image: IMAGES["regions/blackwater-jakarta"].src, briefing: "O coração da infração tecnológica de Blackwater. Ali mercenários de rua e senhores locais trocam armas de fogo de [[Laguardia]] por cajados de série pirateados ou oxidados da [[UP]]." },
      { id: "grip", name: "Grip (O Aperto)", image: IMAGES["regions/blackwater-grip"].src, briefing: "Gargalo fluvial perto da saída do [[Rio Rhenus]], disputado por facções e bandidos. Quem o controla cobra taxas extorsivas e domina a descida do fluxo logístico." },
      { id: "porto-imperial", name: "Porto Imperial", image: IMAGES["regions/blackwater-porto-imperial"].src, briefing: "Foco na pesca pantanosa e no trânsito rápido de bens roubados. Seus moradores vivem na lama e atiram para matar nos inspetores." },
    ],
    pendencias: [],
  },
  {
    id: "grao-ducado-de-highbridge",
    name: "Grão-Ducado de Highbridge",
    image: IMAGES["regions/highbridge-distrito"].src,
    andarilho: IMAGES["regions/highbridge-andarilho"].src,
    source: ["Minor Powers.docx", "Subregioes.docx", "dedução"],
    briefing:
      "Ducado cosmopolita e neutro, de pontes do [[Antigo Império]] e bancos imensos, onde se cobra pedágio de todo o comércio de Athanor. Ninguém o ataca, porque destruí-lo arruinaria todos os outros, e suas universidades recebem filhos de nobres e magos de todo o continente. Paga a [[Irmandade de São Ferdinand]] para manter [[Crick]] longe das suas pontes.",
    implications:
      "Vir de Highbridge é crescer sob a lei e a burocracia herdadas do Antigo Império, que ali são tradição. O ducado vê qualquer pessoa capaz de abrir uma conta no banco como indivíduo capaz, com deveres e responsabilidades, e você aprendeu a ser pragmático, neutro e a jogar dentro das leis. Essa ordem vale dentro do território do ducado; diplomatas, banqueiros e acadêmicos de toda parte o recebem com cortesia enquanto você não toma partido. Se serviu ao exército do ducado, foi bem pago e treinado com ligas metálicas leves, armas de fogo e magos ao lado.",
    subregions: [
      { id: "ponte-matriz", name: "A Ponte Matriz (The Mother Span)", image: IMAGES["regions/highbridge-arcos"].src, briefing: "Principal ponte remanescente do [[Antigo Império]]. É uma monstruosidade de engenharia." },
      { id: "eixo-universitario", name: "O Eixo Universitário (Scholar's Ward)", image: IMAGES["regions/highbridge-eixo-universitario"].src, briefing: "Gigantesco complexo acadêmico onde estudam magos, nobres e filhos de barões. Sua presença dá blindagem diplomática ao ducado, pois ninguém bombardeia a universidade onde os próprios filhos estudam." },
      { id: "quarteirao-dourado", name: "O Quarteirão Dourado (Goldenvault)", image: IMAGES["regions/highbridge-quarteirao-dourado"].src, briefing: "Distrito das imensas instituições financeiras e do sistema bancário central de Athanor. É neutro, intocável e fortemente guardado." },
      { id: "ala-das-embaixadas", name: "A Ala das Embaixadas (Embassytown)", image: IMAGES["regions/highbridge-ala-das-embaixadas"].src, briefing: "Zona cosmopolita habitada por emissários oficiais. Ali se tecem tramas e acordos sigilosos entre nações e potências." },
    ],
    pendencias: [],
  },
  {
    id: "uniao-das-provincias",
    name: "União das Províncias (UP)",
    mainArea: "Asenov",
    image: IMAGES["regions/up-centro"].src,
    source: ["União das Províncias (UP).docx", "Regras Globais do Cenário.docx", "decisão do usuário", "dedução"],
    briefing:
      "Um arquipélago de concreto e veludo: cidades de linhas retas, roupas da Espanha colonial e templos de [[Umbra]] e [[Activum]]. Nascida da revolução que derrubou o [[Antigo Império]], a União vota, debate e intriga, e acredita que o progresso só existe onde há ordem, mantida por qualquer meio. Qualquer raça pode virar cidadã, mas a magia é monopólio da elite, as armas de fogo são crime e a escravidão é lei.",
    implications:
      "Como cidadão da União, você tem voto e uma vida digna, desde que obedeça às leis e não se meta com a elite, embora a maioria viva pobre e com dificuldade. Lá fora, muitos veem a UP como a potência que compra escravos e queima vidas para alimentar magia, e você carrega essa fama. Em casa, uma pistola nas suas mãos é crime, e a polícia anda com cajados de lente padronizados.",
    subregions: [
      { id: "asenov", name: "Asenov", briefing: "Capital da UP e centro político, ministerial e intelectual, onde fica o Parlamento da Democracia Universal. Concentra a elite política, a arquitetura modernista e forte presença dos templos de [[Umbra]] e [[Activum]]. É a zona de mais alta segurança." },
      { id: "dragomir", name: "Dragomir", image: IMAGES["factions/up-exercito"].src, briefing: "Opera o comando militar logístico da defesa do estreito e do [[Protetorado de Morrow]]. Abriga os maiores depósitos militares." },
      { id: "munteanu", name: "Munteanu", briefing: "Região notável pela mineração, que sofre com a poluição." },
      { id: "krumov", name: "Krumov", briefing: "Região famosa pelo contraste entre riqueza e pobreza. Grandes favelas e sujeira convivem com uma das naturezas mais belas de Athanor." },
      { id: "sokolov", name: "Sokolov", briefing: "Região pesqueira, com forte agricultura." },
      { id: "stoyanov", name: "Stoyanov", briefing: "Possui as maiores reservas e campos de trabalho escravo da ilha." },
      { id: "zahariev", name: "Zahariev", briefing: "Possui o porto principal de Isla Prima, por onde todo o comércio flui para o resto da ilha." },
      { id: "lazarescu", name: "Lazarescu", briefing: "Famosa pela exportação de açúcar para o resto do mundo." },
      { id: "haller", name: "Haller", image: IMAGES["factions/up-mago-alto"].src, briefing: "Região de florestas tropicais densas, com criaturas selvagens e instalações e laboratórios arcanos do governo. É pouco populosa, apesar de algumas cidades." },
      { id: "puerto-blanco", name: "Puerto Blanco", briefing: "Ilha com o maior sistema prisional da UP. Os maiores inimigos da república são enviados para trabalhar em suas minas de quartzo." },
      { id: "puerto-nobre", name: "Puerto Nobre", briefing: A_DEFINIR },
      { id: "la-luna", name: "La Luna", briefing: "Ilha onde fica Bonita, cidade da [[Companhia de Comércio do Mar do Arauto]]." },
      { id: "isla-de-la-vela", name: "Isla de la Vela", briefing: "Grande ponto de comércio e peregrinação." },
    ],
    pendencias: [`Briefing de Puerto Nobre: ${A_DEFINIR}.`, "La Luna só tem a cidade de Bonita (decisão do usuário), sem mais descrição."],
  },
  {
    id: "reino-de-laguardia",
    name: "Reino de Laguardia",
    mainArea: "Schwarzenberg",
    image: IMAGES["regions/laguardia-centro-comercial"].src,
    andarilho: IMAGES["regions/laguardia-andarilho"].src,
    bandeira: IMAGES["regions/laguardia-bandeira"].src,
    source: ["Contexto basico de faccoes.docx", "O Sistema de Magia e a Engenharia dos Cajados em Athanor.docx", "dedução"],
    briefing:
      "Um reino de vulcões, forjas e pólvora, que atravessou a queda do [[Antigo Império]] sem perder a coroa. Ali estão as principais oficinas do mundo, os estaleiros que servem à [[Companhia de Comércio do Mar do Arauto]] e famílias nobres que governam cada região em nome do rei. Entre casas de estilo bávaro nascem os mercenários de espada longa, pistola e capacete sallet que o mundo inteiro contrata.",
    implications:
      "Laguardia acolhe quem se comporta, e não tem paciência com quem não se comporta. Você vem do berço da pólvora: pistolas e montantes fazem parte da sua criação, e mercenários laguardianos são respeitados, e temidos, em todo canto. As forjas guardam em sigilo absoluto os segredos dos magos que as contratam, e você aprendeu que, ali, quem fala demais não dura.",
    subregions: [
      ...FAMILIAS_LAGUARDIA.map((f) => ({
        id: f.toLowerCase().replace("ü", "u"),
        name: f,
        source: (PERFIL_FAMILIA[f]
          ? ["Contexto basico de faccoes.docx", "artes conceituais das famílias de Laguardia"]
          : ["Contexto basico de faccoes.docx"]) satisfies Source[],
        // famílias sem arte própria ficam com a arte da região
        ...(ARTE_FAMILIA[f] && { image: ARTE_FAMILIA[f] }),
        briefing:
          f === "Schwarzenberg"
            ? "A capital do reino e terra do rei Ludwig von Schwarzenberg. Como as demais regiões, leva o nome da família que a administra."
            : (PERFIL_FAMILIA[f] ?? `Região administrada pela família ${f} em nome do rei.`),
      })),
    ],
    pendencias: [
      "As 13 regiões de família além da capital têm perfil tirado das artes conceituais; o documento só lista os nomes, então os perfis ainda precisam ser confirmados na lore.",
    ],
  },
  {
    id: "reino-de-kruk",
    name: "Kruk (Reino Fronteiriço)",
    image: IMAGES["regions/kruk-comunidade"].src,
    andarilho: IMAGES["regions/kruk-andarilho"].src,
    source: ["Regras Globais do Cenário.docx", "Raça_ Homens-Galho.docx", "COMPÊNDIO DE APARÊNCIA E BIOLOGIA — ATHANOR.docx", "dedução"],
    briefing:
      "A maior e mais estável nação dos [[Homens-Galho]]: cidades-fortalezas escavadas na rocha, onde todos trabalham sem descanso sob os [[feromônios]] da rainha, [[Arauto]] de [[Mui]]. O Estado dá moradia e alimento em troca de trabalho perpétuo, e até a morte serve à colmeia, quando os velhos viram energia para os feitiços da nação. Isolacionista, Kruk desconfia de tudo o que vem de fora.",
    implications:
      "Fora da colmeia, quem conhece Kruk o vê como peça de uma máquina, não como indivíduo, e os caçadores de escravos o veem como presa. Seu povo é isolacionista, e os ataques dos centauros já o empurraram das lavouras para debaixo da terra. Longe dos barris de feromônio que a capital envia, sua mente começa a mudar.",
    subregions: [],
    pendencias: [`Subregiões: ${A_DEFINIR} (nenhuma listada nos documentos).`],
  },
  {
    id: "reino-de-crick",
    name: "Crick (A Horda de Southgarden)",
    image: IMAGES["regions/crick-povoado"].src,
    andarilho: IMAGES["regions/crick-andarilho"].src,
    source: ["Regras Globais do Cenário.docx", "Raça_ Homens-Galho.docx", "A noite maldita.docx", "COMPÊNDIO DE APARÊNCIA E BIOLOGIA — ATHANOR.docx", "decisão do usuário", "dedução"],
    briefing:
      "A Horda de Southgarden: um reino subterrâneo erguido por um príncipe traidor que roubou as princesas de [[Kruk]] e transformou a rainha em fantoche. Devota de [[Tamem]], Crick molda seus filhos com magia em criaturas de guerra medonhas, que misturam ao acaso besouro, vespa, cupim e escorpião, e queima linhagens inteiras como combustível. Na [[Noite Maldita]] devorou uma cidade inteira, e o mundo nunca mais esqueceu.",
    implications:
      "Quase todos os vizinhos são seus inimigos: a [[Irmandade de São Ferdinand]] cerca seu reino com fortes, e centauros velhos peregrinam até Crick só para morrer lutando contra a horda. Em qualquer terra humana, ser reconhecido como da horda é ser tratado como monstro. Seu corpo foi feito para uma função e, se essa função for a guerra, poucos o igualam em brutalidade.",
    subregions: [],
    pendencias: [`Subregiões: ${A_DEFINIR} (nenhuma listada nos documentos).`],
  },
  {
    // sem arte no acervo: card e vitrine usam o brasão (SimboloRegiao) até chegar uma ilustração
    id: "irmandade-de-sao-ferdinand",
    name: "Irmandade de São Ferdinand",
    semAndarilho: true, // decisão do usuário: quem vem da Irmandade é de um dos fortes
    source: ["Contexto basico de faccoes.docx", "Minor Powers.docx", "A noite maldita.docx", "decisão do usuário", "dedução"],
    briefing:
      "Uma ordem de guerra nascida da lenda de São Ferdinand, o santo de [[Activum]] que ganhou dois braços extras para lutar com quatro espadas. Dos fortes que cercam [[Crick]], seus guerreiros mutados protegem viajantes, comerciantes e peregrinos e, na prática, governam a fronteira como uma junta militar: cobram impostos, mantêm a ordem e aplicam a lei.",
    implications:
      "Vir da Irmandade é ter servido num dos fortes, sob a disciplina de uma junta militar e com a horda sempre à vista. Comerciantes e peregrinos que dependem das suas estradas o recebem com gratidão, e [[Highbridge]] e [[Midland]] pagam sua guerra, mas os devotos de [[Umbra]] o veem como herege. Você conhece de perto o que Crick é capaz de fazer.",
    subregions: [
      { id: "forte-norte", name: "Forte Norte", image: IMAGES["regions/irmandade-forte-norte"].src, briefing: "Guarda a passagem entre a cordilheira e o lago central, por onde a horda tenta descer rumo a [[Midland]], e é o forte mais próximo das terras libertadas de Warsaw. O frio castiga muros e sentinelas, e os ataques vêm em ondas, de modo que o inverno ali é tão inimigo quanto a horda. Quem serve no Forte Norte dorme pouco e tem pouco tempo para se achar herói." },
      { id: "forte-sul", name: "Forte Sul", image: IMAGES["regions/irmandade-forte-sul"].src, briefing: "Vigia a ponta sul da cordilheira, entre [[Crick]] e o deserto, onde o calor e a poeira gastam homens e armas e os confrontos com a horda não dão trégua. É por ele que passam os [[Centauros]] que peregrinam para morrer em batalha contra a horda, e as perdas são constantes. Quem é enviado ao Forte Sul aprende que sobreviver é a parte mais difícil do dever." },
      { id: "forte-central", name: "Forte Central", image: IMAGES["regions/irmandade-forte-central"].src, briefing: "Fica no meio do cerco, entre o rio e a cordilheira, ligado por estradas aos outros fortes. Dali partem as patrulhas e os comboios que mantêm a fronteira sob a lei da junta militar. A guarnição vive em alerta e em ronda, sem folga de verdade, porque uma brecha no centro abriria todos os outros fortes." },
      { id: "forte-oeste", name: "Forte Oeste", image: IMAGES["regions/irmandade-forte-oeste"].src, briefing: "Fica do lado de [[Midland]] e recebe o ouro e os suprimentos que chegam pela rota de Koloberg, por onde também entram os recrutas e os mosquetes da Irmandade. É o forte mais calmo e burocrático: ali se administram os recursos, se registram os estoques e se coletam os impostos que sustentam a guerra. A rotina é de livros-caixa e inventários, e o maior perigo é o desvio, não a horda." },
    ],
    pendencias: ["Nomes dos fortes provisórios (Norte, Sul, Oeste e Central, no lado oeste da cordilheira de Crick), a definir pelo autor.", "Sem arte própria; usa o brasão desenhado."],
  },
  {
    id: "companhia-de-comercio",
    name: "Companhia de Comércio do Mar do Arauto",
    image: IMAGES["regions/companhia-porto"].src,
    andarilho: IMAGES["regions/companhia-andarilho"].src,
    source: ["Contexto basico de faccoes.docx", "Minor Powers.docx", "Regras Globais do Cenário.docx", "decisão do usuário", "dedução"],
    briefing:
      "Potência mercantil dona das cidades de Bonita e Belladona, que comercia por mar com todas as nações e faz a ponte entre os [[Centauros]] e a [[UP]]. Seus capitães são especialistas em navegar o gelo do [[Mar do Arauto]] e vestem roupas inspiradas no povo inuíte, com variantes para o calor.",
    implications:
      "Vir da Companhia é ter crescido entre navios, armazéns e contratos, num lugar onde se negocia com qualquer um que pague. Você aprendeu a navegar o gelo, a ler uma carta náutica e a medir o valor de tudo, e o mundo o reconhece pelas roupas de inspiração inuíte. A Companhia lucra comprando e revendendo o que os outros capturam, inclusive escravos, e quem sofre com isso não esquece.",
    subregions: [
      { id: "bonita", name: "Bonita", image: IMAGES["regions/companhia-bonita"].src, briefing: "Cidade mercantil da Companhia, na ilha de La Luna, na [[UP]]. É onde navios de todas as nações atracam para negociar." },
      { id: "belladona", name: "Belladona", image: IMAGES["regions/companhia-belladona"].src, briefing: "Entreposto da Companhia numa ilha distante, ao sul do [[Império das Estepes]], onde param os navios das longas viagens. É a segunda cidade mercantil da Companhia, tão influente quanto Bonita." },
    ],
    pendencias: ["Lore curta: só se sabe que tem duas cidades, navega o gelo e comercia com todos.", "Belladona e Bonita só têm a função e o lugar (decisão do usuário), sem mais descrição."],
  },
  {
    id: "imperio-das-estepes",
    name: "Império das Estepes (Gorturk)",
    image: IMAGES["regions/estepes-acampamento"].src,
    source: ["Regras Globais do Cenário.docx", "Os centauros.docx", "dedução"],
    briefing:
      "Mares de capim sem cercas, cruzados por um império que nunca para de avançar. Os [[Centauros]] seguem [[Gorturk]] e o [[Cavalga-mundos]], que os guia há mais de 200 anos, e vivem da pilhagem, da extorsão e da captura de escravos, muitas vezes [[Homens-Galho]]. Sem tradição acadêmica e sem magia, vencem pelo número e pelas cargas de choque.",
    implications:
      "Nas estepes, valor se mede em força e glória, e a honra proíbe a magia. Dizer o nome de nascimento do Cavalga-mundos é crime punido com a morte, e quase todo centauro é, em algum grau, parente dele. Fora do império, quem vem das estepes é visto como saqueador ou mercenário, e homens-galho têm bons motivos para temê-lo.",
    subregions: [],
    pendencias: [`Subregiões: ${A_DEFINIR} (nenhuma listada nos documentos).`],
  },
  {
    id: "reclusos-do-deserto",
    name: "Reclusos do Deserto",
    mainArea: "Mahabam",
    image: IMAGES["misc/dojo-deserto"].src,
    andarilho: IMAGES["regions/deserto-andarilho"].src,
    source: ["Regras Globais do Cenário.docx", "Os homens do deserto.docx", "A origem do deserto de Marranol.docx", "dedução"],
    briefing:
      "Oásis escondidos entre dunas e rochas, no deserto que um dia foi o rico país de [[Marranol]], antes que a ambição de um mago tirano o queimasse. Ali vivem comunidades reclusas, quase todas de [[Homens do Deserto]], em torno de juízes da lei, anciãos e [[Dojos]] devotos de [[Logan]], onde filosofia, debate e luta são uma coisa só. A cidade de [[Mahabam]] é a porta por onde os estrangeiros entram, com cuidado.",
    implications:
      "Quem vem dos Reclusos carrega a calma, a disciplina e a memória longa dos Dojos, e lá fora isso costuma parecer frieza. Seu povo vê a magia como tabu, lembrança do desastre que transformou a própria terra em deserto. Os estrangeiros são bem-vindos em Mahabam, mas sempre tratados com cuidado, e você aprendeu a fazer o mesmo.",
    subregions: [
      { id: "mahabam", name: "Mahabam", image: IMAGES["regions/deserto-mahabam"].src, source: ["Os homens do deserto.docx", "decisão do usuário"], briefing: "Cidade-estado ao norte do deserto que serve de parada para viajantes, peregrinos e comerciantes de outras terras. Seus moradores não rejeitam estrangeiros, apenas os tratam com cuidado." },
    ],
    pendencias: [`Outras subregiões: ${A_DEFINIR}.`],
  },
  {
    id: "mannaka-oko",
    name: "Man'naka oko",
    image: IMAGES["regions/mannaka-oko-campo"].src,
    source: ["A terra de Man_naka oko.docx", "decisão do usuário", "dedução"],
    briefing:
      "Uma terra distante, hoje um deserto de sucata onde vigora a lei do mais forte. Contam que o shogun Susanoo trocou o sangue dos filhos por prosperidade, que o filho poupado matou o pai e a criatura do pacto, e que a terra cobrou a dívida em secas, tempestades e terremotos. Hoje se vive da escravidão imposta pelos shoguns do deserto e da sucata ancestral vendida à [[Companhia de Comércio do Mar do Arauto]].",
    implications:
      "Em Man'naka oko quase não aparece gente de fora, e ninguém liga para a sua espécie: o que conta é se você luta e sobrevive. Lá fora, o chapéu kasa de metal, a armadura de sucata e a katana denunciam uma terra que poucos conhecem e muitos acham lenda. Alguns da sua terra herdam o [[Terceiro Olho]], bênção para uns e maldição para outros.",
    subregions: [],
    pendencias: [`Subregiões: ${A_DEFINIR} (nenhuma nos documentos lidos).`],
  },
];
