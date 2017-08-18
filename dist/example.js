"use strict";

var _scrollnimation = require("scrollnimation");

var _scrollnimation2 = _interopRequireDefault(_scrollnimation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

new _scrollnimation2.default(document.querySelector(".js-scrollnimation"), {
  steps: [0, 0.5, 1]
});