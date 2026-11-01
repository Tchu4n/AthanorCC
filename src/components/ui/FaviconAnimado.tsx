"use client";

import { useEffect } from "react";

// Mesmos valores de scripts/gerar-favicon.mjs, que gera a folha de quadros.
const TAMANHO = 64;
const QUADROS = 20;
const MS_POR_QUADRO = 80;

/** Anima o favicon (pedra filosofal) trocando os quadros da folha: Chrome e Edge não animam GIF na aba. */
export function FaviconAnimado() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; // fica o icon.png parado
    let timer = 0;
    const folha = new Image();
    folha.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = TAMANHO;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const urls = Array.from({ length: QUADROS }, (_, i) => {
        ctx.clearRect(0, 0, TAMANHO, TAMANHO);
        ctx.drawImage(folha, i * TAMANHO, 0, TAMANHO, TAMANHO, 0, 0, TAMANHO, TAMANHO);
        return canvas.toDataURL("image/png");
      });
      let i = 0;
      timer = window.setInterval(() => {
        document.querySelectorAll<HTMLLinkElement>('link[rel~="icon"]').forEach((l) => (l.href = urls[i]));
        i = (i + 1) % QUADROS;
      }, MS_POR_QUADRO);
    };
    folha.src = "/favicon/pedra-quadros.png";
    return () => window.clearInterval(timer);
  }, []);
  return null;
}
