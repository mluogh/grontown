import Phaser from "phaser";

import { Npc } from "./Npc";
import { Evidence } from "./Evidence"
import PubSub from "pubsub-js";
import topics from "rpg/data/topics";
import characters from "rpg/data/characters";

enum Animation {
  Left = "Left",
  Right = "Right",
  Up = "Up",
  Down = "Down",
}

const Velocity = {
  Horizontal: 250,
  Vertical: 250,
} as const;

export default class Player extends Phaser.Physics.Arcade.Sprite {
  body!: Phaser.Physics.Arcade.Body;
  sensor: Phaser.Physics.Arcade.Sprite;
  // An NPC that is close enough to speak to.
  closeNpc: Npc | null = null;
  closeEvidence: Evidence | null = null;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  interactText: Phaser.GameObjects.Text;

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

    // Create sprite animations
    this.createAnimations();

    this.play(Animation.Right);

    this.interactText = this.scene.add.text(0, 0, "[Space]", {
      align: "center",
      fontSize: "16px",
    });
    this.interactText.setAlpha(0).setDepth(100);
  }

  public setUpSensingNpcs(npcs: Npc[]) {
    for (const npc of npcs) {
      this.scene.physics.add.collider(this.sensor, npc, (player, object) => {
        const npc = object as Npc;
        if (this.closeNpc !== npc) {
          this.closeNpc = npc as Npc;
          this.interactText.setAlpha(1);
          this.interactText.setPosition(
            npc.x - npc.width / 2,
            npc.y - npc.height / 2 - 10,
          );
        }
        this.closeNpc = npc as Npc;
      });
    }
  }

  public setUpSensingEvidence(evidences: Evidence[]) {
    for (const evidence of evidences) {
      this.scene.physics.add.collider(this.sensor, evidence, (player, object) => {
        const evidence = object as Evidence;
        if (this.closeEvidence !== evidence) {
          this.closeEvidence = evidence as Evidence;
        }
        this.closeEvidence = evidence as Evidence;
      });
    }
  }

  private createAnimation(animationKey: Animation, row: number) {
    this.anims.create({
      key: animationKey,
      frames: this.anims.generateFrameNumbers(characters.detective.sprite, {
        // 13 is hardcoded from LPC spritesheets
        start: 13 * row,
        end: 13 * row + 8,
      }),
      frameRate: 16,
      repeat: -1,
    });
  }
  private createAnimations() {
    // row to directionmap hardcoded from LPC spritesheets
    this.createAnimation(Animation.Up, 0);
    this.createAnimation(Animation.Left, 1);
    this.createAnimation(Animation.Down, 2);
    this.createAnimation(Animation.Right, 3);
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
      this.closeNpc = null;
      this.interactText.setAlpha(0);
    }
    if (this.cursors.space.isDown && this.closeNpc) {
      PubSub.publish(topics.enterChat, this.closeNpc.eastworldId);
      PubSub.publish(topics.giveKeysToDom, this.closeNpc.eastworldId);
      // This needs to be reset or isDown gets stuck when we disable keyboard input later on
      this.cursors.space.reset();
    }

    if (this.cursors.space.isDown && this.closeEvidence) {
      PubSub.publish(topics.enterEvidenceModal, this.closeEvidence.evidence_name);
      PubSub.publish(topics.giveKeysToDom);
      // This needs to be reset or isDown gets stuck when we disable keyboard input later on
      this.cursors.space.reset();
    }

    // Horizontal movement
    switch (true) {
      case this.cursors.left.isDown:
        this.body.setVelocityX(-Velocity.Horizontal);
        break;

      case this.cursors.right.isDown:
        this.body.setVelocityX(Velocity.Horizontal);
        break;
    }

    // Vertical movement
    switch (true) {
      case this.cursors.up.isDown:
        this.body.setVelocityY(-Velocity.Vertical);
        break;

      case this.cursors.down.isDown:
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
      case this.cursors.left.isDown:
        this.anims.play(Animation.Left, true);
        break;

      case this.cursors.right.isDown:
        this.anims.play(Animation.Right, true);
        break;

      case this.cursors.up.isDown:
        this.anims.play(Animation.Up, true);
        break;

      case this.cursors.down.isDown:
        this.anims.play(Animation.Down, true);
        break;

      default:
        const frame = this.anims.currentAnim?.frames[0].frame;
        this.anims.stop();

        this.setFrame(frame!);
    }
  }
}
