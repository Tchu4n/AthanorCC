import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { entregarPdf } from "./entregar-pdf";

// Sem jsdom no projeto: os globais do navegador que o código toca são stubs.
const blob = new Blob(["%PDF"], { type: "application/pdf" });
const clique = vi.fn();
const abrir = vi.fn();

function ambiente({ toque, share, canShare = true, comDownload = true }: { toque: boolean; share?: () => Promise<void>; canShare?: boolean; comDownload?: boolean }) {
  vi.stubGlobal("window", { matchMedia: () => ({ matches: toque }), open: abrir });
  vi.stubGlobal("navigator", share ? { share, canShare: () => canShare } : {});
  vi.stubGlobal("HTMLAnchorElement", { prototype: comDownload ? { download: "" } : {} });
  vi.stubGlobal("document", { createElement: () => ({ click: clique }) });
}

beforeEach(() => {
  URL.createObjectURL = vi.fn(() => "blob:x");
  URL.revokeObjectURL = vi.fn();
  clique.mockClear();
  abrir.mockClear();
});
afterEach(() => vi.unstubAllGlobals());

describe("entregarPdf", () => {
  it("no celular com Web Share de arquivos, compartilha o PDF e não baixa", async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    ambiente({ toque: true, share });
    await entregarPdf(blob, "ficha.pdf");
    expect(share).toHaveBeenCalledOnce();
    const { files } = share.mock.calls[0][0] as { files: File[] };
    expect(files[0].name).toBe("ficha.pdf");
    expect(files[0].type).toBe("application/pdf");
    expect(clique).not.toHaveBeenCalled();
  });

  it("fechar a folha de compartilhar não é erro nem dispara o download", async () => {
    ambiente({ toque: true, share: vi.fn().mockRejectedValue(new DOMException("x", "AbortError")) });
    await entregarPdf(blob, "ficha.pdf");
    expect(clique).not.toHaveBeenCalled();
  });

  it("compartilhamento recusado (NotAllowedError) cai no download", async () => {
    ambiente({ toque: true, share: vi.fn().mockRejectedValue(new DOMException("x", "NotAllowedError")) });
    await entregarPdf(blob, "ficha.pdf");
    expect(clique).toHaveBeenCalledOnce();
  });

  it("no desktop baixa, mesmo com Web Share disponível", async () => {
    const share = vi.fn();
    ambiente({ toque: false, share });
    await entregarPdf(blob, "ficha.pdf");
    expect(share).not.toHaveBeenCalled();
    expect(clique).toHaveBeenCalledOnce();
  });

  it("sem Web Share de arquivos, baixa", async () => {
    ambiente({ toque: true, share: vi.fn(), canShare: false });
    await entregarPdf(blob, "ficha.pdf");
    expect(clique).toHaveBeenCalledOnce();
  });

  it("sem suporte a download, abre o PDF numa aba", async () => {
    ambiente({ toque: false, comDownload: false });
    await entregarPdf(blob, "ficha.pdf");
    expect(abrir).toHaveBeenCalledWith("blob:x", "_blank");
    expect(clique).not.toHaveBeenCalled();
  });
});
