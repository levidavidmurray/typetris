import {Key} from "ts-key-enum";
import {GameStatus, ShapeCollidingMap, ShapeConfig, ShapeLetter} from "@/types";
import Shape from "./Shape";
import {GameUtils} from "@/lib/utils";

const BLOCK_WIDTH: number = 35;
const GAME_WIDTH: number = 512;

export default class Game {
	private gameStatus: GameStatus = GameStatus.PreGame;
	private startTime!: Date;
	private context!: CanvasRenderingContext2D;

	private shapeEntities: Shape[] = [];
	private activeShape: Shape | null = null;

	private lastFrameTime: number = GameUtils.timestamp();
	private lastShapeCreation!: number;

	private collisionMap: ShapeCollidingMap = {};
	private activeGameLoop: boolean = true;

	constructor(context: CanvasRenderingContext2D) {
		context.canvas.width = Math.round(GAME_WIDTH / BLOCK_WIDTH) * BLOCK_WIDTH;
		context.canvas.height = 768;

		this.startTime = new Date();
		this.context = context;
	}

	/**
	 * Public Methods
	 */

	public startGame(): void {
		this.gameStatus = GameStatus.InProgress;
		this.frame();

		document.addEventListener("keydown", (e) => {
			if (e.key === Key.Escape) {
				e.preventDefault();
				this.activeGameLoop = !this.activeGameLoop;
			}
		});

		const shape: Shape = this.createNewActiveShape();
		this.shapeEntities.push(shape);
	}

	/**
	 * Private Methods
	 */
	private update(dt: number): void {
		if (this.activeGameLoop) {
			this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

			if (GameUtils.timestamp() - this.lastShapeCreation >= 1000) {
				if (!this.activeShape) {
					const newShape: Shape = this.createNewActiveShape();
					this.shapeEntities.push(newShape);
				}
			}

			this.shapeEntities.forEach((shape: Shape) => {
				this.checkShapeCollisions(shape);
				shape.update();
				this.checkIfLost();
			});
		}
	}

	private checkShapeCollisions(shape: Shape): void {
		if (this.collisionMap[shape.id]) {
			return;
		}

		const colShapesArr = this.shapeEntities.filter((colShape: Shape) => {
			return colShape !== shape && GameUtils.entityInRange(shape, colShape);
		});

		let isColliding = false;
		const isBottom = shape.gamePosition.bottom >= this.canvasHeight;

		if (colShapesArr.length > 0) {
			for (const colShape of  colShapesArr) {
				if (shape.isColliding(colShape)) {
					isColliding = true;
					break;
				}
			}
		}

		this.collisionMap[shape.id] = isColliding;

		if (isColliding || isBottom) {
			if (shape === this.activeShape) {
				console.log("COLLIDED!");
				this.activeShape.setSpeed({x: 0, y: 0});
				this.activeShape = null;
			}
		}
	}

	private checkIfLost() {
		const prevShape: Shape = this.shapeEntities[this.shapeEntities.length - 1];

		if (prevShape && this.collisionMap[prevShape.id] && prevShape.vecPosition.y <= 0) {
			this.activeGameLoop = false;
			console.log("Found limit!");
		}

		// Failsafe
		if (this.shapeEntities.length >= 999) {
			this.activeGameLoop = false;
		}
	}

	private frame(): void {
		const now = GameUtils.timestamp();
		const dt = Math.min(1, (now - this.lastFrameTime) / 1000); // Delta time since last update

		this.update(dt);

		this.lastFrameTime = now;
		requestAnimationFrame(this.frame.bind(this));
	}

	private createShape(): Shape {
		const rand = Math.floor(Math.random() * 10);

		const config: ShapeConfig = {
			position: {
				x: GameUtils.randomInt(this.canvasWidth / BLOCK_WIDTH) * BLOCK_WIDTH,
				y: 0,
			},
			size: {width: BLOCK_WIDTH, height: BLOCK_WIDTH * 3},
			color: ["yellow", "pink", "red", "purple", "orange", "blue", "teal", "green", "limegreen"][rand],
			letter: ShapeLetter.Z,
		};

		this.lastShapeCreation = GameUtils.timestamp();
		return new Shape(this.context, config);
	}

	private setActiveShape(shape: Shape): void {
		shape.setSpeed({x: 0, y: 6});
		this.activeShape = shape;
	}

	private createNewActiveShape(): Shape {
		const shape: Shape = this.createShape();
		this.setActiveShape(shape);

		return shape;
	}

	get canvasHeight(): number {
		return this.context.canvas.height;
	}

	get canvasWidth(): number {
		return this.context.canvas.width;
	}
}
