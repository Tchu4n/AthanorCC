// Upload de imagem própria: tudo acontece no navegador, nada vai para a rede.
import type { AppearanceImage } from "./character";

export const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];
export const MAX_SIDE = 512;
// Limite do data URL salvo (a string inteira), para caber com folga nos ~5 MB do localStorage.
export const MAX_DATA_URL_LENGTH = 400 * 1024;
// Arquivo enviado: acima disso nem é decodificado (uma imagem gigante travaria a aba). Fotos de celular ficam bem abaixo.
export const MAX_ARQUIVO = 20 * 1024 * 1024;
export const DATA_URL_PREFIXES = ["data:image/png;base64,", "data:image/jpeg;base64,", "data:image/webp;base64,"];
const QUALITIES = [0.85, 0.75, 0.65, 0.55, 0.45, 0.35, 0.25];

export const ERRO_FORMATO = "Use PNG, JPEG ou WebP.";
export const ERRO_TAMANHO = "Imagem muito grande, escolha outra.";
export const ERRO_LEITURA = "Não foi possível ler a imagem, escolha outra.";
export const ERRO_ARQUIVO_GRANDE = "Arquivo muito grande (máximo de 20 MB), escolha outro.";

export const isValidImageDataUrl = (dataUrl: string) =>
  DATA_URL_PREFIXES.some((p) => dataUrl.startsWith(p)) && dataUrl.length <= MAX_DATA_URL_LENGTH;

// Mantém a proporção e limita o lado maior; imagens menores não são ampliadas.
export function fitWithin(width: number, height: number, max = MAX_SIDE) {
  const scale = Math.min(1, max / Math.max(width, height));
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) };
}

// Retângulo em px da imagem original.
export type Recorte = { x: number; y: number; width: number; height: number };
// A mesma proporção da moldura do retrato (MolduraRetrato, aspect-[4/5]).
export const PROPORCAO_RETRATO = 4 / 5;

// Maior recorte na proporção dividido pelo zoom, centrado em (cx, cy) e preso dentro da imagem.
export function recortar(width: number, height: number, cx: number, cy: number, zoom: number, proporcao = PROPORCAO_RETRATO): Recorte {
  const w = Math.min(width, height * proporcao) / zoom;
  const h = w / proporcao;
  return { x: Math.min(Math.max(cx - w / 2, 0), width - w), y: Math.min(Math.max(cy - h / 2, 0), height - h), width: w, height: h };
}

// Decodificar e codificar dependem do canvas do navegador; os testes injetam versões falsas.
export type ImageCodec<T = unknown> = {
  decode: (file: Blob) => Promise<{ width: number; height: number; source: T }>;
  encodeJpeg: (source: T, recorte: Recorte, width: number, height: number, quality: number) => string;
};

export const browserCodec: ImageCodec<ImageBitmap> = {
  decode: async (file) => {
    const bitmap = await createImageBitmap(file);
    return { width: bitmap.width, height: bitmap.height, source: bitmap };
  },
  encodeJpeg: (bitmap, r, width, height, quality) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas indisponível");
    ctx.fillStyle = "#ffffff"; // JPEG não tem transparência: fundo branco em vez de preto
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(bitmap, r.x, r.y, r.width, r.height, 0, 0, width, height);
    return canvas.toDataURL("image/jpeg", quality);
  },
};

export type UploadResult = { ok: true; image: AppearanceImage } | { ok: false; error: string };

// Duas fases: ler valida e decodifica o arquivo; depois de a pessoa escolher o recorte, codificar gera o JPEG salvo.
export type ImagemLida<T> = { width: number; height: number; source: T; name: string };

export async function lerImagem<T>(file: File, codec: ImageCodec<T>): Promise<{ ok: true; imagem: ImagemLida<T> } | { ok: false; error: string }> {
  if (!ACCEPTED_TYPES.includes(file.type)) return { ok: false, error: ERRO_FORMATO };
  if (file.size > MAX_ARQUIVO) return { ok: false, error: ERRO_ARQUIVO_GRANDE };
  try {
    return { ok: true, imagem: { ...(await codec.decode(file)), name: file.name } };
  } catch {
    return { ok: false, error: ERRO_LEITURA };
  }
}

export function codificarRecorte<T>(imagem: ImagemLida<T>, recorte: Recorte, codec: ImageCodec<T>): UploadResult {
  const { width, height } = fitWithin(recorte.width, recorte.height);
  for (const quality of QUALITIES) {
    const dataUrl = codec.encodeJpeg(imagem.source, recorte, width, height, quality);
    if (isValidImageDataUrl(dataUrl)) return { ok: true, image: { kind: "upload", dataUrl, name: imagem.name } };
  }
  return { ok: false, error: ERRO_TAMANHO };
}
