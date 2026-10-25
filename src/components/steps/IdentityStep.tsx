import type { Character } from "@/lib/character";
import type { StepProps } from "./types";

type Field = keyof Character["identity"];
const FIELDS: { key: Field; label: string; multiline?: boolean; required?: boolean }[] = [
  { key: "name", label: "Nome", required: true },
  { key: "age", label: "Idade" },
  { key: "shortStory", label: "História curta", multiline: true },
  { key: "personality", label: "Personalidade", multiline: true },
];

const INPUT = "w-full rounded-md border border-foreground/30 bg-transparent p-2 focus-visible:outline-3 focus-visible:outline-blue-500";

export function IdentityStep({ character, dispatch }: StepProps) {
  return (
    <div className="space-y-4">
      {FIELDS.map(({ key, label, multiline, required }) => {
        const id = `identidade-${key}`;
        const props = {
          id,
          value: character.identity[key],
          required,
          className: INPUT,
          onChange: (e: { target: { value: string } }) =>
            dispatch({ type: "SET_IDENTITY", identity: { [key]: e.target.value } }),
        };
        return (
          <div key={key} className="space-y-1">
            <label htmlFor={id} className="font-semibold">
              {label}
              {required ? " (obrigatório)" : ""}
            </label>
            {multiline ? <textarea rows={3} {...props} /> : <input type="text" {...props} />}
          </div>
        );
      })}
    </div>
  );
}
