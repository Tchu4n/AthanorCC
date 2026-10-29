import type { Metadata } from "next";
import { Cinzel } from "next/font/google";
import localFont from "next/font/local";
import { themeCss } from "@/styles/theme";
import "./globals.css";

// A mesma Noto Sans do PDF, servida de public/fonts.
const notoSans = localFont({
  variable: "--font-noto",
  src: [
    { path: "../../public/fonts/NotoSans-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/NotoSans-Italic.ttf", weight: "400", style: "italic" },
    { path: "../../public/fonts/NotoSans-Bold.ttf", weight: "700", style: "normal" },
  ],
});

// Fonte dos títulos do tema de RPG, com cara de inscrição.
const cinzel = Cinzel({ variable: "--font-titulo", subsets: ["latin"], weight: ["600", "700"] });

export const metadata: Metadata = {
  title: "Criador de Personagem — Athanor",
  description: "Criador de personagem para o cenário Athanor",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${notoSans.variable} ${cinzel.variable} h-full antialiased`}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeCss() }} />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
