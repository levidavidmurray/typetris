<template>
	<div class="user-input">
		<input type="text" ref="input" v-model="userInput" @input="keyDown" autofocus @blur="inputBlur">
		<div class="input-display">
			<span class="arrow">></span>
			<span class="text">{{ userInput }}</span>
			<span class="cursor">_</span>
		</div>
	</div>
</template>

<script lang="ts">
	import {Component, Prop, Vue} from "vue-property-decorator";
	import {EventBus, EventType} from "@/lib/types/EventBus";

	@Component
	export default class UserInput extends Vue {
		@Prop() public isListening!: boolean;
		@Prop() public submission!: boolean;

		private userInput: string = "";

		public created() {
			EventBus.$on(EventType.SetInput, (value: string) => {
				this.userInput = value;
			});
		}

		public inputBlur() {
			const input = this.$refs.input as HTMLElement;
			input.focus();
		}

		public keyDown(e: KeyboardEvent) {
			EventBus.$emit(EventType.SetInput, this.userInput);
		}

	}
</script>

<style scoped lang="scss">
	@import "../assets/scss/variables";

	.user-input {
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
				font-size: 13px;
			}

			.arrow {
				margin-right: 3px;
				font-size: 1.4em;
				position: relative;
				top: -2px;
				font-weight: bold;
			}

			.cursor {
				animation: flash 1s infinite;
				top: -1px;
			}
		}
	}
</style>
