import { Textures, Scene } from "phaser";

import { key } from "../data";
import characters from "rpg/data/characters";

export default class Boot extends Phaser.Scene {
  constructor() {
    super(key.scene.boot);
  }

  preload() {
    this.load.spritesheet(
      characters.detective.sprite,
      "assets/sprites/detective.png",
      {
        frameWidth: 64,
        frameHeight: 64,
        startFrame: 104,
        endFrame: 155,
      },
    );

    for (const [character, value] of Object.entries(characters)) {
      if (character !== "detective") {
        this.load.spritesheet(
          value.sprite,
          `assets/sprites/${value.sprite}.png`,
          {
            frameWidth: 64,
            frameHeight: 64,
          },
        );
      }
    }

    this.load.tilemapTiledJSON(
      key.tilemap.tuxemon,
      "assets/tilemaps/tuxemon-town.json",
    );

    for (const tileset of Object.values(key.tileset)) {
      this.load.image(tileset, `assets/tilesets/${tileset}.png`);
    }

    this.load.tilemapTiledJSON(
      key.tilemap.town,
      "assets/tilemaps/grontown_embedded.json",
    );
  }

  create() {
    this.scene.start(key.scene.main);
  }
}
