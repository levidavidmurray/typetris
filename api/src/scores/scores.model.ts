import * as mongoose from "mongoose";
import Score from "./score.interface";

const scoreSchema = new mongoose.Schema({
	author: String,
	score: Number,
});

// const scoreModel = mongoose.model<Score & mongoose.Document>("scores", scoreSchema);
const scoreModel = mongoose.model("Score", scoreSchema);

export default scoreModel;
