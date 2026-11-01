"use client";

import { useEffect, useRef, type PointerEvent } from "react";
import { MAX_ASSINATURA } from "@/lib/character";
import { Button } from "./Button";

const LARGURA = 600;
const ALTURA = 200;
const TINTA = "#2b1a0e"; // tinta ferrogálica, a mesma do PDF

type Props = { valor: string | null; onChange: (assinatura: string | null) => void; idDescricao: string };

// Área de desenho da assinatura: pointer events cobrem mouse, dedo e caneta. Salva um PNG transparente ao soltar o traço.
export function Assinatura({ valor, onChange, idDescricao }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const desenhando = useRef(false);

  // redesenha a assinatura salva ao voltar à página (só na montagem: depois o canvas é a fonte)
  useEffect(() => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx || !valor) return;
    const img = new Image();
    img.onload = () => ctx.drawImage(img, 0, 0, LARGURA, ALTURA);
    img.src = valor;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ponto = (e: PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * LARGURA, ((e.clientY - r.top) / r.height) * ALTURA] as const;
  };

  const comecar = (e: PointerEvent<HTMLCanvasElement>) => {
    const ctx = e.currentTarget.getContext("2d");
    if (!ctx) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    desenhando.current = true;
    ctx.strokeStyle = TINTA;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(...ponto(e));
    ctx.lineTo(...ponto(e)); // um toque vira um ponto
    ctx.stroke();
  };
  const mover = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!desenhando.current) return;
    const ctx = e.currentTarget.getContext("2d");
    ctx?.lineTo(...ponto(e));
    ctx?.stroke();
  };
  const terminar = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!desenhando.current) return;
    desenhando.current = false;
    const png = e.currentTarget.toDataURL("image/png");
    // acima do limite o save seria recusado no carregamento: não guarda (o traço fica só na tela)
    if (png.length <= MAX_ASSINATURA) onChange(png);
  };
  const limparTela = () => {
    canvas.current?.getContext("2d")?.clearRect(0, 0, LARGURA, ALTURA);
    onChange(null);
  };

  return (
    <div className="space-y-2">
      <canvas
        ref={canvas}
        width={LARGURA}
        height={ALTURA}
        role="img"
        aria-label={valor ? "Assinatura desenhada" : "Área para desenhar a assinatura, vazia"}
        aria-describedby={idDescricao}
        data-assinatura
        onPointerDown={comecar}
        onPointerMove={mover}
        onPointerUp={terminar}
        onPointerCancel={terminar}
        // touch-none: o dedo desenha em vez de rolar a página
        className="aspect-[3/1] w-full max-w-xl cursor-crosshair touch-none rounded-sm border border-dashed border-[#6b4a2a] bg-[#f3e6c4]"
      />
      <Button variant="secondary" onClick={limparTela} disabled={!valor}>
        Apagar assinatura
      </Button>
    </div>
  );
}
