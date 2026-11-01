import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { Character } from "@/lib/character";
import { VAZIO } from "@/lib/ficha";
import { personagemCompleto as completo } from "@/lib/ficha.fixtures";
import { initialCharacter } from "@/lib/initialCharacter";
import { FichaPreview } from "./FichaPreview";

// Texto de cada linha da ficha, na ordem: [rótulo, conteúdo].
function rows(character: Character): [string, string][] {
  const html = renderToStaticMarkup(<FichaPreview character={character} />);
  const strip = (s: string) => s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return [...html.matchAll(/<dt[^>]*>(.*?)<\/dt><dd[^>]*>(.*?)<\/dd>/g)].map(([, dt, dd]) => [strip(dt), strip(dd)]);
}

describe("FichaPreview", () => {
  it("personagem vazio mostra — em todos os campos, na ordem da ficha", () => {
    const r = rows(initialCharacter);
    expect(r.map(([label]) => label)).toEqual([
      "Nome", "Sexo", "Idade", "Origem", "Espécie", "Ofício", "Fés", "Marcas", "Aparência", "História curta", "Personalidade",
    ]);
    for (const [, value] of r) expect(value).toBe(VAZIO);
  });

  it("personagem completo mostra todos os campos", () => {
    const r = Object.fromEntries(rows(completo));
    expect(r["Nome"]).toBe("Isabela de Souça");
    expect(r["Idade"]).toBe("34 anos");
    expect(r["Origem"]).toBe("Midland, Aurelia");
    expect(r["Espécie"]).toBe("Humano (Elite de orelhas pontudas)");
    expect(r["Ofício"]).toBe("Mago ortodoxo");
    expect(r["Fés"]).toMatch(/^Umbra É religião oficial da UP.*Activum É religião oficial da UP/);
    expect(r["Fés"]).not.toContain("[[");
    expect(r["Marcas"]).toMatch(/^Terceiro Olho A favor:/);
    expect(r["Aparência"]).toBe("Gola franzida"); // sem o nome da imagem embaixo da foto
    expect(r["História curta"]).toBe("Fugiu da corte.");
    expect(r["Personalidade"]).toBe("Fria e calculista.");
    for (const value of Object.values(r)) expect(value).not.toBe(VAZIO);
  });

  it("exportar exige nome e assinatura, com a dica do que falta", () => {
    const vazio = renderToStaticMarkup(<FichaPreview character={initialCharacter} />);
    expect(vazio).toMatch(/<button[^>]*\sdisabled=""[^>]*>Exportar análise em PDF<\/button>/);
    expect(vazio).toContain("Dê um nome ao personagem para exportar");
    const semAssinatura = renderToStaticMarkup(<FichaPreview character={completo} />);
    expect(semAssinatura).toMatch(/<button[^>]*\sdisabled=""[^>]*>Exportar análise em PDF/);
    expect(semAssinatura).toContain("Assine a análise para exportar");
    const semGrau = renderToStaticMarkup(<FichaPreview character={{ ...completo, periculosidade: null }} />);
    expect(semGrau).toContain("Marque o grau de periculosidade para exportar");
    const semSexo = renderToStaticMarkup(<FichaPreview character={{ ...completo, sexo: null }} />);
    expect(semSexo).toContain("Marque o sexo do indivíduo para exportar");
    const cheio = renderToStaticMarkup(<FichaPreview character={{ ...completo, assinatura: "data:image/png;base64,iVBORw0KGgo=" }} />);
    expect(cheio).not.toMatch(/<button[^>]*\sdisabled=""[^>]*>Exportar análise em PDF/);
  });
});
