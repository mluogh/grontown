import Phaser from "phaser";

import { key } from "../data";
import { Player } from "../sprites";
import { isProduction } from "env";
import { Npc } from "rpg/sprites/Npc";
import Topics from "rpg/data/topics";
import characters from "rpg/data/characters";
import evidence from "rpg/data/evidence";
import { Evidence } from "rpg/sprites/Evidence";
import { getGameState } from "rpg/data/persistence";

export default class Main extends Phaser.Scene {
  private player!: Player;
  private npcs: Npc[] = [];
  private evidences: Evidence[] = [];

  constructor() {
    super(key.scene.main);
  }

  create() {
    const { map, collisionGroup } = this.createMap();
    this.createInteractables(map, collisionGroup);

    this.player.setUpSensingNpcs(this.npcs);
    this.player.setUpSensingEvidence(this.evidences);
    this.player.setUpEvents(map);

    this.setupPubSub();

    this.renderDebug();
  }

  private createMap(): {
    map: Phaser.Tilemaps.Tilemap;
    collisionGroup: Phaser.Physics.Arcade.StaticGroup;
  } {
    const map = this.make.tilemap({ key: key.tilemap.town });
    const tilesets = [];

    for (const [, value] of Object.entries(key.tileset)) {
      if (value.extruded) {
        tilesets.push(
          map.addTilesetImage(
            value.name,
            value.image,
            map.tileWidth,
            map.tileHeight,
            1,
            2,
          )!,
        );
      } else {
        tilesets.push(map.addTilesetImage(value.name, value.image)!);
      }
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

    this.physics.world.bounds.width = worldLayer.width;
    this.physics.world.bounds.height = worldLayer.height;
    // Set the bounds of the camera
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    return { map, collisionGroup };
  }

  private createInteractables(
    map: Phaser.Tilemaps.Tilemap,
    collisionGroup: Phaser.Physics.Arcade.StaticGroup,
  ) {
    const spawnPoint = map.findObject(
      "Misc",
      object => object.name === "Spawn Point",
    )!;
    this.player = new Player(this, spawnPoint.x!, spawnPoint.y!);

    for (const [characterName, characterDef] of Object.entries(characters)) {
      if (characterName === "detective") {
        continue;
      }
      if (getGameState().goneNpcs.has(characterName)) {
        continue;
      }
      const characterSpawnPoint = map.findObject(
        "Misc",
        object => object.name === characterName,
      )!;

      const npc = new Npc(
        characterDef,
        this,
        characterSpawnPoint.x!,
        characterSpawnPoint.y!,
      );

      if (getGameState().nonInteractableNpcs.has(characterName)) {
        npc.canInteract = false;
      }

      this.npcs.push(npc);
      collisionGroup.add(npc);
      npc.collider = this.physics.add.collider(
        this.player,
        this.npcs[this.npcs.length - 1],
      );
    }

    for (const [evidence_piece, value] of Object.entries(evidence)) {
      const evidenceSpawnPoint = map.findObject(
        "Misc",
        object => object.name === evidence_piece,
      )!;

      this.evidences.push(
        new Evidence(
          evidence_piece,
          this,
          evidenceSpawnPoint.x!,
          evidenceSpawnPoint.y!,
          value.sprite,
        ),
      );
    }

    // Watch the player and worldLayer for collisions
    this.physics.add.collider(this.player, collisionGroup);
  }

  private setupPubSub() {
    PubSub.subscribe(Topics.giveKeysToDom, () => {
      if (this.input.keyboard) {
        this.input.keyboard.enabled = false;
        this.input.keyboard.disableGlobalCapture();
      }
    });
    PubSub.subscribe(Topics.giveKeysToGame, () => {
      if (this.input.keyboard) {
        this.input.keyboard.enabled = true;
        this.input.keyboard.enableGlobalCapture();
      }
    });
  }

  /**
   * Debug graphics.
   *
   * @param tilemapLayer - Tilemap layer.
   */
  private renderDebug() {
    if (isProduction) {
      return;
    }
    this.physics.world.debugGraphic.visible = false;
    this.input.keyboard!.on("keydown-G", () => {
      this.physics.world.debugGraphic.visible =
        !this.physics.world.debugGraphic.visible;
    });
  }

  update() {
    this.player.update();
  }
}
