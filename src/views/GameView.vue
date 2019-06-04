<template>
	<div class="game">
		<canvas ref="canvas" id="canvas"></canvas>
	</div>
</template>

<script lang="ts">
	import {Component, Vue} from "vue-property-decorator";
	import { ShapeConfig } from "@/types";
	import Shape from "./Shape";
	import Game from "./Game";

	@Component
	export default class GameView extends Vue {

		public mounted() {
			const canvas: HTMLCanvasElement = document.querySelector("#canvas") as HTMLCanvasElement;
			const ctx: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;

			const game = new Game(ctx);
			game.startGame();
		}
	}
</script>

<style scoped lang="scss">
	#canvas {
		background-color: black;
	}
</style>
