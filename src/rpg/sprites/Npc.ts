import Phaser from "phaser";
import Topics from "rpg/data/topics";

export class Npc extends Phaser.Physics.Arcade.Sprite {
  eastworldId: string | null;
  interactTopic: Topics;

  constructor(
    eastworldId: string | null,
    interactTopic: Topics,
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame = 0,
  ) {
    super(scene, x, y, texture, frame);
    if (interactTopic === Topics.enterChat && !eastworldId) {
      throw new Error("Chat NPC must have an eastworldId");
    }
    this.eastworldId = eastworldId;
    this.interactTopic = interactTopic;
    this.scene = scene;
    this.scene.physics.add.existing(this);
    this.scene.add.existing(this);

    this.setDepth(1);
    this.setImmovable(true);

    // The image has a bit of whitespace so use setOffset
    this.setSize(32, 24).setOffset(16, 14);
  }
}
