// Só imagens da seção "Copiadas" de public/athanor/MANIFEST.md.
export type ImageEntry = { src: string; displayName: string };

export const IMAGES = {
  "factions/up-mago-alto": { src: "/athanor/factions/up-mago-alto.jpg", displayName: "Alto mago ortodoxo da UP" },
  "factions/laguardia-mago": { src: "/athanor/factions/laguardia-mago.jpg", displayName: "Mago ortodoxo de Laguardia" },
  "factions/up-soldado-regular": { src: "/athanor/factions/up-soldado-regular.png", displayName: "Soldado regular da UP" },
  "factions/midland-cavaleiro": { src: "/athanor/factions/midland-cavaleiro.jpg", displayName: "Cavaleiro de Midland" },
  "factions/sunfield-cavaleiro": { src: "/athanor/factions/sunfield-cavaleiro.jpg", displayName: "Cavaleiro de Sunfield" },
  "factions/up-tropa": { src: "/athanor/factions/up-tropa.jpg", displayName: "Infantaria da UP" },
  "factions/up-exercito": { src: "/athanor/factions/up-exercito.jpg", displayName: "Exército da UP" },
  "factions/up-bandeira": { src: "/athanor/factions/up-bandeira.png", displayName: "Bandeira da UP" },
  "factions/laguardia-soldados": { src: "/athanor/factions/laguardia-soldados.jpg", displayName: "Soldados de Laguardia" },
  "species/homens-galho-principe": { src: "/athanor/species/homens-galho-principe.jpg", displayName: "Príncipe do Reino Fronteiriço" },
  "species/homens-do-deserto": { src: "/athanor/species/homens-do-deserto.png", displayName: "Homem do Deserto" },
  "species/vampiros": { src: "/athanor/species/vampiros.png", displayName: "Vampiro fugitivo" },
  "regions/oakhaven-habitante": { src: "/athanor/regions/oakhaven-habitante.png", displayName: "Habitante de Oakhaven" },
  "regions/mannaka-oko-guerreiro": { src: "/athanor/regions/mannaka-oko-guerreiro.png", displayName: "Guerreiro de Man'naka oko" },
  "regions/vargarf-guerreiro": { src: "/athanor/regions/vargarf-guerreiro.png", displayName: "Guerreiro de Vargarf" },
  "regions/morrow-habitante": { src: "/athanor/regions/morrow-habitante.png", displayName: "Habitante de Morrow" },
  "regions/crick-criatura": { src: "/athanor/regions/crick-criatura.png", displayName: "Criatura de Crick" },
  "regions/highbridge-arcos": { src: "/athanor/regions/highbridge-arcos.jpg", displayName: "Arcos de Highbridge" },
  "regions/laguardia-quartel": { src: "/athanor/regions/laguardia-quartel.jpg", displayName: "Quartel de Laguardia" },
  "misc/batalha-warsaw": { src: "/athanor/misc/batalha-warsaw.jpg", displayName: "Batalha por Warsaw" },
  "misc/dojo-deserto": { src: "/athanor/misc/dojo-deserto.jpg", displayName: "Dojo do deserto" },
} as const satisfies Record<string, ImageEntry>;
