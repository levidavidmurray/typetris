import {Entity, GamePosition, Vector, ShapeConfig, ShapeLetter} from "@/types";
import {GameUtils} from "@/lib/utils";
import uuidv4 from "uuid/v4";

export default class Shape {
	public id!: string;
	public readonly position!: Vector;
	private readonly width!: number;
	private readonly height!: number;
	private readonly color!: string;
	private readonly letter!: ShapeLetter;
	private speed: Vector = {x: 0, y: 0};
	private context!: CanvasRenderingContext2D;
	private shapeEntity!: Entity[];

	public collisionY!: number;

	constructor(context: CanvasRenderingContext2D, config: ShapeConfig) {
		const {position, size, color, letter} = config;

		this.id = uuidv4();
		this.context = context;
		this.width = size.width;
		this.height = size.height;
		this.position = position;
		this.color = color;
		this.letter = letter;
	}

	public update() {
		const {x, y} = this.position;
		const {width, height} = this;

		this.context.fillStyle = this.color;

		this.shapeEntity = GameUtils.constructShape(this.letter, {x, y, width, height});

		this.shapeEntity.forEach((extra: Entity) => {
			this.context.fillRect(extra.x, extra.y, extra.width, extra.height);
		});

		this.position.y += this.speed.y;
		this.position.x += this.speed.x;
	}

	public setSpeed(speed: Vector) {
		this.speed = speed;
	}

	public isColliding(colliderShape: Shape) {
		if (this.shapeEntity && colliderShape && colliderShape.shapeEntity) {
			const cols: Entity[] = GameUtils.isColliding(this.shapeEntity, colliderShape.shapeEntity) as Entity[];

			if (cols) {
				this.collisionY = this.position.y - (cols[1].y - cols[0].y);
				this.setSpeed({x: 0, y: 0});
				return true;
			}
		}
	}

	public setYPos() {
		if (this.collisionY) {
			console.log(this.collisionY);
			this.position.y = this.collisionY;
		}
	}

	get gamePosition(): GamePosition {
		return {
			left: this.position.x,
			right: this.position.x + (this.width),
			top: this.position.y,
			bottom: this.position.y + (this.height),
		};
	}

	get vecPosition(): Vector {
		return this.position;
	}
}
