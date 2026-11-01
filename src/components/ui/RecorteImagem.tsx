import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { PROPORCAO_RETRATO, recortar, type Recorte } from "@/lib/image-upload";
import { Button } from "./Button";

const LARGURA = 240; // px da moldura na tela; a altura segue a proporção do retrato
const ALTURA = LARGURA / PROPORCAO_RETRATO;
const ZOOM_MAX = 4;
const PASSO = 10; // px da moldura por toque de seta

type Props = { src: string; nome: string; width: number; height: number; onConfirm: (r: Recorte) => void; onCancel: () => void };

// Moldura 4:5 sobre a imagem enviada: arrastar ou setas movem, o controle (ou + e -) aproxima.
export function RecorteImagem({ src, nome, width, height, onConfirm, onCancel }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  const [vista, setVista] = useState({ cx: width / 2, cy: height / 2, zoom: 1 });
  const arrasto = useRef<{ x: number; y: number } | null>(null);
  const r = recortar(width, height, vista.cx, vista.cy, vista.zoom);
  const escala = LARGURA / r.width;

  useEffect(() => {
    ref.current?.showModal();
  }, []);

  // parte do recorte já preso, para o arrasto não acumular além da borda
  const mover = (dx: number, dy: number) =>
    setVista((v) => ({ ...v, cx: r.x + r.width / 2 - dx / escala, cy: r.y + r.height / 2 - dy / escala }));
  const aproximar = (zoom: number) => setVista((v) => ({ ...v, cx: r.x + r.width / 2, cy: r.y + r.height / 2, zoom: Math.min(ZOOM_MAX, Math.max(1, zoom)) }));

  const teclas: Record<string, () => void> = {
    ArrowLeft: () => mover(PASSO, 0),
    ArrowRight: () => mover(-PASSO, 0),
    ArrowUp: () => mover(0, PASSO),
    ArrowDown: () => mover(0, -PASSO),
    "+": () => aproximar(vista.zoom + 0.2),
    "=": () => aproximar(vista.zoom + 0.2),
    "-": () => aproximar(vista.zoom - 0.2),
  };
  const onKeyDown = (e: KeyboardEvent) => {
    const acao = teclas[e.key];
    if (!acao) return;
    e.preventDefault();
    acao();
  };

  return (
    <dialog
      ref={ref}
      aria-labelledby={`${id}-titulo`}
      aria-describedby={`${id}-ajuda`}
      onCancel={(e) => {
        e.preventDefault();
        onCancel();
      }}
      className="m-auto w-[min(22rem,calc(100vw-2rem))] rounded-lg border border-foreground/20 bg-background p-6 text-foreground backdrop:bg-black/50"
    >
      <h2 id={`${id}-titulo`} className="text-lg font-semibold">
        Recortar imagem
      </h2>
      <p id={`${id}-ajuda`} className="mt-1 text-sm opacity-80">
        Arraste a imagem ou use as setas para enquadrar. Aproxime com o controle abaixo ou com + e −.
      </p>
      <div
        role="group"
        aria-label={`Recorte de ${nome}`}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          arrasto.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerMove={(e) => {
          if (!arrasto.current) return;
          mover(e.clientX - arrasto.current.x, e.clientY - arrasto.current.y);
          arrasto.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={() => (arrasto.current = null)}
        onPointerCancel={() => (arrasto.current = null)}
        style={{ width: LARGURA, height: ALTURA }}
        className="relative mx-auto mt-4 cursor-move touch-none overflow-hidden rounded-t-full border-2 border-ouro-vivo bg-surface select-none focus-visible:outline-3 focus-visible:outline-blue-500"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- object URL local, posicionado em px pelo recorte */}
        <img
          src={src}
          alt=""
          draggable={false}
          style={{ width: width * escala, height: height * escala, maxWidth: "none", transform: `translate(${-r.x * escala}px, ${-r.y * escala}px)` }}
          className="absolute top-0 left-0"
        />
      </div>
      <label className="mt-4 block text-sm font-semibold">
        Aproximar
        <input
          type="range"
          min={1}
          max={ZOOM_MAX}
          step={0.01}
          value={vista.zoom}
          onChange={(e) => aproximar(Number(e.target.value))}
          className="mt-1 block w-full"
        />
      </label>
      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <Button variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={() => onConfirm(r)}>Usar recorte</Button>
      </div>
    </dialog>
  );
}
