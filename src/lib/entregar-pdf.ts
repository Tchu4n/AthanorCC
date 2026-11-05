// Entrega o PDF gerado. No celular com Web Share de arquivos, abre a folha de compartilhar (no iOS o <a download> com blob
// é instável entre versões do Safari); nos demais, baixa. shortcut: o compartilhamento é pedido depois de gerar o PDF, e o
// Safari pode recusar por já ter passado do toque (NotAllowedError); nesse caso cai no download. Confirmar em aparelho real.
const REVOGAR_APOS_MS = 60_000; // o iOS pode ler o blob bem depois do clique

function baixar(blob: Blob, nome: string) {
  const url = URL.createObjectURL(blob);
  setTimeout(() => URL.revokeObjectURL(url), REVOGAR_APOS_MS);
  if (!("download" in HTMLAnchorElement.prototype)) {
    window.open(url, "_blank"); // sem suporte a download: abre o PDF numa aba
    return;
  }
  const link = document.createElement("a");
  link.href = url;
  link.download = nome;
  link.click();
}

export async function entregarPdf(blob: Blob, nome: string) {
  const arquivo = new File([blob], nome, { type: "application/pdf" });
  const compartilha =
    typeof navigator.canShare === "function" &&
    typeof navigator.share === "function" &&
    window.matchMedia("(pointer: coarse)").matches && // no desktop, baixar é o esperado
    navigator.canShare({ files: [arquivo] });
  if (compartilha) {
    try {
      await navigator.share({ files: [arquivo], title: nome });
      return;
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return; // a pessoa fechou a folha: não é erro
      // recusado ou sem gesto válido: baixa
    }
  }
  baixar(blob, nome);
}
