import Phaser from "phaser";

export class Npc extends Phaser.Physics.Arcade.Sprite {
  // private textGameObject: Phaser.GameObjects.Text;
  eastworldId: string;

  constructor(
    eastworldId: string,
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame = 0,
  ) {
    super(scene, x, y, texture, frame);
    this.eastworldId = eastworldId;
    this.scene = scene;
    this.scene.physics.add.existing(this);
    this.scene.add.existing(this);

    this.setDepth(1);
    this.setImmovable(true);

    // The image has a bit of whitespace so use setOffset
    this.setSize(32, 24).setOffset(16, 14);
  }
}
