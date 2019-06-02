<template>
	<div id="app">
		<div class="header">
			<h1>TYPETRIS</h1>
		</div>
		<router-view/>
	</div>
</template>

<style lang="scss">
	* {
		box-sizing: border-box;
	}

	body {
		margin: 0;
		background: #2c332b;
		height: 100vh;
		overflow: hidden;
	}

	#app {
		font-family: 'Roboto Slab', serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
		margin: 0;

		.header {
			color: #a8ff9a;
			text-shadow: 0 0 10px #a8ff9a;
		}
	}
</style>
