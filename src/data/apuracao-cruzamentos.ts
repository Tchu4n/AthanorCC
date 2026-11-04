// Versão da Agência dos cruzamentos de cruzamentos.ts: a escolha (espécie/subespécie, ofício ou fé) vinda de cada região,
// em terceira pessoa. Chave "escolha|região". Entra no parágrafo da origem (espécie) ou do ofício; sem texto, nada é acrescentado.
// {masculino|feminino}: concorda com o sexo do personagem (lib/ficha.ts, flexiona).
export const APURACAO_CRUZAMENTO: Record<string, string> = {
  // Homens do Deserto
  "homens-do-deserto|protetorado-de-morrow":
    "Em Morrow, onde ninguém jamais viu alguém assim, a altura e o casco viram assunto em cada vilarejo, e os miseráveis {o|a} olham com espanto e esperança. A jornada pelo casco {o|a} trouxe a uma terra de sofrimento: veio testemunhar e aliviar, não fazer política.",
  "homens-do-deserto|chiefdom-de-vargarf":
    "Um gigante do deserto no gelo de Vargarf é visão quase lendária. As tribos não {o|a} deixarão morrer de frio, mas demorarão a confiar. Se chegou tão longe, foi pela jornada pelo casco, e o frio é uma das provas mais duras que ela poderia impor.",
  "homens-do-deserto|oakhaven":
    "O povo de Oakhaven nunca viu alguém assim, e a pelagem espessa é talvez a única coisa familiar para eles. Os caçadores respeitam quem atravessa o mundo a pé, o que explica a jornada pelo casco e também por que {ele|ela} é {tolerado|tolerada} nos postos de peles.",
  "homens-do-deserto|planicies-de-sunfield":
    "Nos bailes e justas de Sunfield, {ele|ela} é a atração mais estranha que um castelão poderia exibir. Convém desconfiar de quem {o|a} convida: em terra de intrigas, curiosidade vira interesse. A jornada pelo casco {o|a} trouxe até aqui, e o que vê nas cortes pode ser uma lição, ou um aviso.",
  "homens-do-deserto|midland":
    "Midland nunca viu muitos de sua espécie, e a calma de Dojo destoa da corte devota de Umbra. {Ele|Ela} chama atenção por onde passa. Está aqui pela jornada pelo casco, e a fé alheia é mais um assunto a observar com paciência.",
  "homens-do-deserto|blackwater":
    "Em Blackwater, onde ninguém pergunta nada, {ele|ela} é a única coisa sobre a qual todos perguntam. A estatura e os golpes impõem respeito entre gangues e mercenários, e a jornada pelo casco {o|a} fez parar num porto sem lei porque ali o mundo aparece sem máscara.",
  "homens-do-deserto|grao-ducado-de-highbridge":
    "Em Highbridge, que recebe gente de toda parte, ninguém estranha por muito tempo um peregrino do deserto. A memória longa e o conhecimento da história impressionam os acadêmicos, e a jornada pelo casco {o|a} fez passar pelas bibliotecas e pelos arquivos do ducado.",
  "homens-do-deserto|uniao-das-provincias":
    "Na UP qualquer raça pode ser cidadã, mas {ele|ela} ainda é raridade nas ruas de concreto. A magia da União, gasta sem medida, parece ao povo d{ele|ela} um erro perigoso. A jornada pelo casco {o|a} trouxe até aqui para ver de perto aquilo que os anciãos só conhecem por relatos.",
  "homens-do-deserto|reino-de-laguardia":
    "Em Laguardia, {ele|ela} é {raro|rara} e chama atenção, mas o reino acolhe quem se comporta, e sabe se comportar. Os artesãos admiram a precisão. Veio pela jornada pelo casco, e a disciplina do reino lhe parece quase familiar.",
  "homens-do-deserto|irmandade-de-sao-ferdinand":
    "A Irmandade protege peregrinos e viajantes, e {ele|ela} está de passagem pela fronteira de Crick em busca do primeiro casco. Os mutantes respeitam quem luta bem, e luta.",
  "homens-do-deserto|imperio-das-estepes":
    "Os centauros respeitam a força, e a estatura e as artes marciais impõem respeito. A desconfiança da magia, ao menos, partilham. A jornada pelo casco {o|a} trouxe às estepes, e quem a faz sozinho entre guerreiros ganha fama rápido.",
  "homens-do-deserto|reclusos-do-deserto":
    "Está em casa: oásis, Dojos e anciãos são o seu mundo. Talvez ainda não tenha feito a peregrinação pelo primeiro casco, o que {o|a} torna, por ora, a menor das preocupações desta Agência.",
  "homens-do-deserto|mannaka-oko":
    "Em Man'naka oko ninguém liga para a espécie, só para quem sobrevive, e {ele|ela} nasceu para a areia. Os dois desertos não têm ligação, mas a dureza é a mesma.",
  // Homens-Galho Trabalhadores
  "trabalhador|protetorado-de-morrow":
    "Talvez tenha chegado a Morrow como escravo de alguém, ou fugindo de um, e na lama ninguém pergunta muito. Longe da colmeia, os feromônios se apagam devagar, e convém saber o que virá quando acabarem.",
  "trabalhador|chiefdom-de-vargarf":
    "As tribos não deixam ninguém morrer no frio, e um trabalhador incansável é bem-vindo onde o inverno mata. A confiança, porém, terá de ser ganha.",
  "trabalhador|oakhaven":
    "Os mercadores da Fronteira Cinzenta conhecem bem a casta, e é possível que tenha ficado para trás numa troca de minério. É tolerado enquanto trabalhar.",
  "trabalhador|planicies-de-sunfield":
    "Nos campos de Sunfield, um trabalhador homem-galho costuma ser tratado como ferramenta de algum senhor. Sem voz, depende de que alguém veja além da quitina, e esta Agência não aposta que alguém o faça.",
  "trabalhador|midland":
    "Em Midland, qualquer homem-galho lembra a horda que ocupou Warsaw, e {ele|ela} não tem voz para explicar que é diferente. O medo dos outros é o seu maior perigo.",
  "trabalhador|blackwater":
    "Em Blackwater é mercadoria corrente, {comprado|comprada} e {vendido|vendida} nos portos do contrabando. Fugir ali é fácil; continuar livre é que é difícil.",
  "trabalhador|grao-ducado-de-highbridge":
    "Em Highbridge, {um trabalhador incansável e sem vícios é funcionário valioso|uma trabalhadora incansável e sem vícios é funcionária valiosa}, e as casas ricas e as obras das pontes {o|a} contratam por salário. A lei imperial do ducado {o|a} trata como indivíduo capaz, com contrato, conta no banco, direitos e deveres, e não como propriedade. Longe da colmeia, os feromônios se apagam, e aqui há espaço para descobrir o que fazer com a própria vontade, observação que esta Agência registra com interesse.",
  "trabalhador|uniao-das-provincias":
    "A UP mantém campos de trabalho escravo, como os de Stoyanov, e usa homens-galho como mão de obra e combustível de magia. Conhece esse destino de perto, ou fugiu dele, e a segunda hipótese interessa mais a esta Agência.",
  "trabalhador|reino-de-laguardia":
    "Nas forjas e minas de Laguardia, um trabalhador incansável é útil, e o reino acolhe quem se comporta. Quem {o|a} trouxe até ali provavelmente se considera seu dono.",
  "trabalhador|reino-de-kruk":
    "Trabalha sem descanso para a colmeia, que lhe dá moradia, alimento e propósito, e no fim da vida será levado aos centros de processamento. Para Kruk isso não é crueldade, é o Estado perfeito.",
  "trabalhador|reino-de-crick":
    "Nasceu em Crick {moldado|moldada} para uma única função, talvez com ferramentas de osso no lugar das mãos. Para o Estado, sua vida não vale nada além da tarefa que cumpre.",
  "trabalhador|irmandade-de-sao-ferdinand":
    "Para os guerreiros da Irmandade, um trabalhador de Crick é abominação, e um de Kruk mal se distingue dele. Na fronteira, é prisioneiro, refugiado ou um milagre de sorte.",
  "trabalhador|imperio-das-estepes":
    "É exatamente o que os centauros caçam nas montanhas: o escravo perfeito, usado no império ou vendido para a UP e para a Companhia. Se está nas estepes, alguém é seu dono.",
  "trabalhador|reclusos-do-deserto":
    "Nos oásis ninguém {o|a} trata como mercadoria, e os anciãos talvez vejam nele um enigma digno de estudo. É raro encontrar tanta paz longe da colmeia.",
  "trabalhador|mannaka-oko":
    "Em Man'naka oko ninguém liga para a espécie, mas a escravidão dos shoguns não perdoa quem não sabe lutar. A carapaça e a resistência são tudo o que tem.",
  // Humanos comuns
  "humano-comum|protetorado-de-morrow":
    "Num lugar onde todos são pobres, um humano comum é só mais um rosto na lama, e isso às vezes protege. Cresceu vendo a UP levar o que podia e deixar só o bastante para o protetorado não ruir.",
  "humano-comum|chiefdom-de-vargarf":
    "Cresceu entre tribos que medem as pessoas pela força, não pelo sangue. Fora de lá, basta dizer que vem do Chiefdom para ser tratado como saqueador.",
  "humano-comum|oakhaven":
    "{Filho|Filha} do frio, das lanças e dos cães, aprendeu cedo a desprezar a moleza dos sulistas. Na Fronteira Cinzenta, viu de perto os príncipes de Kruk negociarem como gente.",
  "humano-comum|planicies-de-sunfield":
    "Se não nasceu nobre, nasceu sob o peso dos impostos que pagam os bailes e as justas. Conhece a terra, o rio e a fome dos anos ruins melhor do que qualquer castelão.",
  "humano-comum|midland":
    "Cresceu num reino de gado, madeira e devoção a Umbra, onde cada um sabe o seu lugar. Talvez tenha perdido alguém quando a horda tomou Warsaw, ou visto a Irmandade libertá-la.",
  "humano-comum|blackwater":
    "Num lugar sem lei, um humano comum aprende cedo a escolher um lado: gangue, milícia ou senhor feudal. Sabe atirar, sabe correr e sabe quando ficar {calado|calada}, qualidade rara e muito apreciada.",
  "humano-comum|grao-ducado-de-highbridge":
    "Cresceu à sombra das pontes, entre leis e burocracia herdadas do Antigo Império, que ali são tradição. Basta abrir uma conta no banco para ser tratado como indivíduo capaz, com direitos, deveres e responsabilidade pelos próprios atos, e aprendeu cedo a viver assim.",
  "humano-comum|uniao-das-provincias":
    "É {cidadão|cidadã}, vota e tem direito a uma vida digna, mas, como a maioria, vive pobre e longe da elite. Sem pertencer a ela, a magia lhe é proibida por lei, e as armas de fogo também.",
  "humano-comum|reino-de-laguardia":
    "Em Laguardia, quem trabalha e se comporta tem lugar, seja nas forjas, nas oficinas ou nas companhias de mercenários. Cresceu ouvindo pólvora e martelo.",
  "humano-comum|irmandade-de-sao-ferdinand":
    "Vive sob a lei da junta militar sem carregar as mutações dos guerreiros, talvez como tropeiro, ferreiro ou servo de um forte. Os mutantes protegem, mas nunca deixam esquecer quem segura a fronteira.",
  "humano-comum|imperio-das-estepes":
    "Um humano no império dos centauros é, quase sempre, cativo, mercenário ou comerciante de passagem. Se cresceu ali, aprendeu a ser útil, rápido e nunca fraco.",
  "humano-comum|reclusos-do-deserto":
    "Os oásis aceitam qualquer um, mas um humano entre os gigantes do deserto sempre parece pequeno. Se cresceu num Dojo, aprendeu a calar, debater e lutar com geometria.",
  "humano-comum|mannaka-oko":
    "Em Man'naka oko ninguém pergunta o que alguém é, só se sabe lutar e sobreviver no deserto de sucata. Conhece a katana, a escravidão dos shoguns e o valor de um pedaço de metal antigo.",
  // Elite de orelhas pontudas
  "elite-orelhas-pontudas|protetorado-de-morrow":
    "Uma orelha pontuda no protetorado é a cara da UP que o mantém de joelhos, e o ressentimento vem junto. Talvez esteja ali como burocrata ou oficial, {protegido|protegida} pelos seus e {odiado|odiada} por quase todos.",
  "elite-orelhas-pontudas|chiefdom-de-vargarf":
    "Um barão da UP entre as tribos do gelo é raro e chamativo: refém valioso, emissário perdido ou exilado. A hospitalidade de Vargarf não {o|a} deixa morrer no frio, mas ninguém ali se curva às suas orelhas.",
  "elite-orelhas-pontudas|oakhaven":
    "O povo de Oakhaven despreza os sulistas, e {este é o sulista mais refinado|esta é a sulista mais refinada} que eles já viram. O que {o|a} levou ao frio é uma história que só {ele|ela} sabe contar, e esta Agência gostaria de ouvi-la.",
  "elite-orelhas-pontudas|planicies-de-sunfield":
    "Entre os vassalos de Sunfield, as orelhas lembram uma potência estrangeira, mas os modos de corte se encaixam perfeitamente nos bailes e intrigas de Silvernest.",
  "elite-orelhas-pontudas|midland":
    "Na corte devota de Umbra, reconhece a mesma deusa que a UP venera, e isso abre algumas portas. Mesmo assim, para os nobres de Midland, é {estrangeiro|estrangeira} e talvez {espião|espiã}.",
  "elite-orelhas-pontudas|blackwater":
    "Em Blackwater, um barão da UP sem escolta é um resgate esperando para ser cobrado. Talvez esteja ali comprando lealdades para a União, ou fugindo dela.",
  "elite-orelhas-pontudas|grao-ducado-de-highbridge":
    "Muitos filhos de barões estudam no Eixo Universitário, e {este|esta} se encaixa bem entre embaixadas e bancos. Em Highbridge, a origem é só mais uma credencial na mesa, e cada um responde pelos próprios atos perante a lei do ducado.",
  "elite-orelhas-pontudas|uniao-das-provincias":
    "Está no topo: os cargos políticos e o monopólio legal da magia pertencem à sua casta. O povo {o|a} chama de {barão|baronesa}, e nem sempre com carinho.",
  "elite-orelhas-pontudas|reino-de-laguardia":
    "Os ferreiros de Laguardia forjam cajados para gente assim sob contratos de sigilo absoluto, e a respeitam por medo da retaliação dos magos. É {cliente valioso e perigoso|cliente valiosa e perigosa} de trair.",
  "elite-orelhas-pontudas|irmandade-de-sao-ferdinand":
    "Uma orelha pontuda entre os mutantes é presença estranha: talvez oficial de ligação, financiador ou desertor da própria casta. Na fronteira, ninguém se impressiona com títulos, só com quem segura a linha.",
  "elite-orelhas-pontudas|imperio-das-estepes":
    "Os centauros abominam a magia, e a gaiola no cinto é, para eles, a marca de um trapaceiro. Se vive no império, é como comprador de escravos, emissário ou prisioneiro de alto valor.",
  "elite-orelhas-pontudas|reclusos-do-deserto":
    "Para os Homens do Deserto, a magia gasta sem medida é exatamente o tipo de excesso que transformou Marranol em deserto. Será recebido com cuidado, e observado ainda mais.",
  "elite-orelhas-pontudas|mannaka-oko":
    "Em Man'naka oko a linhagem não vale nada, e o que importa é sobreviver ao deserto e à lâmina. Muitos da sua casta não sobreviveriam.",
  // Mutante de São Ferdinand
  "mutante-sao-ferdinand|irmandade-de-sao-ferdinand":
    "É exatamente o que a Irmandade promete ser: um corpo moldado para a guerra, servindo num dos fortes que cercam a horda. Ali, as mutações são farda e orgulho, não estigma.",
  // Príncipes
  "principe|protetorado-de-morrow":
    "Um príncipe homem-galho no protetorado é visão rara, talvez de passagem para negociar com a burocracia da UP. Os locais desconfiam de qualquer insetoide, mas um que fala já é meio caminho andado.",
  "principe|chiefdom-de-vargarf":
    "As tribos não deixam ninguém morrer no frio, nem um insetoide, mas também não confiam em quem não conhecem. A fala é a chance de provar que vale a hospitalidade.",
  "principe|oakhaven":
    "Oakhaven é a fronteira onde os seus trocam minério por peles e madeira, e na Fronteira Cinzenta os mercadores conhecem príncipes. É dos poucos lugares humanos onde é tolerado como parceiro.",
  "principe|planicies-de-sunfield":
    "Entre os nobres de Sunfield, um príncipe insetoide é curiosidade e ameaça ao mesmo tempo. Mas um feudo de intrigas sempre tem uso para um diplomata.",
  "principe|midland":
    "Midland ainda lembra a ocupação da horda, e poucos ali sabem distinguir Kruk de Crick. A fala e a diplomacia são o que fica entre ele e o medo deles.",
  "principe|blackwater":
    "Em Blackwater, um príncipe sabe que os de sua espécie valem dinheiro, e talvez esteja ali comprando, vendendo ou resgatando alguém. A lei não o protege, mas também não atrapalha.",
  "principe|grao-ducado-de-highbridge":
    "Highbridge é neutra por excelência, e a Ala das Embaixadas é o lugar natural de um diplomata. Ali, a espécie importa menos que a credencial, e o que vale é cumprir o protocolo e não tomar partido. A burocracia imperial do ducado trata todo titular de conta como responsável pelos próprios atos, inclusive um diplomata.",
  "principe|uniao-das-provincias":
    "Na UP, homens-galho são mão de obra e combustível de magia, e até um príncipe precisa provar que não é mercadoria. Qualquer raça pode conquistar cidadania, mas para ele o caminho é longo.",
  "principe|reino-de-laguardia":
    "Laguardia acolhe quem se comporta, e um príncipe que negocia com cortesia encontra parceiros nas oficinas e nas guildas. Os laguardianos olham para o dinheiro antes de olhar para a quitina.",
  "principe|reino-de-kruk":
    "É a voz da colmeia diante dos estrangeiros, mas também o maior risco para ela: cada ano o deixa mais resistente aos feromônios e mais perto do expurgo que a rainha impõe a todo príncipe antes que envelheça.",
  "principe|reino-de-crick":
    "Crick foi fundado por um príncipe, que governa com a rainha reduzida a fantoche. A ambição de um príncipe ali não é perigo, é o próprio regime.",
  "principe|irmandade-de-sao-ferdinand":
    "Na fronteira de Crick, todo homem-galho é inimigo até provar o contrário, e os mutantes não esperam provas. Se está ali, é como prisioneiro, desertor da horda ou diplomata muito corajoso.",
  "principe|imperio-das-estepes":
    "Os centauros caçam a espécie como escravos, e um príncipe que fala é presa ainda mais valiosa. Só a diplomacia e um preço muito bem negociado o mantêm livre no império.",
  "principe|reclusos-do-deserto":
    "Os Homens do Deserto tratam estrangeiros com cuidado, e um príncipe insetoide é o estrangeiro mais estranho que já cruzou um oásis. Ali, pelo menos, ninguém quer acorrentá-lo.",
  "principe|mannaka-oko":
    "Em Man'naka oko ninguém liga para a quitina, só para quem luta e sobrevive. A fala e a diplomacia valem ouro numa terra de shoguns e escravos.",
  // Princesas
  "princesa|protetorado-de-morrow":
    "No protetorado, uma princesa homem-galho seria vendida antes do pôr do sol, se alguém soubesse o que ela é. A sobrevivência ali depende de segredo e de proteção.",
  "princesa|chiefdom-de-vargarf":
    "As tribos de Vargarf não deixam ninguém morrer no frio, e talvez nem saibam o valor do que abrigam. Isso pode ser a sorte dela.",
  "princesa|oakhaven":
    "Os mercadores da Fronteira Cinzenta conhecem os homens-galho o bastante para saber o que ela vale. Para Oakhaven, é um segredo perigoso de guardar e um tesouro tentador de vender.",
  "princesa|planicies-de-sunfield":
    "Num feudo de espiões e intrigas, saber o que ela é seria munição política para qualquer castelão. Vive escondida ou sob a proteção de alguém muito poderoso.",
  "princesa|midland":
    "Midland lembra bem do que a horda de Crick fez com suas terras, e uma princesa é o começo de uma colônia. Se descobrirem o que ela é, o medo virá antes da cobiça.",
  "princesa|blackwater":
    "Blackwater é o maior mercado negro do continente, e uma princesa é a mercadoria mais valiosa que já passou por ali. Cada aliança que faz pode ser a próxima traição.",
  "princesa|grao-ducado-de-highbridge":
    "Highbridge é neutra e cheia de embaixadas, e talvez ela esteja ali como peça de um acordo entre nações. Dentro das leis do ducado, a posição é segura, mas a burocracia herdada do Antigo Império a trata como indivíduo responsável pelos próprios atos, e é prudente não dar a ninguém motivo para cobrar.",
  "princesa|uniao-das-provincias":
    "Na UP, homens-galho são mão de obra e combustível de magia, e uma princesa seria prêmio para qualquer laboratório arcano do governo. Vive em perigo constante.",
  "princesa|reino-de-laguardia":
    "Laguardia acolhe quem se comporta, mas um tesouro estratégico como ela atrai mais olhos do que o reino consegue vigiar. A segurança depende de quem a protege.",
  "princesa|reino-de-kruk":
    "É recurso estratégico da colmeia, protegida como nada mais no reino, porque dela depende a fundação de novas colônias. Sair de Kruk é perder essa proteção e virar alvo de todas as nações vizinhas.",
  "princesa|reino-de-crick":
    "Crick nasceu de princesas roubadas de Kruk, e esta é parte desse tesouro, guardada para gerar a horda. A vida dela pertence ao príncipe que governa.",
  "princesa|irmandade-de-sao-ferdinand":
    "Para a Irmandade, uma princesa é a semente de uma nova horda, e ela sabe disso. Se está entre os fortes, é como prisioneira, refém ou fugitiva sob uma proteção muito improvável.",
  "princesa|imperio-das-estepes":
    "Os centauros caçam homens-galho, e uma princesa é a presa mais valiosa das montanhas, vendida a peso de ouro para a UP ou para a Companhia. Se está no império, é cativa ou está fugindo.",
  "princesa|reclusos-do-deserto":
    "Os Homens do Deserto vivem em paz nos oásis e tratam estrangeiros com cuidado. Talvez seja o lugar mais seguro que ela já conheceu.",
  "princesa|mannaka-oko":
    "Em Man'naka oko ninguém liga para espécie, mas os shoguns do deserto vivem da escravidão. Ali, ela só vale o que consegue defender.",
  // Centauros
  "centauros|protetorado-de-morrow":
    "Os soldados miseráveis do protetorado não recusariam um centauro mercenário na linha contra Vargarf. A força vale ouro onde a lama engole os fracos.",
  "centauros|chiefdom-de-vargarf":
    "As tribos respeitam a força, como todo povo que vive pela lei do mais forte, mas não confiam sem motivo. No gelo, as estepes ficam muito longe, e {ele|ela} sente.",
  "centauros|oakhaven":
    "Os taciturnos de Oakhaven desconfiam de quem vem do sul, e um centauro longe das estepes chama atenção nos bosques gelados. A força, porém, fala uma língua que eles entendem.",
  "centauros|planicies-de-sunfield":
    "Sunfield admira cavaleiros e justas, e um centauro nas competições é sensação garantida. Os castelões contratam a força, mas temem a fome por glória.",
  "centauros|midland":
    "Midland conhece os centauros que peregrinam para morrer lutando contra Crick, e muitos ali os veem com respeito. Mercenários da espécie são bem-vindos nas fronteiras do reino.",
  "centauros|blackwater":
    "Em Blackwater, um mercenário centauro nunca fica sem trabalho, e a força decide escaramuças. Ali ninguém pergunta de onde veio, só quanto cobra.",
  "centauros|grao-ducado-de-highbridge":
    "O exército de Highbridge paga bem e atrai os guerreiros mais gloriosos, e um centauro estaria entre eles. Dentro do território do ducado vigora a lei herdada do Antigo Império, e todo mundo é responsável pelos próprios atos: pilhagem e captura de escravos dão cadeia. Fora dele, a lei do ducado não o alcança.",
  "centauros|uniao-das-provincias":
    "A UP compra escravos dos centauros pela Companhia, então a relação é conhecida: negócio, não amizade. Os cidadãos o veem como bárbaro, e a magia por toda parte lhe dá nojo.",
  "centauros|reino-de-laguardia":
    "Em Laguardia, centauros mercenários são comuns, e ninguém estranha a presença nas companhias e tavernas. Encaixa-se bem entre montantes, pistolas e contratos.",
  "centauros|irmandade-de-sao-ferdinand":
    "Muitos centauros, perto do fim da vida, vêm até a fronteira de Crick para morrer em batalha contra a horda. A Irmandade os recebe como aliados valiosos.",
  "centauros|imperio-das-estepes":
    "É {filho|filha} do império: força, glória e a pressa de quem vive só 30 anos. O destino é seguir o Cavalga-mundos até o próximo horizonte.",
  "centauros|reclusos-do-deserto":
    "Os Homens do Deserto vivem em paz e tratam estrangeiros com cuidado, e um centauro nos oásis desperta curiosidade. A luta defensiva dos Dojos talvez lhe pareça estranha, mas é respeitável.",
  "centauros|mannaka-oko":
    "Em Man'naka oko só importa se alguém luta e sobrevive, e um centauro tem as duas coisas de sobra. Ali a força vale mais do que qualquer linhagem.",
  // Vampiros
  "vampiros|protetorado-de-morrow":
    "No protetorado, a miséria e a guerra civil escondem bem um predador discreto. Ninguém sente falta de quem some na lama.",
  "vampiros|chiefdom-de-vargarf":
    "As longas noites do norte são abrigo para quem foge do sol. As tribos não deixam ninguém morrer no frio, mas desconfiam de quem nunca sai de dia.",
  "vampiros|oakhaven":
    "Os invernos longos e escuros de Oakhaven escondem bem a natureza. Os locais desconfiam de forasteiros, mas não sabem o que temer.",
  "vampiros|planicies-de-sunfield":
    "Em Sunfield, bailes noturnos, intrigas e espionagem são o cenário perfeito para a persuasão. O sol forte dos campos de trigo é o único inimigo.",
  "vampiros|midland":
    "Na corte devota de Umbra, segredos e hierarquias favorecem quem sabe seduzir e manipular. Ninguém ali sequer conhece a palavra vampiro.",
  "vampiros|blackwater":
    "Em Blackwater ninguém investiga uma morte a mais, e um predador discreto vive bem nas sombras do contrabando. Cuidado só com a prata: uma bala ou lâmina dela que chegue ao sangue é fatal.",
  "vampiros|grao-ducado-de-highbridge":
    "Embaixadas, bancos e bailes diplomáticos: Highbridge é terreno fértil para quem vive de persuasão. Mas a lei e a burocracia herdadas do Antigo Império valem para todos dentro do território do ducado, e quem se faz de indivíduo capaz perante o banco responde pelos próprios atos.",
  "vampiros|uniao-das-provincias":
    "Na UP conjura sem gaiola e sem cajado, e ninguém imagina como. Se a elite descobrir que existe magia sem bateria, vira objeto de estudo.",
  "vampiros|reino-de-laguardia":
    "Em Laguardia as forjas trabalham dia e noite, e quem vive à noite não chama atenção. Só precisa tomar cuidado com qualquer bala ou lâmina de prata.",
  "vampiros|irmandade-de-sao-ferdinand":
    "A Irmandade caça abominações e, se descobrir o que {ele|ela} é, será uma delas. Por enquanto, seus guerreiros procuram monstros de quitina, não de sangue.",
  "vampiros|imperio-das-estepes":
    "Nas estepes sem sombra, o sol é inimigo constante. Entre os centauros, que abominam a magia, é preciso esconder também o poder.",
  "vampiros|reclusos-do-deserto":
    "O deserto é o pior lugar para quem teme o sol, e os oásis só são seguros à noite. Os Homens do Deserto, os únicos que sabem usar com eficiência a energia vital do sangue, talvez sejam os primeiros a desconfiar do que {ele|ela} é.",
  "vampiros|mannaka-oko":
    "Em Man'naka oko ninguém liga para espécie, mas o sol do deserto não perdoa. Quem tem o Terceiro Olho pode enxergar a aura do que {ele|ela} realmente é.",
  // soldado
  "soldado|protetorado-de-morrow":
    "Serviu nas trincheiras do Fosso Norte, mal pago e mal armado, como bucha de canhão contra as incursões de Vargarf.",
  "soldado|chiefdom-de-vargarf":
    "Vargarf não tem exército: tem guerreiros de tribo que viram horda quando um chefe forte os une, e lutou nela.",
  "soldado|oakhaven":
    "Os soldados de Oakhaven guardam postos gelados com lanças e cães, sempre na defensiva.",
  "soldado|planicies-de-sunfield":
    "Serviu em armadura de placas protegendo o Rio Rhenus e as fronteiras férteis, num exército que foge de qualquer guerra que possa queimar as plantações.",
  "soldado|midland":
    "Usou o capacete alado e a espada reta de Midland, talvez nas batalhas que libertaram Warsaw.",
  "soldado|blackwater":
    "Blackwater não tem exército, tem milícias de senhores feudais, e serviu a uma delas em escaramuças sem fim.",
  "soldado|grao-ducado-de-highbridge":
    "O exército de Highbridge é pequeno, bem pago e de elite, com ligas metálicas leves, armas de fogo e magos, e entrar nele foi uma conquista.",
  "soldado|uniao-das-provincias":
    "Usou o morion com plumas da cor da sua região e um cajado padronizado de lente única, porque na União as armas de fogo são proibidas.",
  "soldado|reino-de-laguardia":
    "Em Laguardia, soldado e mercenário quase se confundem: montante, pistola de pederneira e capacete sallet.",
  "soldado|reino-de-kruk":
    "Na colmeia, os guerreiros têm asas que não voam, mas servem de armadura de quitina, e lutam com a disciplina de um corpo só.",
  "soldado|reino-de-crick":
    "Os soldados de Crick são moldados por magia em formas medonhas e imprevisíveis, que misturam besouro, vespa, cupim e escorpião, e {é um deles|é uma delas}.",
  "soldado|irmandade-de-sao-ferdinand":
    "Serviu nos fortes da Irmandade, de mosquete, lança ou maça na mão, segurando a linha contra a horda.",
  "soldado|imperio-das-estepes":
    "No império, todo centauro é soldado: arco curto, lâmina curva, lança e a carga de choque nas estepes.",
  "soldado|reclusos-do-deserto":
    "Os Reclusos não têm exército; quem defende os oásis são os lutadores dos Dojos, e {foi um deles|foi uma delas}.",
  "soldado|mannaka-oko":
    "Em Man'naka oko, soldados servem aos shoguns do deserto, de armadura de sucata e katana, vigiando escravos e sucata.",
  // mago-ortodoxo
  "mago-ortodoxo|protetorado-de-morrow":
    "No protetorado, a magia que chega é a dos cajados da UP, e um mago é visto como agente da União.",
  "mago-ortodoxo|chiefdom-de-vargarf":
    "As tribos de Vargarf veem pouca magia e confiam ainda menos nela, e um mago entre elas é raridade.",
  "mago-ortodoxo|oakhaven":
    "Em Oakhaven, terra de lanças e cães, um mago desperta mais desconfiança do que respeito.",
  "mago-ortodoxo|planicies-de-sunfield":
    "Os castelões de Sunfield pagam bem por um mago na corte, seja como conselheiro, guarda ou peça de intriga.",
  "mago-ortodoxo|midland":
    "Midland desconfia de excessos, mas a guerra contra Crick tornou os magos úteis demais para serem recusados.",
  "mago-ortodoxo|blackwater":
    "Em Blackwater, a Magia de Trincheira da UP enfrenta a pólvora de Laguardia, e cajados pirateados mudam de mão em Jakarta.",
  "mago-ortodoxo|grao-ducado-de-highbridge":
    "Magos do mundo inteiro estudam no Eixo Universitário de Highbridge, e o exército do ducado tem magos habilidosos.",
  "mago-ortodoxo|uniao-das-provincias":
    "Na UP, a magia é monopólio legal da elite e das forças militares de elite, e um mago fora delas é criminoso.",
  "mago-ortodoxo|reino-de-laguardia":
    "Os ferreiros de Laguardia forjam cajados sob contratos de sigilo absoluto, e talvez o seu tenha saído dali.",
  "mago-ortodoxo|reino-de-kruk":
    "Em Kruk, só os príncipes estudam magia, voltada a moldar a rocha e o ar e alimentada pelos trabalhadores processados.",
  "mago-ortodoxo|reino-de-crick":
    "Em Crick, a magia é de fogo e de manipulação biológica, movida por linhagens inteiras criadas para morrer como bateria.",
  "mago-ortodoxo|irmandade-de-sao-ferdinand":
    "A Irmandade valoriza tudo o que reforce a linha contra Crick, e um mago é artilharia bem-vinda nos fortes.",
  "mago-ortodoxo|imperio-das-estepes":
    "Os centauros abominam a magia, e um mago no império é desprezado como trapaceiro, sem honra nenhuma.",
  "mago-ortodoxo|reclusos-do-deserto":
    "Para os Reclusos, a magia é um tabu estudado pela matemática, e a maneira como um mago ortodoxo gasta energia lhes parece perigosa.",
  "mago-ortodoxo|mannaka-oko":
    "Em Man'naka oko, um mago de cajado é raridade cobiçada pelos shoguns do deserto.",
  // bardo
  "bardo|protetorado-de-morrow":
    "No protetorado, um bardo que cura com música é recebido como milagre no meio da lama e da guerra civil.",
  "bardo|chiefdom-de-vargarf":
    "Num inverno que mata, quem cura com canções vale mais que ouro, e as tribos de Vargarf recebem um bardo com honra.",
  "bardo|oakhaven":
    "O povo de Oakhaven é de pouca conversa, mas a chegada de um bardo afasta o desespero até ali.",
  "bardo|planicies-de-sunfield":
    "Nos festivais de Sunfield, um bardo é disputado por castelões e camponeses, e ouve os segredos de todos.",
  "bardo|midland":
    "Em Midland, terra de tradição, um bardo que guarda a memória dos povos é sempre bem-vindo.",
  "bardo|blackwater":
    "Em Blackwater, um bardo cura os feridos das escaramuças e é protegido até pelas gangues mais duras.",
  "bardo|grao-ducado-de-highbridge":
    "Em Highbridge, as universidades estudam os bardos sem conseguir explicar o seu dom.",
  "bardo|uniao-das-provincias":
    "Na UP, onde a magia é monopólio da elite, um bardo que cura sem cajado intriga os magos e incomoda a lei.",
  "bardo|reino-de-laguardia":
    "Em Laguardia, bardos acompanham companhias de mercenários e são recebidos nas tavernas com reverência.",
  "bardo|reino-de-kruk":
    "Um bardo homem-galho é quase impossível em Kruk, onde só os príncipes falam, e seria visto como anomalia.",
  "bardo|reino-de-crick":
    "Em Crick, onde tudo serve à guerra, um bardo que fortalece guerreiros com música seria tratado como arma.",
  "bardo|irmandade-de-sao-ferdinand":
    "Nos fortes da Irmandade, um bardo que cura os feridos e fortalece a linha é tratado como bênção.",
  "bardo|imperio-das-estepes":
    "Entre os centauros há bardos que fortalecem a horda com cantos guturais, sem instrumento algum, e {é um deles|é uma delas}.",
  "bardo|reclusos-do-deserto":
    "Os Homens do Deserto guardam a história de boca em boca, e um bardo que preserva a memória dos povos é respeitado.",
  "bardo|mannaka-oko":
    "Em Man'naka oko, um bardo é luxo raro numa terra de escassez, e quem cura com canções é protegido.",
  // monge-de-dojo
  "monge-de-dojo|protetorado-de-morrow":
    "Um monge de Dojo no protetorado é raridade: talvez {ele|ela} tenha aprendido com um peregrino do deserto, e sua calma destoa da lama.",
  "monge-de-dojo|chiefdom-de-vargarf":
    "A luta calma e defensiva dos Dojos parece fraqueza às tribos de Vargarf, até {ele|ela} vencer.",
  "monge-de-dojo|oakhaven":
    "O povo taciturno de Oakhaven respeita a sua quietude, que lembra a deles.",
  "monge-de-dojo|planicies-de-sunfield":
    "Nos jogos de força de Sunfield, um lutador de Dojo surpreende cavaleiros acostumados a placas e lanças.",
  "monge-de-dojo|midland":
    "Em Aurelia, núcleo do debate teológico, seus argumentos interessam, mas a devoção a Logan soa estranha numa corte de Umbra.",
  "monge-de-dojo|blackwater":
    "Em Blackwater, sua luta precisa vale como guarda-costas, e sua calma é rara num barril de pólvora.",
  "monge-de-dojo|grao-ducado-de-highbridge":
    "Nas universidades de Highbridge, seus debates rigorosos impressionam acadêmicos e filósofos.",
  "monge-de-dojo|uniao-das-provincias":
    "Na UP, sua luta dispensa armas de fogo e cajados, então ninguém pode chamá-la de crime.",
  "monge-de-dojo|reino-de-laguardia":
    "Os mercenários de Laguardia admiram sua técnica, mas não entendem por que {ele|ela} recusa a pólvora.",
  "monge-de-dojo|reino-de-kruk":
    "Um homem-galho no caminho dos Dojos rompe tudo o que Kruk ensina sobre o indivíduo, e isso {o|a} tornaria {suspeito|suspeita}.",
  "monge-de-dojo|reino-de-crick":
    "Em Crick, a contemplação não tem lugar, e um monge seria descartado como inútil ou caçado como dissidente.",
  "monge-de-dojo|irmandade-de-sao-ferdinand":
    "A Irmandade respeita quem luta bem, e a precisão geométrica dos Dojos vale ouro na linha contra Crick.",
  "monge-de-dojo|imperio-das-estepes":
    "Os centauros desprezam a luta defensiva, mas respeitam quem vence, e precisa vencer para ser ouvido.",
  "monge-de-dojo|reclusos-do-deserto":
    "Treinou num dos Dojos dos Reclusos, onde filosofia, debate e luta são uma coisa só.",
  "monge-de-dojo|mannaka-oko":
    "Numa terra de lei do mais forte como Man'naka oko, sua disciplina é rara e sua técnica vale mais que palavras.",
  // mercenario
  "mercenario|protetorado-de-morrow":
    "No protetorado, mercenários são contratados para a guerra civil e para reforçar o Fosso Norte, por pouco dinheiro.",
  "mercenario|chiefdom-de-vargarf":
    "Guerreiros de Vargarf às vezes se vendem como mercenários fora do Chiefdom e levam consigo a ferocidade do gelo.",
  "mercenario|oakhaven":
    "Em Oakhaven, mercenários escoltam caravanas de peles e madeira contra o frio e os bandidos.",
  "mercenario|planicies-de-sunfield":
    "Os castelões de Sunfield contratam mercenários para as suas intrigas, porque seus cavaleiros não sujam as mãos.",
  "mercenario|midland":
    "Midland contrata mercenários para as fronteiras e para a guerra contra Crick, e paga bem.",
  "mercenario|blackwater":
    "Blackwater é o paraíso dos mercenários: senhores feudais em guerra constante sempre precisam de mais braços.",
  "mercenario|grao-ducado-de-highbridge":
    "O exército de Highbridge atrai os guerreiros mais gloriosos com alto pagamento e vida tranquila.",
  "mercenario|uniao-das-provincias":
    "Na UP, armas de fogo são proibidas e a magia é monopólio da elite, então um mercenário trabalha com aço.",
  "mercenario|reino-de-laguardia":
    "É {um mercenário laguardiano|uma mercenária laguardiana}, {famoso|famosa} no mundo inteiro pelo montante, pela pistola e pelo capacete sallet.",
  "mercenario|reino-de-kruk":
    "Kruk não tem mercenários, só trabalho perpétuo; um homem-galho que se vende está longe da colmeia, e perto da loucura.",
  "mercenario|reino-de-crick":
    "Crick não paga, consome, e um mercenário homem-galho que vem de lá é desertor da horda.",
  "mercenario|irmandade-de-sao-ferdinand":
    "A Irmandade contrata mercenários para reforçar os fortes e paga com o ouro de Midland e Highbridge.",
  "mercenario|imperio-das-estepes":
    "O trabalho mercenário é parte da economia do império, e centauros são contratados em todo o continente.",
  "mercenario|reclusos-do-deserto":
    "Os Reclusos raramente contratam espadas, mas mercenários escoltam viajantes até Mahabam.",
  "mercenario|mannaka-oko":
    "Em Man'naka oko, mercenários servem aos shoguns do deserto e caçam escravos fugitivos.",
  // contrabandista
  "contrabandista|protetorado-de-morrow":
    "No protetorado, contrabando é questão de sobrevivência, e a UP sabe disso e finge que não vê.",
  "contrabandista|chiefdom-de-vargarf":
    "Os saqueadores de Vargarf vendem o que tomam no mar, e leva a carga até os portos certos.",
  "contrabandista|oakhaven":
    "Em Oakhaven, leva peles e o minério de Kruk para quem paga melhor, longe dos impostos.",
  "contrabandista|planicies-de-sunfield":
    "Grãos desviados dos impostos pesados descem o Rio Rhenus nas suas barcas.",
  "contrabandista|midland":
    "O ouro que segue pela rota de Koloberg atrai contrabandistas como {ele|ela}.",
  "contrabandista|blackwater":
    "É de Blackwater, a capital do contrabando, e a Baía dos Contrabandistas é a sua casa.",
  "contrabandista|grao-ducado-de-highbridge":
    "Em Highbridge, o contrabando atravessa as pontes disfarçado de comércio legal, pagando os pedágios certos.",
  "contrabandista|uniao-das-provincias":
    "Na UP, contrabandeia armas de fogo e cajados pirateados, e as minas de Puerto Blanco esperam por quem é pego.",
  "contrabandista|reino-de-laguardia":
    "Leva a pólvora e as armas de Laguardia para onde elas são proibidas, e lucra muito com isso.",
  "contrabandista|reino-de-kruk":
    "Um homem-galho de Kruk no contrabando é raro, e sabe quanto vale um barril de feromônio fora da colmeia.",
  "contrabandista|reino-de-crick":
    "De Crick saem coisas que ninguém deveria comprar, e sabe quem paga por elas.",
  "contrabandista|irmandade-de-sao-ferdinand":
    "A Irmandade aplica a lei na fronteira, e contrabandistas são caçados nas estradas dos fortes.",
  "contrabandista|imperio-das-estepes":
    "Os centauros vendem escravos pela Companhia, e contrabandistas como {ele|ela} cuidam do resto do comércio.",
  "contrabandista|reclusos-do-deserto":
    "Mahabam recebe comerciantes de todas as terras, e um contrabandista discreto encontra ali um porto seguro.",
  "contrabandista|mannaka-oko":
    "Vende sucata ancestral à Companhia, e às vezes coisas que nem os shoguns sabem que existem.",
  // cacador
  "cacador|protetorado-de-morrow":
    "Em Morrow, caçar e coletar é parte da subsistência, num pântano onde nada sobra.",
  "cacador|chiefdom-de-vargarf":
    "Em Vargarf, a caça de bestas é sustento e prova de força.",
  "cacador|oakhaven":
    "Em Oakhaven, caça com lança e cães e vende as peles aos reinos do sul.",
  "cacador|planicies-de-sunfield":
    "Em Sunfield, a caça em Timberborder é privilégio da nobreza, e um caçador comum precisa de permissão ou de coragem.",
  "cacador|midland":
    "Nas florestas de Baddenberg e nos pastos de Longhorn, caça e protege o gado.",
  "cacador|blackwater":
    "Nos pântanos de Blackwater, caça na lama e nos canais.",
  "cacador|grao-ducado-de-highbridge":
    "Em Highbridge, um caçador vive de levar caça fina às mesas dos banqueiros.",
  "cacador|uniao-das-provincias":
    "Nas florestas tropicais de Haller, caça criaturas selvagens perto dos laboratórios arcanos do governo.",
  "cacador|reino-de-laguardia":
    "Os caçadores da família Wolf conhecem as trilhas vulcânicas de Laguardia melhor que qualquer patrulha.",
  "cacador|reino-de-kruk":
    "Em Kruk, os ataques dos centauros tornaram arriscada qualquer saída à superfície, e caçar é tarefa perigosa.",
  "cacador|reino-de-crick":
    "Em Crick, caçadores são moldados para rastrear presas, inclusive humanas.",
  "cacador|irmandade-de-sao-ferdinand":
    "Na fronteira de Crick, caça as criaturas da horda que escapam do cerco.",
  "cacador|imperio-das-estepes":
    "Os centauros são caçadores letais, e aprendeu nas estepes.",
  "cacador|reclusos-do-deserto":
    "No deserto, caçar exige paciência, e sabe onde a vida se esconde.",
  "cacador|mannaka-oko":
    "Em Man'naka oko, caça as criaturas fatais do deserto, como os escorpiões gigantes de cuja quitina se fazem armaduras.",
  // mago-dissidente
  "mago-dissidente|protetorado-de-morrow":
    "No protetorado, longe da vigilância da UP, um mago dissidente pode pesquisar em paz, desde que pague a quem precisa.",
  "mago-dissidente|chiefdom-de-vargarf":
    "As tribos não entendem sua magia, mas respeitam quem sobrevive ao inverno.",
  "mago-dissidente|oakhaven":
    "Em Oakhaven, longe das academias, pesquisa sozinho, como sempre quis.",
  "mago-dissidente|planicies-de-sunfield":
    "Os castelões de Sunfield contratam magos sem perguntar de onde eles vêm.",
  "mago-dissidente|midland":
    "Em Midland, a corte de Umbra desconfia de magia sem hierarquia, e um dissidente vive sob suspeita.",
  "mago-dissidente|blackwater":
    "Em Blackwater, compra cajados pirateados e lentes roubadas sem que ninguém pergunte nada.",
  "mago-dissidente|grao-ducado-de-highbridge":
    "Em Highbridge, pode pesquisar nas bibliotecas e vender conhecimento, mas a universidade não {o|a} reconhece.",
  "mago-dissidente|uniao-das-provincias":
    "Na UP, é criminoso por definição: magia fora da elite é proibida por lei.",
  "mago-dissidente|reino-de-laguardia":
    "Em Laguardia, as forjas fazem seu cajado sob sigilo absoluto, desde que {ele|ela} pague.",
  "mago-dissidente|reino-de-kruk":
    "Em Kruk, só os príncipes estudam magia, e sempre para a colmeia; um dissidente seria expurgado.",
  "mago-dissidente|reino-de-crick":
    "Em Crick, toda magia serve à guerra e ao príncipe, e um dissidente vira bateria.",
  "mago-dissidente|irmandade-de-sao-ferdinand":
    "A Irmandade aceita qualquer magia que ajude a conter Crick, sem perguntar de onde ela vem.",
  "mago-dissidente|imperio-das-estepes":
    "Os centauros abominam a magia, e um mago sem dono no império vive em perigo constante.",
  "mago-dissidente|reclusos-do-deserto":
    "Os Homens do Deserto estudam a magia pela matemática, e talvez aceitem discutir suas pesquisas, com muita cautela.",
  "mago-dissidente|mannaka-oko":
    "Em Man'naka oko, pesquisa a sucata ancestral, onde talvez durmam segredos esquecidos.",
  // medico
  "medico|protetorado-de-morrow":
    "No protetorado, um médico é raridade e quase um santo, pago em peixe e gratidão.",
  "medico|chiefdom-de-vargarf":
    "As tribos de Vargarf recebem um médico estrangeiro com desconfiança e necessidade, porque o saque e o frio deixam muitos feridos.",
  "medico|oakhaven":
    "Em Oakhaven, um médico salva vidas no inverno e é respeitado por isso.",
  "medico|planicies-de-sunfield":
    "Os nobres de Sunfield pagam bem por médicos, e um bom cirurgião circula entre bailes e justas.",
  "medico|midland":
    "Em Midland, sua ciência à moda de Activum pode soar como heresia na corte de Umbra.",
  "medico|blackwater":
    "Em Blackwater, costura feridos de bala e não faz perguntas.",
  "medico|grao-ducado-de-highbridge":
    "Se formou nas universidades de Highbridge, entre os melhores do continente.",
  "medico|uniao-das-provincias":
    "Na UP, médicos costumam seguir Activum e trabalhar para os hospitais e laboratórios do governo.",
  "medico|reino-de-laguardia":
    "Em Laguardia, trata queimaduras de forja e ferimentos de pólvora o dia inteiro.",
  "medico|reino-de-kruk":
    "Em Kruk, a regeneração faz boa parte do trabalho, e a cura é tarefa da colmeia, não de um indivíduo.",
  "medico|reino-de-crick":
    "Em Crick, médicos são moldadores de carne, que alteram corpos para a guerra.",
  "medico|irmandade-de-sao-ferdinand":
    "A Irmandade depende de cirurgiões para os seus aprimoramentos, e um bom médico é disputado nos fortes.",
  "medico|imperio-das-estepes":
    "Entre os centauros, a vida curta impede longos estudos, e um médico que entende de feridas de guerra vale muito.",
  "medico|reclusos-do-deserto":
    "Os Homens do Deserto fazem curas críticas com magia precisa e saber antigo, e um médico encontra ali conhecimentos raros.",
  "medico|mannaka-oko":
    "Em Man'naka oko, um médico vale ouro numa terra de criaturas fatais e lei do mais forte.",
  // alquimista
  "alquimista|protetorado-de-morrow":
    "No protetorado, um alquimista trabalha com o pouco que a lama oferece.",
  "alquimista|chiefdom-de-vargarf":
    "As tribos não confiam em alquimia, mas usam de bom grado seus fogos e venenos.",
  "alquimista|oakhaven":
    "Em Oakhaven, troca reagentes pelo minério de Kruk.",
  "alquimista|planicies-de-sunfield":
    "Os castelões pagam por venenos e fertilizantes, e não pergunta para quê.",
  "alquimista|midland":
    "Em Midland, a alquimia é vista com suspeita, mas a Irmandade compra seus reagentes.",
  "alquimista|blackwater":
    "Em Blackwater, sua alquimia abastece cajados piratas e armas ilegais.",
  "alquimista|grao-ducado-de-highbridge":
    "Em Highbridge, estuda nas universidades e vende ligas para os magos de elite.",
  "alquimista|uniao-das-provincias":
    "Na UP, alquimistas abastecem os magos da elite e os laboratórios do governo.",
  "alquimista|reino-de-laguardia":
    "Em Laguardia, prepara ligas e fluidos para os cajados forjados sob sigilo.",
  "alquimista|reino-de-kruk":
    "Em Kruk, a química que importa é a dos feromônios, e talvez a estude de perto.",
  "alquimista|reino-de-crick":
    "Em Crick, a alquimia serve à transmutação e à guerra biológica.",
  "alquimista|irmandade-de-sao-ferdinand":
    "A Irmandade compra seus reagentes para as mutações e os aprimoramentos.",
  "alquimista|imperio-das-estepes":
    "Os centauros desprezam a magia, e a alquimia, irmã dela, desperta a mesma aversão.",
  "alquimista|reclusos-do-deserto":
    "Os Reclusos guardam a memória de Marranol, destruído por um mago que buscava a pedra filosofal, e sua alquimia é vista com receio.",
  "alquimista|mannaka-oko":
    "Em Man'naka oko, a sucata ancestral esconde materiais que nenhum alquimista conhece.",
  // acolito
  "acolito|protetorado-de-morrow":
    "No protetorado, os templos são pobres, e cuida deles com quase nada.",
  "acolito|chiefdom-de-vargarf":
    "As tribos têm pouca paciência com templos, e um acólito precisa provar seu valor.",
  "acolito|oakhaven":
    "Em Oakhaven, os templos são pequenos e frios, e serve a poucos fiéis.",
  "acolito|planicies-de-sunfield":
    "Em Sunfield, acólitos servem nas capelas dos castelões e ouvem muitas confissões.",
  "acolito|midland":
    "Em Midland, devota de Umbra, os acólitos são muitos e os templos, poderosos.",
  "acolito|blackwater":
    "Em Blackwater, até os templos têm donos armados.",
  "acolito|grao-ducado-de-highbridge":
    "Em Highbridge, templos de vários deuses convivem, e vê de perto a diplomacia da fé.",
  "acolito|uniao-das-provincias":
    "Na UP, os templos de Umbra e Activum são oficiais e fortes, sobretudo em Asenov.",
  "acolito|reino-de-laguardia":
    "Em Laguardia, como em quase todo lugar herdeiro do antigo império, o culto é livre, e serve à fé que escolheu.",
  "acolito|reino-de-kruk":
    "Em Kruk, o culto a Mui é a própria colmeia, e a rainha é o seu Arauto.",
  "acolito|reino-de-crick":
    "Em Crick, linhagens inteiras nascem para ser sacrificadas na guerra de Tamem.",
  "acolito|irmandade-de-sao-ferdinand":
    "Na Irmandade, serve a Activum nos fortes e acende velas pelos que caem.",
  "acolito|imperio-das-estepes":
    "Nas estepes, a fé em Gorturk se vive a galope, não dentro de templos.",
  "acolito|reclusos-do-deserto":
    "Entre os Reclusos, os Dojos são os templos, e um acólito ali também aprende a lutar.",
  "acolito|mannaka-oko":
    "Em Man'naka oko, a fé convive com lendas, e o Terceiro Olho é visto por uns como bênção e por outros como maldição.",
  // astrologo
  "astrologo|protetorado-de-morrow":
    "No protetorado, ninguém paga por previsões, porque o futuro é sempre lama.",
  "astrologo|chiefdom-de-vargarf":
    "As tribos de Vargarf leem o céu para navegar e saquear, e um astrólogo é útil nos barcos.",
  "astrologo|oakhaven":
    "Em Oakhaven, as estrelas marcam o degelo e a hora de comerciar.",
  "astrologo|planicies-de-sunfield":
    "As cortes de Sunfield pagam caro por mapas de nascimento e por datas propícias.",
  "astrologo|midland":
    "Em Midland, a lua de Umbra dá à astrologia um lugar respeitado na corte.",
  "astrologo|blackwater":
    "Em Blackwater, prevê o melhor dia para o contrabando.",
  "astrologo|grao-ducado-de-highbridge":
    "Nas universidades de Highbridge, a astrologia é debatida, e ridicularizada pelos seguidores de Activum.",
  "astrologo|uniao-das-provincias":
    "Na UP, o racionalismo de Activum torna a astrologia suspeita, mas os fiéis de Umbra a toleram.",
  "astrologo|reino-de-laguardia":
    "Em Laguardia, os nobres consultam astrólogos antes de fechar grandes contratos.",
  "astrologo|reino-de-kruk":
    "Em Kruk, debaixo da terra, o céu é quase desconhecido, e um astrólogo é uma anomalia.",
  "astrologo|reino-de-crick":
    "Em Crick, ninguém olha para o céu, só para a guerra.",
  "astrologo|irmandade-de-sao-ferdinand":
    "A Irmandade, devota de Activum, vê a astrologia com desdém.",
  "astrologo|imperio-das-estepes":
    "Nas estepes, o sol é de Gorturk, e quem lê o céu fala do destino do império.",
  "astrologo|reclusos-do-deserto":
    "Os Homens do Deserto estudam o céu pela matemática e desprezam previsões sem cálculo.",
  "astrologo|mannaka-oko":
    "Em Man'naka oko, as estrelas são o único mapa confiável no deserto de sucata.",
  // apotecario
  "apotecario|protetorado-de-morrow":
    "No protetorado, seus remédios são a única medicina que muitos conhecem.",
  "apotecario|chiefdom-de-vargarf":
    "Em Vargarf, suas pomadas contra o frio e as feridas valem mais que ouro.",
  "apotecario|oakhaven":
    "Em Oakhaven, prepara unguentos com o que a floresta dá.",
  "apotecario|planicies-de-sunfield":
    "Em Sunfield, os nobres compram seus perfumes e, às vezes, seus venenos.",
  "apotecario|midland":
    "Em Midland, atende a corte e os camponeses no mesmo balcão.",
  "apotecario|blackwater":
    "Em Blackwater, negocia substâncias proibidas com a Companhia, como tantos outros.",
  "apotecario|grao-ducado-de-highbridge":
    "Em Highbridge, seus remédios finos atendem banqueiros e embaixadores.",
  "apotecario|uniao-das-provincias":
    "Na UP, atende uma população pobre e numerosa, sob o olhar atento da polícia.",
  "apotecario|reino-de-laguardia":
    "Em Laguardia, trata queimaduras de pólvora e de forja.",
  "apotecario|reino-de-kruk":
    "Em Kruk, os remédios são feitos pela colmeia, e um apotecário por conta própria é estranho.",
  "apotecario|reino-de-crick":
    "Em Crick, venenos e drogas servem à guerra.",
  "apotecario|irmandade-de-sao-ferdinand":
    "A Irmandade compra seus remédios para os feridos da fronteira.",
  "apotecario|imperio-das-estepes":
    "Os centauros compram unguentos de guerra e desdenham do resto.",
  "apotecario|reclusos-do-deserto":
    "Nos oásis dos Reclusos crescem ervas raras que {ele|ela} não encontra em outro lugar.",
  "apotecario|mannaka-oko":
    "Em Man'naka oko, o veneno dos escorpiões gigantes é o seu ingrediente mais precioso.",
  // ferreiro
  "ferreiro|protetorado-de-morrow":
    "No protetorado, remenda a infraestrutura imperial que mal funciona.",
  "ferreiro|chiefdom-de-vargarf":
    "Em Vargarf, conserta as armas tomadas nos saques.",
  "ferreiro|oakhaven":
    "Em Oakhaven, trabalha o minério trocado com Kruk.",
  "ferreiro|planicies-de-sunfield":
    "Em Sunfield, forja as armaduras de placas dos cavaleiros.",
  "ferreiro|midland":
    "Em Midland, forja as espadas retas e os capacetes alados do reino.",
  "ferreiro|blackwater":
    "Em Blackwater, conserta armas de fogo e cajados pirateados.",
  "ferreiro|grao-ducado-de-highbridge":
    "Em Highbridge, trabalha as ligas leves e resistentes do exército do ducado.",
  "ferreiro|uniao-das-provincias":
    "Na UP, ferreiros não podem fazer armas de fogo, mas forjam cajados de série.",
  "ferreiro|reino-de-laguardia":
    "Vem do coração das forjas do mundo, onde cajados são feitos sob sigilo absoluto.",
  "ferreiro|reino-de-kruk":
    "Em Kruk, a engenharia é coletiva, e trabalha nas fortalezas escavadas na rocha.",
  "ferreiro|reino-de-crick":
    "Em Crick, há trabalhadores que nascem com ferramentas de osso no lugar das mãos.",
  "ferreiro|irmandade-de-sao-ferdinand":
    "A Irmandade precisa de mosquetes e lanças, e os forja nos fortes.",
  "ferreiro|imperio-das-estepes":
    "A tecnologia do império é rudimentar, e um ferreiro é valioso entre os centauros.",
  "ferreiro|reclusos-do-deserto":
    "Os Reclusos têm poucas forjas e precisam de quem faça ferramentas e correias para os cascos.",
  "ferreiro|mannaka-oko":
    "Em Man'naka oko, forja katanas e armaduras com sucata ancestral.",
  // paladino
  "paladino|protetorado-de-morrow":
    "No protetorado, um paladino defende os miseráveis ou serve à burocracia da UP.",
  "paladino|chiefdom-de-vargarf":
    "Em Vargarf, um paladino de fé estrangeira é visto com desconfiança, mas sua força é respeitada.",
  "paladino|oakhaven":
    "Em Oakhaven, um paladino é raro e taciturno como o povo.",
  "paladino|planicies-de-sunfield":
    "Em Sunfield, paladinos disputam as justas em nome dos seus deuses.",
  "paladino|midland":
    "Em Midland, os paladinos de Umbra guardam mosteiros e ritos.",
  "paladino|blackwater":
    "Em Blackwater, um paladino é ou um alvo, ou um senhor da guerra.",
  "paladino|grao-ducado-de-highbridge":
    "Em Highbridge, a neutralidade do ducado não deixa paladinos travarem guerras de fé.",
  "paladino|uniao-das-provincias":
    "Na UP, os paladinos de Umbra e Activum servem ao Estado.",
  "paladino|reino-de-laguardia":
    "Em Laguardia, o culto é livre, e um paladino de qualquer fé encontra trabalho.",
  "paladino|reino-de-kruk":
    "Em Kruk, o paladino serve a Mui, e a colmeia é a sua fé.",
  "paladino|reino-de-crick":
    "Em Crick, o paladino serve a Tamem e à guerra.",
  "paladino|irmandade-de-sao-ferdinand":
    "Na Irmandade, os paladinos de Activum aceitam mutações para conter Crick.",
  "paladino|imperio-das-estepes":
    "Nas estepes, todo guerreiro é um pouco paladino de Gorturk.",
  "paladino|reclusos-do-deserto":
    "Entre os Reclusos, os paladinos são monges guerreiros de Logan.",
  "paladino|mannaka-oko":
    "Em Man'naka oko, um paladino precisa provar sua fé numa terra que só respeita a força.",
  // cacador-de-monstros
  "cacador-de-monstros|protetorado-de-morrow":
    "No protetorado, caça o que Vargarf e a lama trazem.",
  "cacador-de-monstros|chiefdom-de-vargarf":
    "Em Vargarf, sobram bestas e lendas para caçar.",
  "cacador-de-monstros|oakhaven":
    "Na Floresta do Uivo, caça as criaturas selvagens que rondam Oakhaven.",
  "cacador-de-monstros|planicies-de-sunfield":
    "Em Sunfield, é contratado para livrar as plantações de criaturas.",
  "cacador-de-monstros|midland":
    "Em Midland, caça os restos da horda que ainda rondam Warsaw.",
  "cacador-de-monstros|blackwater":
    "Em Blackwater, caça o que os mercenários trazem de longe.",
  "cacador-de-monstros|grao-ducado-de-highbridge":
    "Em Highbridge, é contratado para manter as pontes seguras.",
  "cacador-de-monstros|uniao-das-provincias":
    "Em Haller, caça as criaturas selvagens perto dos laboratórios arcanos do governo.",
  "cacador-de-monstros|reino-de-laguardia":
    "Em Laguardia, usa prata e pólvora contra o que não deveria existir.",
  "cacador-de-monstros|reino-de-kruk":
    "Em Kruk, caça as criaturas de Crick que se aproximam da colmeia.",
  "cacador-de-monstros|reino-de-crick":
    "Em Crick, é o monstro que os outros caçam.",
  "cacador-de-monstros|irmandade-de-sao-ferdinand":
    "Na fronteira de Crick, é exatamente o que a Irmandade precisa.",
  "cacador-de-monstros|imperio-das-estepes":
    "Nas estepes, caça bestas para a horda.",
  "cacador-de-monstros|reclusos-do-deserto":
    "No deserto, caça as criaturas da terra envenenada de Marranol.",
  "cacador-de-monstros|mannaka-oko":
    "Em Man'naka oko, as criaturas fatais do deserto são a única fartura.",
  // detetive
  "detetive|protetorado-de-morrow":
    "No protetorado, investiga crimes da guerra civil que ninguém quer resolver.",
  "detetive|chiefdom-de-vargarf":
    "Em Vargarf, as tribos resolvem tudo pela força, e um detetive é uma figura estranha.",
  "detetive|oakhaven":
    "Em Oakhaven, investiga roubos de peles e madeira.",
  "detetive|planicies-de-sunfield":
    "Sunfield é um ninho de espiões, e é valioso para castelões paranoicos.",
  "detetive|midland":
    "Em Midland, investiga as intrigas da corte e o ouro enviado à Irmandade.",
  "detetive|blackwater":
    "Em Blackwater, investiga crimes que a lei não alcança.",
  "detetive|grao-ducado-de-highbridge":
    "Trabalha para a Agência de Highbridge, que registra cada cliente e cada devedor do continente.",
  "detetive|uniao-das-provincias":
    "Na UP, investiga os grupos de oposição financiados por forças desconhecidas.",
  "detetive|reino-de-laguardia":
    "Em Laguardia, investiga contratos quebrados e segredos de forja.",
  "detetive|reino-de-kruk":
    "Em Kruk, investigar é encontrar príncipes resistentes aos feromônios antes que seja tarde.",
  "detetive|reino-de-crick":
    "Em Crick, caça dissidentes para o príncipe.",
  "detetive|irmandade-de-sao-ferdinand":
    "Na Irmandade, caça espiões de Crick.",
  "detetive|imperio-das-estepes":
    "Nas estepes, descobre quem ousou dizer o nome do Cavalga-mundos.",
  "detetive|reclusos-do-deserto":
    "Entre os Reclusos, os juízes da lei investigam com lógica pura, e aprendeu com eles.",
  "detetive|mannaka-oko":
    "Em Man'naka oko, investiga qual shogun roubou a sucata de qual.",
  // nobre
  "nobre|protetorado-de-morrow":
    "No protetorado, um nobre é uma relíquia sem poder real sob a UP.",
  "nobre|chiefdom-de-vargarf":
    "Em Vargarf, nobreza é força, e um chefe de tribo é o mais nobre de todos.",
  "nobre|oakhaven":
    "Em Oakhaven, a nobreza é rústica e pouco se distingue do povo.",
  "nobre|planicies-de-sunfield":
    "Em Sunfield, é castelão ou vassalo, preso ao ninho de cobras de Silvernest.",
  "nobre|midland":
    "Em Midland, frequenta a corte de Aurelia e disputa influência sob o olhar de Umbra.",
  "nobre|blackwater":
    "Em Blackwater, é um senhor feudal em guerra constante com os vizinhos.",
  "nobre|grao-ducado-de-highbridge":
    "Em Highbridge, é banqueiro ou embaixador, e praticamente intocável.",
  "nobre|uniao-das-provincias":
    "Na UP, a nobreza é a elite política, e títulos dependem de eleições e intrigas.",
  "nobre|reino-de-laguardia":
    "Em Laguardia, pertence a uma das famílias que administram as regiões em nome do rei.",
  "nobre|reino-de-kruk":
    "Em Kruk, nobreza é ser príncipe ou princesa, e ambos servem à colmeia.",
  "nobre|reino-de-crick":
    "Em Crick, o príncipe é o único nobre, e os outros são ferramentas.",
  "nobre|irmandade-de-sao-ferdinand":
    "Na Irmandade, títulos não valem nada, e o que manda é a junta militar.",
  "nobre|imperio-das-estepes":
    "Nas estepes, a maioria dos centauros é parente do Cavalga-mundos, e ser seu filho direto é a maior das honras.",
  "nobre|reclusos-do-deserto":
    "Entre os Reclusos, a nobreza está na idade e na sabedoria dos anciãos.",
  "nobre|mannaka-oko":
    "Em Man'naka oko, os nobres são os shoguns do deserto, donos de escravos.",
  // filosofo
  "filosofo|protetorado-de-morrow":
    "No protetorado, pensa sobre a miséria e a injustiça, e não faltam exemplos.",
  "filosofo|chiefdom-de-vargarf":
    "Em Vargarf, filosofia é luxo para o verão.",
  "filosofo|oakhaven":
    "Em Oakhaven, reflete em silêncio, como o resto do povo.",
  "filosofo|planicies-de-sunfield":
    "Em Sunfield, aconselha castelões, e às vezes os convence de alguma coisa.",
  "filosofo|midland":
    "Em Midland, debate teologia em Aurelia, sob a vigilância de Umbra.",
  "filosofo|blackwater":
    "Em Blackwater, filosofa sobre um mundo sem lei, e mora num barril, como os antigos.",
  "filosofo|grao-ducado-de-highbridge":
    "Nas universidades de Highbridge, disputa alunos com os seguidores de Activum.",
  "filosofo|uniao-das-provincias":
    "Na UP, debate o progresso e a ordem, e sabe que a ordem tem sempre a última palavra.",
  "filosofo|reino-de-laguardia":
    "Em Laguardia, aconselha guildas e nobres.",
  "filosofo|reino-de-kruk":
    "Em Kruk, filosofar é perigoso, porque é sinal de individualidade.",
  "filosofo|reino-de-crick":
    "Em Crick, a única filosofia é a do mais forte.",
  "filosofo|irmandade-de-sao-ferdinand":
    "Na Irmandade, debate a doutrina de Activum entre uma patrulha e outra.",
  "filosofo|imperio-das-estepes":
    "Nas estepes, a única filosofia é a do destino manifesto.",
  "filosofo|reclusos-do-deserto":
    "Entre os Reclusos, a filosofia é a própria vida dos Dojos.",
  "filosofo|mannaka-oko":
    "Em Man'naka oko, pensa sobre lendas e sucata, e sobre o que é verdade em cada uma.",
  // cientista
  "cientista|protetorado-de-morrow":
    "No protetorado, estuda a infraestrutura imperial antiga que mal funciona.",
  "cientista|chiefdom-de-vargarf":
    "Em Vargarf, estuda o gelo e as bestas.",
  "cientista|oakhaven":
    "Em Oakhaven, estuda o clima duro e os homens-galho de Kruk.",
  "cientista|planicies-de-sunfield":
    "Em Sunfield, aplica as técnicas agrícolas caras de Highmeadow.",
  "cientista|midland":
    "Em Midland, sua ciência é vista com suspeita pela corte de Umbra.",
  "cientista|blackwater":
    "Em Blackwater, estuda as armas e os cajados pirateados.",
  "cientista|grao-ducado-de-highbridge":
    "Nas universidades de Highbridge, está em casa.",
  "cientista|uniao-das-provincias":
    "Na UP, trabalha nos laboratórios arcanos do governo em Haller.",
  "cientista|reino-de-laguardia":
    "Em Laguardia, estuda pólvora e metalurgia.",
  "cientista|reino-de-kruk":
    "Em Kruk, a ciência é a engenharia da rocha e da colmeia.",
  "cientista|reino-de-crick":
    "Em Crick, ciência é manipulação biológica.",
  "cientista|irmandade-de-sao-ferdinand":
    "A Irmandade depende de pesquisas em mutação e aprimoramento, e paga bem por elas.",
  "cientista|imperio-das-estepes":
    "Nas estepes, a ciência é rudimentar e pouco valorizada.",
  "cientista|reclusos-do-deserto":
    "Os Reclusos estudam a magia pela matemática avançada, e aprende com eles.",
  "cientista|mannaka-oko":
    "Em Man'naka oko, estuda sucata quase alienígena.",
  // logan
  "logan|protetorado-de-morrow":
    "Em Morrow não há templo de Logan, então {ele|ela} faz da beira do leito dos moribundos o seu templo. Senta ao lado de cada um, não promete nada e não desvia o olhar; quando pedem um recado entregue ou uma dívida paga, cumpre, sem que ninguém cobre. Na lama da guerra civil, ser quem não mente na hora da morte é o único nome que lhe resta.",
  "logan|chiefdom-de-vargarf":
    "Em Vargarf ninguém reza a Logan, mas todo guerreiro tribal reconhece quem encara o frio e a dor sem um gemido. {Ele|Ela} nunca explica a fé: deixa o silêncio falar, e é por ele que os caçadores {o|a} aceitam ao redor do fogo. Só um velho xamã desconfia, porque sabe que quem se prende a uma regra só obedece ao chefe enquanto a regra mandar.",
  "logan|oakhaven":
    "Em Oakhaven ninguém pergunta a que deus {ele|ela} reza, e nunca precisou responder. Cumpre o que prometeu, paga o que deve e quase não fala, o que ali passa por costume da casa e não por fé. Só nos dias de luto afasta-se do grupo para recitar {sozinho|sozinha} as regras que {o|a} sustentam, e ninguém vai atrás.",
  "logan|planicies-de-sunfield":
    "Nas capelas de Sunfield, lotadas de santos e de devotos de Umbra, Logan não tem nicho nem vela. Assiste aos ritos em pé, ao fundo, e os castelões, que leem segredo em qualquer calma, passaram a achar que {ele|ela} esconde algo. No máximo esconde a certeza de que o dever pesa igual para o servo e para o senhor, e isso nunca diz alto.",
  "logan|midland":
    "Em Midland, onde Umbra reina, Logan é lembrado como coisa velha e estrangeira, e {ele|ela} aprendeu a rezar sem que ninguém veja. Evita pregar, e a tolerância que ganha vale mais do que qualquer conversão. Quem enterrou parentes na guerra contra Crick percebe a serenidade diante da perda e, às vezes, senta ao lado d{ele|ela} em silêncio, sem perguntar nada.",
  "logan|blackwater":
    "Em Blackwater, falar de regras não escritas é piada, e por isso vale tanto o que {ele|ela} promete. Cumpre o que combinou sem contrato, sem testemunha e sem ameaça, porque deixar de cumprir seria quebrar a ordem que sustenta o resto. Contrabandistas e capangas já {o|a} procuraram para guardar dinheiro, segredo ou herança, certos de que tudo volta inteiro.",
  "logan|grao-ducado-de-highbridge":
    "Nas universidades de Highbridge, a razão geométrica de Logan ainda encontra ouvintes entre filósofos e matemáticos, e {ele|ela} é {convidado|convidada} a debates em que o dever e a morte viram teorema. Gosta das provas, mas desconfia da frieza dos Dedutivos, que levaram a fé a um extremo em que já não sobra lugar para quem chora. Cada convite aceito rende um amigo erudito e, mais cedo ou mais tarde, um adversário.",
  "logan|uniao-das-provincias":
    "Na UP, Logan não tem templo e ninguém o persegue, o que na prática significa que {ele|ela} reza em casas, bibliotecas e cantos de arquivo. Asenov pertence a Umbra e a Activum, e aprendeu a passar por elas sem discutir. Os poucos fiéis que encontra se reconhecem pela forma de ficar calados e por nunca comentar o que viram.",
  "logan|reino-de-laguardia":
    "Em Laguardia o culto é livre e Logan não faz falta a ninguém, o que cai bem a {ele|ela}. Reza onde dá, no fundo das oficinas, e os artesãos respeitam quem entrega o que prometeu no prazo, sem saber que isso é liturgia. Falta templo, mas a fama de quem cumpre ensinou a vizinhança a deixar {o|a} em paz.",
  "logan|reino-de-kruk":
    "Em Kruk, onde tudo pertence a Mui, pensar a própria morte e o próprio dever como assuntos próprios já é traição. {Ele|Ela} cumpre as tarefas da colmeia como todos, mas guarda dentro de si uma ordem que a rainha não escreveu, e a recita baixinho enquanto trabalha. Se alguém descobrir, o melhor a esperar é vigilância; por isso esconde o rito dentro dos gestos do trabalho.",
  "logan|reino-de-crick":
    "Em Crick, a ordem de Logan contradiz o caos biológico de Tamem, e a horda trata essa crença como fraqueza de linhagem. {Ele|Ela} mantém o culto escondido, em gestos mínimos: contar passos, repetir a última regra antes de dormir, aceitar a dor sem dar a ninguém o prazer de vê-la. Vive a um passo da expulsão ou do sacrifício, e sabe que a morte, se vier, será só a última regra.",
  "logan|irmandade-de-sao-ferdinand":
    "Nos fortes de Activum, a fé de Logan é respeitada pelo senso de dever, mas ninguém a divide com {ele|ela}. Na linha contra Crick, os mutantes vão procurá-{lo|la} à noite, depois dos combates, para falar de quem caiu, e {ele|ela} escuta sem consolar. Esse é o rito inteiro: lembrar o nome dos mortos e estar de pé na manhã seguinte.",
  "logan|imperio-das-estepes":
    "Os centauros não entendem uma fé que manda suportar em vez de conquistar, e dizem em voz de adulto que isso é covardia. {Ele|Ela} pratica Logan nas estepes em silêncio, sem discutir, e só a morte de um companheiro mostra o que a fé vale: é quem fica de pé ao lado do corpo enquanto o resto da tropa já galopa adiante.",
  "logan|reclusos-do-deserto":
    "Entre os Reclusos, Logan é o deus mais debatido, e os Dojos são o coração da fé. Cresceu entre mestres que ensinam a lutar, a discutir e a morrer com dignidade, e aprendeu que a serenidade não é ausência de dor, mas a disciplina de carregá-la. Ali a devoção é a regra, e o que {o|a} distingue dos outros é só o grau de rigor com que a pratica.",
  "logan|mannaka-oko":
    "Em Man'naka oko, suportar a dor com dignidade faz sentido numa terra de escravidão e sucata. Entre os escravizados, {ele|ela} oferece consolo e disciplina: ensina a respirar fundo no meio do castigo e a não dar ao senhor o prazer de ver o medo. Alguns shoguns {o|a} toleram porque a fé não incita revolta, e {ele|ela} sabe que essa tolerância também é uma forma de corrente.",  // umbra
  "umbra|protetorado-de-morrow":
    "No protetorado, a fé oficial da UP lembra a todos a quem devem obediência, e seus templos são vistos como extensão da burocracia. Ser fiel de Umbra aqui é ser {visto|vista} como {colaborador|colaboradora}, ainda que {ele|ela} só procure consolo.",
  "umbra|chiefdom-de-vargarf":
    "Em Vargarf, a hierarquia de Umbra só vale se o chefe for forte, e a tradição não segura quem perde o comando. Seu culto é {visto|vista} como coisa de sulistas, e precisa provar valor antes de ser ouvido.",
  "umbra|oakhaven":
    "Em Oakhaven, a fé em Umbra é rara e vista como coisa de sulistas, num povo que cultua pouco e confia menos. Quem a segue reza {sozinho|sozinha} e é {tolerado|tolerada} enquanto não pregue.",
  "umbra|planicies-de-sunfield":
    "Em Sunfield, a hierarquia de Umbra serve muito bem aos castelões, que a usam para justificar vassalagem e tradição. Ser fiel aqui abre portas nos bailes e nas capelas, mas também faz de {ele|ela} peça de intriga.",
  "umbra|midland":
    "Em Midland, Umbra domina a corte, e sua fé abre portas em Aurelia e nas terras tradicionalistas do sul. Os nobres esperam obediência, e quem desafia a hierarquia perde proteção, terra e nome.",
  "umbra|blackwater":
    "Em Blackwater, falar de ordem e hierarquia é falar {sozinho|sozinha}. Os fiéis de Umbra sobrevivem nas margens, pregando tradição a quem só obedece à arma, e alguns capitães do pântano ainda pagam por uma bênção.",
  "umbra|grao-ducado-de-highbridge":
    "Em Highbridge, sua fé convive diplomaticamente com todas as outras, e as embaixadas têm capelas de várias nações. Pode rezar em paz, desde que respeite a neutralidade do ducado.",
  "umbra|uniao-das-provincias":
    "Na UP, Umbra é religião oficial, e seus templos dominam Asenov ao lado dos de Activum. Ser fiel é ser {cidadão exemplar|cidadã exemplar}: obedecer às leis, respeitar a elite e aceitar o lugar que a tradição lhe dá.",
  "umbra|reino-de-laguardia":
    "Em Laguardia, monarquia tradicional, a hierarquia de Umbra encontra bom terreno, e os nobres respeitam quem segue a ordem. Sua fé é livre, mas é entre os fiéis do rei que {ele|ela} encontra mais proteção.",
  "umbra|reino-de-kruk":
    "A hierarquia de Umbra lembra a colmeia, mas em Kruk só há lugar para Mui, e qualquer outro deus é ameaça. Seria {vigiado|vigiada} de perto, e sua obediência, usada como prova de que a colmeia pode ser enganada.",
  "umbra|reino-de-crick":
    "Em Crick, a fé na tradição e no equilíbrio é ridicularizada pela horda, que vê ali fraqueza. Um fiel de Umbra é presa fácil, e a única proteção é esconder o que reza.",
  "umbra|irmandade-de-sao-ferdinand":
    "Na Irmandade, sua fé é minoria, e são justamente os tradicionalistas de Umbra que chamam os mutantes de hereges. Vive entre guerreiros que o sustentam e o desprezam, e cada oração custa uma discussão.",
  "umbra|imperio-das-estepes":
    "Os centauros desdenham do equilíbrio passivo de Umbra, que para eles é covardia. Um fiel de Umbra nas estepes é {visto|vista} como fraco, e só a coragem em combate faz alguém ouvir o que ele crê.",
  "umbra|reclusos-do-deserto":
    "Os Reclusos respeitam a ordem, mas Umbra não é a deusa deles. É bem {recebido|recebida} como hóspede e {visto|vista} como curiosidade teológica, e os Dojos aceitam debater sua fé com toda a paciência.",
  "umbra|mannaka-oko":
    "Em Man'naka oko, a única hierarquia é a dos shoguns, e Umbra parece muito distante. Um fiel de Umbra ali é raro e vulnerável, e só quem tem força para defender suas crenças as pratica abertamente.",  // activum
  "activum|protetorado-de-morrow":
    "No protetorado, Activum é a fé da UP e lembra a lógica fria que mantém Morrow de joelhos. Quem a segue é {visto|vista} como {aliado|aliada} dos burocratas, e seu pragmatismo é lido como justificativa para a miséria.",
  "activum|chiefdom-de-vargarf":
    "Em Vargarf, cálculo e eficiência são coisas práticas, que dispensam templos, e as tribos respeitam quem resolve problemas. Um fiel de Activum que conserta armas ou barcos é {bem-vindo|bem-vinda}, desde que não pregue.",
  "activum|oakhaven":
    "Em Oakhaven, Activum é fé de sulistas, vista com desconfiança num povo que vive de lanças e cães. Seu pragmatismo, porém, é útil nas negociações com os homens-galho da Fronteira Cinzenta.",
  "activum|planicies-de-sunfield":
    "Em Sunfield, Activum interessa a quem busca mais rendimento nas plantações, e castelões espertos pagam engenheiros que a seguem. Encontra trabalho, mas pouca amizade entre os camponeses.",
  "activum|midland":
    "Em Midland, Activum é a fé dos hereges transumanistas da Irmandade, e a corte de Umbra desconfia de quem a segue. Pode ser {acusado|acusada} de colaborar com mutantes, e precisa escolher com quem se mostra.",
  "activum|blackwater":
    "Em Blackwater, o pragmatismo de Activum é a religião que todos praticam, mesmo sem saber. Um fiel assumido é {visto|vista} como sensato, e mercadores, médicos e chefes de gangue o procuram para resolver problemas sem rodeios.",
  "activum|grao-ducado-de-highbridge":
    "Nas universidades de Highbridge, Activum é forte entre cientistas e acadêmicos, que veem na doutrina uma ponte entre razão e prática. É {recebido|recebida} como colega, e seus pares financiam experimentos que ninguém mais aprovaria.",
  "activum|uniao-das-provincias":
    "Na UP, Activum é religião oficial, e seu pragmatismo justifica a escravidão legalizada. Ser fiel é fazer parte da engrenagem: {respeitado|respeitada} pelos poderosos, e conivente, queira ou não, com o que a União faz.",
  "activum|reino-de-laguardia":
    "As forjas e oficinas de Laguardia são terreno natural para Activum, e muitos artesãos veem em seu pragmatismo uma forma de ofício. Encontra espaço, freguesia e discussões com os ferreiros que preferem a tradição.",
  "activum|reino-de-kruk":
    "A eficiência de Activum lembra a colmeia, mas em Kruk só se adora Mui, e a ideia de que o fim justifica os meios soa perigosa para a rainha. Um homem-galh{o fiel|a fiel} de Activum seria suspeito de querer pensar por si.",
  "activum|reino-de-crick":
    "Em Crick, a eficiência também é lei, mas sob Tamem, não sob Activum. Um fiel é {visto|vista} como oportunista, útil enquanto resolver problemas e descartável quando deixar de fazê-lo.",
  "activum|irmandade-de-sao-ferdinand":
    "A Irmandade luta sob a bandeira de Activum e se vê como a prova viva da sua doutrina. É {recebido|recebida} como {irmão|irmã}, tem lugar nos fortes e responde à junta militar, mas a vida ali exige sacrifícios.",
  "activum|imperio-das-estepes":
    "Os centauros desprezam o cálculo de Activum e preferem a força. Um fiel nas estepes é {visto|vista} como trapaceiro, e só quem entrega resultados, como armas melhores ou escravos bem vendidos, ganha tolerância.",
  "activum|reclusos-do-deserto":
    "Os Reclusos estudam a matemática, mas recusam a ideia de que nada tem valor em si. É {bem-vindo|bem-vinda} nos debates dos Dojos, e a discussão entre fé em resultado e fé em dever costuma durar noites.",
  "activum|mannaka-oko":
    "Em Man'naka oko, a sucata ancestral fascina quem segue Activum, que vê ali tecnologia quase alienígena esperando para ser entendida. Um fiel que sabe consertar vale mais que muitos guerreiros, até para os shoguns.",  // mui
  "mui|protetorado-de-morrow":
    "No protetorado, a ideia de que tudo pertence a todos soa como revolução, e a UP vigia quem a prega. Entre os miseráveis, porém, a promessa de comunhão atrai ouvintes, e vive entre o apoio e a delação.",
  "mui|chiefdom-de-vargarf":
    "Em Vargarf, cada tribo é um coletivo, mas quem manda ainda é a força do chefe. Sua fé em Mui é vista como fraqueza ou ingenuidade, e só é {respeitado|respeitada} quando prova que o grupo vale mais que o indivíduo.",
  "mui|oakhaven":
    "Em Oakhaven, os mercadores da Fronteira Cinzenta conhecem a fé em Mui, mas pouco a entendem, e tratam os homens-galho como parceiros de negócio. É {tolerado|tolerada}, e a conversa sobre o coletivo costuma terminar em silêncio.",
  "mui|planicies-de-sunfield":
    "Em Sunfield, pregar o fim das hierarquias é virar inimigo de todo castelão. Precisa esconder o que reza, e qualquer sinal de proselitismo entre os camponeses pode terminar em prisão.",
  "mui|midland":
    "Na corte de Umbra, Mui é {visto|vista} como heresia contra a hierarquia, e as lembranças de Warsaw tornam a fé ainda mais suspeita. É {acusado|acusada} de simpatizar com a horda, e os nobres evitam seu nome.",
  "mui|blackwater":
    "Em Blackwater, a fé em Mui ganha ouvidos entre os explorados, e inimigos entre os senhores. Encontra aliados nos estivadores e nos pescadores, e perseguidores entre os barões que temem greves.",
  "mui|grao-ducado-de-highbridge":
    "Em Highbridge, Mui é uma curiosidade teológica nas universidades, que debatem a fé como um exemplo de organização social. É {tolerado|tolerada} com cortesia, e raramente {levado|levada} a sério.",
  "mui|uniao-das-provincias":
    "Na UP, onde a elite governa, a fé em Mui é vista com suspeita, e a polícia observa quem a prega. Pode ser {acusado|acusada} de subversão, e seus encontros acontecem em casas e porões.",
  "mui|reino-de-laguardia":
    "Em Laguardia, monarquia tradicional, Mui soa como subversão, e os nobres desconfiam de quem prega o fim das hierarquias. O culto é livre, mas é {observado|observada}, e a simpatia popular nem sempre ajuda.",
  "mui|reino-de-kruk":
    "Em Kruk, Mui é o próprio Estado, e a rainha é o seu Arauto. Ser fiel aqui é viver sem questionar: a colmeia cuida de {ele|ela}, e existe para a colmeia, até o dia em que for {levado|levada} ao processamento.",
  "mui|reino-de-crick":
    "Crick rompeu com Mui e se voltou para Tamem, e {um devoto|uma devota} de Mui ali é {traidor|traidora}. Se for {descoberto|descoberta}, o melhor é esperar uma morte rápida, porque o pior é virar exemplo.",
  "mui|irmandade-de-sao-ferdinand":
    "Na Irmandade, a fé em Mui lembra o inimigo de quitina, e é vista com desconfiança. Precisa provar que o coletivo de que fala é o da fraternidade dos fortes, não o da colmeia, e cada oração é vigiada.",
  "mui|imperio-das-estepes":
    "Os centauros não entendem uma fé sem glória individual, e a chamam de loucura de escravos. Um fiel de Mui nas estepes é {visto|vista} como presa, e a única proteção é um dono que valorize seu trabalho.",
  "mui|reclusos-do-deserto":
    "Os Reclusos debateriam Mui com interesse, e com discordância, porque seus Dojos valorizam o indivíduo que pensa e escolhe. É bem {recebido|recebida}, e provoca noites inteiras de discussão sobre o que o coletivo deve ao indivíduo.",
  "mui|mannaka-oko":
    "Em Man'naka oko, o coletivo é um luxo, e a lei é a do mais forte. Sua fé é vista como sonho de escravos, e quem a pratica precisa escolher entre a solidariedade secreta e a sobrevivência.",  // gorturk
  "gorturk|protetorado-de-morrow":
    "No protetorado, a fé dos conquistadores parece promessa de saque, ou de vingança, e os miseráveis a olham com medo e fascínio. Um fiel de Gorturk é {temido|temida} pela UP e {cortejado|cortejada} por quem quer lutar.",
  "gorturk|chiefdom-de-vargarf":
    "Em Vargarf, a expansão de Gorturk encontra eco entre tribos que vivem de saque, e seu culto é bem {recebido|recebida}. É {respeitado|respeitada} pelos guerreiros, e o chefe que desconfiar de {ele|ela} vai precisar de bons motivos.",
  "gorturk|oakhaven":
    "Em Oakhaven, Gorturk é a fé dos centauros que atacam as colmeias vizinhas, e seu culto dá raiva e medo. É {visto|vista} como {saqueador|saqueadora}, e a hospitalidade dura só até alguém descobrir o que {ele|ela} reza.",
  "gorturk|planicies-de-sunfield":
    "Em Sunfield, a fé de Gorturk assusta castelões que fogem de guerras, e quem a segue é {visto|vista} como mercenário em potencial. Pode ser contratado, mas nunca {recebido|recebida} como igual.",
  "gorturk|midland":
    "Em Midland, a fé dos centauros é respeitada pela coragem dos que vêm morrer contra Crick. É {recebido|recebida} com honra nas fronteiras, e cada fiel que cai em combate vira lenda nas aldeias.",
  "gorturk|blackwater":
    "Em Blackwater, a fé na conquista combina bem com a guerra constante entre senhores feudais. Um fiel de Gorturk é {mercenário valioso|mercenária valiosa}, e o pântano tem sempre uma disputa à espera de quem luta bem.",
  "gorturk|grao-ducado-de-highbridge":
    "Em Highbridge, Gorturk é a fé dos mercenários centauros do exército, e as universidades a estudam com curiosidade. Dentro do ducado vale a lei imperial: {ele|ela} reza à vontade, mas pilhagem e captura de escravos dão cadeia.",
  "gorturk|uniao-das-provincias":
    "Na UP, Gorturk é a fé dos centauros que vendem escravos pela Companhia, e os cidadãos a veem com nojo e uso. É {bem-vindo|bem-vinda} como {fornecedor|fornecedora}, {desprezado|desprezada} como {bárbaro|bárbara}, e sempre {vigiado|vigiada}.",
  "gorturk|reino-de-laguardia":
    "Em Laguardia, os mercenários centauros levam Gorturk para as tavernas, e ninguém estranha o culto. Encontra companhia nas companhias e inimigos nos que perderam parentes em suas campanhas.",
  "gorturk|reino-de-kruk":
    "Em Kruk, Gorturk é a fé dos caçadores de escravos que destruíram as lavouras da colmeia, e seus fiéis são inimigos mortais. Se um deles aparece, a rainha manda matar antes de perguntar.",
  "gorturk|reino-de-crick":
    "Em Crick, Gorturk é a fé dos centauros que vêm morrer em batalha contra a horda, e a horda os respeita como inimigos dignos. Um fiel {capturado|capturada} vive pouco, mas morre lutando, como ele mesmo desejaria.",
  "gorturk|irmandade-de-sao-ferdinand":
    "Na Irmandade, os centauros devotos de Gorturk que vêm morrer contra Crick são aliados bem-vindos. É {recebido|recebida} nos fortes como {herói de passagem|heroína de passagem}, e o seu último combate é honrado como poucos.",
  "gorturk|imperio-das-estepes":
    "Nas estepes, Gorturk é o deus do império, e seu Arauto é o Cavalga-mundos. Ser fiel é a regra, e o que {ele|ela} faz de sua vida breve, em glória ou em desonra, decide como será lembrado.",
  "gorturk|reclusos-do-deserto":
    "Os Reclusos, que vivem em paz, não entendem a fé na expansão eterna, e a tratam como curiosidade perigosa. É {bem-vindo|bem-vinda} como hóspede, mas os Dojos o observam, e cada palavra sobre conquista é desafiada com um debate.",
  "gorturk|mannaka-oko":
    "Em Man'naka oko, a fé na força encontra terreno fértil, e shoguns e centauros se entendem como poucos. É {respeitado|respeitada} pelos guerreiros, mas nunca confiado: ali, todo {aliado|aliada} é futuro rival.",  // tamem
  "tamem|protetorado-de-morrow":
    "No protetorado, a fé no mais forte é a própria lei da lama, e quem a segue sobrevive aos fracos. Os fiéis de Tamem são temidos e discretos, e a UP os caça quando percebe.",
  "tamem|chiefdom-de-vargarf":
    "Em Vargarf, a fé na força e na vingança encontra eco entre as tribos, que já vivem assim. É bem {recebido|recebida} pelos guerreiros, mas deve cuidado: um chefe que descobre vir de Crick pode matar antes de perguntar.",
  "tamem|oakhaven":
    "Em Oakhaven, Tamem é o deus da horda, e seu culto dá medo. Um fiel é {expulso|expulsa} ou {morto|morta}, e quem o abriga corre o mesmo risco.",
  "tamem|planicies-de-sunfield":
    "Em Sunfield, cultuar Tamem é se declarar inimigo de toda ordem, e os castelões punem com rigor. Vive escondido, e os espiões do feudo logo procuram quem reza {sozinho|sozinha}.",
  "tamem|midland":
    "Midland sofreu a ocupação da horda, e Tamem é o deus do inimigo. Um fiel é {tratado|tratada} como {traidor|traidora}, e qualquer sinal de culto pode terminar na forca ou na fogueira.",
  "tamem|blackwater":
    "Em Blackwater, a fé na força bruta tem seus seguidores discretos, que se escondem entre gangues e milícias. Sobrevive enquanto for útil, e quem o delata ganha recompensa.",
  "tamem|grao-ducado-de-highbridge":
    "Highbridge paga para manter Crick longe, e a fé em Tamem ali é inaceitável. Um fiel é investigado pela Agência e {preso|presa} por qualquer motivo, e o ducado não tem pressa em deixá-lo sair.",
  "tamem|uniao-das-provincias":
    "Na UP, cultuar Tamem é um escândalo, ainda que nenhuma lei fale disso, e a polícia o trata como suspeito de terrorismo. Precisa esconder o culto até dos vizinhos.",
  "tamem|reino-de-laguardia":
    "Em Laguardia, quem cultua Tamem não se comporta, e não é acolhido. O culto é livre, mas as guildas, os nobres e os mercenários o evitam, e vive {isolado|isolada}.",
  "tamem|reino-de-kruk":
    "Em Kruk, Tamem é o deus da horda rebelde, inimiga da colmeia. Um fiel {capturado|capturada} é {levado|levada} ao processamento sem julgamento, e a rainha vê nele a prova de que o livre-arbítrio leva à loucura.",
  "tamem|reino-de-crick":
    "Em Crick, Tamem é o deus regente, e linhagens inteiras nascem para ser sacrificadas na sua guerra. Ser fiel é a regra: {ele|ela} luta, obedece ao mais forte e sabe que sua vida existe para a vitória da horda.",
  "tamem|irmandade-de-sao-ferdinand":
    "Na Irmandade, Tamem é o deus do inimigo, e seu culto é motivo para a forca. Um fiel {descoberto|descoberta} num forte é {executado|executada}, e os guerreiros veem nisso um dever, não uma crueldade.",
  "tamem|imperio-das-estepes":
    "Os centauros respeitam a força, mas vão a Crick justamente para matar os devotos de Tamem. É {respeitado|respeitada} enquanto vence, e {desprezado|desprezada} como {aliado|aliada} da horda caso perca.",
  "tamem|reclusos-do-deserto":
    "Os Reclusos veem Tamem como a negação da ordem, e seus Dojos não aceitam quem o segue. É {recebido|recebida} com cuidado, mas se afirmar a fé em voz alta, é {convidado|convidada} a partir antes do anoitecer.",
  "tamem|mannaka-oko":
    "Em Man'naka oko, a fé no mais forte não soa nada estranha, e shoguns e guerreiros veem em Tamem um reflexo do que já vivem. É {aceito|aceita}, mas ninguém o protege de quem é mais forte.",  // nilos
  "nilos|protetorado-de-morrow":
    "No protetorado, a revolta contra a ordem imposta pela UP é terreno fértil para Nilos, e a Agência vê isso. Seus fiéis se escondem entre os miseráveis, e cada milagre caótico alimenta o medo e o desejo de mudança.",
  "nilos|chiefdom-de-vargarf":
    "Em Vargarf, a destruição é rotina, e Nilos encontra fiéis entre quem já vive do saque. É {bem-vindo|bem-vinda} quando traz ruína ao inimigo, e {temido|temida} quando o caos volta contra a própria tribo.",
  "nilos|oakhaven":
    "Em Oakhaven, longe de Kruk, homens-galho perdidos às vezes caem nos braços de Nilos. É {visto|vista} como mal presságio, e os mercadores preferem não fazer perguntas.",
  "nilos|planicies-de-sunfield":
    "Em Sunfield, camponeses explorados são presa fácil para Nilos, que promete o fim da opressão. Os castelões caçam seus pregadores, e precisa decidir entre lealdade ao caos e a quem sofre com ele.",
  "nilos|midland":
    "Em Midland, Nilos é a ameaça viva à hierarquia de Umbra, e os nobres veem sua fé como um incêndio à espera de faísca. Um fiel é {perseguido|perseguida} sem trégua, e qualquer sinal de culto pode servir de pretexto para purgas.",
  "nilos|blackwater":
    "Em Blackwater, o caos é a casa de Nilos, e seus fiéis se misturam sem esforço. Encontra abrigo e discípulos, e o pântano esconde bem quem faz do desastre um sacramento.",
  "nilos|grao-ducado-de-highbridge":
    "A queda das pontes de Highbridge seria o milagre supremo de Nilos, e por isso seus fiéis são caçados ali. Para a Agência, é o {suspeito|suspeita} número um, e a burocracia o tratará como ameaça ao ducado.",
  "nilos|uniao-das-provincias":
    "Na UP, os grupos de oposição financiados por forças desconhecidas podem esconder fiéis de Nilos, e a polícia sabe disso. Vive entre a cumplicidade e o risco de ser entregue por quem o protege.",
  "nilos|reino-de-laguardia":
    "Em Laguardia, quem cultua Nilos não se comporta, e o reino o vigia com atenção. As forjas e as companhias o evitam, e só encontra apoio entre quem nada tem a perder.",
  "nilos|reino-de-kruk":
    "Em Kruk, homens-galho que perdem os feromônios muitas vezes se tornam vetores de Nilos, e a rainha teme isso mais que qualquer inimigo. É {visto|vista} como a doença que a colmeia teme, e seu destino costuma ser o expurgo.",
  "nilos|reino-de-crick":
    "Em Crick, a destruição já é rotina, mas sob a ordem de Tamem, não de Nilos. Um fiel de Nilos ali é {visto|vista} como {louco|louca}, e o príncipe o usa como arma ou o descarta.",
  "nilos|irmandade-de-sao-ferdinand":
    "Na Irmandade, Nilos é {visto|vista} como inimigo da ordem e da fé, e seus fiéis são executados sem julgamento. Se {ele|ela} aparece num forte, é como {prisioneiro|prisioneira}, ou como alguém que nunca saiu de lá.",
  "nilos|imperio-das-estepes":
    "Nas estepes, a magia caótica de Nilos é a pior das trapaças, e os centauros matam quem a pratica. Sobrevive escondendo o dom, e quem descobre sua fé aprende a temê-lo antes de desprezá-lo.",
  "nilos|reclusos-do-deserto":
    "Os Reclusos veem Nilos como a negação da causalidade, o que a matemática deles não tolera. Os Dojos recusam seus fiéis, e quem o segue é {expulso|expulsa} ou {tratado|tratada} como doente da razão.",
  "nilos|mannaka-oko":
    "Em Man'naka oko, a ruína de uma civilização inteira lembra o que Nilos promete, e seus fiéis veem ali um milagre cumprido. É {aceito|aceita} como profeta ou {temido|temida} como arauto, conforme o shogun de plantão.",  // deus-oculto
  "deus-oculto|protetorado-de-morrow":
    "No protetorado, quase ninguém ouviu falar do Deus Oculto, e a seita passa despercebida entre os problemas maiores. Vive em paz, mas ninguém entende o que {ele|ela} espera, e quem pergunta tem pouca paciência.",
  "deus-oculto|chiefdom-de-vargarf":
    "Em Vargarf, quem espera um deus que ainda não despertou é {visto|vista} como {sonhador|sonhadora}, e as tribos o toleram por falta de ameaça. Seu rigor mental é estranho ao gelo, e aprende a calar o que sabe.",
  "deus-oculto|oakhaven":
    "Em Oakhaven, sua fé silenciosa passa despercebida, num povo que fala pouco e não pergunta. A paciência da seita combina com a rotina do frio, e vive sem ser incomodado.",
  "deus-oculto|planicies-de-sunfield":
    "Nas capelas de Sunfield, quem nega todos os deuses seria {visto|vista} como herege, se alguém soubesse. Esconde o que pensa, e os castelões, que adoram segredos, descobrem tudo cedo ou tarde.",
  "deus-oculto|midland":
    "Na corte de Umbra, chamar os deuses de falsos é heresia grave, e quem o faz é {queimado|queimada}. Esconde a fé com cuidado, e as discussões teológicas de Aurelia são um perigo constante.",
  "deus-oculto|blackwater":
    "Em Blackwater, ninguém se importa com teologia, e a seita vive em paz entre contrabandistas e gangues. É só mais um {excêntrico|excêntrica}, e o pântano oferece o melhor dos esconderijos: a indiferença.",
  "deus-oculto|grao-ducado-de-highbridge":
    "Nas universidades de Highbridge, os argumentos dos Dedutivos são estudados e debatidos, e é {tratado|tratada} como {filósofo|filósofa}, não como herege. A neutralidade do ducado protege seu direito de duvidar de todos os deuses, e seus debates atraem alunos.",
  "deus-oculto|uniao-das-provincias":
    "Na UP, negar Umbra e Activum é desafiar a religião oficial, e a elite vê a seita como risco. Vive em silêncio, e os encontros dos Dedutivos têm de acontecer em lugares sem testemunhas.",
  "deus-oculto|reino-de-laguardia":
    "Em Laguardia, o livre culto protege até quem nega todos os deuses, e a seita encontra ali um raro abrigo. Os ferreiros e os eruditos o toleram, e ninguém o obriga a explicar sua fé.",
  "deus-oculto|reino-de-kruk":
    "Em Kruk, negar Mui é negar a própria colmeia, e o Deus Oculto seria {visto|vista} como a pior das blasfêmias. Um homem-galho que o segue é denunciado pelos próprios irmãos, e o processamento o espera.",
  "deus-oculto|reino-de-crick":
    "Em Crick, negar Tamem é suicídio, e a seita não sobrevive à primeira inspeção. Quem a segue vive disfarçado, e o príncipe, que adora exemplos, castiga com crueldade quem descobre.",
  "deus-oculto|irmandade-de-sao-ferdinand":
    "Na Irmandade, negar Activum é negar a razão de ser dos fortes, e os mutantes tratam quem o faz como {traidor|traidora}. Precisa esconder o que pensa, e cada pergunta sobre a fé é um teste.",
  "deus-oculto|imperio-das-estepes":
    "Os centauros não toleram quem chama Gorturk de falso deus, e a pena é a morte. Esconde a seita com cuidado, e só em silêncio calcula quando o deus verdadeiro despertará.",
  "deus-oculto|reclusos-do-deserto":
    "Entre os Reclusos, a seita do Deus Oculto brotou do culto a Logan, e seus mosteiros são os mais restritos. Cresceu entre mestres que debatem o despertar, e os Dojos o veem como filho, mesmo quando discordam.",
  "deus-oculto|mannaka-oko":
    "Em Man'naka oko, ninguém sabe o que é o Deus Oculto, e a seita passa invisível entre shoguns e escravos. Pode estudar em paz, mas ninguém entende sua espera, e a solidão é total.",
  "humano-comum|companhia-de-comercio":
    "Cresceu entre armazéns, cais e contratos, e aprendeu cedo a contar, regatear e ler o mar. Para a Companhia, um humano que trabalha bem vale mais que qualquer brasão.",
  "elite-orelhas-pontudas|companhia-de-comercio":
    "Os magos da UP compram da Companhia o que o monopólio da magia não produz, e a sua casta é cliente fiel. Em Bonita {ele|ela} é bem {tratado|tratada}, e bem {cobrado|cobrada}.",
  "principe|companhia-de-comercio":
    "A Companhia comercia com todos, e um príncipe que fala e negocia é um intermediário raro, que ela sabe aproveitar. Mas ela também vende a sua espécie a quem paga, e precisa saber de que lado do balcão está.",
  "princesa|companhia-de-comercio":
    "Para a Companhia tudo tem preço, e uma princesa seria a carga mais valiosa que já cruzou o mar. Se está ali, vive escondida ou sob uma proteção muito cara.",
  "trabalhador|companhia-de-comercio":
    "A Companhia faz a ponte entre os centauros e a UP, e homens-galho capturados fazem parte da carga que atravessa o mar. Se está em Bonita ou Belladona, é mercadoria ou marujo sem escolha.",
  "centauros|companhia-de-comercio":
    "A Companhia compra os escravos que os centauros vendem e os revende à UP, então no cais {ele|ela} é visto como fornecedor, não como selvagem. No mar, a força só vale se alguém paga por ela.",
  "homens-do-deserto|companhia-de-comercio":
    "Um peregrino do deserto num porto de navegadores de gelo é visão rara, e a jornada pelo casco o trouxe até o mar. Os capitães ouvem com interesse quem conhece a história dos povos.",
  "vampiros|companhia-de-comercio":
    "Navios noturnos, armazéns fechados e contratos discretos: o comércio marítimo é um bom disfarce para quem vive nas sombras. Só o sol aberto do convés incomoda.",
  "soldado|companhia-de-comercio":
    "A Companhia mantém guardas próprios nos cais e nos navios, e serviu a ela contra piratas e saqueadores de Vargarf.",
  "mago-ortodoxo|companhia-de-comercio":
    "A Companhia compra e vende cajados e lentes como qualquer outra mercadoria, e um mago a bordo vale por uma tripulação de vigias.",
  "bardo|companhia-de-comercio":
    "Marujos e comerciantes pagam por canções de viagem, e um bardo que cura os doentes do convés embarca de graça.",
  "monge-de-dojo|companhia-de-comercio":
    "Um monge de Dojo entre navegadores é raridade, e a sua calma serve de guarda-costas a capitães que valorizam disciplina.",
  "mercenario|companhia-de-comercio":
    "A Companhia contrata escoltas para cargas e capitães, e paga em ouro sem perguntar de onde veio a espada.",
  "contrabandista|companhia-de-comercio":
    "A Companhia negocia na surdina com Blackwater, e sabe que o contrabando e o comércio legal dividem os mesmos navios.",
  "cacador|companhia-de-comercio":
    "Peles, marfim e carne salgada embarcam em Bonita, e caça para abastecer os porões da Companhia.",
  "mago-dissidente|companhia-de-comercio":
    "A Companhia compra o que ninguém quer saber de onde vem, e um mago sem licença encontra ali clientes e passagem.",
  "medico|companhia-de-comercio":
    "Um médico de bordo vale ouro entre escorbuto e feridas de pirata, e a Companhia o paga bem.",
  "alquimista|companhia-de-comercio":
    "A Companhia revende ligas, tinturas e pós de toda parte, e um alquimista no porto tem acesso a ingredientes de todas as nações.",
  "acolito|companhia-de-comercio":
    "Capelas de vários deuses atendem os marinheiros em Bonita, e um acólito encontra fiéis de todas as fés no cais.",
  "astrologo|companhia-de-comercio":
    "Navegar o gelo exige ler as estrelas, e a Companhia disputa os melhores astrólogos para guiar os seus navios.",
  "apotecario|companhia-de-comercio":
    "Os porões da Companhia carregam ervas e venenos de toda parte, e um apotecário negocia direto com os capitães.",
  "ferreiro|companhia-de-comercio":
    "Os estaleiros de Laguardia servem à Companhia, e um ferreiro que trabalha para os navios nunca fica sem encomenda.",
  "paladino|companhia-de-comercio":
    "A Companhia comercia com todos, e um paladino a seu serviço aprende a escolher entre a carga e a fé quando a carga é gente.",
  "cacador-de-monstros|companhia-de-comercio":
    "O Povo do Mar atormenta marinheiros em ilhas desconhecidas, e a Companhia paga bem a quem protege as suas rotas.",
  "detetive|companhia-de-comercio":
    "A Companhia guarda contratos e segredos de todas as nações, e um detetive vive de seguir cargas, devedores e fugitivos pelos cais.",
  "nobre|companhia-de-comercio":
    "A Companhia não tem nobreza, tem acionistas e capitães, e um nobre ali é só mais um comprador, ainda que com título.",
  "filosofo|companhia-de-comercio":
    "Entre cais e armazéns discute-se o valor das coisas, e um filósofo debate preço, lucro e liberdade com os capitães.",
  "cientista|companhia-de-comercio":
    "A Companhia vive de navegação no gelo e de cartas náuticas, e um cientista encontra ali patrocínio e uma frota de laboratório.",
  "logan|companhia-de-comercio":
    "Logan tem poucos devotos entre capitães, mas muitos marujos o conhecem pelo que importa no mar: manter a ordem do convés quando o navio vai a pique. {Ele|Ela} continua a cumprir a escala e a amarrar os cabos quando todos entram em pânico, e a tripulação desconfia que essa calma tenha uma religião por trás. Um contramestre mais velho já pediu para aprender o que {ele|ela} recita nas madrugadas.",
  "umbra|companhia-de-comercio":
    "Capelas de Umbra existem em Bonita, e capitães ricos doam a elas para ganhar a bênção das viagens. Encontra patrocínio fácil, ainda que a fé dos que pagam seja mais comercial do que devota.",
  "activum|companhia-de-comercio":
    "O pragmatismo de Activum combina com o balcão da Companhia, que justifica os seus contratos com ele. Encontra aliados entre capitães e contadores, e o risco é ser {usado|usada} para dar bênção a negócios que ninguém defenderia.",
  "mui|companhia-de-comercio":
    "Num porto de contratos individuais, a fé no coletivo de Mui parece estranha, e quem a prega perde as negociações. Os marujos, porém, entendem o valor do grupo no mar, e acha ali quem o escute.",
  "gorturk|companhia-de-comercio":
    "A Companhia compra o que os devotos de Gorturk pilham e capturam, então {ele|ela} é {bem-vindo|bem-vinda} como {fornecedor|fornecedora}, ainda que {desprezado|desprezada} como {bárbaro|bárbara}. Seu deus alimenta o comércio, e sabe disso, e a Companhia também.",
  "tamem|companhia-de-comercio":
    "Num porto onde tudo se compra, a fé em Tamem é tolerada enquanto não atrapalhar os negócios, e só em voz baixa. Encontra clientes entre quem lucra com a guerra, e inimigos entre quem a teme.",
  "nilos|companhia-de-comercio":
    "Navios com cargas obscuras e destinos desconhecidos são o melhor esconderijo para os seguidores de Nilos. Encontra passagem sem perguntas, e a Companhia, que não quer saber, tampouco impede.",
  "deus-oculto|companhia-de-comercio":
    "Os Dedutivos encontram nas cartas e bibliotecas dos capitães material para calcular o despertar, e a Companhia não pergunta para quê. É {um estudioso|uma estudiosa} a bordo, e os navios são o melhor lugar para pensar longe de todos.",};

