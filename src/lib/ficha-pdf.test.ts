import { join } from "node:path";
import { PDFParse } from "pdf-parse";
import { describe, expect, it } from "vitest";
import { personagemCompleto as completo } from "./ficha.fixtures";
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

  it("nome do arquivo usa o nome em slug", () => {
    expect(nomeArquivoFicha(completo)).toBe("ficha-isabela-de-souca.pdf");
    expect(nomeArquivoFicha(initialCharacter)).toBe("ficha-personagem.pdf");
  });
});
