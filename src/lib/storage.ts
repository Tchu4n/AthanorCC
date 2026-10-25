import { z } from "zod";
import type { Character } from "./character";
import { characterSchema } from "./character-schema";
import { ALL_STEPS, type StepId } from "./flow";

export const STORAGE_KEY = "athanor:character:v1";

export type Saved = { step: StepId; character: Character };
export type LoadResult =
  | { status: "empty" }
  | { status: "ok"; data: Saved }
  | { status: "invalid" }
  | { status: "unavailable" };

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;
// Em modo privado ou com bloqueio, até acessar window.localStorage pode lançar exceção.
const browserStorage = (): StorageLike => window.localStorage;

const savedSchema = z.object({ version: z.literal(1), step: z.enum(ALL_STEPS), character: characterSchema });

export function load(getStorage = browserStorage): LoadResult {
  let raw: string | null;
  try {
    raw = getStorage().getItem(STORAGE_KEY);
  } catch {
    return { status: "unavailable" };
  }
  if (raw === null) return { status: "empty" };
  try {
    const parsed = savedSchema.safeParse(JSON.parse(raw));
    if (parsed.success) return { status: "ok", data: { step: parsed.data.step, character: parsed.data.character } };
  } catch {
    // JSON corrompido: cai no descarte abaixo
  }
  clear(getStorage);
  return { status: "invalid" };
}

export function save(data: Saved, getStorage = browserStorage): boolean {
  try {
    getStorage().setItem(STORAGE_KEY, JSON.stringify({ version: 1, ...data }));
    return true;
  } catch {
    return false;
  }
}

export function clear(getStorage = browserStorage): boolean {
  try {
    getStorage().removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}
