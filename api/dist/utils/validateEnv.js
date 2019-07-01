"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _envalid = require("envalid");

function validateEnv() {
  (0, _envalid.cleanEnv)(process.env, {
    MONGO_PASS: (0, _envalid.str)(),
    MONGO_USER: (0, _envalid.str)(),
    MONGO_DB: (0, _envalid.str)()
  });
}

var _default = validateEnv;
exports.default = _default;