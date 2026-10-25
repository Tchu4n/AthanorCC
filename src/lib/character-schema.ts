import { z } from "zod";
import { getFaith, getImage, getMark, getOccupation, getRegion, getSpecies, getSubregion, getSubspecies } from "./catalog";
import { ANDARILHO, MAX_FAITHS, type Character } from "./character";

const text = z.string().max(10_000);

export const characterSchema: z.ZodType<Character> = z
  .object({
    origin: z.object({ regionId: z.string(), subregionId: z.string().nullable() }).nullable(),
    speciesId: z.string().nullable(),
    subspeciesId: z.string().nullable(),
    occupationId: z.string().nullable(),
    faithIds: z.array(z.string()).max(MAX_FAITHS),
    marks: z.array(z.string()),
    appearance: z.object({ imageId: z.string().nullable(), notes: text }),
    identity: z.object({ name: text, age: text, shortStory: text, personality: text }),
    createdAt: z.string(),
  })
  // Todo id salvo precisa existir nos dados atuais.
  .superRefine((c, ctx) => {
    const fail = (message: string) => ctx.addIssue({ code: "custom", message });
    if (c.origin) {
      if (!getRegion(c.origin.regionId)) fail(`região desconhecida: ${c.origin.regionId}`);
      const sub = c.origin.subregionId;
      if (sub && sub !== ANDARILHO && !getSubregion(c.origin.regionId, sub)) fail(`subregião desconhecida: ${sub}`);
    }
    if (c.speciesId && !getSpecies(c.speciesId)) fail(`espécie desconhecida: ${c.speciesId}`);
    if (c.subspeciesId && !getSubspecies(c.speciesId).some((s) => s.id === c.subspeciesId))
      fail(`subespécie desconhecida: ${c.subspeciesId}`);
    if (c.occupationId && !getOccupation(c.occupationId)) fail(`ofício desconhecido: ${c.occupationId}`);
    if (new Set(c.faithIds).size !== c.faithIds.length) fail("fé repetida");
    for (const f of c.faithIds) if (!getFaith(f)) fail(`fé desconhecida: ${f}`);
    for (const m of c.marks) if (!getMark(m)) fail(`marca desconhecida: ${m}`);
    if (c.appearance.imageId && !getImage(c.appearance.imageId)) fail(`imagem desconhecida: ${c.appearance.imageId}`);
  });
