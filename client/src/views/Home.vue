<template>
	<div class="home">
		<div class="aside">
			<h1>Typetris</h1>
			<About/>
		</div>
		<Game/>
		<div class="aside">
			<Leaderboards/>
		</div>
	</div>
</template>

<script lang="ts">
	import Game from "./Game.vue";
	import About from "./About.vue";

	export default {
		name: "Home",

		components: {Game, About},
	};
</script>

<style scoped lang="scss">
	@import "../assets/scss/variables";

	* {
		box-sizing: border-box;
	}

	.home {
		display: flex;
		justify-content: space-around;
		width: 100%;

		.aside {
			width: calc(100% - #{$game-width});
			max-width: 512px;
			margin-top: 48px;
			@include brandText;

			h1 {
				text-align: center;
				margin-top: 0;
			}

			&:first-child {
				padding: 0 32px 0 24px;
			}

			&:last-child {
				padding: 0 24px 0 32px;
			}
		}
	}
</style>
