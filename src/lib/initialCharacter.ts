import type { Character } from "./character";

// createdAt fica vazio até o personagem ser salvo
export const initialCharacter: Character = {
  origin: null,
  speciesId: null,
  subspeciesId: null,
  occupationId: null,
  customOccupation: { name: "", description: "" },
  faithIds: [],
  marks: [],
  appearance: { image: null, notes: "" },
  identity: { name: "", age: "", shortStory: "", personality: "" },
  sexo: null,
  periculosidade: null,
  assinatura: null,
  createdAt: "",
};
