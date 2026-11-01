import { join } from "node:path";
import { PDFParse } from "pdf-parse";
import { describe, expect, it } from "vitest";
import { JPEG_PEQUENO, personagemCompleto as completo } from "./ficha.fixtures";
import { nomeArquivoFicha } from "./ficha";
import { gerarFichaPdf } from "./ficha-pdf";
import { initialCharacter } from "./initialCharacter";

// No Node, fontes e imagens vêm direto de public/.
const fromDisk = (p: string) => join(process.cwd(), "public", p);
// imagens embutidas no PDF além das fixas: pergaminho (1) e selo de cera (PNG transparente: imagem + máscara)
const FIXAS = 3;
const imagens = async (b: Blob) => Buffer.from(await b.arrayBuffer()).toString("latin1").split("/Subtype /Image").length - 1 - FIXAS;

async function textOf(blob: Blob) {
  const parser = new PDFParse({ data: new Uint8Array(await blob.arrayBuffer()) });
  try {
    return (await parser.getText()).text;
  } finally {
    await parser.destroy();
  }
}

describe("gerarFichaPdf", () => {
  it("personagem mínimo (só nome) gera PDF com — nos campos vazios", async () => {
    const blob = await gerarFichaPdf({ ...initialCharacter, identity: { ...initialCharacter.identity, name: "Corvo" } }, fromDisk);
    expect(blob.size).toBeGreaterThan(1000);
    expect(new TextDecoder().decode(await blob.slice(0, 5).arrayBuffer())).toBe("%PDF-");
    const text = await textOf(blob);
    expect(text).toContain("Corvo");
    expect(text).toContain("—");
  }, 30_000);

  it("personagem completo gera PDF com nome, espécie, região e acentos", async () => {
    const blob = await gerarFichaPdf(completo, fromDisk);
    expect(blob.size).toBeGreaterThan(10_000); // inclui a imagem de referência
    const text = await textOf(blob);
    for (const s of ["Isabela de Souça", "Humano (Elite de orelhas pontudas)", "Midland, Aurelia", "Mago ortodoxo", "Umbra", "Terceiro Olho", "Fugiu da corte."])
      expect(text).toContain(s);
  }, 30_000);

  it("imagem enviada (upload) entra no PDF como objeto de imagem; upload ilegível vira —", async () => {
    const comUpload = { ...completo, appearance: { image: { kind: "upload" as const, dataUrl: JPEG_PEQUENO, name: "eu.jpg" }, notes: "" } };
    const blob = await gerarFichaPdf(comUpload, fromDisk);
    expect(await imagens(blob)).toBe(1);
    expect(await textOf(blob)).not.toContain("eu.jpg"); // nome do arquivo enviado nunca aparece

    const semImagem = { ...completo, appearance: { image: null, notes: "" } };
    expect(await imagens(await gerarFichaPdf(semImagem, fromDisk))).toBe(0);

    const ilegivel = { ...completo, appearance: { image: { kind: "upload" as const, dataUrl: "data:image/gif;base64,R0lG", name: "x.gif" }, notes: "" } };
    const quebrado = await gerarFichaPdf(ilegivel, fromDisk);
    expect(await imagens(quebrado)).toBe(0);
    expect(await textOf(quebrado)).not.toContain("x.gif");
  }, 30_000);

  it("análise de periculosidade de Highbridge: cabeçalho, nº do processo e assinatura ao pé", async () => {
    const semNada = { ...completo, appearance: { image: null, notes: "" } };
    const text = (await textOf(await gerarFichaPdf(semNada, fromDisk))).replace(/\s+/g, " "); // títulos longos quebram linha
    // títulos com letras espaçadas saem letra a letra na extração: confere pelo rodapé
    for (const s of ["Documento sigiloso da Agência de Inteligência e Detetives de Highbridge", "Análise de Periculosidade de Indivíduo", "Processo nº HB-", "Grau de periculosidade", "Síntese da apuração", "Assinatura do indivíduo"])
      expect(text).toContain(s);
    expect(await imagens(await gerarFichaPdf(semNada, fromDisk))).toBe(0);
    expect(await imagens(await gerarFichaPdf({ ...semNada, assinatura: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" }, fromDisk))).toBe(2); // PNG transparente: imagem + máscara
  }, 30_000);

  it("sexo e grau de periculosidade saem como caixinhas; a escolhida leva o X a pena", async () => {
    const vetores = async (c: typeof completo) => {
      const pdfText = Buffer.from(await (await gerarFichaPdf(c, fromDisk, () => 0)).arrayBuffer()).toString("latin1");
      return pdfText;
    };
    const semMarca = { ...completo, sexo: null, periculosidade: null, appearance: { image: null, notes: "" } };
    const text = (await textOf(await gerarFichaPdf(semMarca, fromDisk))).replace(/\s+/g, " ");
    for (const s of ["Masculino", "Feminino", "Incerto", "Baixo", "Moderado", "Alto", "Extremo", "Classificação pendente"]) expect(text).toContain(s);
    const marcado = (await textOf(await gerarFichaPdf({ ...semMarca, periculosidade: "alto" }, fromDisk))).replace(/\s+/g, " ");
    expect(marcado).not.toContain("Classificação pendente");
    // o X é vetorial: com duas marcas o PDF fica maior que sem nenhuma (sinal cômico fixo: senão o tamanho varia com o sorteio)
    expect((await vetores({ ...semMarca, sexo: "feminino", periculosidade: "alto" })).length).toBeGreaterThan((await vetores(semMarca)).length);
  }, 30_000);

  it("sinais particulares levam um hábito cômico sorteado a cada PDF", async () => {
    const semImagem = { ...completo, appearance: { image: null, notes: "" } };
    const primeiro = (await textOf(await gerarFichaPdf(semImagem, fromDisk, () => 0))).replace(/\s+/g, " ");
    expect(primeiro).toContain("Observado em campo");
    expect(primeiro).toContain("Toma café sem açúcar");
    const ultimo = (await textOf(await gerarFichaPdf(semImagem, fromDisk, () => 0.9999))).replace(/\s+/g, " ");
    expect(ultimo).toContain("Pede a conta antes de pedir a comida");
    expect(ultimo).not.toContain("Toma café sem açúcar");
  }, 30_000);

  it("nome do arquivo usa o nome em slug", () => {
    expect(nomeArquivoFicha(completo)).toBe("ficha-isabela-de-souca.pdf");
    expect(nomeArquivoFicha(initialCharacter)).toBe("ficha-personagem.pdf");
  });
});

describe("gerarFichaPdf: textos sem espaço", () => {
  it("palavra gigante quebra em linhas em vez de vazar da página", async () => {
    const gigante = "1111111111111124-dsfhdhdaaaaaaaaaaa".repeat(8);
    const blob = await gerarFichaPdf({ ...completo, identity: { ...completo.identity, shortStory: gigante } }, fromDisk);
    const linhas = (await textOf(blob)).split("\n").filter((l) => l.includes("dsfhdhd"));
    expect(linhas.length).toBeGreaterThan(2); // vários pedaços = quebrou
    expect(linhas.join("").replace(/\s|-/g, "")).toContain(gigante.replace(/-/g, "")); // e nada sumiu
  }, 30_000);
});
