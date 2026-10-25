import type { RuleTarget, RuleTargetKind } from "../data/rules";
import { getFaith, getFaiths, getMark, getMarks, getOccupation, getOccupations, getRules, getSpecies, getSpeciesList } from "./catalog";
import type { Character } from "./character";
import { characterReducer, type CharacterAction } from "./reducer";

export const optionKey = (t: { kind: RuleTargetKind; id: string }) => `${t.kind}:${t.id}`;

const ALL_IDS: Record<RuleTargetKind, () => string[]> = {
  occupation: () => getOccupations().map((o) => o.id),
  mark: () => getMarks().map((m) => m.id),
  faith: () => getFaiths().map((f) => f.id),
  species: () => getSpeciesList().map((s) => s.id),
};
// Ids que um alvo de regra cobre: o próprio id, ou todas as opções do tipo menos as exceções.
export const targetIds = (t: RuleTarget) => ("id" in t ? [t.id] : ALL_IDS[t.kind]().filter((id) => !t.except.includes(id)));

export type RulesResult = {
  blocked: Record<string, string[]>; // optionKey -> mensagens
  warnings: Record<string, string[]>; // optionKey -> mensagens; ficam no briefing da opção
  required: string[]; // ids de marcas
};

export function evaluateRules(c: Character): RulesResult {
  const result: RulesResult = { blocked: {}, warnings: {}, required: [] };
  for (const rule of getRules()) {
    if (!rule.condicao(c)) continue;
    for (const id of targetIds(rule.alvo)) {
      const key = optionKey({ kind: rule.alvo.kind, id });
      if (rule.efeito === "BLOCK") (result.blocked[key] ??= []).push(rule.mensagem);
      else if (rule.efeito === "WARN") (result.warnings[key] ??= []).push(rule.mensagem);
      else if (!result.required.includes(id)) result.required.push(id);
    }
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
    const sp = c.speciesId;
    const spBlocked = sp && blocked[optionKey({ kind: "species", id: sp })];
    if (spBlocked) run({ type: "SELECT_SPECIES", speciesId: null }, `A espécie ${getSpecies(sp)?.name} foi removida: ${spBlocked[0]}`);
    const occ = c.occupationId;
    const occBlocked = occ && blocked[optionKey({ kind: "occupation", id: occ })];
    if (occBlocked)
      run({ type: "SELECT_OCCUPATION", occupationId: null }, `${getOccupation(occ)?.name} foi removido do ofício: ${occBlocked[0]}`);
    for (const faith of c.faithIds) {
      const faithBlocked = blocked[optionKey({ kind: "faith", id: faith })];
      if (faithBlocked) run({ type: "TOGGLE_FAITH", faithId: faith }, `${getFaith(faith)?.name} foi removida das fés: ${faithBlocked[0]}`);
    }
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

// Marcas que eram obrigatórias antes da ação e deixaram de ser saem sem aviso (decisão do usuário para a Gaiola do R05).
export function dropNoLongerRequired(prev: Character, next: Character): Character {
  const stillRequired = evaluateRules(next).required;
  return evaluateRules(prev)
    .required.filter((mark) => !stillRequired.includes(mark) && next.marks.includes(mark))
    .reduce((c, mark) => characterReducer(c, { type: "SET_MARK", mark, on: false }), next);
}

// Reducer do fluxo: aplica a ação, solta marcas que deixaram de ser obrigatórias e aplica as regras.
const step = (state: Character, action: CharacterAction) =>
  applyRules(dropNoLongerRequired(state, characterReducer(state, action)));
export const reducerWithRules = (state: Character, action: CharacterAction) => step(state, action).character;
// Avisos que a mesma ação vai gerar, para a interface mostrar.
export const noticesFor = (state: Character, action: CharacterAction) => step(state, action).notices;
