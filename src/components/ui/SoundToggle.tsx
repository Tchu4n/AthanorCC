"use client";

import { useEffect, useState } from "react";
import { audioSupported, loadSoundPref, playConfirm, saveSoundPref, setSoundEnabled } from "@/lib/sound";

export function SoundToggleView({ supported, on, onToggle }: { supported: boolean; on: boolean; onToggle: () => void }) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <button
        type="button"
        aria-pressed={on}
        disabled={!supported}
        aria-describedby={supported ? undefined : "sons-aviso"}
        onClick={onToggle}
        className="rounded-md border border-border px-3 py-1.5 text-sm font-medium aria-pressed:border-accent focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {on ? "Sons: ligados" : "Sons: desligados"}
      </button>
      {!supported && (
        <span id="sons-aviso" className="text-xs text-muted">
          Este navegador não reproduz os sons.
        </span>
      )}
    </div>
  );
}

export function SoundToggle() {
  // antes da hidratação vale o padrão (desligado); o navegador e a preferência só são lidos no cliente
  const [state, setState] = useState({ supported: true, on: false });

  useEffect(() => {
    const supported = audioSupported();
    const on = supported && loadSoundPref();
    setSoundEnabled(on);
    setState({ supported, on }); // eslint-disable-line react-hooks/set-state-in-effect -- leitura única do navegador após a hidratação
  }, []);

  const toggle = () => {
    const on = !state.on;
    setSoundEnabled(on);
    saveSoundPref(on);
    setState({ ...state, on });
    if (on) playConfirm(); // dentro do clique: permitido pela política de autoplay
  };

  return <SoundToggleView supported={state.supported} on={state.on} onToggle={toggle} />;
}
