import { GrupoOpcoes } from "@/components/ui/GrupoOpcoes";
import { Opcional } from "@/components/ui/ChoiceCard";
import { limpar, LIMITES_TEXTO, SEXO_LABEL, SEXOS, type Character } from "@/lib/character";
import type { StepProps } from "./types";

type Field = keyof Character["identity"];
// filtro: o que não cabe no campo some ao digitar e ao colar
const FIELDS: { key: Field; label: string; multiline?: boolean; required?: boolean; filtro?: (v: string) => string; numerico?: boolean }[] = [
  { key: "name", label: "Nome", required: true, filtro: limpar.nome },
  { key: "age", label: "Idade (em anos)", filtro: limpar.idade, numerico: true },
  { key: "shortStory", label: "História curta", multiline: true },
  { key: "personality", label: "Personalidade", multiline: true },
];

const INPUT = "w-full rounded-md border border-foreground/30 bg-transparent p-2 focus-visible:outline-3 focus-visible:outline-blue-500";

export function IdentityStep({ character, dispatch }: StepProps) {
  const sexo = (
    <GrupoOpcoes
      key="sexo"
      legenda="Sexo (obrigatório)"
      obrigatorio
      name="sexo"
      opcoes={SEXOS}
      rotulos={SEXO_LABEL}
      valor={character.sexo}
      onChange={(v) => dispatch({ type: "SET_SEXO", sexo: v })}
    />
  );
  return (
    <div className="space-y-4">
      {FIELDS.flatMap(({ key, label, multiline, required, filtro, numerico }) => {
        const id = `identidade-${key}`;
        const value = character.identity[key];
        const props = {
          id,
          value,
          required,
          maxLength: LIMITES_TEXTO[key],
          ...(multiline && { "aria-describedby": `${id}-limite` }),
          ...(numerico && { inputMode: "numeric" as const, pattern: "[0-9]*" }),
          className: INPUT,
          onChange: (e: { target: { value: string } }) =>
            dispatch({ type: "SET_IDENTITY", identity: { [key]: filtro ? filtro(e.target.value) : e.target.value } }),
        };
        // o sexo entra logo depois do nome
        const extra = key === "name" ? [sexo] : [];
        return [
          <div key={key} className="space-y-1">
            <label htmlFor={id} className="font-semibold">
              {label}
              {required ? " (obrigatório)" : (
                <>
                  {" "}(<Opcional />)
                </>
              )}
            </label>
            {multiline ? <textarea rows={3} {...props} /> : <input type="text" {...props} />}
            {multiline && (
              <p id={`${id}-limite`} className="text-right text-xs opacity-70">
                {value.length}/{LIMITES_TEXTO[key]} caracteres
              </p>
            )}
          </div>,
          ...extra,
        ];
      })}
    </div>
  );
}
