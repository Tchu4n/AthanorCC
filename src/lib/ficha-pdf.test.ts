import { join } from "node:path";
import { PDFParse } from "pdf-parse";
import { describe, expect, it } from "vitest";
import { JPEG_PEQUENO, personagemCompleto as completo } from "./ficha.fixtures";
import { nomeArquivoFicha } from "./ficha";
import { gerarFichaPdf } from "./ficha-pdf";
import { initialCharacter } from "./initialCharacter";

// No Node, fontes e imagens vêm direto de public/.
const fromDisk = (p: string) => join(process.cwd(), "public", p);

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
    const hasImage = async (b: Blob) => Buffer.from(await b.arrayBuffer()).toString("latin1").includes("/Subtype /Image");
    const comUpload = { ...completo, appearance: { image: { kind: "upload" as const, dataUrl: JPEG_PEQUENO, name: "eu.jpg" }, notes: "" } };
    const blob = await gerarFichaPdf(comUpload, fromDisk);
    expect(await hasImage(blob)).toBe(true);
    expect(await textOf(blob)).toContain("eu.jpg");

    const semImagem = { ...completo, appearance: { image: null, notes: "" } };
    expect(await hasImage(await gerarFichaPdf(semImagem, fromDisk))).toBe(false);

    const ilegivel = { ...completo, appearance: { image: { kind: "upload" as const, dataUrl: "data:image/gif;base64,R0lG", name: "x.gif" }, notes: "" } };
    const quebrado = await gerarFichaPdf(ilegivel, fromDisk);
    expect(await hasImage(quebrado)).toBe(false);
    expect(await textOf(quebrado)).not.toContain("x.gif");
  }, 30_000);

  it("nome do arquivo usa o nome em slug", () => {
    expect(nomeArquivoFicha(completo)).toBe("ficha-isabela-de-souca.pdf");
    expect(nomeArquivoFicha(initialCharacter)).toBe("ficha-personagem.pdf");
  });
});