// Versão da Agência do "Você no mundo" de cada fé e do "Impacto no mundo" de cada marca (fés e marcas do PDF e da prévia).
export const APURACAO_FE: Record<string, string> = {
  logan:
    "{Seguidor|Seguidora} de Logan, fé em decadência, viva sobretudo nos Dojos dos Homens do Deserto. A serenidade diante da dor e da morte pode parecer frieza a quem não a entende, e a devoção ao dever é levada a sério. Dessa mesma fé brotaram os Dedutivos, que a levaram ao extremo.",
  umbra:
    "{Devoto|Devota} de Umbra, religião oficial da UP e dominante na corte de Midland, onde a fé lhe dá lugar e respeito. Os dogmas pedem subordinação, tradição e obediência, e o fiel aprende a respeitar hierarquias, mesmo quando elas pesam sobre ele. Segundo a lenda, o Arauto da deusa sai sempre do Mosteiro de Itelonomeu, fechado a visitantes.",
  activum:
    "{Seguidor|Seguidora} de Activum, religião oficial da UP, cujo pragmatismo serve de justificativa para a escravidão legalizada. A Irmandade de São Ferdinand luta sob essa bandeira, e por isso os tradicionalistas de Umbra, em Midland, podem tomá-{lo|la} por herege. Entre cientistas, médicos e engenheiros, a fé é quase língua comum.",
  mui:
    "{Devoto|Devota} de Mui, deus de Kruk, onde a rainha é seu Arauto e ninguém vive para si mesmo. Fora da colmeia, quem prega que o indivíduo não importa assusta reinos construídos sobre nobres, vassalos e heranças. Entende o sacrifício pelo coletivo como virtude, mesmo quando o coletivo pede a própria vida.",
  gorturk:
    "{Devoto|Devota} de Gorturk, deus do Império das Estepes, cujo Arauto, o Cavalga-mundos, lidera os centauros há mais de 200 anos. A fé legitima a pilhagem, a conquista e a captura de escravos, e por isso os povos saqueados a veem como a bandeira dos invasores. Para o fiel, ficar parado é morrer devagar.",
  tamem:
    "{Devoto|Devota} de Tamem, deus de Crick, que pratica eugenia e mutações forçadas e sacrifica linhagens inteiras na guerra. Quase ninguém fora da horda o cultua abertamente, e quem o faz é visto como aliado de monstros. A fé exige força, obediência ao mais forte e vingança contra cada ofensa.",
  nilos:
    "Fiel de Nilos, que não tem templo nem nação: seus seguidores vivem infiltrados em todas as sociedades, e assumir a fé em público é se declarar inimigo de toda ordem. A magia dispensa cajados e baterias, mas exige perdas imediatas e caóticas em troca de milagres imprevisíveis. Muitos Homens-Galho que perdem os feromônios acabam a seu serviço.",
  "deus-oculto":
    "{Adepto|Adepta} do Deus Oculto, para quem todos os outros deuses são falsos, até Logan, que os Dedutivos tomam por mero degrau. A seita não funda reinos nem busca convertidos, então quase ninguém sabe o que {ele|ela} é, e quem sabe costuma estranhar. A força está no rigor da mente: debate, matemática e paciência à espera do despertar.",
};

export const APURACAO_MARCA: Record<string, string> = {
  "terceiro-olho":
    "Com o olho aberto, enxerga as almas dos vivos e dos mortos, os espíritos à espreita, a agonia dos escravizados e as cicatrizes deixadas pela magia, ao custo de fadiga física. Uns o chamam de abençoado, recompensa dos deuses pela morte da criatura vil, e outros de marcado ou maculado, herdeiro de uma maldição. Fora de Man'naka oko, quase ninguém sabe o que é a fenda na testa.",
  "mutacao-da-irmandade":
    "O corpo modificado lhe dá força e resistência para enfrentar as criaturas de Crick, à imagem do santo que ganhou dois braços extras para lutar com quatro espadas. As mutações se acumulam e não se escondem, e quem as vê sabe de onde vem. Para os tradicionalistas de Midland, é herege transumanista.",
};
