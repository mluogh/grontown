import Phaser from 'phaser';

import { key } from '../data';

enum Animation {
  Left = 'Left',
  Right = 'Right',
  Up = 'Up',
  Down = 'Down',
}

const Velocity = {
  Horizontal: 175,
  Vertical: 175,
} as const;

export default class Player extends Phaser.Physics.Arcade.Sprite {
  body!: Phaser.Physics.Arcade.Body;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture = key.atlas.player,
    frame = 'misa-front',
  ) {
    super(scene, x, y, texture, frame);

    // Add the sprite to the scene
    scene.add.existing(this);

    // Enable physics for the sprite
    scene.physics.world.enable(this);

    // The image has a bit of whitespace so use setSize and
    // setOffset to control the size of the player's body
    this.setSize(32, 42).setOffset(0, 22);

    // Collide the sprite body with the world boundary
    this.setCollideWorldBounds(true);

    // Set the camera to follow the game object
    scene.cameras.main.startFollow(this);
    scene.cameras.main.setZoom(1);

    // Add cursor keys
    this.cursors = scene.input.keyboard!.createCursorKeys();

    // Create sprite animations
    this.createAnimations();
  }

  private createAnimations() {
    // Create left animation
    this.anims.create({
      key: Animation.Left,
      frames: this.anims.generateFrameNames(key.atlas.player, {
        prefix: 'misa-left-walk.',
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });

    // Create right animation
    this.anims.create({
      key: Animation.Right,
      frames: this.anims.generateFrameNames(key.atlas.player, {
        prefix: 'misa-right-walk.',
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });

    // Create up animation
    this.anims.create({
      key: Animation.Up,
      frames: this.anims.generateFrameNames(key.atlas.player, {
        prefix: 'misa-back-walk.',
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });

    // Create down animation
    this.anims.create({
      key: Animation.Down,
      frames: this.anims.generateFrameNames(key.atlas.player, {
        prefix: 'misa-front-walk.',
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
  }

  update() {
    const prevVelocity = this.body.velocity.clone();

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

    // Normalize and scale the velocity so that player can't move faster along a diagonal
    this.body.velocity.normalize().scale(Velocity.Horizontal);

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
        this.anims.stop();

        // If we were moving, pick an idle frame to use
        switch (true) {
          case prevVelocity.x < 0:
            this.setTexture(key.atlas.player, 'misa-left');
            break;
          case prevVelocity.x > 0:
            this.setTexture(key.atlas.player, 'misa-right');
            break;
          case prevVelocity.y < 0:
            this.setTexture(key.atlas.player, 'misa-back');
            break;
          case prevVelocity.y > 0:
            this.setTexture(key.atlas.player, 'misa-front');
            break;
        }
    }
  }
}
