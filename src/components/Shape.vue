<template>
	<div class="shape" :style="positionStyle" :class="{isSuper}">
		<div
				v-for="(coord, index) in type"
				v-if="coord"
				:style="{gridArea: `s${index}`, backgroundColor: shapeColor}"
				class="coord"
				:class="{animate: isSuper && !gameIsOver}"
		>
		</div>
		<span class="keyword" :class="keywordClass">
			<span
					v-for="(letter, index) in keywordArray"
					:class="isLetterActive(letter, index)"
			>{{ letter }}</span>
		</span>
	</div>
</template>

<script lang="ts">
	import {Component, Prop, Vue} from "vue-property-decorator";
	import {GameShape, GameStatus, ShapeColor, ShapeType} from "@/types";

	@Component
	export default class Shape extends Vue {
		@Prop() private gameShape!: GameShape;
		@Prop() private userInput!: string;
		@Prop() private gameStatus!: GameStatus;

		public created() {
			this.$emit("shape-enter", this.gameShape.worldCoords);
		}

		public isLetterActive(letter: string, index: number) {
			if (this.userInput.includes(this.keyword) && this.userInput.length > this.keyword.length) {
				return "error";
			}

			if (this.keyword.includes(this.userInput) && this.userInput[index] === letter) {
				return "active";
			}
		}

		get id() {
			return this.gameShape.id;
		}

		get type() {
			return this.gameShape.type;
		}

		get coords() {
			return this.gameShape.position;
		}

		get keyword() {
			return this.gameShape.keyword.toLowerCase();
		}

		get isSuper() {
			return this.gameShape.isSuper;
		}

		get gameIsOver() {
			return this.gameStatus === GameStatus.Finished;
		}

		get shapeColor() {
			// return ShapeColor[this.gameShape.shapeName];
			return "";
		}

		public shapeStyle(index: number) {
			switch (this.gameShape.shapeName) {
				case "I":
					return [{
						gridArea: "s1",
						height: "300%",
					}];

			}

			return {
				gridArea: `s${index}`
			}
		}

		get positionStyle() {
			const { x, y } = this.coords;
			return { gridColumnStart: x + 1, gridRowStart: y + 1 };
		}

		get keywordArray() {
			if (this.keyword) {
				return this.keyword.split("");
			}
		}

		get keywordClass() {
			switch (this.gameShape.shapeName) {
				case "O":
					return "shape-O";
				case "T":
					return "top-3";
				default:
					return "center-3";
			}
		}
	}
</script>

<style scoped lang="scss">
	@keyframes superFlash {
		0% {
			background-color: rgba(255,255,255,0);
		}

		50% {
			background-color: rgba(255,255,255,0);
		}

		100% {
			background-color: rgba(255,255,255,0);
		}
	}

	@keyframes superText {
		0% {
			color: white;
		}

		35% {
			color: white;
		}

		35.1% {
			color: rgba(255,255,255,0);
		}

		100% {
			color: rgba(255,255,255,0);
		}
	}

	.shape {
		display: grid;
		grid-row-end: span 3;
		grid-column-end: span 3;
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: repeat(3, 1fr);
		grid-template-areas: "s0 s1 s2" "s3 s4 s5" "s6 s7 s8";
		position: relative;

		&.isSuper {
			.coord {
				box-shadow: 0 0 4px rgba(255, 255, 255, 0.55);
				background-color: rgba(255, 255, 255, 0.23);
			}

			.keyword {
				animation: superText 2s infinite;

				.active {
					color: #a8ff9a;
					text-shadow: 0 0 5px #a8ff9a;
				}
			}
		}

		.coord {
			background-color: rgba(91, 173, 78, 0.6);
			box-shadow: 0 0 4px #a8ff9a;
		}

		.keyword {
			text-transform: uppercase;
			font-weight: bold;
			color: #a8ff9a;
			display: flex;
			position: relative;

			font-size: 80%;
			justify-content: center;
			align-items: center;

			&.center-3 {
				flex-direction: column;
				grid-row-start: 1;
				grid-column-start: 2;
				grid-row-end: span 3;
				grid-column-end: 2;
			}

			&.top-3 {
				grid-row-start: 1;
				grid-row-end: 1;
				grid-column-start: 1;
				grid-column-end: span 3;
			}

			&.shape-O {
				grid-row: 2 / span 3;
				grid-column: 1 / span 2;
			}

			.active {
				color: white;
				text-shadow: 0 0 5px white;
			}

			.error {
				color: #9c9c9c;
				text-shadow: 1px 1px 2px #7D3621;
			}
		}
	}
</style>
