import Phaser from "phaser";

export class Evidence extends Phaser.Physics.Arcade.Sprite {
  // private textGameObject: Phaser.GameObjects.Text;
  evidence_name: string;

  constructor(
    evidence_name: string,
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame = 0,
  ) {
    super(scene, x, y, texture, frame);
    this.evidence_name = evidence_name;
    this.scene = scene;
    this.scene.physics.add.existing(this);
    this.scene.add.existing(this);

    this.setDepth(1);
    this.setImmovable(true);

    // The image has a bit of whitespace so use setOffset
    const width = this.texture.getSourceImage().width;
    const height = this.texture.getSourceImage().height;
    this.setSize(width, height);
  }
}
