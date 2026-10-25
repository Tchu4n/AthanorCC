import { IMAGES } from "./images.ts";
import { A_DEFINIR, type RegionData } from "./types.ts";

const FAMILIAS_LAGUARDIA = [
  "Krupp", "Eisenhauer", "Waldschmidt", "Bauer", "Wagner", "Fugger", "Hoffmann",
  "Ritter", "Krieger", "Wolf", "Müller", "Vogel", "Bergmann",
];

export const regions: RegionData[] = [
  {
    id: "protetorado-de-morrow",
    name: "Protetorado de Morrow",
    mainArea: "Ironmud",
    image: IMAGES["regions/morrow-habitante"].src,
    source: ["Minor Powers.docx", "Subregioes.docx"],
    briefing:
      "Estado fantoche da [[UP]], o protetorado vive de pesca, coleta e miséria, e é o coração de uma guerra civil não declarada. Sua população, durona e ressentida, se vê como bucha de canhão. Forma uma barreira de carne contra as incursões de [[Vargarf]] e precisa pedir permissão à UP para quase tudo.",
    subregions: [
      { id: "ironmud", name: "Ironmud", briefing: "Pântano central pontilhado por infraestrutura imperial antiga que mal funciona. É o núcleo administrativo da burocracia fantoche imposta pela [[UP]]." },
      { id: "costa-afogada", name: "Costa Afogada", briefing: "Região litorânea onde a pesca é a única forma de subsistência. Sua população é a que mais sofre com os ataques navais de [[Vargarf]]." },
      { id: "lamacal", name: "Lamaçal", briefing: "Epicentro da miséria e principal campo de batalha da guerra civil não declarada. Ali os locais lutam por migalhas e pela posse das ruínas que ainda têm algum valor." },
      { id: "fosso-norte", name: "Fosso Norte", briefing: "Trincheira natural e principal linha de defesa, a mais lamacenta do protetorado. Ali os soldados miseráveis absorvem as incursões de [[Vargarf]] e outros perigos." },
    ],
    pendencias: [`Quinta subregião: ${A_DEFINIR} (o cabeçalho de Subregioes.docx diz 5, mas o texto lista 4).`],
  },
  {
    id: "chiefdom-de-vargarf",
    name: "Chiefdom de Vargarf",
    mainArea: "Os Fiordes Cortantes (Shatterfjords)",
    image: IMAGES["regions/vargarf-guerreiro"].src,
    source: ["Minor Powers.docx", "Subregioes.docx", "decisão do usuário"],
    briefing:
      "Sociedade tribal regida pela lei do mais forte, que vive de saque marítimo, caça de bestas e pesca gélida. Quando um chefe forte une as tribos, elas formam uma horda poderosa. Sem organização para guerras longas, fazem incursões violentas no [[Protetorado de Morrow]] e em territórios vizinhos sempre que há fome ou crise.",
    subregions: [
      { id: "baia-da-boa-viagem", name: "Baía da Boa Viagem", briefing: "Assentamento costeiro de onde partem os botes e navios longos. É o ponto de saída para os ataques marítimos e para a pesca." },
      { id: "fiordes-cortantes", name: "Os Fiordes Cortantes (Shatterfjords)", source: ["Subregioes.docx", "decisão do usuário"], briefing: "A região mais fria e isolada de Vargarf. É onde vivem as tribos mais duras." },
    ],
    pendencias: [`Entrada "Território repleto de tribos" está incompleta em Subregioes.docx: ${A_DEFINIR}.`],
  },
  {
    id: "oakhaven",
    name: "Oakhaven",
    image: IMAGES["regions/oakhaven-habitante"].src,
    source: ["Minor Powers.docx", "Subregioes.docx"],
    briefing:
      "Povo isolacionista, taciturno e endurecido pelo clima, com aparência de povos da Sibéria, que usa lanças e domestica cães. Vive de agricultura sazonal de baixo rendimento e do comércio de peles e madeira com reinos humanos. Também troca por minérios com [[Kruk]], sendo intermediário tolerado pelos insetoides.",
    subregions: [
      { id: "posto-das-peles", name: "Posto das Peles", briefing: "Assentamento focado no comércio sazonal com os reinos humanos do sul. Serve de entreposto logístico durante o degelo." },
      { id: "fronteira-cinzenta", name: "Fronteira Cinzenta (Greywatch)", briefing: "Região limite que faz fronteira direta com [[Kruk]]. É habitada por mercadores rústicos que lidam com a diplomacia dos príncipes formigoides." },
      { id: "floresta-do-uivo", name: "Floresta do Uivo", briefing: "A vasta região florestal de onde Oakhaven extrai sua madeira." },
    ],
    pendencias: [],
  },
  {
    id: "planicies-de-sunfield",
    name: "Planícies de Sunfield",
    image: IMAGES["factions/sunfield-cavaleiro"].src,
    source: ["Minor Powers.docx", "Subregioes.docx"],
    briefing:
      "Feudo de agricultura extensiva e muito rentável, que enriquece exportando grãos pelo [[Rio Rhenus]]. A divisão em 11 regiões cria um ninho de cobras político entre vassalos e castelões, com tributação pesada dos camponeses e paranoia de espionagem. O exército protege o rio e as fronteiras, e seus cavaleiros lembram hussardos alados.",
    subregions: [
      { id: "valdourado", name: "Valdourado (Goldshire)", briefing: "Celeiro administrativo do feudo. É onde a tributação pesada da base camponesa é recolhida e processada." },
      { id: "justa", name: "Justa (Jousting Fields)", briefing: "Região plana e rica dedicada aos famosos festivais de cavalaria e jogos. Ali a nobreza faz demonstrações de força e influência." },
      { id: "silvernest", name: "Silvernest", briefing: "Região de diplomacia, grandes bailes, burocracia e espionagem interna. É o ninho de cobras político dos castelões e vassalos mais antigos." },
      { id: "rivermark", name: "Rivermark", briefing: "Faixa de terra paralela ao [[Rio Rhenus]], a zona mais fértil do feudo. É também a mais vulnerável às inundações controladas usadas no plantio." },
      { id: "kingswheat", name: "Kingswheat", briefing: "Maior centro produtor e exportador de trigo da região." },
      { id: "highmeadow", name: "Highmeadow", briefing: "Região de pastos elevados. Ali se empregam as técnicas agrícolas mais eficientes e caras, para plantações delicadas." },
      { id: "southmarch", name: "Southmarch", briefing: "Fronteira sul militarizada e um dos acessos ao reino. Tem postos de guarda que vigiam o fluxo do [[Rio Rhenus]]." },
      { id: "clearwater", name: "Clearwater", briefing: "Território de moinhos aquáticos e silos. Prepara a produção para descer o rio." },
      { id: "farlands", name: "Farlands", briefing: "As piores terras férteis do feudo. São administradas por famílias de vassalos que perderam os jogos de influência." },
      { id: "senestra", name: "Senestra", briefing: "Extensos domínios pessoais sob proteção direta da família governante mais poderosa." },
      { id: "timberborder", name: "Timberborder", briefing: "Zona florestal reservada à caça e ao entretenimento privado da nobreza feudal." },
    ],
    pendencias: [],
  },
  {
    id: "midland",
    name: "Midland",
    mainArea: "Aurelia",
    image: IMAGES["factions/midland-cavaleiro"].src,
    source: ["Minor Powers.docx", "Subregioes.docx"],
    briefing:
      "Monarquia aristocrática em ascensão, que vive de pecuária de grande porte e extração de madeira. A proximidade com o [[Mosteiro de Itelonomeu]] traz forte influência dos dogmas de [[Umbra]] à corte. Ao mesmo tempo, o reino financia a [[Irmandade de São Ferdinand]], que libertou parte de suas terras do domínio de [[Crick]], o que gera tensão com os nobres tradicionalistas.",
    subregions: [
      { id: "aurelia", name: "Aurelia", source: ["Subregioes.docx", "decisão do usuário"], briefing: "Domínio do rei e coração aristocrático do reino, com a corte central e os palácios. É também o núcleo do debate teológico." },
      { id: "donetskai", name: "Donetskai", briefing: "Planícies gigantescas onde ocorreu o boom da pecuária bovina. Gera enorme receita para o reino e alimenta a capital." },
      { id: "baddenberg", name: "Baddenberg", briefing: "Densa região florestal de extração de madeira. Abastece a construção civil." },
      { id: "umbra", name: "Umbra", briefing: "Território do sul que faz fronteira direta com o [[Mosteiro de Itelonomeu]]. Ali os dogmas de subordinação, tradição e obediência cega são aplicados com a severidade de uma teocracia. É a base eleitoral dos nobres tradicionalistas." },
      { id: "warsaw", name: "Warsaw", image: IMAGES["misc/batalha-warsaw"].src, briefing: "Terras que ficaram anos sob domínio da horda de [[Crick]]. Recém-libertadas pela [[Irmandade de São Ferdinand]], são foco de tensão sobre financiamento e reconstrução." },
      { id: "helsing", name: "Helsing", briefing: "Região mercantil e portuária. Vive das tarifas alfandegárias cobradas no comércio pelo lago central." },
      { id: "sarbrucken", name: "Sarbrucken", briefing: "Região montanhosa menor, dedicada à criação de cabras e à proteção de passagens." },
      { id: "alarsa", name: "Alarsa", briefing: "Assentamento comercial. Ali nobres tradicionalistas e representantes da [[Irmandade de São Ferdinand]] costumam negociar em sigilo." },
      { id: "longhorn", name: "Longhorn", briefing: "Região fronteiriça remota, focada em pecuária rústica. Resiste a ataques pontuais." },
      { id: "koloberg", name: "Koloberg", briefing: "Rota por onde passam recursos, gado e ouro destinados a financiar a guerra da [[Irmandade de São Ferdinand]]. É alvo de constante protesto político." },
    ],
    pendencias: [],
  },
  {
    id: "blackwater",
    name: "Blackwater",
    source: ["Minor Powers.docx", "Subregioes.docx"],
    briefing:
      "Território perigoso e militarizado, onde a lei quase não se aplica e os senhores feudais vivem em escaramuças. Vive de agricultura intensiva, aquicultura e pesca pantanosa, e é o principal centro de contrabando pelo [[Mar do Arauto]]. Serve de tabuleiro para as grandes potências: ali a pólvora de [[Laguardia]] e a [[Magia de Trincheira]] da [[UP]] se enfrentam.",
    subregions: [
      { id: "baia-dos-contrabandistas", name: "A Baía dos Contrabandistas (Smuggler's Bay)", briefing: "Principal porto não oficial, nas margens pantanosas, onde as regras de [[Laguardia]] não chegam. Ali a [[Companhia de Comércio do Mar do Arauto]] negocia na surdina." },
      { id: "fishersound", name: "Fishersound (Estuário Pescador)", briefing: "Canais e áreas de aquicultura, fortemente armados. São divididos entre gangues locais sob a fachada da pesca." },
      { id: "smokelands", name: "Smokelands", briefing: "Fronteira de escaramuças constantes. Ali a pólvora mercenária de [[Laguardia]] colide com a sucata arcana e táticas ilegais rivais." },
      { id: "a-guilda", name: "A Guilda", briefing: "Assentamento fortificado e zona neutra, mantida na bala. Ali espiões, mercenários desertores e senhores locais compram e vendem alianças de curto prazo." },
      { id: "mudcreek", name: "Mudcreek (Riacho de Lama)", briefing: "Zona agrícola intensiva e compactada sobre terrenos instáveis. Alimenta as gangues e milícias locais." },
      { id: "jakarta", name: "Jakarta", briefing: "O coração da infração tecnológica de Blackwater. Ali mercenários de rua e senhores locais trocam armas de fogo de [[Laguardia]] por cajados de série pirateados ou oxidados da [[UP]]." },
      { id: "grip", name: "Grip (O Aperto)", briefing: "Gargalo fluvial perto da saída do [[Rio Rhenus]], disputado por facções e bandidos. Quem o controla cobra taxas extorsivas e domina a descida do fluxo logístico." },
      { id: "porto-imperial", name: "Porto Imperial", briefing: "Foco na pesca pantanosa e no trânsito rápido de bens roubados. Seus moradores vivem na lama e atiram para matar nos inspetores." },
    ],
    pendencias: [],
  },
  {
    id: "grao-ducado-de-highbridge",
    name: "Grão-Ducado de Highbridge",
    image: IMAGES["regions/highbridge-arcos"].src,
    source: ["Minor Powers.docx", "Subregioes.docx"],
    briefing:
      "Nação cosmopolita, elitista e neutra, formada por banqueiros e embaixadores, que vive de pedágios, taxas e serviços bancários sobre a infraestrutura intacta do [[Antigo Império]]. Ninguém a ataca, porque destruir suas pontes e bancos arruinaria o comércio de todos. Abriga as principais universidades do continente e financia a [[Irmandade de São Ferdinand]] para manter [[Crick]] longe.",
    subregions: [
      { id: "ponte-matriz", name: "A Ponte Matriz (The Mother Span)", briefing: "Principal ponte remanescente do [[Antigo Império]]. É uma monstruosidade de engenharia." },
      { id: "eixo-universitario", name: "O Eixo Universitário (Scholar's Ward)", briefing: "Gigantesco complexo acadêmico onde estudam magos, nobres e filhos de barões. Sua presença dá blindagem diplomática ao ducado, pois ninguém bombardeia a universidade onde os próprios filhos estudam." },
      { id: "quarteirao-dourado", name: "O Quarteirão Dourado (Goldenvault)", briefing: "Distrito das imensas instituições financeiras e do sistema bancário central de Athanor. É neutro, intocável e fortemente guardado." },
      { id: "ala-das-embaixadas", name: "A Ala das Embaixadas (Embassytown)", briefing: "Zona cosmopolita habitada por emissários oficiais. Ali se tecem tramas e acordos sigilosos entre nações e potências." },
    ],
    pendencias: [],
  },
  {
    id: "uniao-das-provincias",
    name: "União das Províncias (UP)",
    mainArea: "Asenov",
    image: IMAGES["factions/up-exercito"].src,
    source: ["União das Províncias (UP).docx", "Regras Globais do Cenário.docx"],
    briefing:
      "Democracia representativa nascida da revolução que derrubou o [[Antigo Império]], com [[Umbra]] e [[Activum]] como religiões oficiais. Qualquer raça pode conquistar cidadania, mas a elite detém o monopólio legal da magia e as armas de fogo são proibidas. A escravidão é legalizada, e a estética mistura a Espanha colonial com arquitetura modernista.",
    subregions: [
      { id: "asenov", name: "Asenov", briefing: "Capital da UP e centro político, ministerial e intelectual, onde fica o Parlamento da Democracia Universal. Concentra a elite política, a arquitetura modernista e forte presença dos templos de [[Umbra]] e [[Activum]]. É a zona de mais alta segurança." },
      { id: "dragomir", name: "Dragomir", briefing: "Opera o comando militar logístico da defesa do estreito e do [[Protetorado de Morrow]]. Abriga os maiores depósitos militares." },
      { id: "munteanu", name: "Munteanu", briefing: "Região notável pela mineração, que sofre com a poluição." },
      { id: "krumov", name: "Krumov", briefing: "Região famosa pelo contraste entre riqueza e pobreza. Grandes favelas e sujeira convivem com uma das naturezas mais belas de Athanor." },
      { id: "sokolov", name: "Sokolov", briefing: "Região pesqueira, com forte agricultura." },
      { id: "stoyanov", name: "Stoyanov", briefing: "Possui as maiores reservas e campos de trabalho escravo da ilha." },
      { id: "zahariev", name: "Zahariev", briefing: "Possui o porto principal de Isla Prima, por onde todo o comércio flui para o resto da ilha." },
      { id: "lazarescu", name: "Lazarescu", briefing: "Famosa pela exportação de açúcar para o resto do mundo." },
      { id: "haller", name: "Haller", briefing: "Região de florestas tropicais densas, com criaturas selvagens e instalações e laboratórios arcanos do governo. É pouco populosa, apesar de algumas cidades." },
      { id: "puerto-blanco", name: "Puerto Blanco", briefing: "Ilha com o maior sistema prisional da UP. Os maiores inimigos da república são enviados para trabalhar em suas minas de quartzo." },
      { id: "puerto-nobre", name: "Puerto Nobre", briefing: A_DEFINIR },
      { id: "la-luna", name: "La Luna", briefing: A_DEFINIR },
      { id: "isla-de-la-vela", name: "Isla de la Vela", briefing: "Grande ponto de comércio e peregrinação. Abriga Bonita, cidade da [[Companhia de Comércio do Mar do Arauto]]." },
    ],
    pendencias: [`Briefing de Puerto Nobre: ${A_DEFINIR}.`, `Briefing de La Luna: ${A_DEFINIR}.`],
  },
  {
    id: "reino-de-laguardia",
    name: "Reino de Laguardia",
    mainArea: "Schwarzenberg",
    image: IMAGES["regions/laguardia-quartel"].src,
    source: ["Contexto basico de faccoes.docx", "O Sistema de Magia e a Engenharia dos Cajados em Athanor.docx"],
    briefing:
      "Monarquia tradicional e estável em região vulcânica, que sobreviveu à queda do [[Antigo Império]]. Pioneira no uso da pólvora, abriga as principais oficinas e forjas do mundo e constrói os navios usados no comércio com a [[Companhia de Comércio do Mar do Arauto]]. Com estética bávara, o reino é famoso por seus mercenários, e boa parte do território é administrada por famílias nobres em nome do rei.",
    subregions: [
      { id: "schwarzenberg", name: "Schwarzenberg", briefing: "A capital do reino e terra do rei Ludwig von Schwarzenberg. Como as demais regiões, leva o nome da família que a administra." },
      ...FAMILIAS_LAGUARDIA.map((f) => ({
        id: f.toLowerCase().replace("ü", "u"),
        name: f,
        briefing: `Região administrada pela família ${f} em nome do rei.`,
      })),
    ],
    pendencias: [`Detalhes das 13 regiões além da capital: ${A_DEFINIR} (o documento só lista o nome da família).`],
  },
  {
    id: "reino-de-kruk",
    name: "Reino de Kruk",
    image: IMAGES["species/homens-galho-principe"].src,
    source: ["Regras Globais do Cenário.docx", "Raça_ Homens-Galho.docx", "COMPÊNDIO DE APARÊNCIA E BIOLOGIA — ATHANOR.docx"],
    briefing:
      "Maior e mais estável nação dos [[Homens-Galho]], devota de [[Mui]], com cidades-fortalezas subterrâneas escavadas na rocha de regiões montanhosas. A colmeia é mantida pelos [[feromônios]] da rainha, que atua como [[Arauto]] de Mui. O Estado provê moradia e alimento em troca de trabalho perpétuo, e príncipes envelhecidos são expurgados para evitar dissidência.",
    subregions: [],
    pendencias: [`Subregiões: ${A_DEFINIR} (nenhuma listada nos documentos).`],
  },
  {
    id: "reino-de-crick",
    name: "Reino de Crick",
    image: IMAGES["regions/crick-criatura"].src,
    source: ["Regras Globais do Cenário.docx", "Raça_ Homens-Galho.docx", "A noite maldita.docx", "COMPÊNDIO DE APARÊNCIA E BIOLOGIA — ATHANOR.docx"],
    briefing:
      "Reino rebelde de [[Homens-Galho]], fundado por um príncipe resistente aos [[feromônios]] que sequestrou as princesas de [[Kruk]] e reduziu sua rainha a fantoche. Devoto de [[Tamem]], molda seus súditos com magia em criaturas grotescas otimizadas para a guerra ou o trabalho. Ficou conhecido pela [[Noite Maldita]] e mantém escaramuças com todos os vizinhos.",
    subregions: [],
    pendencias: [`Subregiões: ${A_DEFINIR} (nenhuma listada nos documentos).`],
  },
  {
    id: "imperio-das-estepes",
    name: "Império das Estepes (Gorturk)",
    source: ["Regras Globais do Cenário.docx", "Os centauros.docx"],
    briefing:
      "Império nômade dos [[Centauros]], guiado por [[Gorturk]] e liderado há mais de 200 anos por [[Ayalaal]], o Cavalga-mundos. Vive de pilhagem, trabalho mercenário, extorsão e captura de escravos, muitas vezes [[Homens-Galho]]. Abomina a magia e tem tecnologia rudimentar, compensada pelo grande número de guerreiros.",
    subregions: [],
    pendencias: [`Subregiões: ${A_DEFINIR} (nenhuma listada nos documentos).`],
  },
  {
    id: "reclusos-do-deserto",
    name: "Reclusos do Deserto",
    mainArea: "Mahabam",
    image: IMAGES["misc/dojo-deserto"].src,
    source: ["Regras Globais do Cenário.docx", "Os homens do deserto.docx", "A origem do deserto de Marranol.docx"],
    briefing:
      "Comunidades reclusas, predominantemente de [[Homens do Deserto]], que vivem em oásis escondidos no deserto de [[Marranol]]. Não formam grandes reinos: organizam-se em torno de juízes da lei, anciãos e [[Dojos]] devotos de [[Logan]]. Tratam a magia com extrema suspeita e a estudam pela matemática.",
    subregions: [
      { id: "mahabam", name: "Mahabam", source: ["Os homens do deserto.docx", "decisão do usuário"], briefing: "Cidade-estado ao norte do deserto que serve de parada para viajantes, peregrinos e comerciantes de outras terras. Seus moradores não rejeitam estrangeiros, apenas os tratam com cuidado." },
    ],
    pendencias: [`Outras subregiões: ${A_DEFINIR}.`],
  },
  {
    id: "mannaka-oko",
    name: "Man'naka oko",
    image: IMAGES["regions/mannaka-oko-guerreiro"].src,
    source: ["A terra de Man_naka oko.docx"],
    briefing:
      "Terra distante e isolada, hoje um deserto de sucata onde vigora a lei do mais forte. Segundo a lenda de Susanoo, um pacto de sangue trouxe prosperidade tecnológica, e sua quebra reduziu a civilização a destroços e poluição. A economia vive da escravidão pelos shoguns do deserto e da venda de sucata ancestral à [[Companhia de Comércio do Mar do Arauto]].",
    subregions: [],
    pendencias: [`Subregiões: ${A_DEFINIR} (nenhuma nos documentos lidos).`],
  },
];
