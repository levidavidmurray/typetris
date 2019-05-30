import {Direction} from "../types";
import {Direction} from "../types";
import {Direction} from "../types";
import {Direction} from "../types";
import {Direction} from "../types";
<template>
	<div class="home">
		<Shape @shape-enter="setGameCoordinates" :type="shapes.Z" :coords="shapeCoords"/>
	</div>
</template>

<script lang="ts">
	import {Component, Vue} from "vue-property-decorator";
	import Shape from "@/components/Shape.vue";
	import {Direction, GameCoordinates, ShapeCoordinates} from "@/types";
	import shapes from "@/shapes";

	const gameWidth: number = 15;
	const gameHeight: number = 15;
	const gameBoardSize: number = gameWidth * gameHeight;

	@Component({components: {Shape}})
	export default class Home extends Vue {
		private shapes = shapes;
		private gameCoordinates: boolean[][] = [];
		public shapeCoords: GameCoordinates = { x: 0, y: 0 };

		public created() {
			for (let x = 0; x < gameWidth; x++) {
				const xCoordinates: boolean[] = [];

				for (let y = 0; y < gameHeight; y++) {
					xCoordinates.push(false);
				}

				this.gameCoordinates.push(xCoordinates);
				this.$set(this, "gameCoordinates", this.gameCoordinates);
			}
		}

		public mounted() {
			window.addEventListener("keydown", (e) => {
				if (e.key === "d" && this.canMove(Direction.Right)) {
					this.shapeCoords.x++;
				}

				if (e.key === "a" && this.canMove(Direction.Left)) {
					this.shapeCoords.x--;
				}

				if (e.key === "w" && this.canMove(Direction.Up)) {
					this.shapeCoords.y--;
				}

				if (e.key === "s" && this.canMove(Direction.Down)) {
					this.shapeCoords.y++;
				}
			});
		}

		public setGameCoordinates(shapeCoordinates: ShapeCoordinates) {
			shapeCoordinates.coordinates.forEach((coordinate: number[]) => {
				const x = coordinate[0];
				const y = coordinate[1];

				this.gameCoordinates[x][y] = true;
			});
			console.log(this.gameCoordinates);
		}

		private canMove(direction: Direction): boolean {
			switch(direction) {
				case Direction.Left:
					return this.shapeCoords.x !== 0;
				case Direction.Right:
					return this.shapeCoords.x !== gameWidth - 3;
				case Direction.Up:
					return this.shapeCoords.y !== 0;
				case Direction.Down:
					return this.shapeCoords.y !== gameHeight - 3;
			}
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
		background-color: lightblue;
	}
</style>
