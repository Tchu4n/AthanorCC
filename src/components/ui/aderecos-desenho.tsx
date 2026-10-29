// Desenho dos adereços da mesa, vistos de cima (de quem está sentado lendo o pergaminho), tirados da lore: a vela
// do deus do conhecimento, a lente de foco e os cristais focadores dos cajados (a magia é engenharia), pena e
// tinteiro de quem registra o personagem, moedas de Laguardia e Highbridge e uma gaiola de bateria com um rato.
// Luz única: a vela no canto de baixo à esquerda; os brilhos ficam embaixo à esquerda e as sombras caem para cima e
// para a direita.
// Este arquivo é a fonte: o site usa as imagens exportadas em public/aderecos (desenhadas uma vez pelo navegador;
// inline, as sombras e os traços eram redesenhados a cada rolagem). Depois de mudar um desenho, com `npm run dev`
// rodando: `node scripts/exportar-aderecos.mjs`.

const n = (v: number) => Math.round(v * 10) / 10;
const polar = (r: number, graus: number): [number, number] => [n(r * Math.cos((graus * Math.PI) / 180)), n(r * Math.sin((graus * Math.PI) / 180))];

// sombra projetada para cima/direita; `altura` dá o deslocamento e o desfoque (objeto alto, sombra longa)
function Sombra({ id, altura }: { id: string; altura: number }) {
  return (
    <filter id={id} x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx={altura * 0.8} dy={-altura} stdDeviation={altura * 0.6} floodColor="#0a0402" floodOpacity=".6" />
      <feDropShadow dx={altura * 0.15} dy={-altura * 0.2} stdDeviation={0.8} floodColor="#000" floodOpacity=".45" />
    </filter>
  );
}

// ---------------------------------------------------------------- vela

function VelaPrato() {
  // borda da cera derretida: círculo com pequenas ondulações determinísticas
  const borda = Array.from({ length: 48 }, (_, i) => {
    const r = 38 + Math.sin(i * 1.7) * 1.4 + Math.sin(i * 0.6) * 1.1;
    return polar(r, i * 7.5).join(" ");
  });
  // poça de cera endurecida em volta da base: contorno orgânico (soma de senos) e alguns caroços
  const poca = Array.from({ length: 72 }, (_, i) => {
    const t = (i * 5 * Math.PI) / 180;
    return polar(47 + 6 * Math.sin(3 * t + 1) + 4 * Math.sin(7 * t) + 2.5 * Math.sin(13 * t + 2), i * 5).join(" ");
  });
  const carocos = [
    [58, 210, 7],
    [55, 300, 5],
    [60, 135, 4],
    [53, 30, 5],
  ];
  return (
      <svg viewBox="-100 -100 200 200" data-adereco="vela-prato">
        <defs>
          <radialGradient id="vl-prato" cx=".45" cy=".55" r=".6">
            <stop offset="0" stopColor="#f6dc8c" />
            <stop offset=".55" stopColor="#b8862e" />
            <stop offset=".85" stopColor="#6e4a14" />
            <stop offset="1" stopColor="#3b260a" />
          </radialGradient>
          <linearGradient id="vl-aba" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#fbe7a6" />
            <stop offset=".4" stopColor="#c99a3e" />
            <stop offset="1" stopColor="#4d3410" />
          </linearGradient>
          <radialGradient id="vl-cera" cx=".5" cy=".5" r=".5">
            <stop offset="0" stopColor="#fff6dc" />
            <stop offset=".75" stopColor="#efe0bc" />
            <stop offset="1" stopColor="#cdb88c" />
          </radialGradient>
          {/* poça de cera derretida, acesa por dentro pela chama */}
          <radialGradient id="vl-poca" cx=".5" cy=".55" r=".5">
            <stop offset="0" stopColor="#fff2b0" />
            <stop offset=".5" stopColor="#ffd77a" stopOpacity=".85" />
            <stop offset="1" stopColor="#f3d79c" stopOpacity=".2" />
          </radialGradient>
        </defs>
        {/* prato de latão com aba e argola */}
        <circle r="92" fill="url(#vl-aba)" />
        <circle r="84" fill="url(#vl-prato)" />
        <circle r="84" fill="none" stroke="#2b1b06" strokeOpacity=".5" strokeWidth="1.5" />
        <circle r="91" fill="none" stroke="#fff3c4" strokeOpacity=".35" strokeWidth=".8" strokeDasharray="60 40 20 30" />
        <g transform="translate(96 4)">
          <circle r="17" fill="none" stroke="url(#vl-aba)" strokeWidth="6" />
          <circle r="17" fill="none" stroke="#2b1b06" strokeOpacity=".4" strokeWidth=".8" />
        </g>
        {/* cera derramada e endurecida no prato */}
        <path d={`M${poca.join(" L")} Z`} fill="#eadbb6" stroke="#c4ad7e" strokeWidth=".8" />
        <path d={`M${poca.slice(30, 52).join(" L")}`} stroke="#fff8e6" strokeOpacity=".7" strokeWidth="1.2" fill="none" />
        {carocos.map(([d, ang, r]) => {
          const [x, y] = polar(d, ang);
          return (
            <g key={ang}>
              <circle cx={x} cy={y} r={r} fill="#efe1c0" stroke="#c4ad7e" strokeWidth=".6" />
              <circle cx={x - r * 0.3} cy={y + r * 0.3} r={r * 0.35} fill="#fff" fillOpacity=".6" />
            </g>
          );
        })}
        {/* topo da vela: borda irregular, poça derretida e pavio */}
        <path d={`M${borda.join(" L")} Z`} fill="url(#vl-cera)" stroke="#bda77a" strokeWidth=".8" />
        <circle r="27" fill="url(#vl-poca)" />
        <circle r="27" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth=".6" />
        <path d="M-1 2 q1 -4 3 -6" stroke="#1a0f05" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <circle cx="2" cy="-4" r="1.2" fill="#ff7a1a" />
    </svg>
  );
}

