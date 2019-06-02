<template>
	<div class="shape" :style="positionStyle">
		<div
				v-for="(coord, index) in type"
				v-if="coord"
				:style="{gridArea: 's'+index, backgroundColor: shapeColor}"
				class="coord"
		>
		</div>
		<span class="keyword">
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
			if (this.userInput[index] === letter) {
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
	}
</script>

<style scoped lang="scss">
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
		}

		.keyword {
			position: absolute;
			margin: 0 auto;
			left: 0;
			right: 0;
			top: 7px;
			text-transform: uppercase;
			font-weight: bold;
			color: #2d2a2a;

			.active {
				color: #e8e515;
			}
		}
	}
</style>
