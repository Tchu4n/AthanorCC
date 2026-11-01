import { existsSync, readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { faiths } from "../src/data/faiths.ts";
import { glossary } from "../src/data/glossary.ts";
import { IMAGES } from "../src/data/images.ts";
import { APURACAO_ESPECIE, APURACAO_OFICIO, APURACAO_ORIGEM, APURACAO_SUBESPECIE, APURACAO_SUBREGIAO, SINAIS_COMICOS } from "../src/data/apuracao.ts";
import { PINOS, type Pino } from "../src/data/mapa.ts";
import { marks } from "../src/data/marks.ts";
import { occupations } from "../src/data/occupations.ts";
import { regions } from "../src/data/regions.ts";
import { rules } from "../src/data/rules.ts";
import { species } from "../src/data/species.ts";
import { A_DEFINIR, SOURCES, type Source } from "../src/data/types.ts";

const PUBLIC = new URL("../public/", import.meta.url);

const STATUS_PINO = ["estimado", "calibrado", "sem posição"];

// mapa.ts: id de região ou subregião existente, status válido, x/y entre 0 e 1 só em quem tem posição,
// e toda região e subregião com registro (uma nova sem pino seria esquecida no minimapa)
export function validarMapa(pinos: Pino[], regioes: { id: string; subregions: { id: string }[] }[]): string[] {
  const errors: string[] = [];
  const ids = new Set(regioes.flatMap((r) => [r.id, ...r.subregions.map((s) => s.id)]));
  const vistos = new Set<string>();
  for (const p of pinos) {
    const where = `mapa.ts/${p.id}`;
    if (vistos.has(p.id)) errors.push(`${where}: id repetido`);
    vistos.add(p.id);
    if (!ids.has(p.id)) errors.push(`${where}: id não existe em regions.ts`);
    if (!STATUS_PINO.includes(p.status)) errors.push(`${where}: sem status (use ${STATUS_PINO.join(", ")})`);
    if (!p.pista?.trim()) errors.push(`${where}: sem pista`);
    const temXY = p.x !== undefined || p.y !== undefined;
    if (p.status === "sem posição" && temXY) errors.push(`${where}: "sem posição" não leva x/y`);
    if (p.status !== "sem posição" && ![p.x, p.y].every((v) => typeof v === "number" && v >= 0 && v <= 1))
      errors.push(`${where}: x e y precisam estar entre 0 e 1`);
  }
  for (const r of regioes) {
    if (!vistos.has(r.id)) errors.push(`mapa.ts: região "${r.id}" sem registro de pino`);
    for (const sub of r.subregions) if (!vistos.has(sub.id)) errors.push(`mapa.ts: subregião "${sub.id}" sem registro de pino`);
  }
  return errors;
}

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
  checkIds("marks.ts", marks.map((m) => m.id));
  checkIds("rules.ts", rules.map((r) => r.id));

  // regras: todo id citado precisa existir no arquivo de dados correspondente
  const idsOf = {
    species: new Set(species.map((s) => s.id)),
    subspecies: new Set(species.flatMap((s) => (s.subspecies ?? []).map((x) => x.id))),
    occupation: new Set(occupations.map((o) => o.id)),
    region: new Set(regions.map((r) => r.id)),
    faith: new Set(faiths.map((f) => f.id)),
    mark: new Set(marks.map((m) => m.id)),
  };
  const whenKind = { species: "species", notSpecies: "species", subspecies: "subspecies", occupation: "occupation", region: "region", faith: "faith", notFaith: "faith" } as const;
  for (const r of rules) {
    const where = `rules.ts/${r.id}`;
    for (const [field, ids] of Object.entries(r.quando) as [keyof typeof whenKind, string[]][])
      for (const id of ids) if (!idsOf[whenKind[field]].has(id)) errors.push(`${where}: ${field} "${id}" não existe`);
    for (const id of "id" in r.alvo ? [r.alvo.id] : r.alvo.except)
      if (!idsOf[r.alvo.kind].has(id)) errors.push(`${where}: alvo ${r.alvo.kind} "${id}" não existe`);
    if (r.efeito === "REQUIRE" && r.alvo.kind !== "mark") errors.push(`${where}: REQUIRE só vale para marcas`);
  }

  // apuração da Agência (tela final e PDF): um texto por espécie, região e ofício; nada sobrando
  const apuracao = [
    ["especie", APURACAO_ESPECIE, idsOf.species],
    ["subespecie", APURACAO_SUBESPECIE, idsOf.subspecies],
    ["origem", APURACAO_ORIGEM, idsOf.region],
    ["oficio", APURACAO_OFICIO, idsOf.occupation],
    ["subregiao", APURACAO_SUBREGIAO, new Set(regions.flatMap((r) => r.subregions.map((s) => s.id)))],
    ["sinais", Object.fromEntries(SINAIS_COMICOS.map((t, i) => [String(i), t])), new Set(SINAIS_COMICOS.map((_, i) => String(i)))],
  ] as const;
  if (SINAIS_COMICOS.length < 30) errors.push(`apuracao.ts/sinais: ${SINAIS_COMICOS.length} sinais cômicos (mínimo 30)`);
  const subIds = regions.flatMap((r) => r.subregions.map((s) => s.id));
  if (new Set(subIds).size !== subIds.length) errors.push("regions.ts: id de subregião repetido entre regiões (a apuração usa só o id)");
  for (const [nome, textos, ids] of apuracao) {
    if (nome !== "subespecie") for (const id of ids) if (!textos[id]?.trim()) errors.push(`apuracao.ts/${nome}: sem texto para "${id}"`);
    for (const id of Object.keys(textos)) if (!ids.has(id)) errors.push(`apuracao.ts/${nome}: "${id}" não existe`);
    // flexão {masculino|feminino} bem formada: fora dela não sobra chave
    for (const [id, t] of Object.entries(textos))
      if (/[{}|]/.test(t.replace(/\{[^|{}]*\|[^|{}]*\}/g, ""))) errors.push(`apuracao.ts/${nome}/${id}: flexão {m|f} malformada`);
  }

  const checkSource = (where: string, source: readonly Source[] | undefined, required = true) => {
    if (!source) return required && errors.push(`${where}: sem source`);
    if (source.length === 0) errors.push(`${where}: source vazio`);
    for (const s of source) if (!SOURCES.includes(s)) errors.push(`${where}: source desconhecido "${s}"`);
  };

  // imagens: precisam estar em IMAGES, existir em public/ e constar em "Copiadas" no manifesto
  const manifest = readFileSync(new URL("athanor/MANIFEST.md", PUBLIC), "utf8");
  const copiadas = manifest.split("## Copiadas")[1]?.split("\n## ")[0] ?? "";
  const entries: [string, { src?: string; displayName?: string }][] = Object.entries(IMAGES);
  for (const [key, entry] of entries)
    if (!entry.displayName?.trim()) errors.push(`images.ts/${key}: sem displayName`);
  const knownImages = new Set(entries.map(([, e]) => e.src ?? ""));
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
    checkImage(`${where}/bandeira`, r.bandeira);
    checkImage(`${where}/andarilho`, r.andarilho);
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
  for (const m of marks) {
    checkSource(`marks.ts/${m.id}`, m.source);
    checkText(`marks.ts/${m.id}`, m.briefing);
    if (m.descricao) checkText(`marks.ts/${m.id} (descricao)`, m.descricao);
  }
  for (const r of rules) {
    checkSource(`rules.ts/${r.id}`, r.source);
    checkText(`rules.ts/${r.id} (descricao)`, r.descricao, 1, 1);
  }
  for (const g of glossary) {
    checkSource(`glossary.ts/${g.id}`, g.source);
    checkImage(`glossary.ts/${g.id}`, g.image);
    checkText(`glossary.ts/${g.id}`, g.briefing);
  }

  errors.push(...validarMapa(PINOS, regions));

  return errors;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const errors = validateData();
  for (const e of errors) console.error(`✗ ${e}`);
  if (errors.length) process.exit(1);
  console.log("✓ dados válidos");
}
