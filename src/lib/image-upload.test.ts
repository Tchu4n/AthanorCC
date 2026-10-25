import { describe, expect, it } from "vitest";
import {
  ERRO_FORMATO,
  ERRO_LEITURA,
  ERRO_TAMANHO,
  fitWithin,
  MAX_DATA_URL_LENGTH,
  prepareUpload,
  type ImageCodec,
} from "./image-upload";

// Codec falso: registra cada codificação e devolve um JPEG com o tamanho que o teste quiser.
function fakeCodec(width: number, height: number, sizeAt: (quality: number) => number) {
  const calls: { width: number; height: number; quality: number }[] = [];
  const codec: ImageCodec<null> = {
    decode: async () => ({ width, height, source: null }),
    encodeJpeg: (_s, w, h, quality) => {
      calls.push({ width: w, height: h, quality });
      return "data:image/jpeg;base64," + "A".repeat(sizeAt(quality));
    },
  };
  return { codec, calls };
}

const file = (name: string, type: string) => new File([new Uint8Array(10)], name, { type });

describe("fitWithin", () => {
  it("limita o lado maior a 512 px mantendo a proporção, sem ampliar imagens pequenas", () => {
    expect(fitWithin(4000, 3000)).toEqual({ width: 512, height: 384 });
    expect(fitWithin(1000, 4000)).toEqual({ width: 128, height: 512 });
    expect(fitWithin(300, 200)).toEqual({ width: 300, height: 200 });
  });
});

describe("prepareUpload", () => {
  it("imagem grande é redimensionada para no máximo 512 px e salva como JPEG 0,85", async () => {
    const { codec, calls } = fakeCodec(4000, 3000, () => 50_000);
    const result = await prepareUpload(file("foto.png", "image/png"), codec);
    expect(calls).toEqual([{ width: 512, height: 384, quality: 0.85 }]);
    expect(result).toMatchObject({ ok: true, image: { kind: "upload", name: "foto.png" } });
    if (result.ok && result.image.kind === "upload") expect(result.image.dataUrl.startsWith("data:image/jpeg;base64,")).toBe(true);
  });

  it("imagem de 3000 x 2000 px sai com no máximo 512 px e data URL abaixo de 400 KB", async () => {
    // Sem canvas no Node: o codec falso gera um JPEG proporcional aos pixels e à qualidade (pior caso: 3 bytes por pixel).
    // A compressão real, com canvas do navegador, é coberta em e2e/upload.e2e.ts.
    const encoded: { width: number; height: number }[] = [];
    const codec: ImageCodec<null> = {
      decode: async () => ({ width: 3000, height: 2000, source: null }),
      encodeJpeg: (_s, width, height, quality) => {
        encoded.push({ width, height });
        return "data:image/jpeg;base64," + "A".repeat(Math.ceil(((width * height * 3 * quality) / 3) * 4));
      },
    };
    const result = await prepareUpload(file("grande.jpg", "image/jpeg"), codec);
    expect(result.ok).toBe(true);
    if (!result.ok || result.image.kind !== "upload") return;
    for (const { width, height } of encoded) expect(Math.max(width, height)).toBeLessThanOrEqual(512);
    expect(encoded[0]).toEqual({ width: 512, height: 341 });
    expect(result.image.dataUrl.length).toBeLessThan(MAX_DATA_URL_LENGTH);
  });

  it("reduz a qualidade até caber em 400 KB", async () => {
    const { codec, calls } = fakeCodec(2000, 2000, (q) => (q > 0.6 ? MAX_DATA_URL_LENGTH : 100_000));
    const result = await prepareUpload(file("foto.webp", "image/webp"), codec);
    expect(result.ok).toBe(true);
    expect(calls.map((c) => c.quality)).toEqual([0.85, 0.75, 0.65, 0.55]);
  });

  it("se nem a menor qualidade couber, recusa com a mensagem de tamanho", async () => {
    const { codec } = fakeCodec(512, 512, () => MAX_DATA_URL_LENGTH);
    expect(await prepareUpload(file("enorme.jpg", "image/jpeg"), codec)).toEqual({ ok: false, error: ERRO_TAMANHO });
  });

  it("formato não aceito é recusado com a mensagem certa, sem decodificar", async () => {
    const { codec, calls } = fakeCodec(10, 10, () => 10);
    for (const [name, type] of [["notas.txt", "text/plain"], ["anim.gif", "image/gif"], ["vetor.svg", "image/svg+xml"], ["sem-tipo", ""]])
      expect(await prepareUpload(file(name, type), codec)).toEqual({ ok: false, error: ERRO_FORMATO });
    expect(calls).toEqual([]);
  });

  it("arquivo com tipo de imagem mas conteúdo ilegível vira mensagem, sem exceção", async () => {
    const codec: ImageCodec<null> = {
      decode: async () => {
        throw new Error("corrompido");
      },
      encodeJpeg: () => "",
    };
    expect(await prepareUpload(file("quebrada.png", "image/png"), codec)).toEqual({ ok: false, error: ERRO_LEITURA });
  });
});
