<template>
	<div class="shape" :style="positionStyle">
		<div
				v-for="(coord, index) in type"
				v-if="coord"
				:style="{gridArea: 's'+index}"
				class="coord"
		>
		</div>
		<span class="keyword">
			<span v-for="letter in keywordArray">{{ letter }}</span>
		</span>
	</div>
</template>

<script lang="ts">
	import {Component, Vue, Prop} from "vue-property-decorator";
	import {ShapeElement, Vector} from "@/types";
	import uuidv4 from "uuid";

	@Component
	export default class Shape extends Vue {
		@Prop() private type!: boolean[];
		@Prop() private coords!: Vector;
		@Prop() private keyword!: string;
		@Prop() private userInput!: string;

		private id: string = uuidv4();

		public created() {
			const shapeCoordinates: ShapeElement = {
				id: this.id,
				coordinates: [],
			};

			this.type.forEach((coordBool, index) => {
				if (coordBool) {
					if (index < 3) {
						shapeCoordinates.coordinates.push([this.coords.x + index, this.coords.y]);
					} else if (index >= 3 && index < 6) {
						shapeCoordinates.coordinates.push([this.coords.x + index - 3, this.coords.y + 1]);
					} else {
						shapeCoordinates.coordinates.push([this.coords.x + index - 6, this.coords.y + 2]);
					}
				}
			});

			this.$emit("shape-enter", shapeCoordinates);
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
			background-color: #f1ec23;
		}

		.keyword {
			position: absolute;
			margin: 0 auto;
			left: 0;
			right: 0;
			top: 7px;
			text-transform: uppercase;
		}
	}
</style>
