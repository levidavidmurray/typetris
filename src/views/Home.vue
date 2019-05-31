import {Direction} from "../types";
<template>
	<div class="home">
		<Shape
				v-if="gameStarted && activeGameShape"
				@shape-enter="setGameCoordinates"
				:key="activeGameShape.id"
				:game-shape="activeGameShape"
				:user-input="userInput"
		/>
	</div>
</template>

<script lang="ts">
	import {Component, Vue, Watch} from "vue-property-decorator";
	import {Direction, GameResult, GameShape, GameStatus, ShapeElement, ShapeType, Vector} from "@/types";
	import {ShapeBody} from "@/lib/ShapeBody";
	import Shape from "@/components/Shape.vue";
	import shapes from "@/shapes";
	import uuidv4 from "uuid/v4";

	const WORD_STORE = ["plane", "vagabond", "eggnog", "hobbies", "solicit", "satisfy"];
	const GAME_WIDTH: number = 30;
	const GAME_HEIGHT: number = 23;
	const GAME_SIZE: number = GAME_WIDTH * GAME_HEIGHT;

	@Component({components: {Shape}})
	export default class Home extends Vue {
		public activeGameShape: GameShape | null = null;

		private activeShapeBody: ShapeElement = {id: "", worldCoords: []};
		private gameCoordinates: boolean[][] = [];

		private userInput: string = "";

		private gameInterval!: number;
		private gameStatus: GameStatus = GameStatus.Waiting;
		private gameResult: GameResult = GameResult.Lost;

		public created() {
			this.resetGameCoordinates();
			this.generateGameShape();
		}

		public mounted() {
			setTimeout(() => {
				this.gameStatus = GameStatus.InProgress;
			}, 400);

			setTimeout(() => {
				this.initializeKeyListeners();
				this.gameInterval = window.setInterval(() => {

					if (this.activeGameShape && !this.isPaused) {

						if (!this.moveActiveShape(Direction.Down)) {
							this.gameStatus = GameStatus.Finished;
							clearInterval(this.gameInterval);
						}
					}
				}, 250);
			}, 400);
		}

		public setGameCoordinates(shapeEl: ShapeElement) {
			this.activeShapeBody = shapeEl;
			this.$set(this, "activeShapeBody", this.activeShapeBody);

			shapeEl.worldCoords.forEach((coordinate: number[]) => {
				const x = coordinate[0];
				const y = coordinate[1];

				this.gameCoordinates[x][y] = true;
			});
		}

		@Watch("gameStatus")
		private onGameStatusChanged(gameStatus: GameStatus) {
			if (gameStatus === GameStatus.Finished) {
				window.clearInterval(this.gameInterval);

				if (this.gameResult === GameResult.Lost) {
					console.log("YOU LOST :(");
				} else {
					console.log("Game ended!");
				}
			}
		}

		private initializeKeyListeners() {
			window.addEventListener("keydown", (e) => {
				if (e.keyCode >= 65 && e.keyCode <= 90 && this.activeGameShape) {
					const letter = e.key.toLowerCase();
					const userLength = this.userInput.length;

					if (letter === this.activeGameShape.keyword[userLength]) {
						this.userInput += letter;
					} else {
						this.userInput = "";
					}
				}

				// if (e.keyCode === 8) {
				// 	this.userInput = this.userInput.substring(0, this.userInput.length - 1);
				// }

				if (e.keyCode === 13) {
					const testInput = this.userInput;
					this.userInput = "";
					if (this.isKeyword(testInput)) {
						console.log("IS KEYWORD");
						this.activeGameShape = null;
						this.resetGameCoordinates();

						setTimeout(() => {
							this.generateGameShape();
						}, 300);
					}
				}
			});
		}

		private isKeyword(testInput: string) {
			if (this.activeGameShape) {
				return testInput === this.activeGameShape.keyword;
			}

			return false;
		}

		private generateGameShape() {
			const randIndex: number = ShapeBody.getRandomInt(Object.keys(shapes).length);
			const shapeType: boolean[] = shapes[Object.keys(shapes)[randIndex]];

			this.activeGameShape = {
				id: uuidv4(),
				type: shapeType,
				coordinates: {x: ShapeBody.getRandomInt(GAME_WIDTH - 3), y: 0},
				keyword: WORD_STORE[ShapeBody.getRandomInt(WORD_STORE.length)]
			};
		}

		private moveActiveShape(dir: Direction) {
			if (this.activeGameShape) {
				if (this.isColliding(dir)) {
					return false;
				}

				this.activeGameShape.coordinates = ShapeBody.appliedVector(dir, this.activeGameShape.coordinates);
				this.updateActiveShapeBody(dir);
				return true;
			}

			return false;
		}

		private updateActiveShapeBody(direction: Direction) {
			const shapeBodyCoords = this.activeShapeBody.worldCoords;
			const newShapeBodyCoords: number[][] = [];

			shapeBodyCoords.forEach((coords) => {
				this.gameCoordinates[coords[0]][coords[1]] = false;
				const {x, y} = ShapeBody.appliedVector(direction, {x: coords[0], y: coords[1]});

				newShapeBodyCoords.push([x, y]);
			});

			// TODO 	This just needs to have more thought put into it. Looping twice because
			// TODO   the new coordinates will be overwritten if they're the same as an old value
			newShapeBodyCoords.forEach((coords) => {
				this.gameCoordinates[coords[0]][coords[1]] = true;
			});

			this.activeShapeBody.worldCoords = newShapeBodyCoords;
		}

		/**
		 * Check for potential collisions on active shape coordinates
		 * @param direction
		 */
		private isColliding(direction: Direction) {
			const shapeGameCoords = this.activeShapeBody.worldCoords;

			for (const coord of shapeGameCoords) {
				const coords: Vector = ShapeBody.appliedVector(direction, {x: coord[0], y: coord[1]});

				if (ShapeBody.validCoords(coords, GAME_WIDTH, GAME_HEIGHT)) {
					if (!this.coordsAreEmpty(coords) && !this.shapeCoordsAreIn(coords)) {
						return true;
					}
				} else {
					return true;
				}
			}

			return false;
		}

		private resetGameCoordinates() {
			const gameCoordinates: boolean[][] = [];
			for (let x = 0; x < GAME_WIDTH; x++) {
				const xCoordinates: boolean[] = [];

				for (let y = 0; y < GAME_HEIGHT; y++) {
					xCoordinates.push(false);
				}

				gameCoordinates.push(xCoordinates);
			}
			this.gameCoordinates = gameCoordinates;
		}

		/**
		 * Check if the current shape's coordinates fall within the given vector
		 * @param vector
		 */
		private shapeCoordsAreIn(vector: Vector) {
			const shapeCoords = this.activeShapeBody.worldCoords;
			return shapeCoords.some((coords: number[]) => coords[0] === vector.x && coords[1] === vector.y);
		}

		private coordsAreEmpty(vector: Vector) {
			return !this.gameCoordinates[vector.x][vector.y];
		}

		get gameStarted() {
			return this.gameStatus === GameStatus.InProgress;
		}

		get isPaused() {
			return this.gameStatus === GameStatus.Paused;
		}
	}
</script>

<style lang="scss">
	.home {
		display: grid;
		width: 1024px;
		height: 768px;
		grid-template-columns: repeat(30, 1fr);
		grid-template-rows: repeat(23, 1fr);
		grid-auto-rows: 34px;
		grid-auto-columns: 34px;
		background-color: #395a65;
	}
</style>
