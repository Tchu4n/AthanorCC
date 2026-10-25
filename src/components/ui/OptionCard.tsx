import { useId, type ReactNode } from "react";

type Props = {
  type: "radio" | "checkbox";
  name: string;
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
  children?: ReactNode;
  // Quando há mensagens, a opção fica desabilitada e o motivo aparece no cartão.
  blockedReasons?: string[];
  // Quando há mensagens, a opção fica marcada e travada.
  lockedReasons?: string[];
};

// Input nativo transparente cobrindo o cartão: teclado (setas, espaço) e leitores de tela funcionam sem código extra.
export function OptionCard({ type, name, label, checked, disabled, onChange, children, blockedReasons, lockedReasons }: Props) {
  const id = useId();
  const blocked = !!blockedReasons?.length;
  const locked = !!lockedReasons?.length;
  const note = blocked
    ? { title: "Indisponível para esta escolha", reasons: blockedReasons }
    : locked
      ? { title: "Obrigatória para esta escolha", reasons: lockedReasons }
      : null;

  return (
    <label className="relative flex cursor-pointer flex-col gap-2 rounded-lg border border-foreground/20 p-3 has-checked:border-foreground has-checked:bg-foreground/10 has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-blue-500 has-disabled:cursor-not-allowed">
      <input
        type={type}
        name={name}
        checked={checked || locked}
        disabled={disabled || blocked || locked}
        onChange={onChange}
        aria-labelledby={`${id}-label`}
        aria-describedby={note ? `${id}-note` : undefined}
        className="absolute inset-0 z-10 m-0 cursor-[inherit] opacity-0"
      />
      {children}
      <span id={`${id}-label`} className={`font-medium ${disabled || blocked ? "opacity-40" : ""}`}>
        {label}
      </span>
      {note && (
        <span id={`${id}-note`} className="text-sm">
          <span className="block font-semibold">{note.title}</span>
          {note.reasons.join(" ")}
        </span>
      )}
    </label>
  );
}

export function OptionGroup({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-2">
      <legend className="mb-2 font-semibold">{legend}</legend>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </fieldset>
  );
}
