import { Document, Font, Image, Page, Path, pdf, StyleSheet, Svg, Text, View } from "@react-pdf/renderer";
import type { ReactNode } from "react";
import { PERICULOSIDADE_LABEL, PERICULOSIDADES, SEXO_LABEL, SEXOS, type Character } from "./character";
import { SINAIS_COMICOS } from "../data/apuracao";
import { flexiona, montarFicha, VAZIO, type Ficha } from "./ficha";

// Converte um caminho de public/ ("/fonts/x.ttf") no endereço que o react-pdf consegue ler.
export type ResolveAsset = (publicPath: string) => string;
const fromBrowser: ResolveAsset = (p) => new URL(p, window.location.origin).href;

// O PDF é uma análise de periculosidade da Agência de Inteligência e Detetives de Highbridge, num pergaminho.
// A agência não está na lore (é sigilosa por natureza): o tom é invenção do app, a pedido do usuário.
// IM Fell English (impressão antiga) no texto e Grenze Gotisch (a gótica do site, peso 600) em todos os títulos;
// o carimbo usa Cinzel, letra de bloco de carimbo. A Noto Sans
// fica de reserva para caracteres que a IM Fell não tem (texto livre do usuário).
const TEXTO = ["IM Fell", "Noto Sans"];
const TITULO = "Grenze Gotisch";
const CARIMBO = "Cinzel";
let registeredWith: string | null = null;

function registerFonts(resolve: ResolveAsset) {
  const chave = resolve("/fonts/IMFellEnglish-Regular.ttf");
  if (registeredWith === chave) return;
  Font.register({
    family: "IM Fell",
    fonts: [
      { src: chave },
      { src: resolve("/fonts/IMFellEnglish-Italic.ttf"), fontStyle: "italic" },
      // IM Fell não tem negrito: o negrito usa a mesma fonte (os destaques vêm do tamanho e da cor)
      { src: chave, fontWeight: "bold" },
    ],
  });
  // gótica só num peso: normal e negrito usam o mesmo arquivo (instância fixa 600 da fonte variável)
  const gotica = resolve("/fonts/GrenzeGotisch-SemiBold.ttf");
  Font.register({ family: TITULO, fonts: [{ src: gotica }, { src: gotica, fontWeight: "bold" }] });
  Font.register({ family: CARIMBO, src: resolve("/fonts/Cinzel-Bold.ttf"), fontWeight: "bold" });
  Font.register({
    family: "Noto Sans",
    fonts: [
      { src: resolve("/fonts/NotoSans-Regular.ttf") },
      { src: resolve("/fonts/NotoSans-Bold.ttf"), fontWeight: "bold" },
      { src: resolve("/fonts/NotoSans-Italic.ttf"), fontStyle: "italic" },
    ],
  });
  // A hifenização padrão do react-pdf segue regras do inglês; em português ela quebra palavras de forma errada.
  // Palavras longas demais (sem espaço) viram caracteres soltos para quebrar em vez de vazar da página.
  Font.registerHyphenationCallback((word) => (word.length > 30 ? Array.from(word) : [word]));
  registeredWith = chave;
}

const TINTA = "#2b1a0e";
const SEPIA = "#6b4a2a";
const PAPEL = "#f1e3bf";

