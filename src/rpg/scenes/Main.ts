import Phaser from 'phaser';

import { key } from '../data';
import { Player } from '../sprites';
import { isProduction } from '../utils';

export default class Main extends Phaser.Scene {
  private player!: Player;
  private isDebug = false;

  constructor() {
    super(key.scene.main);
  }

  create() {
    const map = this.make.tilemap({ key: key.tilemap.tuxemon });

    // Parameters are the name you gave the tileset in Tiled and
    // the key of the tileset image in Phaser's cache (name used in preload)
    const tileset = map.addTilesetImage(
      'tuxemon-sample-32px-extruded',
      key.image.tuxemon,
    )!;

    // Parameters: layer name (or index) from Tiled, tileset, x, y
    map.createLayer('Below Player', tileset, 0, 0);
    const worldLayer = map.createLayer('World', tileset, 0, 0)!;
    const aboveLayer = map.createLayer('Above Player', tileset, 0, 0)!;

    worldLayer.setCollisionByProperty({ collides: true });
    this.physics.world.bounds.width = worldLayer.width;
    this.physics.world.bounds.height = worldLayer.height;

    // By default, everything gets depth sorted on the screen in the order we created things.
    // We want the "Above Player" layer to sit on top of the player, so we explicitly give it a depth.
    // Higher depths will sit on top of lower depth objects.
    aboveLayer.setDepth(10);

    // Object layers in Tiled let you embed extra info into a map like a spawn point or custom collision shapes.
    // In the tmx file, there's an object layer with a point named 'Spawn Point'.
    const spawnPoint = map.findObject(
      'Objects',
      (object) => object.name === 'Spawn Point',
    )!;

    this.player = new Player(this, spawnPoint.x || 0, spawnPoint.y || 0);

    // Watch the player and worldLayer for collisions
    this.physics.add.collider(this.player, worldLayer);

    // Set the bounds of the camera
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.renderDebug(worldLayer);
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

    this.input.keyboard!.on('keydown-D', () => {
      this.isDebug = !this.isDebug;
      graphics.setAlpha(this.isDebug ? 0.75 : 0);
    });
  }

  update() {
    this.player.update();
  }
}
