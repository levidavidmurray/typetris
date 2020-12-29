import * as PIXI from "pixi.js";

import cellImage from "./assets/cell.png";
import { Shape } from "./lib/cell.model";

export class Main {
    private static readonly GAME_WIDTH = 800;
    private static readonly GAME_HEIGHT = 600;

    private app: PIXI.Application | undefined;

    private shapeLastMoved: Date | undefined;
    private shape: Shape | undefined;

    constructor() {
        window.onload = (): void => {
            this.setup();
        };
    }

    /** Lifecycle: Setup
     *  Initialization
     */
    private setup(): void {
        const loader = PIXI.Loader.shared;
        loader.add("cell", cellImage);
        loader.add("spriteExample", "./spritesData.json"); // example of loading spriteSheet

        loader.on("complete", () => {
            this.start();
        });

        loader.load();
    }

    /** Lifecycle: Start
     *  Called when assets are done loading
     */
    private start(): void {
        this.createRenderer();

        const stage = this.app!.stage;

        this.shape = this.createShape();
        this.shape.filters = new PIXI.filters.AlphaFilter()

        stage.addChild(this.shape);

        this.app!.ticker.add(this.update.bind(this));
    }

    /** Lifecycle: Update
     *  Called 60 times a second
     */
    private update(delta: number): void {
        if (this.shapeLastMoved === undefined) {
            setTimeout(() => {

            }, 1500);
        }

        const shape: Shape = this.shape!;

        if (shape.y < Main.GAME_HEIGHT) {
            shape.updatePosition(0, delta);
        }
    }

    private createShape(): Shape {
        const shape = new Shape();
        shape.setVelocity(0, 2);
        return shape;
    }

    private createRenderer(): void {
        this.app = new PIXI.Application({
            backgroundColor: 0x353A32,
            width: window.innerWidth,
            height: window.innerHeight,
            antialias: true,
            resolution: 1,
        });

        document.body.appendChild(this.app.view);

        this.app.renderer.resize(window.innerWidth, window.innerHeight);

        window.addEventListener("resize", this.onResize.bind(this));
    }

    private onResize(): void {
        if (!this.app) {
            return;
        }

        this.app.renderer.resize(window.innerWidth, window.innerHeight);
        this.app.stage.scale.x = window.innerWidth / Main.GAME_WIDTH;
        this.app.stage.scale.y = window.innerHeight / Main.GAME_HEIGHT;
    }

    private getBird(): PIXI.AnimatedSprite {
        const bird = new PIXI.AnimatedSprite([
            PIXI.Texture.from("birdUp.png"),
            PIXI.Texture.from("birdMiddle.png"),
            PIXI.Texture.from("birdDown.png"),
        ]);
        bird.loop = true;
        bird.animationSpeed = 0.1;
        bird.play();
        bird.scale.set(3);

        return bird;
    }
}

new Main();
