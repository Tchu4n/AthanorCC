import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SoundToggleView } from "@/components/ui/SoundToggle";
import { audioSupported, loadSoundPref, saveSoundPref, SOUND_KEY } from "./sound";

function memoryStorage() {
  const map = new Map<string, string>();
  const storage = { getItem: (k: string) => map.get(k) ?? null, setItem: (k: string, v: string) => void map.set(k, v) };
  return { map, get: () => storage };
}

describe("sound", () => {
  it("alternância persiste na chave athanor:sound:v1, separada do personagem", () => {
    expect(SOUND_KEY).toBe("athanor:sound:v1");
    const s = memoryStorage();
    expect(loadSoundPref(s.get)).toBe(false); // desligado por padrão
    expect(saveSoundPref(true, s.get)).toBe(true);
    expect([...s.map.entries()]).toEqual([["athanor:sound:v1", "on"]]);
    expect(loadSoundPref(s.get)).toBe(true);
    saveSoundPref(false, s.get);
    expect(s.map.get(SOUND_KEY)).toBe("off");
    expect(loadSoundPref(s.get)).toBe(false);
  });

  it("storage indisponível não quebra: fica desligado", () => {
    const broken = () => {
      throw new Error("bloqueado");
    };
    expect(loadSoundPref(broken)).toBe(false);
    expect(saveSoundPref(true, broken)).toBe(false);
  });

  it("detecta AudioContext, inclusive o prefixado", () => {
    expect(audioSupported({})).toBe(false);
    expect(audioSupported({ AudioContext: class {} as unknown as typeof AudioContext })).toBe(true);
    expect(audioSupported({ webkitAudioContext: class {} as unknown as typeof AudioContext })).toBe(true);
  });

  it("sem AudioContext, o botão fica desabilitado e com aviso", () => {
    const html = renderToStaticMarkup(<SoundToggleView supported={false} on={false} onToggle={() => {}} />);
    expect(html).toMatch(/<button[^>]*aria-pressed="false"[^>]*disabled=""[^>]*aria-describedby="sons-aviso"/);
    expect(html).toContain("Sons: desligados");
    expect(html).toContain('id="sons-aviso"');
  });

  it("com suporte, o botão anuncia o estado por aria-pressed", () => {
    const html = renderToStaticMarkup(<SoundToggleView supported on onToggle={() => {}} />);
    expect(html).toMatch(/<button[^>]*aria-pressed="true"/);
    expect(html).not.toContain('disabled=""');
    expect(html).toContain("Sons: ligados");
  });
});
