"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _scores = _interopRequireDefault(require("./scores.model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ScoresController =
/*#__PURE__*/
function () {
  function ScoresController() {
    _classCallCheck(this, ScoresController);

    this.path = "/scores";
    this.router = _express.default.Router();

    this.getHighScores = function (request, response) {
      var query = _scores.default.find().sort({
        score: "desc"
      }).limit(10);

      query.exec().then(function (scores) {
        response.send(scores);
      });
    };

    this.saveAScore = function (request, response) {
      var scoreData = request.body;
      var createdScore = new _scores.default(Object.assign({}, scoreData, {
        createdAt: new Date()
      }));
      createdScore.save().then(function (savedScore) {
        response.send(savedScore);
      });
    };

    this.initializeRoutes();
  }

  _createClass(ScoresController, [{
    key: "initializeRoutes",
    value: function initializeRoutes() {
      this.router.get(this.path, this.getHighScores);
      this.router.post(this.path, this.saveAScore);
    }
  }]);

  return ScoresController;
}();

var _default = ScoresController;
exports.default = _default;