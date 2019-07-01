<template>
	<PopUp header="YOUR SCORE" :flash="!submission">
		<template #top>
			<span>YOUR SCORE</span>
			<span>{{ score }}</span>
		</template>
		<template #message v-if="!submission">
			<strong>[ENTER] to play again</strong><br/><br/>
			<strong>[CTRL+ENTER] to submit your score</strong>
		</template>
		<template #message v-else>
			<div class="fake-input">{{ !name ? 'Enter your name' : name }}</div>
			<strong>Press [ENTER] to submit your score</strong>
		</template>
	</PopUp>
</template>

<script lang="ts">
	import PopUp from "./PopUp.vue";
	import {EventBus, EventType} from "@/lib/types/EventBus";
	export default {
		name: "EndScore",

		props: {
			score: Number,
			submission: Boolean,
		},

		data()
		{
			return {
				name: "",
			}
		},

		created()
		{
			EventBus.$on(EventType.SetInput, (val) => this.name = val);
		},

		components: {PopUp}
	}
</script>

<style scoped lang="scss">
	@import "../assets/scss/variables";

	.fake-input {
		background-color: rgb(53, 140, 39);
		margin: 16px 0;
		padding: 8px;
		font-weight: bold;
	}
</style>
