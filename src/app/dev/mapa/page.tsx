import { notFound } from "next/navigation";
import { CalibrarMapa } from "./CalibrarMapa";

// Só em desenvolvimento: o autor posiciona os pinos do minimapa e copia o novo src/data/mapa.ts.
export default function MapaDev() {
  if (process.env.NODE_ENV === "production") notFound();
  return <CalibrarMapa />;
}
