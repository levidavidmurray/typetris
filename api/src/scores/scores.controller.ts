import * as express from "express";
import Score from "./score.interface";
import scoreModel from "./scores.model";

class ScoresController {
	public path = "/scores";
	public router = express.Router();

	constructor() {
		this.initializeRoutes();
	}

	public initializeRoutes() {
		this.router.get(this.path, this.getHighScores);
		this.router.post(this.path, this.saveAScore);
	}

	getHighScores = (request: express.Request, response: express.Response) => {
		const query = scoreModel.find().sort({score: "desc"}).limit(10);

		query.exec().then((scores) => {
			response.send(scores);
		});
	};

	saveAScore = (request: express.Request, response: express.Response) => {
		const scoreData: Score = request.body;
		const createdScore = new scoreModel(scoreData);
		createdScore.save()
			.then((savedScore) => {
				response.send(savedScore);
			});
	};
}

export default ScoresController;
