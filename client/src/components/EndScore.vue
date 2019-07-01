<template>
	<PopUp header="YOUR SCORE" :flash="true">
		<template #top>
			<span>YOUR SCORE</span>
			<span>{{ score }}</span>
		</template>
		<template #message>
			Press <strong>[ENTER]</strong> to play
		</template>
	</PopUp>
</template>

<script>
	import PopUp from "./PopUp";
	export default {
		name: "EndScore",

		props: {
			score: Number,
		},

		components: {PopUp}
	}
</script>

<style scoped>

</style>
