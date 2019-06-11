<template>
	<div id="app">
<!--		<PopUp header="Typetris" footnote="Press [ENTER] to play" :flash="true"/>-->
		<router-view/>
	</div>
</template>

<script lang="ts">
	import PopUp from "@/components/PopUp.vue";

	export default {
		components: {PopUp}
	}
</script>

<style lang="scss">
	* {
		box-sizing: border-box;
	}

	body {
		margin: 0;
		background: #353a32;
		height: 100vh;
		overflow: hidden;
	}

	#app {
		font-family: 'Roboto Mono', monospace;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
		margin: 0;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;

		.header {
			color: #a8ff9a;
			text-shadow: 0 0 10px #a8ff9a;
			margin: 0;
			padding: 0 10px;
		}
	}
</style>
