"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var scoreSchema = new _mongoose.default.Schema({
  createdAt: Date,
  author: String,
  score: Number
});

var scoreModel = _mongoose.default.model("Score", scoreSchema);

var _default = scoreModel;
exports.default = _default;