<template>
	<div class="container">
		<div class="shadow"></div>
		<div class="display">
			<div class="overlay">
				<div class="lines" :style="lineTemplate">
					<div v-for="index in numOfLines" :key="index" class="line"></div>
				</div>
				<div class="corner top-left"></div>
				<div class="corner top-right"></div>
				<div class="corner bottom-left"></div>
				<div class="corner bottom-right"></div>
			</div>
			<Terminal
					:style="gridTemplate"
					:status="gameStatus"
					:user-input="userInput"
					:submission="promptSubmission"
					:score="userScore"
					:active-shapes="activeGameShapes"
					:static-shapes="staticGameShapes"
					@shape="(coords) => setGameCoordinates(true, coords)"
					@set-input="(val) => userInput = val"
			/>
		</div>
	</div>
</template>

<script lang="ts">
	import {Component, Vue} from "vue-property-decorator";
	import {Direction, GameResult, GameShape, GameStatus, LetterShapeMap, Vector} from "@/types";
	import {ShapeBody} from "@/lib/ShapeBody";
	import shapes from "@/shapes";
	import uuidv4 from "uuid/v4";
	import WORD_STORE from "../words";
	import {EventBus, EventType} from "@/lib/types/EventBus";
	import {GameSize, TerminalConfig} from "@/lib/types/Terminal";
	import {getGameSize} from "@/lib/PlayerInfo";
	import ScoreApi from "@/lib/api/score.api";

	const gameSize: GameSize = getGameSize();

	let fps = 60,
		interval = 1000 / fps,
		shapeTimeOut = 100,
		lastTime = (new Date()).getTime(),
		lastShape = (new Date()).getTime(),
		gameFinishTime = 0,
		currentTime = 0,
		delta = 0;

	@Component
	export default class Game extends Vue {
		private gameSize: GameSize = gameSize;
		private config: TerminalConfig = {
			enableUserInput: true,
			enableScore: false,
		};

		public activeGameShapes: GameShape[] = [];
		public staticGameShapes: GameShape[] = [];

		private gameCoordinates: boolean[][] = [];

		private letterShapeMap: LetterShapeMap = {
			I: [],
			T: [],
			O: [],
			L: [],
			Z: [],
		};

		private userInput: string = "";
		private userScore: number = 0;
		private gameFinish: boolean = false;
		private promptSubmission: boolean = false;

		private gameInterval!: number;
		private gameStatus: GameStatus = GameStatus.Waiting;
		private gameResult: GameResult = GameResult.Undecided;

		public created() {
			EventBus.$on(EventType.SetInput, this.setUserInput);

			this.resetGameCoordinates();
			this.initializeKeyListeners();
		}

		public mounted() {
			this.update();
		}

		private startGame() {
			this.resetGame(true);
		}

		private update() {
			requestAnimationFrame(this.update.bind(this));

			currentTime = (new Date()).getTime();
			delta = (currentTime - lastTime);
			let deltaS = (currentTime - lastShape);

			if (delta > interval) {
				if (!this.isPaused && !this.gameFinish && this.gameStarted) {
					if (deltaS > shapeTimeOut) {
						this.generateGameShape();
						lastShape = currentTime - (deltaS % shapeTimeOut);
					}

					this.activeGameShapes.forEach((activeShape: GameShape) => {
						if (!this.moveShape(activeShape, Direction.Down)) {
							if (activeShape.position.y <= 0) {
								return this.endGame();
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

				lastTime = currentTime - (delta % interval);
			}
		}

		public setUserInput(userInput: string) {
			this.userInput = userInput;
		}

		private moveShape(gameShape: GameShape, dir: Direction) {
			if (this.isColliding(gameShape, dir)) {
				return false;
			}

			gameShape.position = ShapeBody.appliedVector(dir, gameShape.position);
			this.updateGameShapePosition(gameShape, dir);
			return true;
		}

		private endGame() {
			gameFinishTime = new Date().getTime();
			this.gameFinish = true;
			this.gameResult = GameResult.Lost;
			this.gameStatus = GameStatus.Finished;
		}

		private initializeKeyListeners() {
			window.addEventListener("keydown", (e) => {
				if (this.gameOver || (!this.gameOver && !this.gameStarted)) {
					if (this.promptSubmission && e.keyCode === 13) {
						this.submitScore();
					}

					if (e.keyCode === 13 && e.ctrlKey) {
						EventBus.$emit(EventType.SetInput, "");
						this.promptSubmission = true;
					} else if (e.keyCode === 13 && (currentTime - gameFinishTime) > 1000 && !this.promptSubmission) {
						this.resetGame(true);
					}
				} else if (!this.gameOver) {
					if (e.keyCode === 13) {
						this.validateInputWord();
					}
				}
			});
		}

		private validateInputWord() {
			const testInput = this.userInput;
			EventBus.$emit(EventType.SetInput, "");

			if (WORD_STORE.includes(testInput)) {
				this.shapesWithKeyword(testInput).forEach((gameShape: GameShape) => {
					if (gameShape.isSuper) {
						this.userScore += 50 * this.letterShapeMap[gameShape.shapeName].length;
						this.clearShapeType(gameShape.shapeName);
					} else {
						this.destroyGameShape(gameShape);
						this.userScore += 25;
					}
				});
			}
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

		private clearShapeType(shapeType: string) {
			this.letterShapeMap[shapeType].forEach((gameShape: GameShape) => {
				this.destroyGameShape(gameShape, true);
			});

			this.letterShapeMap[shapeType] = [];
		}

		private destroyGameShape(gameShape: GameShape, clearing?: boolean) {
			if (!clearing) {
				const shapeMapIndex: number = this.letterShapeMap[gameShape.shapeName].indexOf(gameShape);
				this.letterShapeMap[gameShape.shapeName].splice(shapeMapIndex, 1);
			}

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

		private generateGameShape() {
			let isSuper = false;
			let superChance = 1;

			this.gameCoordinates.forEach((xCoord) => {
				if (xCoord[8]) {
					superChance = 10;
				}
			});

			if (Math.random() * 100 <= superChance) {
				isSuper = true;
			}

			const randIndex: number = ShapeBody.getRandomInt(Object.keys(shapes).length);
			const shapeName: string = Object.keys(shapes)[randIndex];
			const position: Vector = {x: ShapeBody.getRandomInt(this.gameSize.width - 3), y: 0};

			const newShape: GameShape = {
				id: uuidv4(),
				type: shapes[shapeName],
				shapeName,
				position,
				keyword: WORD_STORE[ShapeBody.getRandomInt(WORD_STORE.length)],
				worldCoords: ShapeBody.shapeConstruct(shapes[shapeName], position),
				isSuper,
			};

			this.letterShapeMap[shapeName].push(newShape);
			this.activeGameShapes.push(newShape);
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

				if (ShapeBody.validCoords(deltaPosition, this.gameSize.width, this.gameSize.height)) {
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
			for (let x = 0; x < this.gameSize.width; x++) {
				const xCoordinates: boolean[] = [];

				for (let y = 0; y < this.gameSize.height; y++) {
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

		private resetGame(start?: boolean) {
			this.promptSubmission = false;
			this.userScore = 0;
			EventBus.$emit(EventType.SetInput, "");
			this.activeGameShapes = [];
			this.staticGameShapes = [];
			this.resetGameCoordinates();
			lastTime = (new Date()).getTime();
			lastShape = (new Date()).getTime();
			currentTime = 0;
			this.gameFinish = false;
			this.gameResult = GameResult.Undecided;
			this.gameStatus = start ? GameStatus.InProgress : GameStatus.Waiting;
			this.$forceUpdate();
		}

		private submitScore() {
			new ScoreApi().submitScore({
				player_name: this.userInput,
				score: this.userScore,
			})
				.then((response) => EventBus.$emit(EventType.SubmitScore, response.data));

			this.promptSubmission = false;
			this.resetGame();
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
			return {
				gridTemplateColumns: `repeat(${this.gameSize.width}, 1fr)`,
				gridTemplateRows: `repeat(${this.gameSize.height}, 1fr)`
			};
		}

		get lineTemplate() {
			return {gridTemplateColumns: "1fr", gridTemplateRows: `repeat(${this.numOfLines}, 1fr)`};
		}

		get numOfLines() {
			return this.gameSize.height * 3;
		}
	}
</script>

<style scoped lang="scss">
	@import "../assets/scss/variables";

	.container {
		position: relative;

		.shadow {
			@include displayShadow;
		}

		.display {
			@include displayContainer;

			.overlay {
				@include overlayMixin;
			}
		}
	}
</style>
