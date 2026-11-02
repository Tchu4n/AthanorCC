import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import PaginaErro from "./error";

describe("página de erro", () => {
  it("fala pt-BR, oferece tentar de novo e voltar, e não mostra a mensagem interna do erro", () => {
    const html = renderToStaticMarkup(<PaginaErro error={new Error("detalhe interno secreto")} retry={() => {}} />);
    for (const t of ["Algo deu errado", "Tentar de novo", "Voltar ao início"]) expect(html).toContain(t);
    expect(html).toContain('href="/criar"');
    expect(html).not.toContain("detalhe interno secreto");
  });
});
