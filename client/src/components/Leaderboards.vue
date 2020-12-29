<template>
	<div class="leaderboard">
		<h1>Leaderboard</h1>
		<div class="highscores">
			<div class="highscore" v-for="(score, index) in topTen" :key="score._id">
				<div class="left">
					<div class="rank">{{ index + 1 }}</div>
					<div class="name">{{ score.player }}</div>
				</div>
				<div class="right">
					<span class="score">{{ score.score }}</span>
				</div>
			</div>
			<div class="highscore unfilled" v-for="index in numUnfilled" :key="index">
				<div class="left">
					<div class="rank">{{ index + topTen.length }}</div>
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
	import LeaderboardController from "@/lib/controllers/LeaderboardController";
	import {EventBus, EventType} from "@/lib/types/EventBus";

	export default {
		name: "Leaderboards",

		data() {
			return {
				controller: new LeaderboardController() as LeaderboardController,
			};
		},

		created() {
			this.controller.getTopTen();

			EventBus.$on(EventType.SubmitScore, () => this.controller.getTopTen());
		},

		computed: {
			topTen() {
					return this.controller.topTen;
			},

			numUnfilled() {
				return this.controller.numUnfilled;
			}
		}
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
