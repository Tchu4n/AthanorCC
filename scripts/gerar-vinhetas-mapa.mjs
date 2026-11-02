// Gera public/athanor/mapa/vinhetas.svg: vinhetas a traço de tinta sobre o mapa do continente, tiradas do lore
// (Subregioes.md e os textos de regions.ts). Coordenadas em px da imagem 1280 x 1231; o minimapa desenha o SVG
// por cima do mapa, na mesma posição, e ele acompanha o zoom. Uso: node scripts/gerar-vinhetas-mapa.mjs
import { writeFileSync } from "node:fs";

const T = "#3b2412"; // tinta
const P = "#efdfb6"; // papel
const f = (n) => Math.round(n * 10) / 10;
const g = (conteudo, extra = "") => `<g ${extra}>${conteudo}</g>`;

// ---------- peças
const casa = (x, y, w = 6, h = 5) =>
  `<path d="M${f(x - w / 2)} ${f(y)} V${f(y - h)} L${f(x)} ${f(y - h - w * 0.5)} L${f(x + w / 2)} ${f(y - h)} V${f(y)} Z" fill="${P}"/>`;
const casas = (x, y, n, passo = 7, w = 6, h = 5) => Array.from({ length: n }, (_, i) => casa(x + i * passo, y + (i % 2) * 2, w, h)).join("");
const torre = (x, y, h = 18, w = 6) =>
  `<rect x="${f(x - w / 2)}" y="${f(y - h)}" width="${w}" height="${h}" fill="${P}"/><path d="M${f(x - w / 2 - 1)} ${f(y - h)} L${f(x)} ${f(y - h - w * 1.2)} L${f(x + w / 2 + 1)} ${f(y - h)} Z" fill="${T}"/>` +
  `<path d="M${f(x)} ${f(y - h * 0.6)} v3" />`;
const cupula = (x, y, r = 6) =>
  `<rect x="${f(x - r)}" y="${f(y - r * 0.8)}" width="${2 * r}" height="${f(r * 0.8)}" fill="${P}"/><path d="M${f(x - r)} ${f(y - r * 0.8)} A${r} ${r} 0 0 1 ${f(x + r)} ${f(y - r * 0.8)} Z" fill="${P}"/>` +
  `<path d="M${f(x)} ${f(y - r * 1.8)} v-3" /><circle cx="${f(x)}" cy="${f(y - r * 1.8 - 3.5)}" r="1" fill="${T}"/>`;
const ponte = (x, y, comp, arcos = 5, h = 6) => {
  const w = comp / arcos;
  let d = `M${f(x)} ${f(y)} H${f(x + comp)} V${f(y + h)}`;
  for (let i = arcos - 1; i >= 0; i--) d += ` H${f(x + (i + 0.85) * w)} A${f(w * 0.35)} ${f(h * 0.7)} 0 0 0 ${f(x + (i + 0.15) * w)} ${f(y + h)}`;
  d += ` H${f(x)} Z`;
  return `<path d="${d}" fill="${P}"/><path d="M${f(x)} ${f(y - 2)} H${f(x + comp)}" stroke-dasharray="1.5 1.5"/>`;
};
const muralha = (x, y, r) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke-width="2.2"/><circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${P}" stroke-width=".8" stroke-dasharray="2 2"/>` +
  [0, 90, 180, 270].map((a) => { const t = (a * Math.PI) / 180; return `<rect x="${f(x + Math.cos(t) * r - 2.5)}" y="${f(y + Math.sin(t) * r - 2.5)}" width="5" height="5" fill="${P}"/>`; }).join("");
const fumaca = (x, y, alt = 22) => `<path d="M${x} ${y} c-4 -5 4 -8 0 -13 c-4 -5 5 -7 1 ${-(alt - 13)}" fill="none" stroke-width="1" opacity=".8"/>`;
const vulcao = (x, y, w = 26, h = 18) =>
  `<path d="M${f(x - w / 2)} ${y} L${f(x - 4)} ${f(y - h)} H${f(x + 4)} L${f(x + w / 2)} ${y} Z" fill="${P}"/>` +
  `<path d="M${f(x - 4)} ${f(y - h)} q4 3 8 0" fill="none"/>` +
  Array.from({ length: 4 }, (_, i) => `<path d="M${f(x - w / 2 + 4 + i * 3)} ${f(y - 1)} l${f(3 + i)} ${f(-h * 0.6 + i * 2)}" stroke-width=".6"/>`).join("") +
  fumaca(x, y - h, 26);
