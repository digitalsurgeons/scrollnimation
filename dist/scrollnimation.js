"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Scrollnimation = function () {
  function Scrollnimation(el) {
    var _this = this;

    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Scrollnimation);

    if (!el) return;
    if (!(config.steps && Array.isArray(config.steps))) throw "Scrollnimation: you need to define array of steps for your animation";

    var defaults = {
      preModifierClass: "Scrollnimation--pre",
      stepModifierClass: "Scrollnimation--step",
      matchMedia: "(min-width: 768px)",
      animSpeed: 1,
      onDisable: function onDisable() {},
      onEnable: function onEnable() {},
      onStep: function onStep(n) {}
    };

    this.config = Object.assign({}, defaults, config);

    this.state = {
      isEnabled: true,
      machesMedia: true,
      isAnimating: false,
      lastTime: +new Date()
    };

    this.panel = el;

    // init
    this.mediaQueryToggle();
    window.addEventListener("scroll", function (e) {
      return _this.handleScroll();
    });
    window.addEventListener("resize", function (e) {
      return _this.mediaQueryToggle();
    });
  }

  _createClass(Scrollnimation, [{
    key: "handleScroll",
    value: function handleScroll() {
      var _this2 = this;

      if (this.isThrottled() || !this.state.machesMedia) return;

      var vals = this.getRectValues();
      var isStepScrolled = function isStepScrolled(step) {
        return vals.elementOffset > vals.height * _this2.config.animSpeed * step;
      };
      var getClassAction = function getClassAction(step) {
        return isStepScrolled(step) ? "add" : "remove";
      };
      var getStepClassName = function getStepClassName(i) {
        return _this2.config.stepModifierClass + "-" + i;
      };
      var toggleClass = function toggleClass(step, i) {
        return _this2.panel.classList[getClassAction(step)](getStepClassName(i));
      };

      this.config.steps.forEach(toggleClass);

      this.state.isAnimating = vals.elementOffset > 0;

      var lastActive = this.config.steps.filter(isStepScrolled).pop();
      var currentStep = this.config.steps.indexOf(lastActive);
      if (this.state.currentStep != currentStep && currentStep > -1) {
        this.state.currentStep = currentStep;
        this.config.onStep(currentStep);
      }
    }
  }, {
    key: "mediaQueryToggle",
    value: function mediaQueryToggle() {
      var _this3 = this;

      this.setMediaState();

      var getStepClassName = function getStepClassName(i) {
        return _this3.config.stepModifierClass + "-" + i;
      };
      var allStepsClassNames = this.config.steps.map(function (_, i) {
        return getStepClassName(i);
      });

      if (this.state.machesMedia && !this.state.isEnabled) {
        this.panel.classList.add(this.config.preModifierClass);
        this.config.onEnable();
        this.state.isEnabled = true;
      } else if (!this.state.machesMedia && this.state.isEnabled) {
        var _panel$classList;

        (_panel$classList = this.panel.classList).remove.apply(_panel$classList, _toConsumableArray(allStepsClassNames).concat([this.config.preModifierClass]));
        this.config.onDisable();
        this.state.isEnabled = false;
      }
    }
  }, {
    key: "setMediaState",
    value: function setMediaState() {
      this.state.machesMedia = window.matchMedia(this.config.matchMedia).matches;
    }
  }, {
    key: "isThrottled",
    value: function isThrottled() {
      var throttleTime = 100;
      var now = +new Date();
      var isThrottled = !this.state.isAnimating && now < this.state.lastTime + throttleTime;

      if (!isThrottled) this.state.lastTime = now;

      return isThrottled;
    }
  }, {
    key: "getRectValues",
    value: function getRectValues() {
      var rect = this.panel.getBoundingClientRect();
      var top = rect.top * -1; // make vals positive
      var height = rect.height;
      var elementOffset = top + height * this.config.animSpeed;

      return { top: top, height: height, elementOffset: elementOffset };
    }
  }]);

  return Scrollnimation;
}();

exports.default = Scrollnimation;