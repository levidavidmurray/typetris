<template>
	<div class="home">
		<Shape
				@shape-enter="setGameCoordinates"
				:type="shapeType"
				:coords="shapeVector"
				:keyword="keyword"
				:user-input="userInput"
		/>
	</div>
</template>

<script lang="ts">
	import {Component, Vue, Watch} from "vue-property-decorator";
	import {Direction, GameResult, GameStatus, ShapeElement, Vector} from "@/types";
	import {ShapeBody} from "@/lib/ShapeBody";
	import Shape from "@/components/Shape.vue";
	import shapes from "@/shapes";

	const GAME_WIDTH: number = 15;
	const GAME_HEIGHT: number = 15;
	const GAME_SIZE: number = GAME_WIDTH * GAME_HEIGHT;

	@Component({components: {Shape}})
	export default class Home extends Vue {
		public shapes = shapes;
		public shapeVector: Vector = {x: 5, y: 0};
		public shapeType = shapes.T;

		public ready = false;

		private activeShapeBody: ShapeElement = {id: "", coordinates: []};
		private gameCoordinates: boolean[][] = [];

		private keyword: string = "testing";
		private userInput: string = "";

		private gameInterval!: number;
		private gameStatus: GameStatus = GameStatus.Waiting;
		private gameResult: GameResult = GameResult.Lost;

		public created() {
			for (let x = 0; x < GAME_WIDTH; x++) {
				const xCoordinates: boolean[] = [];

				for (let y = 0; y < GAME_HEIGHT; y++) {
					xCoordinates.push(false);
				}

				this.gameCoordinates.push(xCoordinates);
				this.$set(this, "gameCoordinates", this.gameCoordinates);
			}
		}

		public mounted() {
			// setTimeout(() => {
			// 	this.initializeKeyListeners();
			// 	this.gameInterval = window.setInterval(() => {
			// 		if (!this.moveActiveShape(Direction.Down)) {
			// 			this.gameStatus = GameStatus.Finished;
			// 			clearInterval(this.gameInterval);
			// 		}
			// 	}, 800);
			// }, 2000);
		}

		public setGameCoordinates(shapeEl: ShapeElement) {
			if (!this.ready) {
				this.activeShapeBody = shapeEl;
				this.$set(this, "activeShapeBody", this.activeShapeBody);
			}

			shapeEl.coordinates.forEach((coordinate: number[]) => {
				const x = coordinate[0];
				const y = coordinate[1];

				this.gameCoordinates[x][y] = true;
			});
			this.ready = true;
		}

		@Watch("gameStatus")
		private onGameStatusChanged(gameStatus: GameStatus) {
			if (gameStatus === GameStatus.Finished) {
				window.clearInterval(this.gameInterval);

				if (this.gameResult === GameResult.Won) {
					console.log("YOU WON!");
				} else {
					console.log("YOU LOST :(");
				}
			}
		}

		private initializeKeyListeners() {
			window.addEventListener("keydown", (e) => {
				if (e.keyCode >= 65 && e.keyCode <= 90) {
					this.userInput += e.key;
					console.log(this.userInput);
					this.checkIfKeyword();
				}

				if (e.keyCode === 8) {
					this.userInput = this.userInput.substring(0, this.userInput.length - 1);
					console.log(this.userInput);
				}
			});
		}

		private checkIfKeyword() {
			if (this.userInput === this.keyword) {
				this.gameStatus = GameStatus.Finished;
				this.gameResult = GameResult.Won;
			}
		}

		private moveActiveShape(dir: Direction) {
			if (this.isColliding(dir)) {
				return false;
			}

			this.shapeVector = ShapeBody.appliedVector(dir, this.shapeVector);
			this.updateActiveShapeBody(dir);
			return true;
		}

		private updateActiveShapeBody(direction: Direction) {
			const shapeBodyCoords = this.activeShapeBody.coordinates;
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

			this.activeShapeBody.coordinates = newShapeBodyCoords;
		}

		/**
		 * Check for potential collisions on active shape coordinates
		 * @param direction
		 */
		private isColliding(direction: Direction) {
			const shapeGameCoords = this.activeShapeBody.coordinates;

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

		/**
		 * Check if the current shape's coordinates fall within the given vector
		 * @param vector
		 */
		private shapeCoordsAreIn(vector: Vector) {
			const shapeCoords = this.activeShapeBody.coordinates;
			return shapeCoords.some((coords: number[]) => coords[0] === vector.x && coords[1] === vector.y);
		}

		private coordsAreEmpty(vector: Vector) {
			return !this.gameCoordinates[vector.x][vector.y];
		}
	}
</script>

<style lang="scss">
	.home {
		display: grid;
		width: 512px;
		height: 512px;
		grid-template-columns: repeat(15, 1fr);
		grid-template-rows: repeat(15, 1fr);
		grid-auto-rows: 34px;
		grid-auto-columns: 34px;
		background-color: #395a65;

		.user-input {
			position: absolute;
		}
	}
</style>
