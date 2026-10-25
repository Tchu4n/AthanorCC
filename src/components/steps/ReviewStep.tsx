import {
  ANDARILHO_LABEL,
  getFaith,
  getImage,
  getMark,
  getOccupation,
  getRegion,
  getSpecies,
  getSubregion,
  getSubspecies,
} from "@/lib/catalog";
import { ANDARILHO } from "@/lib/character";
import type { StepProps } from "./types";

const list = (names: (string | undefined)[], empty: string) => names.filter(Boolean).join(", ") || empty;

export function ReviewStep({ character: c }: StepProps) {
  const region = getRegion(c.origin?.regionId);
  const subId = c.origin?.subregionId;
  const sub = subId === ANDARILHO ? ANDARILHO_LABEL : region && subId ? getSubregion(region.id, subId)?.name : undefined;
  const subspecies = getSubspecies(c.speciesId).find((s) => s.id === c.subspeciesId);
  const image = getImage(c.appearance.imageId);

  const rows: [string, string][] = [
    ["Origem", list([region?.name, sub], "—")],
    ["Espécie", list([getSpecies(c.speciesId)?.name, subspecies?.name], "—")],
    ["Ofício", getOccupation(c.occupationId)?.name ?? "Nenhum"],
    ["Fés", list(c.faithIds.map((id) => getFaith(id)?.name), "Nenhuma")],
    ["Marcas", list(c.marks.map((id) => getMark(id)?.name), "Nenhuma")],
    ["Imagem de referência", image?.displayName ?? "Sem imagem"],
    ["Notas de aparência", c.appearance.notes || "—"],
    ["Nome", c.identity.name || "—"],
    ["Idade", c.identity.age || "—"],
    ["História curta", c.identity.shortStory || "—"],
    ["Personalidade", c.identity.personality || "—"],
  ];

  return (
    <dl className="divide-y divide-foreground/10 rounded-lg border border-foreground/20">
      {rows.map(([label, value]) => (
        <div key={label} className="grid gap-1 p-3 sm:grid-cols-3">
          <dt className="font-semibold">{label}</dt>
          <dd className="whitespace-pre-wrap break-words sm:col-span-2">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
