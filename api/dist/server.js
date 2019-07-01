"use strict";

require("dotenv/config");

var _validateEnv = _interopRequireDefault(require("./utils/validateEnv"));

var _app = _interopRequireDefault(require("./app"));

var _scores = _interopRequireDefault(require("./scores/scores.controller"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _validateEnv.default)();
var app = new _app.default([new _scores.default()], 5000);
app.listen();