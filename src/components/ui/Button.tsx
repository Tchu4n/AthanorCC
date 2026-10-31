import type { ComponentProps, CSSProperties } from "react";

export type Variante = "primary" | "secondary";
export type Seta = "direita" | "nenhuma";

const PONTA = "0.75rem";
const FORMAS: Record<Seta, string> = {
  // ponta em rabo de andorinha, como uma flâmula
  direita: `polygon(0 0, 100% 0, calc(100% - ${PONTA}) 50%, 100% 100%, 0 100%)`,
  nenhuma: "none",
};
const PADDING: Record<Seta, string> = { direita: "pl-8 pr-9", nenhuma: "px-6" };

// O recorte fica nas camadas ::before (borda) e ::after (miolo), não no botão: clip-path cortaria o anel de foco.
// desligado/foco valem para <button> e para a <label> do "Escolher" dos cards (variantes em globals.css).
const BASE =
  "relative isolate inline-flex min-h-11 min-w-11 cursor-pointer select-none items-center justify-center gap-1 py-2 text-center font-semibold " +
  "before:absolute before:inset-0 before:-z-10 before:[clip-path:var(--forma)] " +
  "after:absolute after:inset-[2px] after:-z-10 after:[clip-path:var(--forma)] " +
  "foco:outline-3 foco:outline-offset-2 foco:outline-blue-500 " +
  "motion-safe:transition-transform motion-safe:active:scale-[0.98] motion-safe:desligado:active:scale-100 " +
  // desabilitado: troca as cores, sem depender de opacidade
  "desligado:cursor-not-allowed desligado:text-muted desligado:before:bg-border desligado:after:bg-surface desligado:after:brightness-100";

const LOOK: Record<Variante, string> = {
  // flâmula de veludo na cor da região (bordado e losango em globals.css); a borda é o accent escurecido
  primary: "flamula text-accent-text before:bg-[color-mix(in_oklch,var(--accent),black_45%)] after:bg-accent hover:after:brightness-110",
  // placa de ferro forjado (textura, rebites e brasa no hover em globals.css)
  secondary: "ferro",
};

// Primário é a flâmula, com ponta em rabo de andorinha; secundário é a placa de ferro, retangular.
export function botao(variant: Variante = "primary", seta: Seta = variant === "primary" ? "direita" : "nenhuma") {
  return { className: `${BASE} ${LOOK[variant]} ${PADDING[seta]}`, style: { "--forma": FORMAS[seta] } as CSSProperties };
}

type Props = ComponentProps<"button"> & { variant?: Variante; seta?: Seta };

export function Button({ variant = "primary", seta, className = "", style, ...props }: Props) {
  const b = botao(variant, seta);
  return <button type="button" className={`${b.className} ${className}`} style={{ ...b.style, ...style }} {...props} />;
}
