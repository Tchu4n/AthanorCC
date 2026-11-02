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

export const metadata: Metadata = {
  title: "Criador de Personagem — Athanor",
  description: "Criador de personagem para o cenário Athanor",
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
