export interface ShapeElement {
	id: string;
	coordinates: number[][];
}

export interface Vector {
	x: number;
	y: number;
}

export enum Direction {
	Right = "ArrowRight",
	Left = "ArrowLeft",
	Up = "ArrowUp",
	Down = "ArrowDown",
}

export enum Keys {
	W = "w",
	A = "a",
	S = "s",
	D = "d",
}
