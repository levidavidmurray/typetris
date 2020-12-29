<template>
	<div class="about">
		<p>Type the word of the shapes as they appear. Ensure to not let any reach the top!</p>
		<div class="example default">
			<Shape :gameShape="gameShape" :game-status="GameStatus.InProgress" :demo="true"/>
			<p class="title">Default - 25 points</p>
			<Shape :gameShape="superShape" :game-status="GameStatus.InProgress" :demo="true"/>
			<p class="title">A super clears the game of all same shapes as the super, resulting in 50 points for each shape.</p>
			<p class="title off">Supers have a low drop chance by default, and increase as you rise closer to the top.</p>
		</div>
	</div>
</template>

<script lang="ts">
	import uuidv4 from "uuid/v4";
	import shapes from "@/shapes";
	import {GameStatus} from "@/types";

	export default {
		data() {
			return {
				GameStatus,
				gameShape: {
					id: uuidv4(),
					type: shapes.T,
					shapeName: "T",
					position: {x: 0, y: 0},
					keyword: "Default",
					worldCoords: {x: 0, y: 0},
					isSuper: false,
				},
				superShape: {
					id: uuidv4(),
					type: shapes.Z,
					shapeName: "Z",
					position: {x: 0, y: 0},
					keyword: "Super",
					worldCoords: {x: 0, y: 0},
					isSuper: true,
				},
			};
		},
	};
</script>

<style scoped lang="scss">
	@import "../assets/scss/variables";

	.about {
		max-width: 512px;
		min-width: 300px;

		.example {
			margin-top: 24px;

			p {
				display: block;

				&.title {
					margin: 24px 0;
					font-size: 14px;

					&.off {
						margin-top: -12px;
					}
				}
			}
		}

	}
</style>
