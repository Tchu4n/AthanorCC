// Adereços sobre a mesa, em volta do pergaminho. Os desenhos ficam em aderecos-desenho.tsx e são exportados como
// imagens para public/aderecos: como <img>, o navegador desenha cada um uma vez (inline, as sombras e os traços eram
// redesenhados a cada rolagem). A chama (animada) e o brilho da vela ficam aqui.
// Só em telas largas: no celular não há mesa em volta do papel, e max-lg:hidden + loading="lazy" evita o download.

function Adereco({ nome, className }: { nome: string; className: string }) {
  // eslint-disable-next-line @next/next/no-img-element -- SVG estático e decorativo; next/image não otimiza SVG
  return <img src={`/aderecos/${nome}.svg`} alt="" loading="lazy" decoding="async" draggable={false} className={`absolute ${className}`} />;
}

// chama vista do alto: aponta para longe de quem lê e tremula a partir do pavio. A animação fica no <div> (HTML):
// assim o navegador só move a camada pronta; animada dentro do SVG, a chama era redesenhada a cada quadro.
// O pavio (0,0 do desenho) cai no centro do prato: a vela tem 11rem para 200 unidades, a chama 50 x 45 unidades.
function Chama() {
  return (
    <div
      className="absolute left-[calc(50%-1.375rem)] top-[calc(50%-1.925rem)] h-[2.475rem] w-[2.75rem] origin-[1.375rem_1.925rem] motion-safe:animate-[chama_1.8s_ease-in-out_infinite]"
    >
      <svg viewBox="-25 -35 50 45" className="size-full overflow-visible">
        <defs>
          <radialGradient id="vl-chama" cx=".5" cy=".7" r=".55">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset=".3" stopColor="#fff3b0" />
            <stop offset=".65" stopColor="#ffb340" />
            <stop offset="1" stopColor="#ff6a00" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="vl-aura" cx=".5" cy=".5" r=".5">
            <stop offset="0" stopColor="#ffd27a" stopOpacity=".9" />
            <stop offset="1" stopColor="#ff9a2e" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cy="-10" rx="20" ry="26" fill="url(#vl-aura)" />
        <path d="M0 -30 C7 -20 9 -10 7 -3 C5 3 -5 3 -7 -3 C-9 -10 -7 -20 0 -30 Z" fill="url(#vl-chama)" />
        <ellipse cy="-6" rx="3" ry="6" fill="#fff" />
        <ellipse cy="1" rx="4.5" ry="2.2" fill="#3d6bd8" fillOpacity=".55" />
      </svg>
    </div>
  );
}

// Olhos do rato na gaiola, em % da imagem: o rato do desenho (translate(-6 30) rotate(-12) scale(1.1), olhos em
// (-21.5, ±4)) leva os olhos a (-30.05, 30.61) e (-28.22, 39.22) num viewBox de 170 unidades começando em -85.
// Se o rato mudar em aderecos-desenho.tsx, refazer a conta.
const OLHOS_DO_RATO = [
  ["32.32%", "68.01%"],
  ["33.40%", "73.07%"],
];

// A gaiola com o rato piscando: as pálpebras são pontinhos de pelo por cima dos olhos, no HTML, que fecham com
// scaleY (só a camada se move; animar dentro da imagem faria a gaiola inteira ser redesenhada a cada quadro).
function Gaiola() {
  return (
    <div className="absolute -right-48 top-[40rem] w-60">
      {/* eslint-disable-next-line @next/next/no-img-element -- SVG estático e decorativo; next/image não otimiza SVG */}
      <img src="/aderecos/gaiola.svg" alt="" loading="lazy" decoding="async" draggable={false} className="w-full" />
      {OLHOS_DO_RATO.map(([x, y]) => (
        <span
          key={y}
          className="absolute size-[2.8%] -translate-x-1/2 -translate-y-1/2 scale-y-0 rounded-full bg-[#ddd7cc] motion-safe:animate-[piscar_4.2s_ease-in-out_infinite]"
          style={{ left: x, top: y }}
        />
      ))}
    </div>
  );
}

// Posições relativas ao pergaminho: na faixa de mesa acima dele e na margem direita, no máximo sobre a margem
// interna do papel (sem cobrir conteúdo). A vela é fixa no canto de baixo à esquerda da tela; a lente fica à direita
// porque as duas se cruzariam ao rolar.
export function Aderecos() {
  return (
    <div aria-hidden className="pointer-events-none max-lg:hidden">
      <Adereco nome="pena" className="-top-28 left-[4%] w-[22rem] -rotate-3" />
      <Adereco nome="tinteiro" className="-top-28 left-[34%] w-32" />
      <Adereco nome="moedas" className="-top-28 left-[50%] w-56" />
      <Adereco nome="cristais" className="-top-28 right-[4%] w-72" />
      <Adereco nome="lente" className="-right-24 top-[24rem] w-40 rotate-12" />
      <Gaiola />
      <div className="fixed bottom-24 -left-12 z-10 size-44">
        {/* luz da chama sobre a mesa e a borda do papel. Parada: animada, até só na opacidade, ela era recomposta a
            cada quadro (0,6 núcleo de CPU sem placa de vídeo); a chama tremulando já dá vida. Transparência comum:
            o fixed isola a camada, então mix-blend não alcançaria a página. */}
        <div
          className="absolute left-1/2 top-1/2 size-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, rgb(255 205 130 / 0.55), rgb(255 170 80 / 0.28) 22%, rgb(255 150 60 / 0.12) 40%, transparent 62%)" }}
        />
        <Adereco nome="vela-prato" className="inset-0 size-full" />
        <Chama />
      </div>
    </div>
  );
}
