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
        title={on ? "Sons: ligados" : "Sons: desligados"}
        className="grid min-h-11 min-w-11 cursor-pointer place-items-center rounded-full focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {/* sino de ferro: riscado quando desligado, com ondas de som quando ligado */}
        <svg aria-hidden viewBox="0 0 32 32" className="size-8 drop-shadow-[0_2px_2px_rgb(0_0_0/0.7)]">
          <defs>
            <linearGradient id="sino-ferro" x1="0" x2="1">
              <stop offset="0" stopColor="#2a2b2f" />
              <stop offset=".4" stopColor="#8a8a90" />
              <stop offset="1" stopColor="#2a2b2f" />
            </linearGradient>
          </defs>
          <path d="M16 4 C10 4 8 9 8 15 C8 20 6 22 5 24 H27 C26 22 24 20 24 15 C24 9 22 4 16 4 Z" fill="url(#sino-ferro)" stroke="#111" />
          <circle cx="16" cy="26.5" r="2.5" fill="#55565b" stroke="#111" />
          {on ? (
            <path d="M28 9 q3 4 0 8 M3.5 9 q-3 4 0 8" fill="none" stroke="#f0d78c" strokeWidth="1.6" strokeLinecap="round" />
          ) : (
            <path d="M6 6 L26 26" stroke="#e9dcc0" strokeWidth="2" strokeLinecap="round" />
          )}
        </svg>
        <span className="sr-only">{on ? "Sons: ligados" : "Sons: desligados"}</span>
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
