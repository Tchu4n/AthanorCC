import { existsSync, readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { faiths } from "../src/data/faiths.ts";
import { glossary } from "../src/data/glossary.ts";
import { IMAGES } from "../src/data/images.ts";
import { occupations } from "../src/data/occupations.ts";
import { regions } from "../src/data/regions.ts";
import { species } from "../src/data/species.ts";
import { A_DEFINIR, SOURCES, type Source } from "../src/data/types.ts";

const PUBLIC = new URL("../public/", import.meta.url);

export function validateData(): string[] {
  const errors: string[] = [];

  const checkIds = (file: string, ids: string[]) => {
    const seen = new Set<string>();
    for (const id of ids) {
      if (seen.has(id)) errors.push(`${file}: id duplicado "${id}"`);
      seen.add(id);
    }
  };
  checkIds("regions.ts", regions.flatMap((r) => [r.id, ...r.subregions.map((s) => s.id)]));
  checkIds("species.ts", species.flatMap((s) => [s.id, ...(s.subspecies ?? []).map((x) => x.id)]));
  checkIds("faiths.ts", faiths.map((f) => f.id));
  checkIds("occupations.ts", occupations.map((o) => o.id));
  checkIds("glossary.ts", glossary.map((g) => g.id));

  const checkSource = (where: string, source: readonly Source[] | undefined, required = true) => {
    if (!source) return required && errors.push(`${where}: sem source`);
    if (source.length === 0) errors.push(`${where}: source vazio`);
    for (const s of source) if (!SOURCES.includes(s)) errors.push(`${where}: source desconhecido "${s}"`);
  };

  // imagens: precisam estar em IMAGES, existir em public/ e constar em "Copiadas" no manifesto
  const manifest = readFileSync(new URL("athanor/MANIFEST.md", PUBLIC), "utf8");
  const copiadas = manifest.split("## Copiadas")[1]?.split("\n## ")[0] ?? "";
  const knownImages = new Set<string>(Object.values(IMAGES));
  for (const path of knownImages) {
    if (!existsSync(new URL("." + path, PUBLIC))) errors.push(`images.ts: arquivo ausente ${path}`);
    if (!copiadas.includes(path.replace("/athanor/", ""))) errors.push(`images.ts: ${path} não está em Copiadas no MANIFEST.md`);
  }
  const checkImage = (where: string, image?: string) => {
    if (image && !knownImages.has(image)) errors.push(`${where}: imagem fora de images.ts "${image}"`);
  };

  const terms = new Set(glossary.flatMap((g) => [g.term, ...(g.aliases ?? [])].map((t) => t.toLowerCase())));
  const checkText = (where: string, text: string, min = 2, max = 4) => {
    if (text === A_DEFINIR) return;
    const sentences = text.match(/[.!?](?=\s|$)/g)?.length ?? 0;
    if (sentences < min || sentences > max) errors.push(`${where}: ${sentences} frases (esperado ${min} a ${max})`);
    for (const [, term] of text.matchAll(/\[\[([^\]]+)\]\]/g))
      if (!terms.has(term.toLowerCase())) errors.push(`${where}: termo "${term}" não existe em glossary.ts`);
  };

  for (const r of regions) {
    const where = `regions.ts/${r.id}`;
    checkSource(where, r.source);
    checkImage(where, r.image);
    checkText(where, r.briefing);
    if (r.mainArea && !r.subregions.some((s) => s.name === r.mainArea))
      errors.push(`${where}: mainArea "${r.mainArea}" não é uma subregião`);
    for (const s of r.subregions) {
      checkSource(`${where}/${s.id}`, s.source, false);
      checkImage(`${where}/${s.id}`, s.image);
      checkText(`${where}/${s.id}`, s.briefing, 1);
    }
  }
  for (const s of species) {
    const where = `species.ts/${s.id}`;
    checkSource(where, s.source);
    checkImage(where, s.image);
    checkText(where, s.briefing);
    for (const x of s.subspecies ?? []) {
      checkSource(`${where}/${x.id}`, x.source);
      checkImage(`${where}/${x.id}`, x.image);
      checkText(`${where}/${x.id}`, x.briefing);
    }
  }
  for (const f of faiths) {
    const where = `faiths.ts/${f.id}`;
    checkSource(where, f.source);
    checkImage(where, f.image);
    checkText(where, f.briefing);
    checkText(`${where} (implications)`, f.implications);
  }
  for (const o of occupations) {
    checkSource(`occupations.ts/${o.id}`, o.source);
    checkImage(`occupations.ts/${o.id}`, o.image);
    checkText(`occupations.ts/${o.id}`, o.briefing);
  }
  for (const g of glossary) {
    checkSource(`glossary.ts/${g.id}`, g.source);
    checkImage(`glossary.ts/${g.id}`, g.image);
    checkText(`glossary.ts/${g.id}`, g.briefing);
  }

  return errors;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const errors = validateData();
  for (const e of errors) console.error(`✗ ${e}`);
  if (errors.length) process.exit(1);
  console.log("✓ dados válidos");
}
