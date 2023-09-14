import Phaser from "phaser";
import { Character } from "rpg/data/characters";
import Topics from "rpg/data/topics";

export class Npc extends Phaser.Physics.Arcade.Sprite {
  characterDef: Character;
  interactText: Phaser.GameObjects.Text;
  collider: Phaser.Physics.Arcade.Collider | undefined;
  canInteract: boolean = true;

  constructor(
    characterDef: Character,
    scene: Phaser.Scene,
    x: number,
    y: number,
    frame = 0,
  ) {
    super(scene, x, y, characterDef.sprite, frame);
    if (
      characterDef.interactTopic === Topics.enterChat &&
      !characterDef.eastworldId
    ) {
      throw new Error("Chat NPC must have an eastworldId");
    }
    this.characterDef = characterDef;
    this.scene = scene;
    this.scene.physics.add.existing(this);
    this.scene.add.existing(this);

    this.setDepth(1);
    this.setImmovable(true);

    // The image has a bit of whitespace so use setOffset
    this.setSize(32, 24).setOffset(16, 14);

    this.interactText = this.scene.add.text(
      this.x - this.width / 2,
      this.y - this.height / 2 - 10,
      "[Space]",
      {
        align: "center",
        fontSize: "16px",
      },
    );
    this.interactText.setAlpha(0).setDepth(100);

    this.createAnimations();

    PubSub.subscribe(
      Topics.action,
      (_channel, data: { character: string; action: string }) => {
        if (data.character === this.characterDef.eastworldId) {
          this.actionCompletion(data.action);
        }
      },
    );
  }

  private createAnimations() {
    for (const action of this.characterDef.actions) {
      this.anims.create({
        key: action.name,
        frames: this.anims.generateFrameNumbers(this.characterDef.sprite, {
          start: action.startFrame,
          end: action.endFrame,
        }),
        frameRate: action.frameRate || 16,
        repeat: -1,
      });
    }
  }

  public toggleInteractText() {
    if (this.canInteract) {
      this.interactText.setAlpha(this.interactText.alpha === 0 ? 1 : 0);
    }
  }

  public actionCompletion = (action: string) => {
    if (!this.characterDef.actions.some(a => a.name === action)) {
      console.error(`Unknown action ${action}`);
      return;
    }

    this.anims.play(action);

    // Hacky but kind of works for us
    if (action === "RunAway") {
      this.setVelocityX(300);
      if (this.collider) {
        this.collider.destroy();
      }
      this.canInteract = false;
      this.interactText.setAlpha(0);
    } else if (action === "Cane") {
      this.canInteract = false;
      this.interactText.setAlpha(0);
      // Set depth higher so the cane is on top of player.
      this.setDepth(10);
    }
  };
}
