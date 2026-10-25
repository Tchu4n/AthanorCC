import { Document, Font, Image, Page, pdf, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { Character } from "./character";
import { montarFicha, VAZIO, type Ficha } from "./ficha";

// Converte um caminho de public/ ("/fonts/x.ttf") no endereço que o react-pdf consegue ler.
export type ResolveAsset = (publicPath: string) => string;
const fromBrowser: ResolveAsset = (p) => new URL(p, window.location.origin).href;

const FAMILY = "Noto Sans";
let registeredWith: string | null = null;

function registerFont(resolve: ResolveAsset) {
  const regular = resolve("/fonts/NotoSans-Regular.ttf");
  if (registeredWith === regular) return;
  Font.register({
    family: FAMILY,
    fonts: [
      { src: regular },
      { src: resolve("/fonts/NotoSans-Bold.ttf"), fontWeight: "bold" },
      { src: resolve("/fonts/NotoSans-Italic.ttf"), fontStyle: "italic" },
    ],
  });
  // A hifenização padrão do react-pdf segue regras do inglês; em português ela quebra palavras de forma errada.
  Font.registerHyphenationCallback((word) => [word]);
  registeredWith = regular;
}

const s = StyleSheet.create({
  page: { fontFamily: FAMILY, fontSize: 10, lineHeight: 1.4, padding: 40, color: "#171717" },
  header: { borderBottomWidth: 1, borderBottomColor: "#999", paddingBottom: 8, marginBottom: 12 },
  name: { fontSize: 22, fontWeight: "bold", lineHeight: 1.2 }, // sem isto herda a altura de linha do corpo e encosta na espécie
  subtitle: { fontSize: 12, lineHeight: 1.3, marginTop: 4 },
  section: { marginBottom: 10 },
  label: { fontSize: 8, fontWeight: "bold", textTransform: "uppercase", color: "#555", marginBottom: 2 },
  itemTitle: { fontWeight: "bold" },
  item: { marginBottom: 4 },
  appearance: { flexDirection: "row", gap: 10 },
  image: { width: 120, height: 120, objectFit: "contain" },
  appearanceText: { flex: 1 },
  footer: { position: "absolute", bottom: 20, left: 40, right: 40, fontSize: 8, color: "#777", textAlign: "right" },
});

function Field({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.section} wrap={false}>
      <Text style={s.label}>{label}</Text>
      <Text>{value}</Text>
    </View>
  );
}

function List({ label, items }: { label: string; items: { title: string; text: string }[] }) {
  return (
    <View style={s.section}>
      <Text style={s.label}>{label}</Text>
      {items.length === 0 && <Text>{VAZIO}</Text>}
      {items.map((it) => (
        <View key={it.title} style={s.item} wrap={false}>
          <Text style={s.itemTitle}>{it.title}</Text>
          <Text>{it.text}</Text>
        </View>
      ))}
    </View>
  );
}

// O react-pdf embute PNG e JPEG; WebP (só possível em upload vindo de fora do app) fica de fora em vez de quebrar o PDF.
const podeEmbutir = (src: string) => !src.startsWith("data:image/webp");

function FichaDocument({ ficha, resolve }: { ficha: Ficha; resolve: ResolveAsset }) {
  const { imagem } = ficha.aparencia;
  return (
    <Document title={`Ficha — ${ficha.nome}`} language="pt-BR">
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <Text style={s.name}>{ficha.nome}</Text>
          <Text style={s.subtitle}>{ficha.especie}</Text>
        </View>

        <Field label="Idade" value={ficha.idade} />
        <Field label="Origem" value={ficha.origem} />
        <Field label="Espécie" value={ficha.especie} />
        <Field label="Ofício" value={ficha.oficio} />
        <List label="Fés" items={ficha.fes.map((f) => ({ title: f.nome, text: f.implicacoes }))} />
        <List label="Marcas" items={ficha.marcas.map((m) => ({ title: m.nome, text: m.descricao }))} />

        <View style={s.section} wrap={false}>
          <Text style={s.label}>Aparência</Text>
          <View style={s.appearance}>
            {/* eslint-disable-next-line jsx-a11y/alt-text -- Image do react-pdf não tem alt */}
            {imagem && podeEmbutir(imagem.src) && <Image src={imagem.src.startsWith("data:") ? imagem.src : resolve(imagem.src)} style={s.image} />}
            <View style={s.appearanceText}>
              {imagem && <Text style={s.itemTitle}>{imagem.displayName}</Text>}
              <Text>{ficha.aparencia.notas}</Text>
            </View>
          </View>
        </View>

        <Field label="História curta" value={ficha.historia} />
        <Field label="Personalidade" value={ficha.personalidade} />

        <Text style={s.footer} fixed render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
      </Page>
    </Document>
  );
}

export async function gerarFichaPdf(character: Character, resolve: ResolveAsset = fromBrowser): Promise<Blob> {
  registerFont(resolve);
  return pdf(<FichaDocument ficha={montarFicha(character)} resolve={resolve} />).toBlob();
}
