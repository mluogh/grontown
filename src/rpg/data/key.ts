const scene = {
  boot: "boot",
  main: "main",
} as const;

const tilemap = {
  town: "town",
} as const;

const tileset = {
  victorianMansion: "victorian-mansion",
  victorianStreets: "victorian-streets",
  victorianGarden: "victorian-garden",
  victorianMarket: "victorian-market",
  victorianWindowsDoors: "victorian-windows-doors",
  victorianAccessories: "victorian-accessories",
  victorianTenement: "victorian-tenement",
  roofs: "roofs",
  terrain: "terrain",
  treesGreen: "trees-green",
} as const;

export const key = {
  scene,
  tileset,
  tilemap,
} as const;
