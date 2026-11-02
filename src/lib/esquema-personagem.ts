import { z } from "zod";
import { getFaith, getImage, getMark, getOccupation, getRegion, getSpecies, getSubregion, getSubspecies } from "./catalogo";
import { ANDARILHO, LIMITES_TEXTO, MAX_ASSINATURA, MAX_FAITHS, OFICIO_PROPRIO, PERICULOSIDADES, SEXOS, type Character } from "./character";
import { DATA_URL_PREFIXES, MAX_DATA_URL_LENGTH } from "./envio-imagem";

// Acima de 10 mil caracteres o save é recusado; abaixo, só é cortado no limite do campo para não perder o personagem.
const text = (limite: number) => z.string().max(10_000).transform((s) => s.slice(0, limite));

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

// Salvamentos anteriores à 1.6 guardavam { imageId, notes }, e os mais antigos nem tinham appearance:
// os dois são convertidos em vez de descartados.
const appearance = z.preprocess(
  (v) =>
    v === undefined
      ? { image: null, notes: "" }
      : v && typeof v === "object" && "imageId" in v && !("image" in v)
        ? {
            image: typeof v.imageId === "string" ? { kind: "catalog", imageId: v.imageId } : null,
            notes: "notes" in v ? v.notes : "",
          }
        : v,
  z.object({ image: appearanceImage.nullable(), notes: text(LIMITES_TEXTO.notes) }),
);

// Subregiões renomeadas: o save antigo aponta para o id novo em vez de ser recusado.
const SUBREGIOES_RENOMEADAS: Record<string, string> = { "forte-leste": "forte-central" };

// Origem: subregião renomeada vira o id novo, e Andarilho numa região sem essa opção volta a "escolher subregião".
const migrarOrigem = (o: unknown) => {
  if (!o || typeof o !== "object") return o;
  const { regionId, subregionId } = o as { regionId?: unknown; subregionId?: unknown };
  const sub = typeof subregionId === "string" ? (SUBREGIOES_RENOMEADAS[subregionId] ?? subregionId) : subregionId;
  const semAndarilho = typeof regionId === "string" && getRegion(regionId)?.semAndarilho;
  return { ...o, subregionId: sub === ANDARILHO && semAndarilho ? null : sub };
};

// Marcas que saíram dos dados (gaiola de bateria) são descartadas, e a antiga subespécie Terceiro Olho vira
// humano comum com a marca: as regras do carregamento tiram a marca se a origem não for Man'naka oko.
const migrar = (v: unknown) => {
  if (!v || typeof v !== "object") return v;
  const c = { ...(v as Record<string, unknown>) };
  if ("origin" in c) c.origin = migrarOrigem(c.origin);
  const marks = Array.isArray(c.marks) ? c.marks.filter((m) => typeof m !== "string" || getMark(m)) : c.marks;
  if (c.subspeciesId !== "terceiro-olho") return { ...c, marks };
  return { ...c, subspeciesId: "humano-comum", marks: [...(Array.isArray(marks) ? marks : []), "terceiro-olho"] };
};

export const characterSchema: z.ZodType<Character> = z.preprocess(migrar, z
  .object({
    origin: z.object({ regionId: z.string(), subregionId: z.string().nullable() }).nullable(),
    speciesId: z.string().nullable(),
    subspeciesId: z.string().nullable(),
    occupationId: z.string().nullable(),
    customOccupation: z
      .object({ name: text(LIMITES_TEXTO.oficioNome), description: text(LIMITES_TEXTO.oficioDescricao) })
      .default({ name: "", description: "" }),
    faithIds: z.array(z.string()).max(MAX_FAITHS),
    marks: z.array(z.string()),
    appearance,
    identity: z.object({
      name: text(LIMITES_TEXTO.name),
      // saves antigos aceitavam texto livre ("34 anos"): fica só o número
      age: z.string().max(10_000).transform((s) => s.replace(/\D/g, "").slice(0, LIMITES_TEXTO.age)),
      shortStory: text(LIMITES_TEXTO.shortStory),
      personality: text(LIMITES_TEXTO.personality),
    }),
    sexo: z.enum(SEXOS).nullable().default(null), // saves anteriores ao campo: sem sexo
    periculosidade: z.enum(PERICULOSIDADES).nullable().default(null),
    assinatura: z
      .string()
      .max(MAX_ASSINATURA, "assinatura grande demais")
      .refine((d) => d.startsWith("data:image/png;base64,"), "assinatura precisa ser PNG em base64")
      .nullable()
      .default(null),
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
    if (c.occupationId && c.occupationId !== OFICIO_PROPRIO && !getOccupation(c.occupationId)) fail(`ofício desconhecido: ${c.occupationId}`);
    if (new Set(c.faithIds).size !== c.faithIds.length) fail("fé repetida");
    for (const f of c.faithIds) if (!getFaith(f)) fail(`fé desconhecida: ${f}`);
    for (const m of c.marks) if (!getMark(m)) fail(`marca desconhecida: ${m}`);
    const img = c.appearance.image;
    if (img?.kind === "catalog" && !getImage(img.imageId)) fail(`imagem desconhecida: ${img.imageId}`);
  }));
