<template>
	<div class="home" :style="gridTemplate">
		<div class="overlay">
			<div class="top-left"></div>
			<div class="top-right"></div>
			<div class="bottom-left"></div>
			<div class="bottom-right"></div>
		</div>
		<div class="game-over" v-if="gameOver">
			<div class="message" v-if="gameLost">YOU LOST</div>
			<div class="message" v-else>YOU WON</div>
			<p class="sub-message">Press [ENTER] to play again</p>
		</div>
		<div class="user-input">
			<span class="left">></span>
			<span class="input">{{ userInput }}</span>
			<span class="cursor">_</span>
		</div>
		<Shape
				v-for="activeShape in activeGameShapes"
				v-if="(gameStarted || isPaused || gameOver)"
				@shape-enter="() => setGameCoordinates(true, activeShape.worldCoords)"
				:key="activeShape.id"
				:game-shape="activeShape"
				:user-input="userInput"
				:game-status="gameStatus"
		/>
		<Shape
				v-for="shape in staticGameShapes"
				v-if="(gameStarted || isPaused || gameOver)"
				:key="shape.id"
				:game-shape="shape"
				:user-input="userInput"
				:game-status="gameStatus"
		/>
	</div>
</template>

<script lang="ts">
	import {Component, Vue, Watch} from "vue-property-decorator";
	import {Direction, GameResult, GameShape, GameSpeed, GameStatus, Vector} from "@/types";
	import {ShapeBody} from "@/lib/ShapeBody";
	import Shape from "@/components/Shape.vue";
	import shapes from "@/shapes";
	import uuidv4 from "uuid/v4";
	import WORD_STORE from "../words";

	const GAME_WIDTH: number = 20;
	const GAME_HEIGHT: number = Math.ceil(GAME_WIDTH * 1.25);
	const GAME_SPEED: number = GameSpeed.Fast;
	const GAME_SIZE: number = GAME_WIDTH * GAME_HEIGHT;

	@Component({components: {Shape}})
	export default class Home extends Vue {
		public activeGameShapes: GameShape[] = [];
		public staticGameShapes: GameShape[] = [];

		private gameCoordinates: boolean[][] = [];
		private shapeToEnd: GameShape | null = null;
		private shapeQueued: boolean = false;

		private userInput: string = "";

		private gameInterval!: number;
		private gameStatus: GameStatus = GameStatus.Waiting;
		private gameResult: GameResult = GameResult.Undecided;

		public created() {
			this.resetGameCoordinates();
			this.generateGameShape();
			this.initializeKeyListeners();
		}

		public mounted() {
			this.startGame();
		}

		private startGame() {
			setTimeout(() => {
				this.gameStatus = GameStatus.InProgress;
			}, 400);

			setTimeout(() => {
				this.gameInterval = window.setInterval(() => {

					if (!this.isPaused && !this.gameOver) {
						if (this.activeGameShapes.length === 0) {
							if (!this.shapeQueued) {
								setTimeout(() => {
									this.generateGameShape();
									this.shapeQueued = false;
								}, 300);
							}

							this.shapeQueued = true;
						}

						this.activeGameShapes.forEach((activeShape: GameShape) => {
							if (!this.moveShape(activeShape, Direction.Down)) {
								if (activeShape.position.y <= 0) {
									if (!this.shapeToEnd) {
										this.shapeToEnd = activeShape;
									} else {
										if (this.shapeToEnd.position.y <= 0) {
											return this.endGame();
										}
									}
								}

								this.activeGameShapes = this.activeGameShapes.filter((gameShape: GameShape) => {
									if (gameShape.id === activeShape.id) {
										this.staticGameShapes.push(gameShape);
									}

									return gameShape.id !== activeShape.id;
								});
							}
						});
					}
				}, GAME_SPEED);
			}, 400);
		}

		private moveShape(gameShape: GameShape, dir: Direction) {
			if (this.isColliding(gameShape, dir)) {
				return false;
			}

			gameShape.position = ShapeBody.appliedVector(dir, gameShape.position);
			this.updateGameShapePosition(gameShape, dir);
			return true;
		}

		@Watch("gameStatus")
		private onGameStatusChanged(gameStatus: GameStatus) {
			if (gameStatus === GameStatus.Finished) {

				if (this.gameResult === GameResult.Lost) {
					console.log("YOU LOST :(");
				} else {
					console.log("Game ended!");
				}
			}
		}

		private endGame() {
			console.log("YOU LOST :(");
			this.gameResult = GameResult.Lost;
			this.gameStatus = GameStatus.Finished;
		}

		private initializeKeyListeners() {
			window.addEventListener("keydown", (e) => {
				// Kill game interval
				if (e.ctrlKey && e.code === "KeyK") {
					e.preventDefault();
					window.clearInterval(this.gameInterval);
				}

				if (e.keyCode === 27) {
					return this.gameStatus = this.isPaused ? GameStatus.InProgress : GameStatus.Paused;
				}

				if (this.isPaused) {
					return;
				}

				if (e.keyCode >= 65 && e.keyCode <= 90) {
					this.userInput += e.key.toLowerCase();
				}

				if (e.keyCode === 8) {
					this.userInput = this.userInput.substring(0, this.userInput.length - 1);
				}

				if (e.keyCode === 13) {
					if (this.gameOver) {
						return this.resetGame();
					}

					const testInput = this.userInput;
					this.userInput = "";
					if (WORD_STORE.includes(testInput)) {
						this.shapesWithKeyword(testInput).forEach((gameShape: GameShape) => {
							if (gameShape.isSuper) {
								this.clearBoard();
							} else {
								this.destroyGameShape(gameShape);
							}
						});
					}
				}
			});
		}

		private shapesWithKeyword(keyword: string) {
			const staticKeywordShapes = this.staticGameShapes.filter((gameShape: GameShape) => {
				return gameShape.keyword === keyword;
			});

			const activeKeywordShapes = this.activeGameShapes.filter((gameShape: GameShape) => {
				return gameShape.keyword === keyword;
			});

			return [...staticKeywordShapes, ...activeKeywordShapes];
		}

		private destroyGameShape(gameShape: GameShape) {
			this.staticGameShapes = this.staticGameShapes.filter((staticShape: GameShape) => {
				if (staticShape.id === gameShape.id) {
					this.setGameCoordinates(false, staticShape.worldCoords);
				}

				return staticShape.id !== gameShape.id;
			});

			this.activeGameShapes = this.activeGameShapes.filter((activeShape: GameShape) => {
				if (activeShape.id === gameShape.id) {
					this.setGameCoordinates(false, activeShape.worldCoords);
				}

				return activeShape.id !== gameShape.id;
			});

			this.makeStaticShapesActive();
		}

		private makeStaticShapesActive() {
			this.activeGameShapes = [...this.activeGameShapes, ...this.staticGameShapes];
			this.staticGameShapes = [];
		}

		private clearBoard() {
			this.activeGameShapes = [];
			this.staticGameShapes = [];
			this.resetGameCoordinates();
		}

		private generateGameShape() {
			let isSuper = false;
			let superChance = 0.01;

			this.gameCoordinates.forEach((xCoord) => {
				if (xCoord[8]) {
					superChance = 0.3;
				}
			});

			if (Math.random() <= superChance) {
				isSuper = true;
			}

			const randIndex: number = ShapeBody.getRandomInt(Object.keys(shapes).length);
			const shapeName: string = Object.keys(shapes)[randIndex];

			const position: Vector = {x: ShapeBody.getRandomInt(GAME_WIDTH - 3), y: 0};

			this.activeGameShapes.push({
				id: uuidv4(),
				type: shapes[shapeName],
				shapeName,
				position,
				keyword: WORD_STORE[ShapeBody.getRandomInt(WORD_STORE.length)],
				worldCoords: ShapeBody.shapeConstruct(shapes[shapeName], position),
				isSuper,
			});
		}

		private updateGameShapePosition(gameShape: GameShape, direction: Direction) {
			const newShapeBodyCoords: Vector[] = [];

			gameShape.worldCoords.forEach(({x, y}) => {
				this.setGameCoordinate(false, {x, y});
				newShapeBodyCoords.push(ShapeBody.appliedVector(direction, {x, y}));
			});

			// TODO 	This just needs to have more thought put into it. Looping twice because
			// TODO   the new coordinates will be overwritten if they're the same as an old value
			this.setGameCoordinates(true, newShapeBodyCoords);
			gameShape.worldCoords = newShapeBodyCoords;
		}

		/**
		 * Check for potential collisions on active shape coordinates
		 * @param gameShape
		 * @param direction
		 */
		private isColliding(gameShape: GameShape, direction: Direction) {
			for (const currentPosition of gameShape.worldCoords) {
				const deltaPosition: Vector = ShapeBody.appliedVector(direction, currentPosition);

				if (ShapeBody.validCoords(deltaPosition, GAME_WIDTH, GAME_HEIGHT)) {
					if (!this.coordsAreEmpty(deltaPosition) && !this.coordsAreActiveShape(gameShape, deltaPosition)) {
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

		private setGameCoordinates(value: boolean, positionArr: Vector[]) {
			if (positionArr) {
				positionArr.forEach(({x, y}) => {
					this.gameCoordinates[x][y] = value;
				});
			}
		}

		private setGameCoordinate(value: boolean, position: Vector) {
			this.gameCoordinates[position.x][position.y] = value;
		}

		private resetGame() {
			window.clearInterval(this.gameInterval);
			this.userInput = "";
			this.gameResult = GameResult.Undecided;
			this.gameStatus = GameStatus.Waiting;
			this.activeGameShapes = [];
			this.staticGameShapes = [];
			this.resetGameCoordinates();
			this.generateGameShape();
			this.startGame();
		}

		/**
		 * Check if this shape's coordinates fall within the given vector
		 * @param gameShape
		 * @param vector
		 */
		private coordsAreActiveShape(gameShape: GameShape, vector: Vector) {
			return gameShape.worldCoords.some((sVector: Vector) => sVector.x === vector.x && sVector.y === vector.y);
		}

		private coordsAreEmpty(vector: Vector) {
			return !this.gameCoordinates[vector.x][vector.y];
		}

		get gameLost() {
			return this.gameResult === GameResult.Lost;
		}

		get gameStarted() {
			return this.gameStatus === GameStatus.InProgress;
		}

		get gameOver() {
			return this.gameStatus === GameStatus.Finished;
		}

		get isPaused() {
			return this.gameStatus === GameStatus.Paused;
		}

		get gridTemplate() {
			return {gridTemplateColumns: `repeat(${GAME_WIDTH}, 1fr)`, gridTemplateRows: `repeat(${GAME_HEIGHT}, 1fr)`};
		}
	}
</script>

<style lang="scss">
	@keyframes flash {
		0% { opacity: 1; }
		50% { opacity: 1; }
		50.1% { opacity: 0; }
		100% { opacity: 0; }
	}

	.home {
		position: relative;
		display: grid;
		margin: 0 auto;
		width: 641px;
		height: 854px;
		grid-template-columns: repeat(15, 1fr);
		grid-template-rows: repeat(15, 1fr);
		grid-auto-rows: 34px;
		grid-auto-columns: 34px;
		background: lightgrey;
		background: radial-gradient(circle, #2d6b29 0%, #243834 100%);
		box-shadow: 0 0 17px -5px black;
		overflow: hidden;

		.overlay {
			position: absolute;
			overflow: hidden;
			width: 100%;
			height: 100%;
			z-index: 99;

			& > * {
				width: 300px;
				height: 300px;
				border-radius: 50%;
				position: absolute;
				box-shadow: 0 0 120px 70px #2d2a2a;

				&.top-left {
					top: -300px;
					left: -200px;
				}

				&.top-right {
					top: -300px;
					right: -200px;
				}

				&.bottom-left {
					bottom: -300px;
					left: -200px;
				}

				&.bottom-right {
					bottom: -300px;
					right: -200px;
				}
			}
		}

		.user-input {
			position: absolute;
			top: 25px;
			z-index: 9;
			left: 15px;
			color: white;
			font-weight: bold;
			display: flex;
			align-items: center;
			padding-left: 5px;
			padding-top: 5px;
			letter-spacing: 2px;
			text-transform: lowercase;
			text-shadow: 0 0 3px white;

			.cursor {
				animation: flash 1s infinite;
				position: relative;
				top: -1px;
			}

			.input {
				font-size: 13px;
			}

			.left {
				margin-right: 3px;
				font-size: 1.3em;
				position: relative;
				top: -2px;
			}
		}

		.game-over {
			position: absolute;
			top: 0; bottom: 0; left: 0; right: 0;
			margin: auto;
			width: 65%;
			height: 300px;
			background-color: rgba(0,0,0,0.9);
			box-shadow: 0 0 6px 16px rgba(0, 0, 0, 0.9);
			color: white;
			z-index: 5;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;

			.message {
				font-size: 60px;
			}

			.sub-message {
				animation: flash 1.5s infinite;
			}
		}
	}
</style>
