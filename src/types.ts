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
	Undecided = "Undecided"
}

export interface GameShape {
	id: string;
	type: boolean[];
	shapeName: string;
	position: Vector;
	keyword: string;
	worldCoords: Vector[];
	isSuper: boolean;
}

export interface ShapeType {
	[key: string]: boolean[];
}

export enum GameSpeed {
	Slow = 300,
	Regular = 150,
	Fast = 10,
}

interface StringObject {
	[key: string]: string;
}

export const ShapeColor: StringObject = {
	I: "#5a828e", // Blue
	O: "#9e3220", // Red
	T: "#79a089", // Green
	L: "#af973d", // Yellow
	Z: "#b56f98", // Pink
};
