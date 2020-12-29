import logoImg from "@/assets/shapes/T@2x.png";

export class MainScene extends Phaser.Scene {
    private phaserSprite: Phaser.GameObjects.Sprite;

    constructor() {
        super({
            key: "MainScene",
        });
    }

    preload(): void {
        this.load.image("myLogo", logoImg);
    }

    create(): void {
        this.phaserSprite = this.add.sprite(250, 250, "myLogo");
    }
}
