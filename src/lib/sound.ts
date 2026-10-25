// Sons sintetizados com Web Audio API, sem arquivos. Desligados por padrão; a preferência fica em chave própria.
export const SOUND_KEY = "athanor:sound:v1";

type StorageLike = Pick<Storage, "getItem" | "setItem">;
// Em modo privado ou com bloqueio, até acessar window.localStorage pode lançar exceção.
const browserStorage = (): StorageLike => window.localStorage;

type AudioWindow = { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext };
const audioConstructor = (w: AudioWindow) => w.AudioContext ?? w.webkitAudioContext;

export const audioSupported = (w: AudioWindow = globalThis as AudioWindow) => typeof audioConstructor(w) === "function";

export function loadSoundPref(getStorage = browserStorage): boolean {
  try {
    return getStorage().getItem(SOUND_KEY) === "on";
  } catch {
    return false;
  }
}

export function saveSoundPref(on: boolean, getStorage = browserStorage): boolean {
  try {
    getStorage().setItem(SOUND_KEY, on ? "on" : "off");
    return true;
  } catch {
    return false;
  }
}

let enabled = false;
let ctx: AudioContext | null = null;

export const setSoundEnabled = (on: boolean) => {
  enabled = on;
};

// O AudioContext só nasce aqui, chamado de um clique: a política de autoplay não deixa tocar antes.
function tone(freq: number, start: number, duration: number, type: OscillatorType) {
  if (!enabled || typeof window === "undefined") return;
  if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return;
  const Ctor = audioConstructor(window as AudioWindow);
  if (!Ctor) return;
  ctx ??= new Ctor();
  if (ctx.state === "suspended") void ctx.resume();
  const t = ctx.currentTime + start;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.08, t + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + duration + 0.02);
}

export const playClick = () => tone(880, 0, 0.04, "triangle");

export const playConfirm = () => {
  tone(523.25, 0, 0.09, "sine");
  tone(783.99, 0.08, 0.14, "sine");
};