// ---------------------------------------------------------------- lente de foco

function Lente() {
  const serrilha = Array.from({ length: 72 }, (_, i) => {
    const [x1, y1] = polar(66, i * 5);
    const [x2, y2] = polar(70, i * 5);
    return `M${x1} ${y1} L${x2} ${y2}`;
  }).join(" ");
  return (
    <svg viewBox="-90 -90 180 180" data-adereco="lente">
      <defs>
        <Sombra id="ln-sombra" altura={5} />
        <linearGradient id="ln-latao" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#fff0b8" />
          <stop offset=".3" stopColor="#d9ad52" />
          <stop offset=".65" stopColor="#7d5518" />
          <stop offset="1" stopColor="#3e2908" />
        </linearGradient>
        <radialGradient id="ln-vidro" cx=".35" cy=".65" r=".75">
          <stop offset="0" stopColor="#ffffff" stopOpacity=".35" />
          <stop offset=".4" stopColor="#d6ece6" stopOpacity=".12" />
          <stop offset=".9" stopColor="#3f6560" stopOpacity=".22" />
          <stop offset="1" stopColor="#1d3330" stopOpacity=".45" />
        </radialGradient>
        <radialGradient id="ln-foco" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#fffbe0" stopOpacity=".95" />
          <stop offset=".35" stopColor="#ffe08a" stopOpacity=".55" />
          <stop offset="1" stopColor="#ffb040" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g filter="url(#ln-sombra)">
        {/* abas de encaixe no cajado */}
        {[45, 225].map((a) => (
          <g key={a} transform={`rotate(${a})`}>
            <rect x="62" y="-9" width="20" height="18" rx="3" fill="url(#ln-latao)" stroke="#2e1e06" strokeWidth=".8" />
            <circle cx="74" cy="0" r="3.2" fill="#3a2608" />
            <path d="M71.5 0 h5" stroke="#f3d98f" strokeWidth=".9" />
          </g>
        ))}
        <circle r="68" fill="none" stroke="url(#ln-latao)" strokeWidth="12" />
        <path d={serrilha} stroke="#3e2908" strokeOpacity=".55" strokeWidth=".9" />
        <circle r="62" fill="none" stroke="#2e1e06" strokeOpacity=".6" strokeWidth="1.2" />
        <circle r="74" fill="none" stroke="#2e1e06" strokeOpacity=".5" strokeWidth="1" />
        {/* vidro: quase transparente (a sombra dele sai clara), com reflexo da vela embaixo à esquerda */}
        <circle r="61" fill="url(#ln-vidro)" />
        <path d="M-50 22 A54 54 0 0 1 -22 -48" stroke="#fff" strokeOpacity=".55" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M-40 34 A54 54 0 0 1 -44 22" stroke="#fff" strokeOpacity=".8" strokeWidth="3" fill="none" strokeLinecap="round" />
        <ellipse cx="-24" cy="30" rx="7" ry="4" transform="rotate(-40 -24 30)" fill="#fffbe6" fillOpacity=".8" />
        <circle r="61" fill="none" stroke="#e8fff8" strokeOpacity=".4" strokeWidth=".8" />
      </g>
      {/* a lente concentra a luz da vela num ponto do pano, do lado oposto (fora do filtro de sombra) */}
      <circle cx="34" cy="-36" r="16" fill="url(#ln-foco)" />
    </svg>
  );
}

// ---------------------------------------------------------------- cristais

const CORES = {
  azul: { claro: "#e4f3ff", meio: "#9fc8f0", escuro: "#3e6c9e", leite: "#f4f8fc" },
  violeta: { claro: "#efe6ff", meio: "#b9a2ec", escuro: "#55409a", leite: "#f6f1fd" },
};

