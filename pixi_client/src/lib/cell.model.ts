import * as PIXI from "pixi.js";

export class Shape extends PIXI.ParticleContainer {

    public vx = 0;
    public vy = 0;

    private boolArr: boolean[][] = [
        [true, true, true],
        [false, true, false],
        [false, true, false],
    ];

    constructor() {
        super();

        for (let i = 0; i < this.boolArr.length; i++) {
            const row: boolean[] = this.boolArr[i];

            for (let j = 0; j < row.length; j++) {
                if (row[j]) {
                    const cell = new PIXI.Sprite(PIXI.Texture.from("cell"));
                    // cell.scale.set(1.5, 1.5);
                    cell.position.set(j * cell.width, i * cell.height);
                    this.addChild(cell);
                }
            }
        }
    }

    public setVelocity(x = 0, y = 0): void {
        this.vx = x;
        this.vy = y;
    }

    public reverseVelocity(): void {
        this.vx = -this.vx;
    }

    public updatePosition(deltaX = 0, deltaY = 0): void {
        this.x += this.vx * deltaX;
        this.y += this.vy * deltaY;
    }
}
