export interface ShapeElement {
	id: string;
	worldCoords: number[][];
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

export enum GameStatus {
	Waiting = "Waiting",
	InProgress = "InProgress",
	Finished = "Finished",
	Paused = "Paused",
}

export enum GameResult {
	Won = "Won",
	Lost = "Lost",
}

export interface GameShape {
	id: string;
	type: boolean[];
	coordinates: Vector;
	keyword: string;
	worldCoords?: number[][];
}

export interface ShapeType {
	[key: string]: boolean[];
}