// prisma hexagonal deitado: de cima aparecem três faces em faixas e a ponta piramidal; a base quebrada é leitosa
function Prisma({ x, y, comprimento, largura, angulo, cor, id }: { x: number; y: number; comprimento: number; largura: number; angulo: number; cor: keyof typeof CORES; id: string }) {
  const c = CORES[cor];
  const w = largura / 2;
  const ponta = largura * 0.9;
  const lb = comprimento - ponta;
  const quebra = `M0 ${-w} L4 ${-w * 0.6} L-2 ${-w * 0.2} L5 ${w * 0.25} L-1 ${w * 0.7} L3 ${w}`;
  const faixa = (y1: number, y2: number) => `M2 ${y1} L${lb} ${y1} L${lb} ${y2} L2 ${y2} Z`;
  return (
    <g transform={`translate(${x} ${y}) rotate(${angulo})`}>
      <defs>
        <linearGradient id={`${id}-leite`} x1="0" x2="1">
          <stop offset="0" stopColor={c.leite} stopOpacity=".95" />
          <stop offset=".45" stopColor={c.leite} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* faces: de cima para baixo, escura (longe da vela), média e clara (perto da vela) */}
      <path d={faixa(-w, -w / 2)} fill={c.escuro} fillOpacity=".82" />
      <path d={faixa(-w / 2, w / 2)} fill={c.meio} fillOpacity=".78" />
      <path d={faixa(w / 2, w)} fill={c.claro} fillOpacity=".85" />
      <path d={`M${lb} ${-w} L${lb} ${-w / 2} L${comprimento} 0 Z`} fill={c.escuro} fillOpacity=".9" />
      <path d={`M${lb} ${-w / 2} L${lb} ${w / 2} L${comprimento} 0 Z`} fill={c.meio} fillOpacity=".85" />
      <path d={`M${lb} ${w / 2} L${lb} ${w} L${comprimento} 0 Z`} fill={c.claro} fillOpacity=".95" />
      {/* base leitosa e quebrada */}
      <path d={`${quebra} L${lb * 0.5} ${w} L${lb * 0.5} ${-w} Z`} fill={`url(#${id}-leite)`} />
      <path d={quebra} stroke={c.leite} strokeWidth="1.2" fill="none" />
      {/* inclusões e arestas acesas */}
      <path d={`M${lb * 0.25} ${-w * 0.2} q${lb * 0.15} ${w * 0.3} ${lb * 0.35} ${w * 0.1} M${lb * 0.4} ${w * 0.55} l${lb * 0.18} ${-w * 0.15}`} stroke="#fff" strokeOpacity=".5" strokeWidth=".8" fill="none" />
      <path d={`M2 ${w / 2} L${lb} ${w / 2} L${comprimento} 0 M2 ${-w / 2} L${lb} ${-w / 2} L${comprimento} 0`} stroke="#fff" strokeOpacity=".75" strokeWidth=".9" fill="none" />
      <path d={`M2 ${w} L${lb} ${w} L${comprimento} 0`} stroke="#fff" strokeOpacity=".95" strokeWidth="1.2" fill="none" />
      <path d={`M2 ${-w} L${lb} ${-w} L${comprimento} 0`} stroke="#1b2a44" strokeOpacity=".6" strokeWidth=".8" fill="none" />
    </g>
  );
}

// lapidação brilhante vista de cima: mesa octogonal, estrelas, coroa (kites) e quebras da cintura
function Lapidado({ x, y, r }: { x: number; y: number; r: number }) {
  const facetas: { d: string; tom: number }[] = [];
  for (let i = 0; i < 8; i++) {
    const a = i * 45;
    const t1 = polar(r * 0.52, a - 22.5);
    const t2 = polar(r * 0.52, a + 22.5);
    const estrela = polar(r * 0.8, a);
    const estrelaAnt = polar(r * 0.8, a - 45);
    const g = polar(r, a - 22.5);
    const ga = polar(r, a - 45);
    const gm = polar(r, a);
    // luz da vela embaixo à esquerda (135°): facetas viradas para lá ficam claras
    const luz = (ang: number) => (Math.cos(((ang - 135) * Math.PI) / 180) + 1) / 2;
    facetas.push({ d: `M${t1} L${t2} L${estrela} Z`, tom: luz(a) });
    facetas.push({ d: `M${t1} L${estrelaAnt} L${g} L${estrela} Z`, tom: luz(a - 22.5) * 0.8 + 0.1 });
    facetas.push({ d: `M${estrelaAnt} L${ga} L${g} Z`, tom: luz(a - 33) * 0.6 });
    facetas.push({ d: `M${estrela} L${g} L${gm} Z`, tom: luz(a - 11) * 0.7 + 0.15 });
  }
  const mesa = Array.from({ length: 8 }, (_, i) => polar(r * 0.52, i * 45 - 22.5).join(" ")).join(" L");
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill="#24466e" />
      {facetas.map((f, i) => (
        <path key={i} d={f.d} fill={`hsl(208 70% ${n(30 + f.tom * 58)}%)`} stroke="#e8f5ff" strokeOpacity=".55" strokeWidth=".5" />
      ))}
      <path d={`M${mesa} Z`} fill="#bfe2ff" fillOpacity=".85" stroke="#fff" strokeWidth=".7" />
      <path d={`M${polar(r * 0.45, 150)} L${polar(r * 0.2, 200)}`} stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx={-r * 0.35} cy={r * 0.35} r={r * 0.09} fill="#fff" />
    </g>
  );
}

