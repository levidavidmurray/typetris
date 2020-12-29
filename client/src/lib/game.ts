
import "phaser";
import { MainScene } from "@/lib/scenes/main-scene";

export class Game extends Phaser.Game {

    public static launch(containerId: string): Game {
        return new Game({
            width: 600,
            height: 800,
            type: Phaser.AUTO,
            parent: containerId,
            physics: {
                default: "arcade",
                arcade: {
                    gravity: { y: 300 },
                    debug: false,
                },
            },
            scene: MainScene,
        });
    }

    constructor(config: Phaser.Types.Core.GameConfig) {
        super(config);
    }
}
