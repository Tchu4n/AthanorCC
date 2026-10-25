import type { Character } from "./character";

// Personagem com todas as escolhas preenchidas, para os testes da ficha.
export const personagemCompleto: Character = {
  origin: { regionId: "midland", subregionId: "aurelia" },
  speciesId: "humano",
  subspeciesId: "elite-orelhas-pontudas",
  occupationId: "mago-ortodoxo",
  faithIds: ["umbra", "activum"],
  marks: ["terceiro-olho", "gaiola-de-bateria"],
  appearance: { imageId: "factions/up-mago-alto", notes: "Gola franzida" },
  identity: { name: "Isabela de Souça", age: "34", shortStory: "Fugiu da corte.", personality: "Fria e calculista." },
  createdAt: "2026-10-25T12:00:00.000Z",
};