const chamine = (x, y) => `<rect x="${x - 1.5}" y="${y - 9}" width="3" height="9" fill="${T}"/>${fumaca(x, y - 9, 16)}`;
const bandeira = (x, y, h = 10) => `<path d="M${x} ${y} V${y - h}" /><path d="M${x} ${y - h} l6 2 l-6 2 Z" fill="${T}"/>`;
const castelo = (x, y) =>
  `<rect x="${x - 10}" y="${y - 10}" width="20" height="10" fill="${P}"/>` +
  `<path d="M${x - 10} ${y - 10} v-2 h3 v2 h3 v-2 h3 v2 h3 v-2 h3 v2 h2 v-2" fill="none"/>` +
  torre(x - 10, y, 16, 5) + torre(x + 10, y, 16, 5) + torre(x, y - 8, 12, 6) + bandeira(x, y - 27, 7);
const lua = (x, y, r = 4) => `<path d="M${x + r * 0.3} ${y - r} A${r} ${r} 0 1 0 ${x + r * 0.3} ${y + r} A${r * 0.75} ${r * 0.75} 0 1 1 ${x + r * 0.3} ${y - r} Z" fill="${T}"/>`;
const mosteiro = (x, y) =>
  `<rect x="${x - 9}" y="${y - 8}" width="18" height="8" fill="${P}"/><path d="M${x - 11} ${y - 8} L${x} ${y - 15} L${x + 11} ${y - 8} Z" fill="${P}"/>` + torre(x + 9, y, 14, 4) + lua(x, y - 22, 3.5);
const lica = (x, y) =>
  `<rect x="${x - 22}" y="${y - 6}" width="44" height="12" rx="1" fill="${P}" stroke-dasharray="2 1"/><path d="M${x - 18} ${y} H${x + 18}" stroke-width="1.6"/>` +
  bandeira(x - 22, y - 6) + bandeira(x + 22, y - 6) + `<path d="M${x - 4} ${y - 6} v-5 h8 v5" fill="${P}"/>`;
const trigo = (x, y, w = 30, linhas = 5) =>
  Array.from({ length: linhas }, (_, i) => `<path d="M${x} ${y + i * 4} q${w / 4} -2 ${w / 2} 0 t${w / 2} 0" fill="none" stroke-width=".7"/>`).join("");
const pinheiro = (x, y, s = 1) => `<path d="M${x} ${y - 12 * s} L${x + 5 * s} ${y - 2 * s} H${x - 5 * s} Z" fill="${P}"/><path d="M${x} ${y - 2 * s} v${3 * s}"/>`;
const pinheiral = (x, y, pontos) => pontos.map(([dx, dy, s]) => pinheiro(x + dx, y + dy, s)).join("");
const palicada = (x, y, n = 8) => Array.from({ length: n }, (_, i) => `<path d="M${x + i * 3} ${y} v-6 l1.5 -2 l1.5 2 v6" fill="${P}" stroke-width=".7"/>`).join("");
const drakkar = (x, y, s = 1) =>
  g(`<path d="M-14 0 Q0 7 14 0 L16 -5 Q12 -1 10 0 H-10 Q-12 -1 -16 -5 Z" fill="${P}"/><path d="M0 0 V-18"/>` +
    `<rect x="-8" y="-17" width="16" height="12" fill="${P}"/>` + [0, 1, 2].map((i) => `<rect x="${-8 + i * 5.33 + 1.6}" y="-17" width="2.6" height="12" fill="${T}" stroke="none"/>`).join("") +
    `<path d="M-18 4 q3 -2 6 0 t6 0 M8 5 q3 -2 6 0 t6 0" fill="none" stroke-width=".6"/>`, `transform="translate(${x} ${y}) scale(${s})"`);
const monte = (x, y, h = 20, w = 12, espinhos = false) =>
  `<path d="M${x - w / 2} ${y} Q${x - w / 2} ${y - h * 0.7} ${x} ${y - h} Q${x + w / 2} ${y - h * 0.7} ${x + w / 2} ${y} Z" fill="${P}"/>` +
  [0.35, 0.6, 0.8].map((k, i) => `<ellipse cx="${f(x + (i - 1) * 2)}" cy="${f(y - h * k)}" rx="1.2" ry="1.6" fill="${T}" stroke="none"/>`).join("") +
  (espinhos ? [-1, 1].map((sgn) => `<path d="M${f(x + (sgn * w) / 3)} ${f(y - h * 0.5)} l${sgn * 5} -3 M${f(x + (sgn * w) / 4)} ${f(y - h * 0.75)} l${sgn * 4} -4"/>`).join("") : "");
