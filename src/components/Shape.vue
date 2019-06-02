<template>
	<div class="shape" :style="positionStyle">
		<div
				v-for="(coord, index) in type"
				v-if="coord"
				:style="{gridArea: 's'+index, backgroundColor: shapeColor}"
				class="coord"
				:class="{isSuper: isSuper}"
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
	import {Component, Vue, Prop} from "vue-property-decorator";
	import { GameShape, ShapeColor } from "@/types";

	@Component
	export default class Shape extends Vue {
		@Prop() private gameShape!: GameShape;
		@Prop() private userInput!: string;

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

		get shapeColor() {
			const shapeName: string = this.gameShape.shapeName;
			return ShapeColor[shapeName];
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
	@keyframes superAnimation {
		0% {
			background-color: white;
		}

		50% {
			background-color: #2d2a2a;
		}

		100% {
			background-color: white;
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

		.coord {
			background-color: #e24919;
			box-shadow: 0 0 4px black;

			&.isSuper {
				animation: superAnimation 0.7s infinite;
			}
		}

		.keyword {
			text-transform: uppercase;
			font-weight: bold;
			color: #2d2a2a;
			display: flex;

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
				color: #fff446;
				text-shadow: 0 0 5px white;
			}

			.error {
				color: #ff0000;
				text-shadow: 1px 1px 2px #7D3621;
			}
		}
	}
</style>
