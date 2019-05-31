<template>
	<div class="home">
		<Shape @shape-enter="setGameCoordinates" :type="shapeType" :coords="shapeVector"/>
		<Shape v-if="ready" @shape-enter="setGameCoordinates" :type="shapes.O" :coords="{x: 6, y: 6}"/>
		<Shape v-if="ready" @shape-enter="setGameCoordinates" :type="shapes.Z" :coords="{x: 10, y: 3}"/>
	</div>
</template>

<script lang="ts">
	import {Component, Vue} from "vue-property-decorator";
	import {Direction, Vector, Keys, ShapeElement} from "@/types";
	import {ShapeBody} from "@/lib/ShapeBody";
	import Shape from "@/components/Shape.vue";
	import shapes from "@/shapes";

	const GAME_WIDTH: number = 15;
	const GAME_HEIGHT: number = 15;
	const GAME_SIZE: number = GAME_WIDTH * GAME_HEIGHT;

	@Component({components: {Shape}})
	export default class Home extends Vue {
		public shapes = shapes;
		public shapeVector: Vector = {x: 0, y: 0};
		public shapeType = shapes.T;

		public ready = false;

		private activeShapeBody: ShapeElement = {id: "", coordinates: []};
		private gameCoordinates: boolean[][] = [];

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
			window.addEventListener("keypress", (e) => {
				if (e.key === Keys.D && !this.isColliding(Direction.Right)) {
					this.shapeVector.x++;
					this.updateActiveShapeBody(Direction.Right);
				}

				if (e.key === Keys.A && !this.isColliding(Direction.Left)) {
					this.shapeVector.x--;
					this.updateActiveShapeBody(Direction.Left);
				}

				if (e.key === Keys.W && !this.isColliding(Direction.Up)) {
					this.shapeVector.y--;
					this.updateActiveShapeBody(Direction.Up);
				}

				if (e.key === Keys.S && !this.isColliding(Direction.Down)) {
					this.shapeVector.y++;
					this.updateActiveShapeBody(Direction.Down);
				}
			});
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

		// private printGrid() {
		// 	this.activeCoords = [];
		// 	this.gameCoordinates.forEach((gridColumn, index) => {
		// 		gridColumn.forEach((isActive, index2) => {
		// 			if (isActive) {
		// 				this.activeCoords.push({x: index, y: index2});
		// 			}
		// 		});
		// 	});
		// }

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
	}
</style>
