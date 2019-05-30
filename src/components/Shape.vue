<template>
	<div class="shape" :style="positionStyle">
		<div
				v-for="(coord, index) in type"
				v-if="coord"
				:style="{gridArea: 's'+index}"
				class="coord"
		>

		</div>
	</div>
</template>

<script lang="ts">
	import {Component, Vue, Prop} from "vue-property-decorator";
	import {ShapeCoordinates, GameCoordinates} from "@/types";
	import uuidv4 from "uuid";

	@Component
	export default class Shape extends Vue {
		@Prop() private type!: boolean[];
		@Prop() private coords!: GameCoordinates;
		private id: string = uuidv4();

		public created() {
			const shapeCoordinates: ShapeCoordinates = {
				id: this.id,
				coordinates: [],
			};

			this.type.forEach((coordBool, index) => {
				if (coordBool) {
					if (index < 3) {
						shapeCoordinates.coordinates.push([index, 0]);
					} else if (index >= 3 && index < 6) {
						shapeCoordinates.coordinates.push([index - 3, 1]);
					} else {
						shapeCoordinates.coordinates.push([index - 6, 2]);
					}
				}
			});

			this.$emit("shape-enter", shapeCoordinates);
		}

		get positionStyle() {
			const { x, y } = this.coords;
			return { gridColumnStart: x + 1, gridRowStart: y + 1 };
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

		.coord {
			background-color: teal;
		}
	}
</style>
