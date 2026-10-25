import type { Metadata } from "next";
import localFont from "next/font/local";
import { SoundToggle } from "@/components/ui/SoundToggle";
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

export const metadata: Metadata = {
  title: "Criador de Personagem — Athanor",
  description: "Criador de personagem para o cenário Athanor",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${notoSans.variable} h-full antialiased`}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeCss() }} />
      </head>
      <body className="min-h-full flex flex-col">
        <header className="border-b border-border bg-surface/90">
          <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-2">
            <p className="font-bold tracking-wide">Athanor · Criador de personagem</p>
            <SoundToggle />
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
