<template>
	<div class="shape" :style="positionStyle" :class="{isSuper, demo}">
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
	import uuidv4 from "uuid/v4";

	@Component
	export default class Shape extends Vue {
		@Prop() private gameShape!: GameShape;
		@Prop() private userInput!: string;
		@Prop() private gameStatus!: GameStatus;
		@Prop() private demo!: boolean;

		public created() {
			if (!this.demo) {
				this.$emit("shape-enter", this.gameShape.worldCoords);
			}
		}

		public isLetterActive(letter: string, index: number) {
			if (!this.demo) {

				if (this.userInput.includes(this.keyword) && this.userInput.length > this.keyword.length) {
					return "error";
				}

				if (this.keyword.includes(this.userInput) && this.userInput[index] === letter) {
					return "active";
				}
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
			};
		}

		get positionStyle() {
			if (!this.demo) {
				const {x, y} = this.coords;
				return {gridColumnStart: x + 1, gridRowStart: y + 1};
			}
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
	@import "Shape";
</style>
