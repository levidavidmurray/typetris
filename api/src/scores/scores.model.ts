import mongoose from "mongoose";
import Score from "./score.interface";

const scoreSchema = new mongoose.Schema({
	createdAt: Date,
	author: String,
	score: Number,
});

const scoreModel = mongoose.model<Score & mongoose.Document>("Score", scoreSchema);

export default scoreModel;
