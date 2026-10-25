import type { RuleTarget } from "../data/rules";
import { getMark, getOccupation, getRules } from "./catalog";
import type { Character } from "./character";
import { characterReducer, type CharacterAction } from "./reducer";

export const optionKey = (t: RuleTarget) => `${t.kind}:${t.id}`;

export type RulesResult = {
  blocked: Record<string, string[]>; // optionKey -> mensagens
  warnings: Record<string, string[]>; // optionKey -> mensagens; ficam no briefing da opção
  required: string[]; // ids de marcas
};

export function evaluateRules(c: Character): RulesResult {
  const result: RulesResult = { blocked: {}, warnings: {}, required: [] };
  for (const rule of getRules()) {
    if (!rule.condicao(c)) continue;
    const key = optionKey(rule.alvo);
    if (rule.efeito === "BLOCK") (result.blocked[key] ??= []).push(rule.mensagem);
    else if (rule.efeito === "WARN") (result.warnings[key] ??= []).push(rule.mensagem);
    else if (!result.required.includes(rule.alvo.id)) result.required.push(rule.alvo.id);
  }
  return result;
}

// Remove escolhas que ficaram bloqueadas e marca as obrigatórias, só com ações já existentes do reducer.
export function applyRules(start: Character): { character: Character; notices: string[] } {
  let c = start;
  const notices: string[] = [];
  const run = (action: CharacterAction, notice: string) => {
    c = characterReducer(c, action);
    notices.push(notice);
  };
  // poucas passadas bastam: cada correção só remove escolhas ou adiciona marcas obrigatórias
  for (let pass = 0; pass < 3; pass++) {
    const { blocked, required } = evaluateRules(c);
    const before = c;
    const occ = c.occupationId;
    const occBlocked = occ && blocked[optionKey({ kind: "occupation", id: occ })];
    if (occBlocked)
      run({ type: "SELECT_OCCUPATION", occupationId: null }, `${getOccupation(occ)?.name} foi removido do ofício: ${occBlocked[0]}`);
    for (const mark of c.marks) {
      const markBlocked = blocked[optionKey({ kind: "mark", id: mark })];
      if (markBlocked) run({ type: "SET_MARK", mark, on: false }, `${getMark(mark)?.name} foi removida das marcas: ${markBlocked[0]}`);
    }
    for (const mark of required)
      if (!c.marks.includes(mark)) run({ type: "SET_MARK", mark, on: true }, `${getMark(mark)?.name} foi adicionada às marcas por ser obrigatória.`);
    if (c === before) break;
  }
  return { character: c, notices };
}

// Reducer do fluxo: aplica a ação e logo em seguida as regras.
export const reducerWithRules = (state: Character, action: CharacterAction) =>
  applyRules(characterReducer(state, action)).character;