const s = StyleSheet.create({
  page: { fontFamily: TEXTO, fontSize: 11, lineHeight: 1.45, paddingTop: 58, paddingBottom: 64, paddingHorizontal: 64, color: TINTA, backgroundColor: PAPEL },
  // textura do pergaminho (public/pdf/pergaminho.jpg) e a moldura dupla, em todas as folhas
  fundo: { position: "absolute", top: 0, left: 0, width: 595.28, height: 841.89 }, // A4 em pontos
  moldura: { position: "absolute", top: 24, left: 24, right: 24, bottom: 24, borderWidth: 1.2, borderColor: SEPIA },
  molduraFina: { position: "absolute", top: 28, left: 28, right: 28, bottom: 28, borderWidth: 0.4, borderColor: SEPIA },
  canto: { position: "absolute", width: 7, height: 7, backgroundColor: SEPIA, transform: "rotate(45deg)" },

  // à esquerda, como num ofício; o carimbo fica à direita, sem cobrir o texto
  cabecalho: { marginBottom: 6, paddingRight: 150 },
  ducado: { fontFamily: TITULO, fontSize: 14, color: SEPIA },
  chancelaria: { fontStyle: "italic", fontSize: 10.5, color: SEPIA, marginTop: 2 },
  titulo: { fontFamily: TITULO, fontSize: 27, lineHeight: 1.1, marginTop: 8 },
  meta: { fontSize: 9.5, color: SEPIA, marginTop: 4 },
  filete: { flexDirection: "row", alignItems: "center", marginVertical: 10, gap: 6 },
  fileteLinha: { flex: 1, borderBottomWidth: 0.8, borderBottomColor: SEPIA },
  fileteLosango: { width: 5, height: 5, backgroundColor: SEPIA, transform: "rotate(45deg)" },

  carimbo: {
    position: "absolute",
    top: 84,
    right: 44,
    borderWidth: 2,
    borderColor: "#8f1d14",
    paddingVertical: 3,
    paddingHorizontal: 8,
    transform: "rotate(-11deg)",
    opacity: 0.85,
  },
  carimboTexto: { fontFamily: CARIMBO, fontWeight: "bold", fontSize: 12, color: "#8f1d14", letterSpacing: 2 },

  sujeito: { flexDirection: "row", gap: 16, marginBottom: 6 },
  sujeitoDados: { flex: 1 },
  nome: { fontFamily: TITULO, fontSize: 22, lineHeight: 1.15, marginBottom: 6 },
  campo: { flexDirection: "row", marginBottom: 3 },
  campoRotulo: { width: 64, fontStyle: "italic", color: SEPIA },
  campoValor: { flex: 1 },
  retrato: { width: 118, alignItems: "center" },
  retratoMoldura: { borderWidth: 1, borderColor: SEPIA, padding: 3, backgroundColor: "#e8d6a8" },
  retratoImagem: { width: 108, height: 135, objectFit: "cover" },
  // escala de periculosidade em branco: o detetive (o mestre) marca à mão
  grau: { flexDirection: "row", flexWrap: "wrap", gap: 14, marginTop: 2 },
  grauOpcao: { flexDirection: "row", alignItems: "center", gap: 9 }, // folga para o X a pena não cobrir o rótulo
  grauCaixa: { width: 10, height: 10, borderWidth: 0.9, borderColor: TINTA },
  // o X sai da caixa, como feito à mão
  xis: { position: "absolute", top: -7, left: -5, width: 22, height: 22 },
  grauNota: { fontSize: 8.5, fontStyle: "italic", color: SEPIA, marginTop: 3 },
  legenda: { fontSize: 8.5, fontStyle: "italic", color: SEPIA, marginTop: 3, textAlign: "center" },

  secao: { marginTop: 10 },
  secaoTitulo: { fontFamily: TITULO, fontSize: 14, color: SEPIA, marginBottom: 2 },
  itemTitulo: { fontStyle: "italic" },
  item: { marginBottom: 4 },

  parecer: { marginTop: 14, fontStyle: "italic", fontSize: 10.5 },
  pe: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", marginTop: 22 },
  firma: { width: 240 },
  firmaImagem: { width: 210, height: 70, objectFit: "contain" },
  firmaLinha: { borderTopWidth: 0.8, borderTopColor: TINTA, marginTop: 2, paddingTop: 2 },
  firmaRotulo: { fontSize: 9, fontStyle: "italic", color: SEPIA },
  selo: { alignItems: "center" },
  seloCera: { width: 92, height: 92 },

  rodape: { position: "absolute", bottom: 36, left: 64, fontSize: 8, color: SEPIA, fontStyle: "italic" },
});

const CANTOS = [
  { top: 21, left: 21 },
  { top: 21, right: 21 },
  { bottom: 21, left: 21 },
  { bottom: 21, right: 21 },
];

function Pergaminho({ resolve }: { resolve: ResolveAsset }) {
  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/alt-text -- Image do react-pdf não tem alt */}
      <Image fixed src={resolve("/pdf/pergaminho.jpg")} style={s.fundo} />
      <View fixed style={s.moldura} />
      <View fixed style={s.molduraFina} />
      {CANTOS.map((c, i) => (
        <View key={i} fixed style={[s.canto, c]} />
      ))}
    </>
  );
}

function Filete() {
  return (
    <View style={s.filete}>
      <View style={s.fileteLinha} />
      <View style={s.fileteLosango} />
      <View style={s.fileteLinha} />
    </View>
  );
}

