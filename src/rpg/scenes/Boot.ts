import { Textures, Scene } from "phaser";

import { key } from "../data";

export default class Boot extends Phaser.Scene {
  constructor() {
    super(key.scene.boot);
  }

  preload() {
    this.load.spritesheet(key.image.spaceman, "assets/sprites/spaceman.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet(key.image.detective, "assets/sprites/detective.png", {
      frameWidth: 64,
      frameHeight: 64,
      startFrame: 104,
      endFrame: 155,
    });

    this.load.image(
      key.image.tuxemon,
      "assets/tilesets/tuxemon-sample-32px-extruded.png",
    );
    this.load.tilemapTiledJSON(
      key.tilemap.tuxemon,
      "assets/tilemaps/tuxemon-town.json",
    );
    this.load.atlas(
      key.atlas.player,
      "assets/atlas/atlas.png",
      "assets/atlas/atlas.json",
    );
  }

  create() {
    this.scene.start(key.scene.main);
  }
}
