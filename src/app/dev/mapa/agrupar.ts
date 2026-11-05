import type { Pino } from "../../../data/mapa.ts";

type RegiaoDoCatalogo = { id: string; name: string; subregions: { id: string; name: string }[] };

export type GrupoMapa = {
  regiaoId: string;
  nome: string;
  /** Pino da própria região (os pinos de região ficam no nível da região, não das subregiões). */
  regiao: Pino | undefined;
  /** Subregiões da região; `pino` vazio = sem registro em mapa.ts (herda a posição da região-mãe). */
  subs: { id: string; nome: string; pino: Pino | undefined }[];
};

/** Separa os pinos em regiões e subregiões, na ordem do catálogo. `soltos` = pinos que nenhuma região conhece. */
export function agruparPinos(pinos: Pino[], regioes: RegiaoDoCatalogo[]): { grupos: GrupoMapa[]; soltos: Pino[] } {
  const porId = new Map(pinos.map((p) => [p.id, p]));
  const conhecidos = new Set<string>();
  const grupos = regioes.map((r) => {
    conhecidos.add(r.id);
    for (const s of r.subregions) conhecidos.add(s.id);
    return { regiaoId: r.id, nome: r.name, regiao: porId.get(r.id), subs: r.subregions.map((s) => ({ id: s.id, nome: s.name, pino: porId.get(s.id) })) };
  });
  return { grupos, soltos: pinos.filter((p) => !conhecidos.has(p.id)) };
}
