import { MAPA, type Pino } from "../../../data/mapa.ts";

// Mesmo formato de src/data/mapa.ts: o resultado substitui o arquivo inteiro.
export function serializarMapa(pinos: Pino[]): string {
  const linha = (p: Pino) => {
    const pos = p.x !== undefined && p.y !== undefined ? `, x: ${p.x}, y: ${p.y}` : "";
    return `  { id: ${JSON.stringify(p.id)}, status: ${JSON.stringify(p.status)}, pista: ${JSON.stringify(p.pista)}${pos} },`;
  };
  return `// Pinos do minimapa da Origem sobre public/athanor/mapa/mapa-continente.jpeg (${MAPA.largura} x ${MAPA.altura}).
// x e y vão de 0 a 1, a partir do canto superior esquerdo da imagem.
// status: "estimado" (posição deduzida da pista, a conferir), "calibrado" (posta pelo autor em /dev/mapa)
// ou "sem posição" (não aparece no mapa; a escolha continua valendo).
// Subregião sem registro aqui usa a posição da região-mãe; com registro "sem posição", mostra a nota.
// Este arquivo é gerado pelo botão "Copiar JSON" de /dev/mapa: calibrar lá, não à mão.

export const MAPA = { src: ${JSON.stringify(MAPA.src)}, vinhetas: ${JSON.stringify(MAPA.vinhetas)}, largura: ${MAPA.largura}, altura: ${MAPA.altura} } as const;

export type StatusPino = "estimado" | "calibrado" | "sem posição";
export type Pino = { id: string; status: StatusPino; pista: string; x?: number; y?: number };

export const PINOS: Pino[] = [
${pinos.map(linha).join("\n")}
];
`;
}
