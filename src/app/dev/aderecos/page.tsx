import { notFound } from "next/navigation";
import { DESENHOS } from "@/components/ui/aderecos-desenho";

// Só em desenvolvimento: mostra os desenhos dos adereços para scripts/exportar-aderecos.mjs gravar em public/aderecos.
export default function AderecosDev() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <main className="grid grid-cols-3 gap-6 bg-[#5a1a22] p-6">
      {Object.entries(DESENHOS).map(([nome, Desenho]) => (
        <figure key={nome} className="space-y-2">
          <Desenho />
          <figcaption className="text-sm text-white">{nome}</figcaption>
        </figure>
      ))}
    </main>
  );
}
