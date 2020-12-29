import {Score} from "@/lib/types/score.interface";
import ScoreApi from "@/lib/api/score.api";
import {AxiosResponse} from "axios";

const LEADERBOARD_LENGTH: number = 10;

class LeaderboardController {
	private _topTen: Score[] = [];
	private _numUnfilled: number = 0;

	public getTopTen()
	{
		new ScoreApi().getTopTen()
			.then((response: AxiosResponse<Score[]>) => {
				this.parseResponse(response.data);
			});
	}

	private parseResponse(scores: Score[])
	{
		this.numUnfilled = LEADERBOARD_LENGTH - scores.length;
		this.topTen = scores;
	}

	get topTen(): Score[] {
		return this._topTen;
	}

	set topTen(value: Score[]) {
		this._topTen = value;
	}

	get numUnfilled(): number {
		return this._numUnfilled;
	}

	set numUnfilled(value: number) {
		this._numUnfilled = value;
	}
}

export default LeaderboardController;
