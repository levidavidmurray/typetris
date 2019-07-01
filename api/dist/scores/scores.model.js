import * as mongoose from "mongoose";
const scoreSchema = new mongoose.Schema({
    createdAt: Date,
    author: String,
    score: Number,
});
const scoreModel = mongoose.model("Score", scoreSchema);
export default scoreModel;
//# sourceMappingURL=scores.model.js.map