// X a pena: dois traços que engrossam no meio e afinam nas pontas, com um pingo de tinta onde a pena pousou.
function XisDePena() {
  return (
    <Svg viewBox="0 0 20 20" style={s.xis}>
      {/* primeiro traço, de cima à esquerda, levemente curvo; o segundo cruza mais apressado e passa do ponto */}
      <Path d="M3 2.6 C6.4 6.6 9.8 10.4 17.4 17.6 C17.9 18.1 17.2 18.8 16.6 18.3 C9.4 12 5.6 8.2 1.9 3.6 C1.6 3 2.5 2.1 3 2.6 Z" fill={TINTA} opacity={0.9} />
      <Path d="M17.8 1.4 C13.6 6.4 9.2 11.4 3.6 18.4 C3.1 19 2.1 18.4 2.6 17.7 C7.9 10.9 12.4 5.7 16.9 0.7 C17.4 0.2 18.3 0.8 17.8 1.4 Z" fill={TINTA} opacity={0.9} />
      <Path d="M2.4 3.4 m-1.3 0 a1.3 1.2 0 1 0 2.6 0 a1.3 1.2 0 1 0 -2.6 0" fill={TINTA} opacity={0.85} />
      <Path d="M17.3 17.9 m-0.6 0.4 a0.6 0.6 0 1 0 1.2 0 a0.6 0.6 0 1 0 -1.2 0" fill={TINTA} opacity={0.6} />
    </Svg>
  );
}

// Caixinhas em linha; a escolhida leva o X a pena.
function Marcaveis<T extends string>({ opcoes, rotulos, marcada }: { opcoes: readonly T[]; rotulos: Record<T, string>; marcada: T | null }) {
  return (
    <View style={s.grau}>
      {opcoes.map((o) => (
        <View key={o} style={s.grauOpcao}>
          <View style={s.grauCaixa}>{marcada === o && <XisDePena />}</View>
          <Text>{rotulos[o]}</Text>
        </View>
      ))}
    </View>
  );
}

function Campo({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <View style={s.campo}>
      <Text style={s.campoRotulo}>{rotulo}</Text>
      <Text style={s.campoValor}>{valor}</Text>
    </View>
  );
}

function Secao({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <View style={s.secao} wrap={false}>
      <Text style={s.secaoTitulo}>{titulo}</Text>
      {children}
    </View>
  );
}

function Itens({ itens }: { itens: { title: string; text: string }[] }) {
  if (itens.length === 0) return <Text>{VAZIO}</Text>;
  return itens.map((it) => (
    <View key={it.title} style={s.item}>
      <Text style={s.itemTitulo}>{it.title}</Text>
      <Text>{it.text}</Text>
    </View>
  ));
}

// O react-pdf só embute PNG e JPEG, e as artes do catálogo são WebP: no navegador, o retrato é redesenhado
// num canvas e vira JPEG. Fora do navegador (testes) ou se falhar, o PDF sai sem o retrato.
async function retratoEmbutivel(src: string, resolve: ResolveAsset): Promise<string | null> {
  const webp = src.startsWith("data:image/webp") || src.endsWith(".webp");
  if (!webp) return src.startsWith("data:") ? src : resolve(src);
  if (typeof document === "undefined") return null;
  try {
    const bitmap = await createImageBitmap(await (await fetch(src.startsWith("data:") ? src : resolve(src))).blob());
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0);
    return canvas.toDataURL("image/jpeg", 0.88);
  } catch {
    return null;
  }
}

