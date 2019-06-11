<template>
	<div class="terminal">
		<UserInput v-if="config.enableUserInput" />
	</div>
</template>

<script lang="ts">
	import {Component, Prop, Vue} from "vue-property-decorator";
	import {GameSize, TerminalConfig} from "@/lib/types/Terminal";
	import UserInput from "./UserInput.vue";

	@Component({components:{UserInput}})
	export default class Terminal extends Vue {
		@Prop() private gameSize!: GameSize;
		@Prop() private config!: TerminalConfig;
	}
</script>

<style scoped lang="scss">
	.terminal {
		position: absolute;
		width: 100%;
		height: 100%;
	}
</style>
