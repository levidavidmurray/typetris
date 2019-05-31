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

export enum GameStatus {
	Waiting = "Waiting",
	InProgress = "InProgress",
	Finished = "Finished",
}

export enum GameResult {
	Won = "Won",
	Lost = "Lost",
}