function RelatorioDocument({ ficha, retrato, sinal, resolve }: { ficha: Ficha; retrato: string | null; sinal: string; resolve: ResolveAsset }) {
  const { imagem } = ficha.aparencia;
  return (
    <Document title={`Análise de periculosidade ${ficha.dossie} — ${ficha.nome}`} language="pt-BR">
      <Page size="A4" style={s.page}>
        <Pergaminho resolve={resolve} />
        <View style={s.carimbo}>
          <Text style={s.carimboTexto}>CONFIDENCIAL</Text>
        </View>

        <View style={s.cabecalho}>
          <Text style={s.ducado}>Agência de Inteligência e Detetives de Highbridge</Text>
          <Text style={s.chancelaria}>Divisão de Vigilância · Ala das Embaixadas · Uso restrito</Text>
          <Text style={s.titulo}>Análise de Periculosidade de Indivíduo</Text>
          <Text style={s.meta}>
            Processo nº {ficha.dossie} · Aberto em {ficha.lavradoEm}
          </Text>
        </View>
        <Filete />

        <View style={s.sujeito}>
          <View style={s.sujeitoDados}>
            <Text style={s.secaoTitulo}>Identificação do indivíduo</Text>
            <Text style={s.nome}>{ficha.nome}</Text>
            <View style={s.campo}>
              <Text style={s.campoRotulo}>Sexo</Text>
              <Marcaveis opcoes={SEXOS} rotulos={SEXO_LABEL} marcada={ficha.marcados.sexo} />
            </View>
            <Campo rotulo="Idade" valor={ficha.idade} />
            <Campo rotulo="Origem" valor={ficha.origem} />
            <Campo rotulo="Espécie" valor={ficha.especie} />
            <Campo rotulo="Ofício" valor={ficha.oficio} />
          </View>
          {imagem && retrato && (
            <View style={s.retrato}>
              <View style={s.retratoMoldura}>
                {/* eslint-disable-next-line jsx-a11y/alt-text -- Image do react-pdf não tem alt */}
                <Image src={retrato} style={s.retratoImagem} />
              </View>
            </View>
          )}
        </View>

        <View style={s.secao}>
          <Text style={s.secaoTitulo}>Síntese da apuração</Text>
          <Text>{ficha.apuracao.especie}</Text>
          <Text style={{ marginTop: 4 }}>{ficha.apuracao.origem}</Text>
          <Text style={{ marginTop: 4 }}>{ficha.apuracao.oficio}</Text>
        </View>
        <Secao titulo="Grau de periculosidade">
          <Marcaveis opcoes={PERICULOSIDADES} rotulos={PERICULOSIDADE_LABEL} marcada={ficha.marcados.periculosidade} />
          {!ficha.marcados.periculosidade && <Text style={s.grauNota}>Classificação pendente de observação em campo.</Text>}
        </Secao>
        <Secao titulo="I. Crenças e lealdades declaradas">
          <Itens itens={ficha.fes.map((f) => ({ title: f.nome, text: f.implicacoes }))} />
        </Secao>
        <Secao titulo="II. Sinais particulares">
          {/* as marcas e, sempre, um hábito observado em campo, sorteado a cada PDF */}
          <Itens itens={[...ficha.marcas.map((m) => ({ title: m.nome, text: m.descricao })), { title: "Observado em campo", text: sinal }]} />
        </Secao>
        <Secao titulo="III. Descrição física">
          <Text>{ficha.aparencia.notas}</Text>
        </Secao>
        <Secao titulo="IV. Histórico apurado">
          <Text>{ficha.historia}</Text>
        </Secao>
        <Secao titulo="V. Perfil comportamental">
          <Text>{ficha.personalidade}</Text>
        </Secao>

        <View wrap={false}>
          <Filete />
          <Text style={s.parecer}>
            Parecer da Agência: indivíduo fichado e mantido sob observação discreta até segunda ordem. Highbridge não toma partido:
            vigia, registra e cobra. Este processo segue lacrado para os cofres do Quarteirão Dourado, e sua divulgação fora da
            Agência é crime contra o Grão-Ducado.
          </Text>
          <View style={s.pe}>
            <View style={s.firma}>
              {/* eslint-disable-next-line jsx-a11y/alt-text -- Image do react-pdf não tem alt */}
              {ficha.assinatura ? <Image src={ficha.assinatura} style={s.firmaImagem} /> : <View style={{ height: 70 }} />}
              <View style={s.firmaLinha}>
                <Text style={s.firmaRotulo}>Assinatura do indivíduo · colhida em registro do Quarteirão Dourado</Text>
              </View>
            </View>
            <View style={s.selo}>
              {/* cera vermelha derretida (public/pdf/selo-cera.png, gerada para o app) */}
              {/* eslint-disable-next-line jsx-a11y/alt-text -- Image do react-pdf não tem alt */}
              <Image src={resolve("/pdf/selo-cera.png")} style={s.seloCera} />
              <Text style={s.legenda}>Selo da Agência</Text>
            </View>
          </View>
        </View>

        <Text style={s.rodape} fixed>
          Documento sigiloso da Agência de Inteligência e Detetives de Highbridge · Divulgação proibida
        </Text>
      </Page>
    </Document>
  );
}

// sorteio: injetável para os testes; cada PDF exportado sai com um sinal cômico diferente
export async function gerarFichaPdf(character: Character, resolve: ResolveAsset = fromBrowser, sorteio = Math.random): Promise<Blob> {
  registerFonts(resolve);
  const ficha = montarFicha(character);
  const retrato = ficha.aparencia.imagem && (await retratoEmbutivel(ficha.aparencia.imagem.src, resolve));
  const sinal = flexiona(SINAIS_COMICOS[Math.floor(sorteio() * SINAIS_COMICOS.length)], character.sexo);
  return pdf(<RelatorioDocument ficha={ficha} retrato={retrato || null} sinal={sinal} resolve={resolve} />).toBlob();
}