function Cristais() {
  return (
    <svg viewBox="0 0 280 170" data-adereco="cristais">
      <defs>
        <Sombra id="cr-sombra" altura={6} />
        <Sombra id="cr-sombra-baixa" altura={3} />
      </defs>
      <g filter="url(#cr-sombra)">
        <Prisma id="cr-a" x={16} y={96} comprimento={140} largura={32} angulo={-12} cor="azul" />
        <Prisma id="cr-b" x={56} y={132} comprimento={96} largura={22} angulo={-4} cor="violeta" />
        <Prisma id="cr-c" x={250} y={92} comprimento={70} largura={18} angulo={196} cor="azul" />
      </g>
      <g filter="url(#cr-sombra-baixa)">
        <Lapidado x={196} y={36} r={22} />
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------- pena e tinteiro

// pena deitada: raque em curva, barbas geradas ao longo dela (leque estreito de um lado, largo do outro),
// faixas escuras perto da ponta, penugem na base e o cálamo cortado e sujo de tinta
function Pena() {
  const P0 = [16, 92];
  const C = [170, 50];
  const P2 = [372, 40];
  const ponto = (t: number) => [0, 1].map((k) => (1 - t) ** 2 * P0[k] + 2 * (1 - t) * t * C[k] + t ** 2 * P2[k]);
  const tangente = (t: number) => {
    const d = [0, 1].map((k) => 2 * (1 - t) * (C[k] - P0[k]) + 2 * t * (P2[k] - C[k]));
    const l = Math.hypot(d[0], d[1]);
    return [d[0] / l, d[1] / l];
  };
  const barbas: Record<"clara" | "escura" | "penugem", string[]> = { clara: [], escura: [], penugem: [] };
  const contorno: { lado: number; pts: string[] }[] = [
    { lado: -1, pts: [] },
    { lado: 1, pts: [] },
  ];
  const N = 150;
  for (const lado of [-1, 1]) {
    const largura = lado === -1 ? 20 : 34;
    for (let i = 0; i <= N; i++) {
      const t = 0.2 + (i / N) * 0.79;
      const u = (t - 0.2) / 0.79;
      const perfil = Math.sin(Math.PI * Math.min(1, u * 1.15)) ** 0.6 * (1 - u * 0.25);
      // fendas naturais da pena: alguns trechos com as barbas desalinhadas
      const fenda = (lado === 1 && i > 92 && i < 97) || (lado === -1 && i > 60 && i < 63) ? 9 : 0;
      const [px, py] = ponto(t);
      const [tx, ty] = tangente(t);
      const ang = ((48 + fenda) * Math.PI) / 180;
      const dx = tx * Math.cos(ang) - lado * ty * Math.sin(ang);
      const dy = ty * Math.cos(ang) + lado * tx * Math.sin(ang);
      const L = largura * perfil + 2;
      const ex = px + dx * L + tx * 3;
      const ey = py + dy * L + ty * 3;
      const cx = px + dx * L * 0.55 - lado * ty * 1.5;
      const cy = py + dy * L * 0.55 + lado * tx * 1.5;
      const seg = `M${n(px)} ${n(py)} Q${n(cx)} ${n(cy)} ${n(ex)} ${n(ey)}`;
      const faixa = (u > 0.7 && u < 0.76) || (u > 0.84 && u < 0.88) || u > 0.95;
      (u < 0.12 ? barbas.penugem : faixa ? barbas.escura : barbas.clara).push(seg);
      if (i % 3 === 0 || i === N) contorno[lado === -1 ? 0 : 1].pts.push(`${n(ex)} ${n(ey)}`);
    }
  }
  const raque = (de: number, ate: number) =>
    Array.from({ length: 20 }, (_, i) => ponto(de + ((ate - de) * i) / 19).map(n).join(" ")).join(" L");
  const [bx, by] = ponto(0.2);
  const [fx, fy] = ponto(0.99);
  return (
    <svg viewBox="0 0 390 140" data-adereco="pena">
      <defs>
        <Sombra id="pn-sombra" altura={2.5} />
        <linearGradient id="pn-calamo" x1="0" x2="1">
          <stop offset="0" stopColor="#d9c79c" stopOpacity=".9" />
          <stop offset="1" stopColor="#f4ead2" stopOpacity=".95" />
        </linearGradient>
      </defs>
      <g filter="url(#pn-sombra)">
        {/* fundo das duas bandeiras, por baixo das barbas */}
        {contorno.map((c) => (
          <path key={c.lado} d={`M${n(bx)} ${n(by)} L${c.pts.join(" L")} L${n(fx)} ${n(fy)} Z`} fill="#e9dfc8" fillOpacity=".9" />
        ))}
        <path d={barbas.clara.join(" ")} stroke="#f8f2e2" strokeWidth=".9" fill="none" />
        <path d={barbas.clara.filter((_, i) => i % 4 === 0).join(" ")} stroke="#a89878" strokeOpacity=".55" strokeWidth=".5" fill="none" />
        <path d={barbas.escura.join(" ")} stroke="#6b5a45" strokeWidth=".9" fill="none" />
        <path d={barbas.penugem.join(" ")} stroke="#fbf7ee" strokeOpacity=".75" strokeWidth=".7" fill="none" strokeDasharray="3 1.5" />
        {/* raque: grossa na base, fina na ponta, com brilho do lado da vela */}
        <path d={`M${raque(0.2, 0.7)}`} stroke="#cdbb95" strokeWidth="2.8" fill="none" strokeLinecap="round" />
        <path d={`M${raque(0.7, 0.995)}`} stroke="#bba982" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        <path d={`M${raque(0.2, 0.9)}`} stroke="#fffaf0" strokeWidth=".7" fill="none" transform="translate(-.6 .8)" />
        {/* cálamo translúcido, cortado em bico e manchado de tinta */}
        <path d={`M${raque(0.005, 0.2)}`} stroke="url(#pn-calamo)" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d={`M${raque(0.01, 0.19)}`} stroke="#fff" strokeOpacity=".7" strokeWidth="1" fill="none" transform="translate(-.8 1.2)" />
        <path d="M13 90 L28 84 L30 89 L17 96 Z" fill="#120a1c" fillOpacity=".85" />
      </g>
    </svg>
  );
}

function Tinteiro() {
  return (
    <svg viewBox="0 0 170 160" data-adereco="tinteiro">
      <defs>
        <Sombra id="tt-sombra" altura={9} />
        <linearGradient id="tt-vidro" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#3b4c5e" />
          <stop offset=".35" stopColor="#141c26" />
          <stop offset="1" stopColor="#06080c" />
        </linearGradient>
        <radialGradient id="tt-ombro" cx=".4" cy=".6" r=".6">
          <stop offset="0" stopColor="#4a5f74" />
          <stop offset="1" stopColor="#0c1118" />
        </radialGradient>
        <linearGradient id="tt-latao" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#fff0b8" />
          <stop offset=".35" stopColor="#d4a548" />
          <stop offset=".7" stopColor="#7a5216" />
          <stop offset="1" stopColor="#3e2908" />
        </linearGradient>
        <radialGradient id="tt-tinta" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#0b0712" />
          <stop offset=".85" stopColor="#140c24" />
          <stop offset="1" stopColor="#2a1d44" />
        </radialGradient>
      </defs>
      {/* borrão de tinta no pano, ao lado (fora da sombra) */}
      <path d="M118 118 q14 -8 26 2 q8 10 -4 18 q-10 6 -16 -2 q-12 0 -6 -18 Z" fill="#0d0814" fillOpacity=".78" />
      <circle cx="152" cy="108" r="2.6" fill="#0d0814" fillOpacity=".7" />
      <circle cx="146" cy="146" r="1.8" fill="#0d0814" fillOpacity=".7" />
      <g filter="url(#tt-sombra)">
        {/* frasco quadrado de vidro escuro visto de cima, com quinas acesas pela vela */}
        <rect x="18" y="20" width="112" height="112" rx="24" fill="url(#tt-vidro)" />
        <rect x="22" y="24" width="104" height="104" rx="21" fill="none" stroke="#9fb6cc" strokeOpacity=".25" strokeWidth="1.5" />
        <path d="M26 104 Q24 126 46 128" stroke="#e6f2ff" strokeOpacity=".75" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M22 70 L22 92" stroke="#e6f2ff" strokeOpacity=".35" strokeWidth="2" strokeLinecap="round" />
        <circle cx="74" cy="76" r="40" fill="url(#tt-ombro)" />
        <circle cx="74" cy="76" r="27" fill="none" stroke="url(#tt-latao)" strokeWidth="8" />
        <circle cx="74" cy="76" r="31" fill="none" stroke="#2a1c06" strokeOpacity=".6" strokeWidth="1" />
        <circle cx="74" cy="76" r="22.5" fill="url(#tt-tinta)" />
        {/* a chama refletida na tinta */}
        <ellipse cx="66" cy="84" rx="3.2" ry="4.5" transform="rotate(-35 66 84)" fill="#ffe7a6" />
        <ellipse cx="66" cy="84" rx="7" ry="9" transform="rotate(-35 66 84)" fill="#ffb84a" fillOpacity=".18" />
        <path d="M58 96 A24 24 0 0 1 52 82" stroke="#fff" strokeOpacity=".25" strokeWidth="1.5" fill="none" />
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------- moedas

// Moedas com os símbolos nacionais (a lore não descreve moedas; os desenhos saem dos símbolos de cada reino):
// - Táler de Laguardia (prata): na frente, o brasão da bandeira, escudo com o capacete sallet coroado e o anel de
//   losangos; no verso, as zweihänder cruzadas dos mercenários laguardianos e o nome da capital, Schwarzenberg.
// - Ducado de Highbridge (ouro): a Ponte Matriz do antigo império, com torres nas pontas, e a chave do Goldenvault.
// Desenhos em coordenadas de uma moeda de raio 50, escalados. Tudo em currentColor para o relevo: a mesma figura
// é desenhada três vezes (sombra para cima/direita, brilho para baixo/esquerda e a face).

type Face = "laguardia" | "laguardia-verso" | "highbridge";

const LEGENDAS: Record<Face, [string, string]> = {
  laguardia: ["REINO DE LAGVARDIA", "◆ ◆ ◆"],
  "laguardia-verso": ["SCHWARZENBERG", "◆"],
  highbridge: ["GRÃO-DVCADO", "HIGHBRIDGE"],
};

const losango = (raio: number, graus: number, t = 1) => {
  const [x, y] = polar(raio, graus);
  return <path key={graus} d={`M0 ${-3.4 * t} L${2.2 * t} 0 L0 ${3.4 * t} L${-2.2 * t} 0 Z`} transform={`translate(${x} ${y}) rotate(${graus + 90})`} fill="currentColor" />;
};

function Brasao() {
  return (
    <>
      {Array.from({ length: 12 }, (_, i) => losango(29, i * 30 + 15, 0.85))}
      <path d="M-14 -12 H14 V3 C14 13 7 19 0 22 C-7 19 -14 13 -14 3 Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
      {/* coroa sobre o sallet */}
      <path d="M-6 -6.5 V-11 L-3 -8.5 L0 -12.5 L3 -8.5 L6 -11 V-6.5 Z" fill="currentColor" />
      {/* sallet de perfil, virado à direita: cúpula, fenda da viseira e a cauda longa atrás */}
      <path d="M-10 4 C-9 -1 -6.5 -5 0 -5.3 C6 -5.6 9 -1.8 9 2.6 Z" fill="currentColor" />
      <path d="M-10.6 5.6 L9 4.4 L9 9 C5 10.4 0 10.4 -5 9.8 L-13.4 11.4 Z" fill="currentColor" />
    </>
  );
}

function Montantes() {
  const espada = (
    <>
      <path d="M0 -33 L2.4 -28 V7 H-2.4 V-28 Z" fill="currentColor" />
      <path d="M2.4 1 q4.5 0 4.5 -3.5 M-2.4 1 q-4.5 0 -4.5 -3.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M-11 7 H11 V9.6 H-11 Z M-11 7 q-2 1.3 0 2.6 M11 7 q2 1.3 0 2.6" fill="currentColor" stroke="currentColor" strokeWidth=".8" />
      <path d="M-1.5 9.6 H1.5 V21 H-1.5 Z" fill="currentColor" />
      <circle cy="23.5" r="2.8" fill="currentColor" />
    </>
  );
  return (
    <>
      <g transform="rotate(-34)">{espada}</g>
      <g transform="rotate(34)">{espada}</g>
      {[0, 180, 90].map((a) => losango(24, a, 0.9))}
    </>
  );
}

function PonteMatriz() {
  const arcos = [-16, 0, 16].map((c) => `M${c - 6.5} 16 A6.5 6.5 0 0 1 ${c + 6.5} 16 Z`).join(" ");
  const torre = (x: number) =>
    `M${x} -12 H${x + 7} V16 H${x} Z M${x} -12 V-15.5 H${x + 1.8} V-13.6 H${x + 2.6} V-15.5 H${x + 4.4} V-13.6 H${x + 5.2} V-15.5 H${x + 7} V-12 Z M${x + 2.6} -6 h1.8 v4 h-1.8 Z`;
  return (
    <>
      {/* chave do Goldenvault sobre a ponte */}
      <circle cx="-12" cy="-19" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M-8.8 -19 H11 M11 -19 V-15 M7.6 -19 V-16" fill="none" stroke="currentColor" strokeWidth="1.6" />
      {/* tabuleiro com parapeito, três arcos vazados e torres com ameias */}
      <path d="M-25 -1 H25" stroke="currentColor" strokeWidth="1.2" />
      <path d={`M-25 0 H25 V16 H-25 Z ${arcos}`} fill="currentColor" fillRule="evenodd" />
      <path d={`${torre(-32)} ${torre(25)}`} fill="currentColor" fillRule="evenodd" />
      <path d="M-24 21 q3 -2 6 0 t6 0 t6 0 t6 0 t6 0 t6 0 t6 0 t6 0 M-18 25 q3 -2 6 0 t6 0 t6 0 t6 0 t6 0 t6 0" fill="none" stroke="currentColor" strokeWidth=".9" />
    </>
  );
}

const DESENHO: Record<Face, () => React.JSX.Element> = { laguardia: Brasao, "laguardia-verso": Montantes, highbridge: PonteMatriz };

function Moeda({ id, x, y, r, face, giro }: { id: string; x: number; y: number; r: number; face: Face; giro: number }) {
  const cor = face === "highbridge" ? ["#fff1b0", "#e0b44a", "#8a5f12", "#4a3006"] : ["#ffffff", "#c9ccd2", "#7c818b", "#3c3f45"];
  const Desenho = DESENHO[face];
  const [cima, baixo] = LEGENDAS[face];
  const contas = Array.from({ length: 56 }, (_, i) => polar(46.5, i * (360 / 56)));
  const relevo = (cor: string, dx: number, opacidade: number) => <use href={`#${id}-face`} x={dx} y={-dx} color={cor} opacity={opacidade} />;
  return (
    <g transform={`translate(${x} ${y}) scale(${r / 50}) rotate(${giro})`}>
      <defs>
        <radialGradient id={`${id}-metal`} cx=".35" cy=".65" r=".8" gradientTransform={`rotate(${-giro} .5 .5)`}>
          <stop offset="0" stopColor={cor[0]} />
          <stop offset=".45" stopColor={cor[1]} />
          <stop offset=".85" stopColor={cor[2]} />
          <stop offset="1" stopColor={cor[3]} />
        </radialGradient>
        {/* arcos das legendas: o de cima passa de meia-volta para caber o nome inteiro */}
        <path id={`${id}-sup`} d="M-37.5 10.5 A39 39 0 1 1 37.5 10.5" />
        <path id={`${id}-inf`} d="M-30 24 A39 39 0 0 0 30 24" />
        <g id={`${id}-face`}>
          <Desenho />
          <text fontSize="6.8" letterSpacing=".6" fill="currentColor" textAnchor="middle" style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}>
            <textPath href={`#${id}-sup`} startOffset="50%">
              {cima}
            </textPath>
          </text>
          <text fontSize="6.8" letterSpacing=".6" fill="currentColor" textAnchor="middle" dy="5" style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}>
            <textPath href={`#${id}-inf`} startOffset="50%">
              {baixo}
            </textPath>
          </text>
        </g>
      </defs>
      <circle r="50" fill={`url(#${id}-metal)`} />
      <circle r="44" fill="none" stroke={cor[3]} strokeOpacity=".5" strokeWidth="1.2" />
      <circle r="48.6" fill="none" stroke={cor[2]} strokeOpacity=".6" strokeWidth="1" />
      {contas.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="1.1" fill={cor[i % 2 ? 2 : 1]} />
      ))}
      {/* campo fosco e mais escuro; o relevo, polido, pega a luz */}
      <circle r="44" fill={cor[3]} fillOpacity=".3" />
      {relevo(cor[3], 1.6, 0.95)}
      {relevo(cor[0], -1.1, 1)}
      {relevo(cor[1], 0, 1)}
      {/* desgaste: arranhões finos na face */}
      <path d="M-30 18 l14 -5 M8 30 l18 -9 M-22 -26 l9 4" stroke={cor[3]} strokeOpacity=".25" strokeWidth=".5" />
    </g>
  );
}

