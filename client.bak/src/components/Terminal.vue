<template>
	<div class="terminal">
		<EndScore :score="score" :submission="submission" v-if="gameOver"/>
		<PopUp v-if="!gameOver && !gameStarted">
			<template #top>
				<span>Typetris</span>
			</template>
			<template #message>
				Press <strong>[ENTER]</strong> to play!
			</template>
		</PopUp>
		<div class="game-bar">
			<UserInput :submission="submission"/>
			<div class="score">
				<span class="label">Score:</span>
				<span class="number">{{ score }}</span>
			</div>
		</div>
		<Shape
				v-for="activeShape in activeShapes"
				v-if="(gameStarted || isPaused || gameOver)"
				@shape-enter="$emit('shape', activeShape.worldCoords)"
				:key="activeShape.id"
				:game-shape="activeShape"
				:user-input="userInput"
				:game-status="status"
		/>
		<Shape
				v-for="shape in staticShapes"
				v-if="(gameStarted || isPaused || gameOver)"
				:key="shape.id"
				:game-shape="shape"
				:user-input="userInput"
				:game-status="status"
		/>
	</div>
</template>

<script lang="ts">
	import {Component, Prop, Vue} from "vue-property-decorator";
	import {GameSize, TerminalConfig} from "@/lib/types/Terminal";
	import UserInput from "./UserInput.vue";
	import {GameShape, GameStatus} from "@/types";

	@Component({components:{UserInput}})
	export default class Terminal extends Vue {
		@Prop() private status!: GameStatus;
		@Prop() private activeShapes!: GameShape[];
		@Prop() private staticShapes!: GameShape[];
		@Prop() private score!: Number;
		@Prop() private userInput!: String;
		@Prop() private submission!: boolean;

		get gameStarted() {
			return this.status === GameStatus.InProgress;
		}

		get gameOver() {
			return this.status === GameStatus.Finished;
		}

		get isPaused() {
			return this.status === GameStatus.Paused;
		}
	}
</script>

<style scoped lang="scss">
	.terminal {
		position: absolute;
		width: 100%;
		height: 100%;
		grid-auto-rows: 34px;
		grid-auto-columns: 34px;
		display: grid;

		.game-bar {
			position: absolute;
			left: 15px;
			top: 25px;
			z-index: -1;
			color: white;
			font-weight: bold;
			display: flex;
			text-shadow: 0 0 3px white;
			width: 100%;
			justify-content: space-between;
			align-items: center;

			.score {
				.number {
					width: 50px;
					margin-right: 30px;
					padding: 0 5px;
				}
			}
		}
	}
</style>
