import Phaser from "phaser";

import { Npc } from "./Npc";
import { Evidence } from "./Evidence";
import PubSub from "pubsub-js";
import topics from "rpg/data/topics";
import characters from "rpg/data/characters";
import Topics from "rpg/data/topics";
import { GameResult, ResultScreenProps } from "components/ResultScreen";

enum Animation {
  Left = "Left",
  Right = "Right",
  Up = "Up",
  Down = "Down",
  Fall = "Fall",
}

const Velocity = {
  Horizontal: 250,
  Vertical: 250,
} as const;

type WASD = {
  WKey: Phaser.Input.Keyboard.Key;
  AKey: Phaser.Input.Keyboard.Key;
  SKey: Phaser.Input.Keyboard.Key;
  DKey: Phaser.Input.Keyboard.Key;
};

export default class Player extends Phaser.Physics.Arcade.Sprite {
  body!: Phaser.Physics.Arcade.Body;
  sensor: Phaser.Physics.Arcade.Sprite;
  // An NPC that is close enough to speak to.
  closeNpc: Npc | null = null;
  closeEvidence: Evidence | null = null;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  WASDKeys: WASD;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture = characters.detective.sprite,
    frame = 0,
  ) {
    super(scene, x, y, texture, frame);
    this.setDepth(2);

    // Add the sprite to the scene
    scene.add.existing(this);

    // Enable physics for the sprite
    scene.physics.world.enable(this);

    // The image has a bit of whitespace so use setSize and
    // setOffset to control the size of the player's body
    this.setSize(32, 48).setOffset(16, 14);
    this.sensor = scene.physics.add.sprite(this.x, this.y, "");
    this.sensor.setSize(72, 96);
    this.sensor.setVisible(false);

    // Collide the sprite body with the world boundary
    this.setCollideWorldBounds(true);

    // Set the camera to follow the game object
    scene.cameras.main.startFollow(this);
    scene.cameras.main.setZoom(1);

    // Add cursor keys
    this.cursors = scene.input.keyboard!.createCursorKeys();
    this.WASDKeys = scene.input.keyboard!.addKeys({
      WKey: Phaser.Input.Keyboard.KeyCodes.W,
      AKey: Phaser.Input.Keyboard.KeyCodes.A,
      SKey: Phaser.Input.Keyboard.KeyCodes.S,
      DKey: Phaser.Input.Keyboard.KeyCodes.D,
    }) as WASD;

    // Create sprite animations
    this.createAnimations();

    this.play(Animation.Right);
  }

  public setUpSensingNpcs(npcs: Npc[]) {
    for (const npc of npcs) {
      this.scene.physics.add.overlap(this.sensor, npc, (player, object) => {
        const npc = object as Npc;
        if (this.closeNpc !== npc) {
          this.closeNpc = npc as Npc;
          this.closeNpc.toggleInteractText();
        }
      });
    }
  }

  public setUpSensingEvidence(evidences: Evidence[]) {
    for (const evidence of evidences) {
      this.scene.physics.add.overlap(this, evidence, (_player, object) => {
        const evidence = object as Evidence;
        if (this.closeEvidence !== evidence) {
          this.closeEvidence = evidence as Evidence;
        }
        this.closeEvidence = evidence as Evidence;
      });
    }
  }

  public setUpEvents(map: Phaser.Tilemaps.Tilemap) {
    // Hacky hardcode real quick lol.
    const caning_point = map.findObject(
      "Misc",
      object => object.name === "Caning Teleport",
    )!;
    PubSub.subscribe(
      Topics.action,
      (_channel, data: { character: string; action: string }) => {
        if (data.action === "Cane") {
          this.x = caning_point.x!;
          this.y = caning_point.y!;
          this.setVelocity(0, 0);
          this.anims.play(Animation.Fall);
          if (this.scene.input.keyboard) {
            this.scene.input.keyboard.enabled = false;
          }
          setInterval(() => {
            const result: ResultScreenProps = {
              status: GameResult.DEAD,
            };
            PubSub.publish(Topics.endGame, result);
          }, 3000);
        }
      },
    );
  }

  private createAnimation(
    animationKey: Animation,
    row: number,
    numFrames: number = 9,
    frameRate: number = 16,
    repeat: number = -1,
  ) {
    this.anims.create({
      key: animationKey,
      frames: this.anims.generateFrameNumbers(characters.detective.sprite, {
        // 13 is hardcoded from the spritesheet
        start: row * 9,
        end: row * 9 + numFrames - 1,
      }),
      frameRate,
      repeat,
    });
  }

  private createAnimations() {
    // row to directionmap hardcoded from LPC spritesheets
    this.createAnimation(Animation.Up, 0);
    this.createAnimation(Animation.Left, 1);
    this.createAnimation(Animation.Down, 2);
    this.createAnimation(Animation.Right, 3);
    this.createAnimation(Animation.Fall, 4, 6, 3, 0);
  }

  update() {
    // Stop any previous movement from the last frame
    this.body.setVelocity(0);
    this.sensor.x = this.x;
    this.sensor.y = this.y;

    if (
      !this.closeNpc ||
      !this.scene.physics.overlap(this.sensor, this.closeNpc)
    ) {
      this.closeNpc?.toggleInteractText();
      this.closeNpc = null;
    }
    if (
      !this.closeEvidence ||
      !this.scene.physics.overlap(this, this.closeEvidence)
    ) {
      this.closeEvidence = null;
    }

    if (this.cursors.space.isDown && this.closeNpc?.canInteract) {
      PubSub.publish(
        this.closeNpc.characterDef.interactTopic,
        this.closeNpc.characterDef.eastworldId,
      );
      PubSub.publish(
        topics.giveKeysToDom,
        this.closeNpc.characterDef.eastworldId,
      );
      // This needs to be reset or isDown gets stuck when we disable keyboard input later on
      Object.values(this.cursors).forEach(value => value.reset());
      Object.values(this.WASDKeys).forEach(value => value.reset());
    }

    if (this.cursors.space.isDown && this.closeEvidence) {
      PubSub.publish(
        topics.enterEvidenceModal,
        this.closeEvidence.evidence_name,
      );
      PubSub.publish(topics.giveKeysToDom);
      // This needs to be reset or isDown gets stuck when we disable keyboard input later on
      Object.values(this.cursors).forEach(value => value.reset());
      Object.values(this.WASDKeys).forEach(value => value.reset());
    }

    // Horizontal movement
    switch (true) {
      case this.cursors.left.isDown || this.WASDKeys.AKey.isDown:
        this.body.setVelocityX(-Velocity.Horizontal);
        break;

      case this.cursors.right.isDown || this.WASDKeys.DKey.isDown:
        this.body.setVelocityX(Velocity.Horizontal);
        break;
    }

    // Vertical movement
    switch (true) {
      case this.cursors.up.isDown || this.WASDKeys.WKey.isDown:
        this.body.setVelocityY(-Velocity.Vertical);
        break;

      case this.cursors.down.isDown || this.WASDKeys.SKey.isDown:
        this.body.setVelocityY(Velocity.Vertical);
        break;
    }

    let speed = Velocity.Horizontal;
    if (this.cursors.shift.isDown) {
      speed *= 2;
    }

    // Normalize and scale the velocity so that player can't move faster along a diagonal
    this.body.velocity.normalize().scale(speed);

    // Update the animation last and give left/right animations precedence over up/down animations
    switch (true) {
      case this.cursors.left.isDown || this.WASDKeys.AKey.isDown:
        this.anims.play(Animation.Left, true);
        break;

      case this.cursors.right.isDown || this.WASDKeys.DKey.isDown:
        this.anims.play(Animation.Right, true);
        break;

      case this.cursors.up.isDown || this.WASDKeys.WKey.isDown:
        this.anims.play(Animation.Up, true);
        break;

      case this.cursors.down.isDown || this.WASDKeys.SKey.isDown:
        this.anims.play(Animation.Down, true);
        break;

      default:
        if (this.anims.currentAnim !== this.anims.get(Animation.Fall)) {
          const frame = this.anims.currentAnim?.frames[0].frame;
          this.anims.stop();

          this.setFrame(frame!);
        }
    }
  }
}
