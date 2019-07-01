import * as express from "express";
import scoreModel from "./scores.model";
class ScoresController {
    constructor() {
        this.path = "/scores";
        this.router = express.Router();
        this.getHighScores = (request, response) => {
            const query = scoreModel.find().sort({ score: "desc" }).limit(10);
            query.exec().then((scores) => {
                response.send(scores);
            });
        };
        this.saveAScore = (request, response) => {
            const scoreData = request.body;
            const createdScore = new scoreModel(Object.assign({}, scoreData, { createdAt: new Date() }));
            createdScore.save()
                .then((savedScore) => {
                response.send(savedScore);
            });
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(this.path, this.getHighScores);
        this.router.post(this.path, this.saveAScore);
    }
}
export default ScoresController;
//# sourceMappingURL=scores.controller.js.map