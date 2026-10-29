import { createContext, useContext } from "react";

export type EstadoFiltro = "todas" | "disponiveis" | "indisponiveis";
export type Filtro = { estado: EstadoFiltro; busca: string };
export const SEM_FILTRO: Filtro = { estado: "todas", busca: "" };

// A página fornece o filtro; cada ChoiceCard decide se aparece. As etapas não precisam saber do filtro.
export const FiltroContext = createContext<Filtro>(SEM_FILTRO);

const normalizar = (t: string) => t.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

export function combina({ estado, busca }: Filtro, nome: string, indisponivel: boolean) {
  if (estado === "disponiveis" && indisponivel) return false;
  if (estado === "indisponiveis" && !indisponivel) return false;
  return normalizar(nome).includes(normalizar(busca.trim()));
}

export const useCombina = (nome: string, indisponivel: boolean) => combina(useContext(FiltroContext), nome, indisponivel);

const PILULAS: [EstadoFiltro, string][] = [
  ["todas", "Todas"],
  ["disponiveis", "Disponíveis"],
  ["indisponiveis", "Indisponíveis"],
];

const FOCO = "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue-500";

// Pílulas de disponibilidade, abaixo do título; a página só as mostra quando alguma opção da etapa está indisponível por regra.
export function FilterBar({ filtro, onChange }: { filtro: Filtro; onChange: (f: Filtro) => void }) {
  return (
    <div role="group" aria-label="Filtrar por disponibilidade" className="flex flex-wrap gap-2">
      {PILULAS.map(([estado, rotulo]) => (
        <button
          key={estado}
          type="button"
          aria-pressed={filtro.estado === estado}
          onClick={() => onChange({ ...filtro, estado })}
          className={`min-h-11 rounded-full border border-border px-4 text-sm font-semibold hover:bg-surface aria-pressed:border-accent aria-pressed:bg-accent aria-pressed:text-accent-text ${FOCO}`}
        >
          {rotulo}
        </button>
      ))}
    </div>
  );
}

// Busca por nome, na barra superior.
export function Busca({ filtro, onChange, className = "" }: { filtro: Filtro; onChange: (f: Filtro) => void; className?: string }) {
  return (
    <div className={className}>
      <label htmlFor="busca-opcoes" className="sr-only">
        Buscar por nome
      </label>
      <input
        id="busca-opcoes"
        type="search"
        placeholder="Buscar por nome"
        value={filtro.busca}
        onChange={(e) => onChange({ ...filtro, busca: e.target.value })}
        className={`busca-pergaminho min-h-11 w-full pr-3 pl-9 ${FOCO}`}
      />
    </div>
  );
}