const queimado = (x, y, r) => Array.from({ length: 7 }, (_, i) => `<path d="M${x - r + i * (r / 3)} ${y + r * 0.3} l${r / 3} ${-r * 0.6}" stroke-width=".5" opacity=".7"/>`).join("");
const tenda = (x, y, r = 6) => `<path d="M${x - r} ${y} V${y - r * 0.6} Q${x} ${y - r * 1.6} ${x + r} ${y - r * 0.6} V${y} Z" fill="${P}"/><path d="M${x - 1.5} ${y} v-3.5 h3 v3.5" fill="${T}"/>`;
const sol = (x, y, r = 4) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P}"/>` + Array.from({ length: 8 }, (_, i) => { const t = (i * Math.PI) / 4; return `<path d="M${f(x + Math.cos(t) * (r + 1))} ${f(y + Math.sin(t) * (r + 1))} l${f(Math.cos(t) * 3)} ${f(Math.sin(t) * 3)}" stroke-width=".8"/>`; }).join("");
const cascos = (x, y, n = 6) => Array.from({ length: n }, (_, i) => `<path d="M${x + i * 6} ${y + (i % 2) * 4} a1.6 1.6 0 1 1 3 0" fill="none" stroke-width=".7"/>`).join("");
const palafita = (x, y) => `<path d="M${x - 5} ${y - 4} h10 l-5 -5 Z" fill="${P}"/><rect x="${x - 4}" y="${y - 4}" width="8" height="4" fill="${P}"/><path d="M${x - 3} ${y} v4 M${x + 3} ${y} v4" />` +
  `<path d="M${x - 7} ${y + 5} q2 -1.5 4 0 t4 0 t4 0" fill="none" stroke-width=".6"/>`;
const barco = (x, y) => `<path d="M${x - 7} ${y} q7 4 14 0 Z" fill="${P}"/><path d="M${x} ${y} v-9 l5 7 Z" fill="${P}"/>`;
const blocos = (x, y) => [[0, 0, 7, 12], [8, 3, 9, 9], [18, -2, 6, 14], [3, 12, 12, 6], [17, 13, 8, 5]]
  .map(([dx, dy, w, h]) => `<rect x="${x + dx}" y="${y + dy - h}" width="${w}" height="${h}" fill="${P}"/><path d="M${x + dx + 1.5} ${y + dy - h + 2} h${w - 3} M${x + dx + 1.5} ${y + dy - h + 4.5} h${w - 3}" stroke-width=".4"/>`).join("");
const prisao = (x, y) => `<rect x="${x - 9}" y="${y - 10}" width="18" height="10" fill="${P}"/>` + [-6, -3, 0, 3, 6].map((d) => `<path d="M${x + d} ${y - 10} v10" stroke-width=".8"/>`).join("") +
  [[-14, 0], [12, 2], [15, -3]].map(([dx, dy]) => `<path d="M${x + dx} ${y + dy} l2 -6 l2 6 Z" fill="${P}"/>`).join("");
const vela = (x, y) => `<rect x="${x - 2.5}" y="${y - 10}" width="5" height="10" fill="${P}"/><path d="M${x} ${y - 10} q3 -4 0 -8 q-3 4 0 8" fill="${T}"/>`;
const ruinas = (x, y) => `<path d="M${x} ${y} v-8 a4 4 0 0 1 8 0 v8 M${x + 12} ${y} v-6 a3 3 0 0 1 6 0" fill="none"/><path d="M${x - 2} ${y} h22" />`;
const cratera = (x, y, r) => Array.from({ length: 18 }, (_, i) => { const t = (i * Math.PI) / 9; return `<path d="M${f(x + Math.cos(t) * r)} ${f(y + Math.sin(t) * r * 0.75)} l${f(Math.cos(t) * 7)} ${f(Math.sin(t) * 5)}" stroke-width=".8"/>`; }).join("") +
  `<path d="M${x - 6} ${y - 6} l12 12 M${x + 6} ${y - 6} l-12 12" stroke-width="1.4" opacity=".75"/>`;
const caravana = (x, y) => Array.from({ length: 4 }, (_, i) => `<path d="M${x + i * 9} ${y} v-3 q1 -3 3 -1 q1 -2 2 0 l1 -2 v6" fill="none" stroke-width=".7"/>`).join("") + `<path d="M${x - 6} ${y + 3} q20 3 40 0" fill="none" stroke-dasharray="1.5 2" stroke-width=".6"/>`;

