<template>
	<div class="container">
		<div class="shadow"></div>
		<div class="display" :style="gridTemplate">
			<div class="overlay">
				<div class="lines" :style="lineTemplate">
					<div v-for="index in numOfLines" :key="index" class="line"></div>
				</div>
				<div class="corner top-left"></div>
				<div class="corner top-right"></div>
				<div class="corner bottom-left"></div>
				<div class="corner bottom-right"></div>
			</div>
			<Terminal :game-size="gameSize" :config="config" />
		</div>
	</div>
</template>

<script lang="ts">
	import {Component, Prop, Vue} from "vue-property-decorator";
	import {getGameSize} from "@/lib/PlayerInfo";
	import Terminal from "@/components/Terminal.vue";
	import {GameSize, TerminalConfig} from "@/lib/types/Terminal";

	const gameSize: GameSize = getGameSize();

	@Component({components: {Terminal}})
	export default class Game extends Vue {
		private gameSize: GameSize = gameSize;
		private config: TerminalConfig = {
			enableUserInput: true,
			enableScore: false,
		};

		get gridTemplate() {
			return {
				gridTemplateColumns: `repeat(${this.gameSize.width}, 1fr)`,
				gridTemplateRows: `repeat(${this.gameSize.height}, 1fr)`
			};
		}

		get lineTemplate() {
			return {gridTemplateColumns: "1fr", gridTemplateRows: `repeat(${this.numOfLines}, 1fr)`};
		}

		get numOfLines() {
			return this.gameSize.height * 3;
		}
	}
</script>

<style scoped lang="scss">
	@import "../assets/scss/variables";

	.container {
		position: relative;

		.display {
			@include displayContainer;

			.shadow {
				@include displayShadow;
			}

			.overlay {
				@include overlayMixin;
			}
		}
	}
</style>
