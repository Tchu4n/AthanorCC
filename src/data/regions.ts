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
    source: ["Minor Powers.docx", "Subregioes.docx"],
    briefing:
      "Estado fantoche da [[UP]], o protetorado vive de pesca, coleta e miséria, e é o coração de uma guerra civil não declarada. Sua população, durona e ressentida, se vê como bucha de canhão. Forma uma barreira de carne contra as incursões de [[Vargarf]] e precisa pedir permissão à UP para quase tudo.",
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
    source: ["Minor Powers.docx", "Subregioes.docx", "decisão do usuário"],
    briefing:
      "Sociedade tribal regida pela lei do mais forte, que vive de saque marítimo, caça de bestas e pesca gélida. Quando um chefe forte une as tribos, elas formam uma horda poderosa. Sem organização para guerras longas, fazem incursões violentas no [[Protetorado de Morrow]] e em territórios vizinhos sempre que há fome ou crise.",
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
    source: ["Minor Powers.docx", "Subregioes.docx"],
    briefing:
      "Povo isolacionista, taciturno e endurecido pelo clima, com aparência de povos da Sibéria, que usa lanças e domestica cães. Vive de agricultura sazonal de baixo rendimento e do comércio de peles e madeira com reinos humanos. Também troca por minérios com [[Kruk]], sendo intermediário tolerado pelos insetoides.",
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
    source: ["Minor Powers.docx", "Subregioes.docx"],
    briefing:
      "Feudo de agricultura extensiva e muito rentável, que enriquece exportando grãos pelo [[Rio Rhenus]]. A divisão em 11 regiões cria um ninho de cobras político entre vassalos e castelões, com tributação pesada dos camponeses e paranoia de espionagem. O exército protege o rio e as fronteiras, e seus cavaleiros lembram hussardos alados.",
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
    source: ["Minor Powers.docx", "Subregioes.docx"],
    briefing:
      "Monarquia aristocrática em ascensão, que vive de pecuária de grande porte e extração de madeira. A proximidade com o [[Mosteiro de Itelonomeu]] traz forte influência dos dogmas de [[Umbra]] à corte. Ao mesmo tempo, o reino financia a [[Irmandade de São Ferdinand]], que libertou parte de suas terras do domínio de [[Crick]], o que gera tensão com os nobres tradicionalistas.",
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
    source: ["Minor Powers.docx", "Subregioes.docx"],
    briefing:
      "Território perigoso e militarizado, onde a lei quase não se aplica e os senhores feudais vivem em escaramuças. Vive de agricultura intensiva, aquicultura e pesca pantanosa, e é o principal centro de contrabando pelo [[Mar do Arauto]]. Serve de tabuleiro para as grandes potências: ali a pólvora de [[Laguardia]] e a [[Magia de Trincheira]] da [[UP]] se enfrentam.",
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
    source: ["Minor Powers.docx", "Subregioes.docx"],
    briefing:
      "Nação cosmopolita, elitista e neutra, formada por banqueiros e embaixadores, que vive de pedágios, taxas e serviços bancários sobre a infraestrutura intacta do [[Antigo Império]]. Ninguém a ataca, porque destruir suas pontes e bancos arruinaria o comércio de todos. Abriga as principais universidades do continente e financia a [[Irmandade de São Ferdinand]] para manter [[Crick]] longe.",
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
    source: ["União das Províncias (UP).docx", "Regras Globais do Cenário.docx"],
    briefing:
      "Democracia representativa nascida da revolução que derrubou o [[Antigo Império]], com [[Umbra]] e [[Activum]] como religiões oficiais. Qualquer raça pode conquistar cidadania, mas a elite detém o monopólio legal da magia e as armas de fogo são proibidas. A escravidão é legalizada, e a estética mistura a Espanha colonial com arquitetura modernista.",
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
      { id: "la-luna", name: "La Luna", briefing: A_DEFINIR },
      { id: "isla-de-la-vela", name: "Isla de la Vela", briefing: "Grande ponto de comércio e peregrinação. Abriga Bonita, cidade da [[Companhia de Comércio do Mar do Arauto]]." },
    ],
    pendencias: [`Briefing de Puerto Nobre: ${A_DEFINIR}.`, `Briefing de La Luna: ${A_DEFINIR}.`],
  },
  {
    id: "reino-de-laguardia",
    name: "Reino de Laguardia",
    mainArea: "Schwarzenberg",
    image: IMAGES["regions/laguardia-centro-comercial"].src,
    andarilho: IMAGES["regions/laguardia-andarilho"].src,
    bandeira: IMAGES["regions/laguardia-bandeira"].src,
    source: ["Contexto basico de faccoes.docx", "O Sistema de Magia e a Engenharia dos Cajados em Athanor.docx"],
    briefing:
      "Monarquia tradicional e estável em região vulcânica, que sobreviveu à queda do [[Antigo Império]]. Pioneira no uso da pólvora, abriga as principais oficinas e forjas do mundo e constrói os navios usados no comércio com a [[Companhia de Comércio do Mar do Arauto]]. Com estética bávara, o reino é famoso por seus mercenários, e boa parte do território é administrada por famílias nobres em nome do rei.",
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
    source: ["Regras Globais do Cenário.docx", "Raça_ Homens-Galho.docx", "COMPÊNDIO DE APARÊNCIA E BIOLOGIA — ATHANOR.docx"],
    briefing:
      "Maior e mais estável nação dos [[Homens-Galho]], devota de [[Mui]], com cidades-fortalezas subterrâneas escavadas na rocha de regiões montanhosas. A colmeia é mantida pelos [[feromônios]] da rainha, que atua como [[Arauto]] de Mui. O Estado provê moradia e alimento em troca de trabalho perpétuo, e príncipes envelhecidos são expurgados para evitar dissidência.",
    subregions: [],
    pendencias: [`Subregiões: ${A_DEFINIR} (nenhuma listada nos documentos).`],
  },
  {
    id: "reino-de-crick",
    name: "Crick (A Horda de Southgarden)",
    image: IMAGES["regions/crick-povoado"].src,
    andarilho: IMAGES["regions/crick-andarilho"].src,
    source: ["Regras Globais do Cenário.docx", "Raça_ Homens-Galho.docx", "A noite maldita.docx", "COMPÊNDIO DE APARÊNCIA E BIOLOGIA — ATHANOR.docx"],
    briefing:
      "Reino rebelde de [[Homens-Galho]], fundado por um príncipe resistente aos [[feromônios]] que sequestrou as princesas de [[Kruk]] e reduziu sua rainha a fantoche. Devoto de [[Tamem]], molda seus súditos com magia em criaturas grotescas otimizadas para a guerra ou o trabalho. Ficou conhecido pela [[Noite Maldita]] e mantém escaramuças com todos os vizinhos.",
    subregions: [],
    pendencias: [`Subregiões: ${A_DEFINIR} (nenhuma listada nos documentos).`],
  },
  {
    // sem arte no acervo: card e vitrine usam o brasão (SimboloRegiao) até chegar uma ilustração
    id: "irmandade-de-sao-ferdinand",
    name: "Irmandade de São Ferdinand",
    semAndarilho: true, // decisão do usuário: quem vem da Irmandade é de um dos fortes
    source: ["Contexto basico de faccoes.docx", "Minor Powers.docx", "A noite maldita.docx", "decisão do usuário"],
    briefing:
      "Ordem guerreira inspirada em São Ferdinand, santo de [[Activum]] que ganhou dois braços extras e lutou com quatro espadas. Seus guerreiros recorrem a mutações e aprimoramentos para conter [[Crick]], a partir de fortes que cercam a horda. Na prática, uma junta militar governa a fronteira: cobra impostos, mantém a ordem e aplica a lei.",
    subregions: [
      { id: "forte-norte", name: "Forte Norte", briefing: "Guarda a passagem entre a cordilheira e o lago central, por onde a horda tenta descer rumo a [[Midland]]. É o forte mais próximo das terras libertadas de Warsaw." },
      { id: "forte-sul", name: "Forte Sul", briefing: "Vigia a ponta sul da cordilheira, entre [[Crick]] e o deserto. É por ele que passam os [[Centauros]] que peregrinam para morrer em batalha contra a horda." },
      { id: "forte-central", name: "Forte Central", briefing: "Fica no meio do cerco, entre o rio e a cordilheira, ligado por estradas aos outros fortes. Dali partem as patrulhas e os comboios que mantêm a fronteira sob a lei da junta militar." },
      { id: "forte-oeste", name: "Forte Oeste", briefing: "Fica do lado de [[Midland]] e recebe o ouro e os suprimentos que chegam pela rota de Koloberg. Por ele entram os recrutas e os mosquetes da Irmandade." },
    ],
    pendencias: ["Nomes dos fortes provisórios (Norte, Sul, Oeste e Central, no lado oeste da cordilheira de Crick), a definir pelo autor.", "Sem arte própria; usa o brasão desenhado."],
  },
  {
    id: "imperio-das-estepes",
    name: "Império das Estepes (Gorturk)",
    image: IMAGES["regions/estepes-acampamento"].src,
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
    andarilho: IMAGES["regions/deserto-andarilho"].src,
    source: ["Regras Globais do Cenário.docx", "Os homens do deserto.docx", "A origem do deserto de Marranol.docx"],
    briefing:
      "Comunidades reclusas, predominantemente de [[Homens do Deserto]], que vivem em oásis escondidos no deserto de [[Marranol]]. Não formam grandes reinos: organizam-se em torno de juízes da lei, anciãos e [[Dojos]] devotos de [[Logan]]. Tratam a magia com extrema suspeita e a estudam pela matemática.",
    subregions: [
      { id: "mahabam", name: "Mahabam", image: IMAGES["regions/deserto-mahabam"].src, source: ["Os homens do deserto.docx", "decisão do usuário"], briefing: "Cidade-estado ao norte do deserto que serve de parada para viajantes, peregrinos e comerciantes de outras terras. Seus moradores não rejeitam estrangeiros, apenas os tratam com cuidado." },
    ],
    pendencias: [`Outras subregiões: ${A_DEFINIR}.`],
  },
  {
    id: "mannaka-oko",
    name: "Man'naka oko",
    image: IMAGES["regions/mannaka-oko-campo"].src,
    source: ["A terra de Man_naka oko.docx"],
    briefing:
      "Terra distante e isolada, hoje um deserto de sucata onde vigora a lei do mais forte. Segundo a lenda de Susanoo, um pacto de sangue trouxe prosperidade tecnológica, e sua quebra reduziu a civilização a destroços e poluição. A economia vive da escravidão pelos shoguns do deserto e da venda de sucata ancestral à [[Companhia de Comércio do Mar do Arauto]].",
    subregions: [],
    pendencias: [`Subregiões: ${A_DEFINIR} (nenhuma nos documentos lidos).`],
  },
];
