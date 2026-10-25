// Upload de imagem própria: tudo acontece no navegador, nada vai para a rede.
import type { AppearanceImage } from "./character";

export const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];
export const MAX_SIDE = 512;
// Limite do data URL salvo (a string inteira), para caber com folga nos ~5 MB do localStorage.
export const MAX_DATA_URL_LENGTH = 400 * 1024;
export const DATA_URL_PREFIXES = ["data:image/png;base64,", "data:image/jpeg;base64,", "data:image/webp;base64,"];
const QUALITIES = [0.85, 0.75, 0.65, 0.55, 0.45, 0.35, 0.25];

export const ERRO_FORMATO = "Use PNG, JPEG ou WebP.";
export const ERRO_TAMANHO = "Imagem muito grande, escolha outra.";
export const ERRO_LEITURA = "Não foi possível ler a imagem, escolha outra.";

export const isValidImageDataUrl = (dataUrl: string) =>
  DATA_URL_PREFIXES.some((p) => dataUrl.startsWith(p)) && dataUrl.length <= MAX_DATA_URL_LENGTH;

// Mantém a proporção e limita o lado maior; imagens menores não são ampliadas.
export function fitWithin(width: number, height: number, max = MAX_SIDE) {
  const scale = Math.min(1, max / Math.max(width, height));
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) };
}

// Decodificar e codificar dependem do canvas do navegador; os testes injetam versões falsas.
export type ImageCodec<T = unknown> = {
  decode: (file: Blob) => Promise<{ width: number; height: number; source: T }>;
  encodeJpeg: (source: T, width: number, height: number, quality: number) => string;
};

export const browserCodec: ImageCodec<ImageBitmap> = {
  decode: async (file) => {
    const bitmap = await createImageBitmap(file);
    return { width: bitmap.width, height: bitmap.height, source: bitmap };
  },
  encodeJpeg: (bitmap, width, height, quality) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas indisponível");
    ctx.fillStyle = "#ffffff"; // JPEG não tem transparência: fundo branco em vez de preto
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(bitmap, 0, 0, width, height);
    return canvas.toDataURL("image/jpeg", quality);
  },
};

export type UploadResult = { ok: true; image: AppearanceImage } | { ok: false; error: string };

export async function prepareUpload<T>(file: File, codec: ImageCodec<T>): Promise<UploadResult> {
  if (!ACCEPTED_TYPES.includes(file.type)) return { ok: false, error: ERRO_FORMATO };
  let decoded: Awaited<ReturnType<ImageCodec<T>["decode"]>>;
  try {
    decoded = await codec.decode(file);
  } catch {
    return { ok: false, error: ERRO_LEITURA };
  }
  const { width, height } = fitWithin(decoded.width, decoded.height);
  for (const quality of QUALITIES) {
    const dataUrl = codec.encodeJpeg(decoded.source, width, height, quality);
    if (isValidImageDataUrl(dataUrl)) return { ok: true, image: { kind: "upload", dataUrl, name: file.name } };
  }
  return { ok: false, error: ERRO_TAMANHO };
}
