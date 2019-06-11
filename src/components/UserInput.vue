<template>
	<div class="user-input">
		<input type="text" ref="input" v-model="userInput" @keydown="keyDown" autofocus @blur="inputBlur">
		<div class="input-display">
			<span class="arrow">></span>
			<span class="text">{{ userInput }}</span>
			<span class="cursor">_</span>
		</div>
	</div>
</template>

<script lang="ts">
	import {Component, Prop, Vue} from "vue-property-decorator";

	@Component
	export default class UserInput extends Vue {
		@Prop() public isListening!: boolean;
		private userInput: string = "";

		public inputBlur()
		{
			const input = this.$refs.input as HTMLElement;
			input.focus();
		}

		public keyDown(e: KeyboardEvent)
		{
			// console.log(e);
		}

	}
</script>

<style scoped lang="scss">
	@import "../assets/scss/variables";

	.user-input {
		margin-top: 17px;
		margin-left: 20px;

		input {
			opacity: 0;
			position: absolute;
		}

		.input-display {
			display: flex;
			align-items: center;
			text-shadow: 0 0 3px white;
			width: fit-content;
			color: white;
			font-weight: 500;
			font-size: 14px;

			.text {
				white-space: pre;
			}

			.arrow {
				margin-right: 5px;
			}

			.cursor {
				animation: flash 1s infinite;
			}
		}
	}
</style>
