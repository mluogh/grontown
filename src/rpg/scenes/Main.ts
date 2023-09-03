import Phaser from "phaser";

import { key } from "../data";
import { Player } from "../sprites";
import { isProduction } from "../utils";

export default class Main extends Phaser.Scene {
  private player!: Player;
  private isDebug = false;

  constructor() {
    super(key.scene.main);
  }

  create() {
    const map = this.make.tilemap({ key: key.tilemap.town });

    // // Parameters are the name you gave the tileset in Tiled and
    // // the key of the tileset image in Phaser's cache (name used in preload)
    // const tileset = map.addTilesetImage(
    //   "tuxemon-sample-32px-extruded",
    //   key.image.tuxemon,
    // )!;

    // // Parameters: layer name (or index) from Tiled, tileset, x, y
    // map.createLayer("Below Player", tileset, 0, 0);
    // const worldLayer = map.createLayer("World", tileset, 0, 0)!;
    // const aboveLayer = map.createLayer("Above Player", tileset, 0, 0)!;

    const tilesets = [];

    for (const tileset of Object.values(key.tileset)) {
      tilesets.push(map.addTilesetImage(tileset, tileset)!);
    }

    // Man, I didn't know I would have to do this for every layer...
    const worldLayer = map.createLayer("Ground Level", tilesets)!;
    map.createLayer("Shadows", tilesets)!;
    map.createLayer("Ground Gradient", tilesets)!;
    map.createLayer("Exterior Base", tilesets)!;
    map.createLayer("Exterior 1", tilesets)!;
    map.createLayer("Exterior 2", tilesets)!;
    map.createLayer("Exterior Decor", tilesets)!;
    map.createLayer("Exterior Decor 2", tilesets)!;
    map.createLayer("Garden", tilesets)!;

    const objects = map.getObjectLayer("Collision")!["objects"];
    const collisionGroup = this.physics.add.staticGroup();

    objects.forEach(object => {
      console.log(object);
      collisionGroup
        .create(
          object.x! + object.width! / 2,
          object.y! + object.height! / 2,
          undefined,
        )
        .setSize(object.width, object.height)
        .setVisible(false)
        .setActive(true)
        .setImmovable(true);
    });
    // const collisionLayer = map.createFromObjects("Collision", tilesets)!;

    // collisionLayer.setCollisionByProperty({ collides: true });
    this.physics.world.bounds.width = worldLayer.width;
    this.physics.world.bounds.height = worldLayer.height;

    // By default, everything gets depth sorted on the screen in the order we created things.
    // We want the "Above Player" layer to sit on top of the player, so we explicitly give it a depth.
    // Higher depths will sit on top of lower depth objects.
    // aboveLayer.setDepth(10);

    // Object layers in Tiled let you embed extra info into a map like a spawn point or custom collision shapes.
    // In the tmx file, there's an object layer with a point named 'Spawn Point'.
    const spawnPoint = map.findObject(
      "Misc",
      object => object.name === "Spawn Point",
    )!;

    this.player = new Player(this, spawnPoint.x!, spawnPoint.y!);

    // Watch the player and worldLayer for collisions
    this.physics.add.collider(this.player, collisionGroup);

    // Set the bounds of the camera
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // this.renderDebug(collisionGroup);
  }

  /**
   * Debug graphics.
   *
   * @param tilemapLayer - Tilemap layer.
   */
  private renderDebug(tilemapLayer: Phaser.Tilemaps.TilemapLayer) {
    if (isProduction) {
      return;
    }

    const graphics = this.add.graphics().setAlpha(0).setDepth(20);

    // Create worldLayer collision graphic above the player, but below the help text
    tilemapLayer.renderDebug(graphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
    });

    this.input.keyboard!.on("keydown-D", () => {
      this.isDebug = !this.isDebug;
      graphics.setAlpha(this.isDebug ? 0.75 : 0);
    });
  }

  update() {
    this.player.update();
  }
}
