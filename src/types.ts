export interface ShapeCoordinates {
	id: string;
	coordinates: number[][];
}

export interface GameCoordinates {
	x: number;
	y: number;
}

export enum Direction {
	Right = "ArrowRight",
	Left = "ArrowLeft",
	Up = "ArrowUp",
	Down = "ArrowDown",
}
