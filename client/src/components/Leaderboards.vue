<template>
	<div class="leaderboard">
		<h1>Leaderboard</h1>
		<div class="highscores">
			<div class="highscore unfilled" v-for="index in 10" :key="index">
				<div class="left">
				<div class="rank">{{ index }}</div>
				<div class="name">Unfilled</div>
				</div>
				<div class="right">
					<span class="score">N/A</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	export default {
		name: "Leaderboards",


	};
</script>

<style scoped lang="scss">
	@import "../assets/scss/variables";

	.leaderboard {
		border-left: $default-border;
		border-right: $default-border;
		border-bottom: $default-border;

		h1 {
			margin: 0;
			padding: 8px;
			border-top: $default-border;
			border-bottom: $default-border;
		}

		.highscores {
			.highscore {
				padding: 12px 32px;
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: $default-border;

				&.unfilled {
					.name, .score {
						font-style: italic;
					}
				}

				&:last-child {
					border-bottom: none;
				}

				.left {
					display: flex;
					align-items: center;

					.rank {
						border: $default-border;
						width: 24px;
						height: 24px;
						display: flex;
						justify-content: center;
						align-items: center;
						border-radius: 50%;
					}

					.name {
						margin-left: 16px;
					}
				}

				.right {

				}
			}
		}
	}
</style>
