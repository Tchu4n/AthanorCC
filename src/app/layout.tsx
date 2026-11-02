import type { Metadata } from "next";
import { Cinzel, Grenze_Gotisch } from "next/font/google";
import localFont from "next/font/local";
import { FaviconAnimado } from "@/components/ui/FaviconAnimado";
import { RolarPagina } from "@/components/ui/RolarPagina";
import { themeCss } from "@/styles/theme";
import "./globals.css";

// A mesma Noto Sans do PDF, recortada para o site: só os caracteres latinos, em WOFF2 (~53 KB cada, contra ~515 KB
// do TTF completo). O PDF segue com os TTF de public/fonts. Para regerar: scripts/gerar-fontes-web.sh.
const notoSans = localFont({
  variable: "--font-noto",
  src: [
    { path: "../fonts/NotoSans-Regular-latin.woff2", weight: "400", style: "normal" },
    { path: "../fonts/NotoSans-Italic-latin.woff2", weight: "400", style: "italic" },
    { path: "../fonts/NotoSans-Bold-latin.woff2", weight: "700", style: "normal" },
  ],
});

// Fonte dos títulos do tema de RPG, com cara de inscrição.
const cinzel = Cinzel({ variable: "--font-titulo", subsets: ["latin"], weight: ["600", "700"] });
// Gótica legível dos botões e da tábua do título (só rótulos curtos; o texto corrido segue na Noto Sans).
const gotica = Grenze_Gotisch({ variable: "--font-rotulo", subsets: ["latin"], weight: ["600"] });

const DESCRICAO = "Crie seu personagem no cenário de Athanor: espécie, origem, ofício e fé, com a ficha confidencial da Agência de Highbridge em PDF.";

// Prévia do link (WhatsApp, Discord, X): a imagem vem de app/opengraph-image.jpg (scripts/gerar-imagem-previa.mjs).
// Sem metadataBase: na Vercel, o Next monta a URL absoluta da imagem com o endereço de produção do projeto.
export const metadata: Metadata = {
  title: "Criador de Personagem — Athanor",
  description: DESCRICAO,
  openGraph: { type: "website", locale: "pt_BR", siteName: "Athanor", title: "Criador de Personagem — Athanor", description: DESCRICAO },
  twitter: { card: "summary_large_image", title: "Criador de Personagem — Athanor", description: DESCRICAO },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${notoSans.variable} ${cinzel.variable} ${gotica.variable} h-full antialiased`}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeCss() }} />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <RolarPagina />
        <FaviconAnimado />
      </body>
    </html>
  );
}
