import Phaser from "phaser";

import { key } from "../data";

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
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture = key.image.detective,
    frame = 0,
  ) {
    super(scene, x, y, texture, frame);

    // Add the sprite to the scene
    scene.add.existing(this);

    // Enable physics for the sprite
    scene.physics.world.enable(this);

    // The image has a bit of whitespace so use setSize and
    // setOffset to control the size of the player's body
    this.setSize(32, 48).setOffset(16, 14);

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
  }

  private createAnimation(animationKey: Animation, row: number) {
    this.anims.create({
      key: animationKey,
      frames: this.anims.generateFrameNumbers(key.image.detective, {
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
