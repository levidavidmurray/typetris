"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _cors = _interopRequireDefault(require("cors"));

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var App =
/*#__PURE__*/
function () {
  function App(controllers, port) {
    _classCallCheck(this, App);

    this.app = (0, _express.default)();
    this.port = port;
    this.connectToDatabase();
    this.initializeMiddleware();
    this.initializeControllers(controllers);
  }

  _createClass(App, [{
    key: "initializeMiddleware",
    value: function initializeMiddleware() {
      this.app.use((0, _cors.default)());
      this.app.use(_express.default.json());
    }
  }, {
    key: "initializeControllers",
    value: function initializeControllers(controllers) {
      var _this = this;

      controllers.forEach(function (controller) {
        _this.app.use("/", controller.router);
      });
    }
  }, {
    key: "connectToDatabase",
    value: function connectToDatabase() {
      var _process$env = process.env,
          MONGO_USER = _process$env.MONGO_USER,
          MONGO_PASS = _process$env.MONGO_PASS,
          MONGO_DB = _process$env.MONGO_DB;
      var uri = "mongodb+srv://".concat(MONGO_USER, ":").concat(MONGO_PASS, "@").concat(MONGO_DB, "-ffsuz.mongodb.net/test?retryWrites=true&w=majority");

      _mongoose.default.connect(uri, {
        useNewUrlParser: true
      });
    }
  }, {
    key: "listen",
    value: function listen() {
      var _this2 = this;

      this.app.listen(this.port, function () {
        console.log("App listening on port ".concat(_this2.port));
      });
    }
  }]);

  return App;
}();

var _default = App;
exports.default = _default;