function Moedas() {
  return (
    <svg viewBox="0 0 210 140" data-adereco="moedas">
      <defs>
        <Sombra id="md-sombra" altura={1.8} />
      </defs>
      <g filter="url(#md-sombra)">
        <Moeda id="md-a" x={46} y={84} r={36} face="laguardia" giro={-8} />
        <Moeda id="md-b" x={172} y={104} r={32} face="laguardia-verso" giro={20} />
        <Moeda id="md-c" x={124} y={50} r={40} face="highbridge" giro={6} />
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------- gaiola de bateria

// Gaiola de bateria (lore: os magos da UP levam animais vivos em pequenas gaiolas de metal como Bateria Vital), com
// um rato branco de olhos vermelhos. De cima, a cúpula vira raios de arame até a argola de pendurar, com anéis
// concêntricos; o rato aparece por entre os arames, sobre a maravalha. A gaiola é alta: sombra longa e rendada.
function Gaiola() {
  const raios = Array.from({ length: 22 }, (_, i) => {
    const [x1, y1] = polar(9, i * (360 / 22));
    const [x2, y2] = polar(63, i * (360 / 22));
    return `M${x1} ${y1} L${x2} ${y2}`;
  }).join(" ");
  // maravalha: lascas curvas espalhadas no chão (determinísticas)
  const lascas = Array.from({ length: 34 }, (_, i) => {
    const [x, y] = polar(14 + ((i * 37) % 44), i * 47);
    const a = (i * 71) % 180;
    return `M${x} ${y} q${n(4 * Math.cos(a))} ${n(4 * Math.sin(a))} ${n(7 * Math.cos(a + 0.6))} ${n(7 * Math.sin(a + 0.6))}`;
  }).join(" ");
  return (
    <svg viewBox="-85 -85 170 170" data-adereco="gaiola">
      <defs>
        <Sombra id="gl-sombra" altura={10} />
        <linearGradient id="gl-latao" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#fbe6a2" />
          <stop offset=".35" stopColor="#c99a3e" />
          <stop offset=".7" stopColor="#7a5216" />
          <stop offset="1" stopColor="#3e2908" />
        </linearGradient>
        <radialGradient id="gl-chao" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#6b4a2a" />
          <stop offset="1" stopColor="#3a2614" />
        </radialGradient>
        <radialGradient id="gl-pelo" cx=".4" cy=".6" r=".6">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset=".7" stopColor="#f1ede6" />
          <stop offset="1" stopColor="#cfc8bc" />
        </radialGradient>
        <radialGradient id="gl-olho" cx=".35" cy=".35" r=".6">
          <stop offset="0" stopColor="#ff8a8a" />
          <stop offset=".45" stopColor="#d1121e" />
          <stop offset="1" stopColor="#5a0008" />
        </radialGradient>
      </defs>
      {/* bandeja: aro de latão e chão com maravalha */}
      <circle r="66" fill="url(#gl-latao)" filter="url(#gl-sombra)" />
      <circle r="61" fill="url(#gl-chao)" />
      <path d={lascas} stroke="#d9b77c" strokeOpacity=".75" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      {/* potinho de água */}
      <circle cx="30" cy="-30" r="9" fill="#cfd3d8" stroke="#6b7078" strokeWidth="1" />
      <circle cx="30" cy="-30" r="6.5" fill="#7fa6c4" fillOpacity=".85" />
      <ellipse cx="27.5" cy="-27.5" rx="2" ry="1.2" fill="#fff" fillOpacity=".8" />
      {/* rato encolhido longe da argola central (senão ela o esconde), cabeça para a esquerda e rabo enrolado */}
      <g transform="translate(-6 30) rotate(-12) scale(1.1)">
        <path d="M14 4 C30 10 40 2 44 -10 C47 -20 40 -28 34 -22" stroke="#e8a3a3" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        <path d="M14 4 C30 10 40 2 44 -10" stroke="#fff" strokeOpacity=".5" strokeWidth=".7" fill="none" transform="translate(-.5 .6)" />
        {/* patas */}
        <ellipse cx="-12" cy="-9" rx="2.4" ry="1.6" fill="#f0b4b4" />
        <ellipse cx="-12" cy="9" rx="2.4" ry="1.6" fill="#f0b4b4" />
        <ellipse cx="9" cy="-11" rx="2.8" ry="1.8" fill="#f0b4b4" />
        <ellipse cx="9" cy="11" rx="2.8" ry="1.8" fill="#f0b4b4" />
        {/* corpo e cabeça */}
        <ellipse cx="2" rx="17" ry="12" fill="url(#gl-pelo)" />
        <path d="M-12 -7 C-20 -6 -27 -3 -30 0 C-27 3 -20 6 -12 7 Z" fill="url(#gl-pelo)" />
        <path d="M-6 -9 q8 -2 18 0 M-4 9 q8 2 16 0 M4 -4 q6 0 10 1" stroke="#d9d2c6" strokeWidth=".8" fill="none" />
        {/* orelhas, focinho, bigodes e os olhos vermelhos */}
        <circle cx="-15" cy="-8.5" r="4.4" fill="#f7c6c6" stroke="#e8d9d0" strokeWidth="1" />
        <circle cx="-15" cy="8.5" r="4.4" fill="#f7c6c6" stroke="#e8d9d0" strokeWidth="1" />
        <circle cx="-30.5" r="1.6" fill="#ee8f9a" />
        <path d="M-27 -1.5 l-7 -5 M-27 -1 l-8 -1 M-27 1.5 l-7 5 M-27 1 l-8 1" stroke="#fff" strokeOpacity=".8" strokeWidth=".4" />
        <circle cx="-21.5" cy="-4" r="1.8" fill="url(#gl-olho)" />
        <circle cx="-21.5" cy="4" r="1.8" fill="url(#gl-olho)" />
        <circle cx="-22.1" cy="-4.6" r=".5" fill="#fff" />
        <circle cx="-22.1" cy="3.4" r=".5" fill="#fff" />
      </g>
      {/* arames da cúpula, anéis, portinhola e argola de pendurar; brilho do lado da vela */}
      <g filter="url(#gl-sombra)">
        <path d={raios} stroke="url(#gl-latao)" strokeWidth="1.1" />
        {[22, 40, 56].map((r) => (
          <circle key={r} r={r} fill="none" stroke="url(#gl-latao)" strokeWidth={r === 56 ? 2.6 : 1.5} />
        ))}
        <path d="M-58 -10 h-6 v20 h6" fill="none" stroke="url(#gl-latao)" strokeWidth="2.2" />
        <circle r="9" fill="none" stroke="url(#gl-latao)" strokeWidth="3.4" />
        <circle r="5" fill="none" stroke="url(#gl-latao)" strokeWidth="2.6" />
        <path d="M-40 28 A49 49 0 0 1 -48 10" stroke="#fff6d0" strokeOpacity=".8" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        <path d="M-6 6 A8 8 0 0 1 -8 1" stroke="#fff6d0" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------- exportação

export const DESENHOS = { "vela-prato": VelaPrato, lente: Lente, cristais: Cristais, pena: Pena, tinteiro: Tinteiro, moedas: Moedas, gaiola: Gaiola };
