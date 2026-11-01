import type { ReactNode } from "react";

type Props<T extends string> = {
  legenda: ReactNode;
  name: string;
  opcoes: readonly T[];
  rotulos: Record<T, string>;
  valor: T | null;
  onChange: (v: T) => void;
  obrigatorio?: boolean; // leitores de tela anunciam o campo como obrigatório
};

// Escolha única em caixinhas: por baixo são radios nativos (com checkbox daria para marcar dois), então teclado
// (Tab entra, setas trocam) e leitor de tela funcionam; a caixinha visível é só desenho.
export function GrupoOpcoes<T extends string>({ legenda, name, opcoes, rotulos, valor, onChange, obrigatorio }: Props<T>) {
  return (
    <fieldset className="space-y-1">
      <legend className="font-semibold">{legenda}</legend>
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        {opcoes.map((o) => (
          <label key={o} className="flex min-h-11 cursor-pointer items-center gap-2">
            {/* o radio transparente fica por cima da caixinha de tinta (como no Escolher dos cards); a escolhida ganha o ✗,
                como o X a pena do PDF */}
            <span className="relative grid size-6 shrink-0">
              <input
                type="radio"
                name={name}
                checked={valor === o}
                required={obrigatorio}
                onChange={() => onChange(o)}
                className="peer absolute inset-0 m-0 cursor-pointer opacity-0"
              />
              <span
                aria-hidden
                className="grid place-items-center rounded-[2px] border-2 border-foreground text-xl leading-none text-transparent peer-checked:text-foreground peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-500"
              >
                ✗
              </span>
            </span>
            {rotulos[o]}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
