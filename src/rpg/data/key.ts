const scene = {
  boot: "boot",
  main: "main",
} as const;

const tilemap = {
  town: "town",
} as const;

const tileset = {
  victorianMansion: {
    name: "victorian-mansion",
    image: "victorian-mansion",
    extruded: false,
  },
  victorianStreets: {
    name: "victorian-streets",
    image: "victorian-streets",
    extruded: false,
  },
  victorianGarden: {
    name: "victorian-garden",
    image: "victorian-garden",
    extruded: false,
  },
  victorianMarket: {
    name: "victorian-market",
    image: "victorian-market",
    extruded: false,
  },
  victorianWindowsDoors: {
    name: "victorian-windows-doors",
    image: "victorian-windows-doors",
    extruded: false,
  },
  victorianAccessories: {
    name: "victorian-accessories",
    image: "victorian-accessories",
    extruded: false,
  },
  victorianTenement: {
    name: "victorian-tenement",
    image: "victorian-tenement",
    extruded: false,
  },
  roofs: {
    name: "roofs",
    image: "roofs",
    extruded: false,
  },
  terrain: {
    name: "terrain",
    image: "terrain-extruded",
    extruded: true,
  },
  treesGreen: {
    name: "trees-green",
    image: "trees-green",
    extruded: false,
  },
} as const;

export const key = {
  scene,
  tileset,
  tilemap,
} as const;
