import { z } from "zod";
import { getFaith, getImage, getMark, getOccupation, getRegion, getSpecies, getSubregion, getSubspecies } from "./catalog";
import { ANDARILHO, MAX_FAITHS, type Character } from "./character";
import { DATA_URL_PREFIXES, MAX_DATA_URL_LENGTH } from "./image-upload";

const text = z.string().max(10_000);

const appearanceImage = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("catalog"), imageId: z.string() }),
  z.object({
    kind: z.literal("upload"),
    dataUrl: z
      .string()
      .max(MAX_DATA_URL_LENGTH, "imagem enviada maior que 400 KB")
      .refine((d) => DATA_URL_PREFIXES.some((p) => d.startsWith(p)), "imagem enviada precisa ser PNG, JPEG ou WebP em base64"),
    name: z.string().max(255),
  }),
]);

// Salvamentos anteriores à 1.6 guardavam { imageId, notes }: convertidos em vez de descartados.
const appearance = z.preprocess(
  (v) =>
    v && typeof v === "object" && "imageId" in v && !("image" in v)
      ? {
          image: typeof v.imageId === "string" ? { kind: "catalog", imageId: v.imageId } : null,
          notes: "notes" in v ? v.notes : "",
        }
      : v,
  z.object({ image: appearanceImage.nullable(), notes: text }),
);

export const characterSchema: z.ZodType<Character> = z
  .object({
    origin: z.object({ regionId: z.string(), subregionId: z.string().nullable() }).nullable(),
    speciesId: z.string().nullable(),
    subspeciesId: z.string().nullable(),
    occupationId: z.string().nullable(),
    faithIds: z.array(z.string()).max(MAX_FAITHS),
    marks: z.array(z.string()),
    appearance,
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
    const img = c.appearance.image;
    if (img?.kind === "catalog" && !getImage(img.imageId)) fail(`imagem desconhecida: ${img.imageId}`);
  });