// forte em estrela (traçado italiano), visto de cima, com a bandeira da ordem
const forte = (x, y, r = 8) => {
  const pontas = Array.from({ length: 10 }, (_, i) => { const a = (Math.PI / 5) * i - Math.PI / 2; const rr = i % 2 ? r * 0.62 : r; return `${f(x + Math.cos(a) * rr)} ${f(y + Math.sin(a) * rr)}`; });
  return `<path d="M${pontas.join(" L")} Z" fill="${P}"/><rect x="${x - 2.5}" y="${y - 2.5}" width="5" height="5" fill="${T}"/>` + bandeira(x, y - 2, 9);
};

// ---------- vinhetas por lugar (pistas do lore em regions.ts e Subregioes.md)
// cada vinheta é ampliada em torno do seu ponto: legível na vista do continente, rica quando o mapa aproxima
const em = (x, y, k, ...partes) => `<g transform="translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})">${partes.join("")}</g>`;
const K = 1.7;
const V = [
  // Highbridge: Ponte Matriz sobre o braço oeste da bifurcação; Eixo Universitário a oeste, Quarteirão Dourado entre os braços, Ala das Embaixadas ao sul
  em(762, 500, 1.5, ponte(744, 496, 30, 4), torre(733, 484, 16), torre(740, 482, 20), torre(726, 486, 12), cupula(786, 496, 6), cupula(799, 500, 4.5), casas(770, 528, 3)),
  // Laguardia: vulcões, chaminés das forjas e a capital murada (Schwarzenberg)
  em(708, 690, K, vulcao(708, 690, 30, 20)), em(838, 695, K, vulcao(838, 695, 22, 15)),
  em(780, 712, K, chamine(780, 700), chamine(792, 712), chamine(768, 716)), em(768, 739, K, muralha(768, 739, 9), casas(762, 742, 2, 6, 5, 4)),
  // Midland: palácio de Aurelia, casario do porto de Helsing no lago, Mosteiro de Itelonomeu ao sul do lago
  em(826, 414, K, castelo(826, 414)), em(858, 386, K, casas(855, 384, 2, 7)), em(908, 470, K, mosteiro(908, 470)),
  // Sunfield: liça dos torneios e campos de trigo
  em(816, 230, K, lica(816, 230)), em(787, 268, K, trigo(770, 262, 34, 4)), em(853, 298, K, trigo(838, 292, 30, 4)),
  // Oakhaven: pinheirais e a paliçada do Posto das Peles
  em(800, 70, K, pinheiral(790, 70, [[0, 0, 1], [10, 4, 1.2], [20, -2, 0.9], [-9, 6, 1], [30, 6, 1.1]])), em(800, 182, K, palicada(790, 185)),
  // Vargarf: navios longos saindo da Baía da Boa Viagem
  em(540, 150, K, drakkar(540, 150, 1)), em(518, 195, K, drakkar(518, 195, 0.8)),
  // Kruk e Crick: montes das colmeias; Crick com espinhos e terra chamuscada
  em(942, 220, K, monte(940, 210, 22, 12), monte(958, 222, 16, 9), monte(925, 225, 14, 8)),
  em(952, 595, K, monte(945, 585, 22, 13, true), monte(964, 598, 15, 9, true), queimado(950, 610, 22)),
  // Irmandade de São Ferdinand: fortes que cercam Crick (posições dos pinos em src/data/mapa.ts)
  em(896, 480, K, forte(896, 480)), em(877, 634, K, forte(877, 634)), em(883, 541, K, forte(883, 541)), em(829, 578, K, forte(829, 578)),
  // Império das Estepes: tendas, rastros de cascos e o sol de Gorturk
  em(1112, 610, K, tenda(1110, 610), tenda(1124, 616, 5), tenda(1100, 622, 4.5), sol(1130, 585)), em(1098, 660, K, cascos(1080, 655, 7)),
  // Blackwater: palafitas e barcos de contrabando
  em(628, 618, K, palafita(628, 612), palafita(645, 622), palafita(612, 628)), em(596, 590, K, barco(596, 590)), em(612, 668, K, barco(612, 668)),
  // Morrow: ruínas da infraestrutura imperial
  em(608, 300, K, ruinas(600, 300)),
  // UP: blocos modernistas de Asenov (margem leste do lago), ilha-prisão de Puerto Blanco, Isla de la Vela
  em(262, 428, 1.4, blocos(250, 432)), em(384, 790, K, prisao(384, 790)), em(232, 1010, K, vela(230, 1010), barco(246, 1028)),
  // Marranol: cratera da terra radioativa; caravana no deserto
  cratera(627, 1108, 30), em(756, 990, K, caravana(740, 990)),
];

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 1231" fill="none" stroke="${T}" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round">${V.join("")}</svg>`;
writeFileSync("public/athanor/mapa/vinhetas.svg", svg);
console.log(`${(svg.length / 1024).toFixed(1)} KB`);
