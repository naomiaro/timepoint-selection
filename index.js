'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = function (el) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];


    return new Selection(el, options);
};

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

require('moment-duration-format');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var formatSelectionPoints = {
    'hh:mm:ss': [0, 0, 1, 2, 2, 3, 4, 4, 5],
    'hh:mm': [0, 0, 1, 2, 2, 3],
    'mm:ss': [0, 0, 1, 2, 2, 3]
};

var unitView = {
    'hh:mm:ss': [],
    'hh:mm': [0, 4],
    'mm:ss': [2, 6]
};

var maxValue = {
    'hh:mm:ss': 3600 * 100,
    'hh:mm': 3600 * 100,
    'mm:ss': 60 * 100
};

var KEYLEFT = 37;
var KEYUP = 38;
var KEYRIGHT = 39;
var KEYDOWN = 40;

var Selection = function () {
    function Selection(el, options) {
        _classCallCheck(this, Selection);

        this.durationFormat = options.durationFormat || 'hh:mm:ss';
        this.value = 0;
        this.index = undefined;
        this.max = Math.min(options.max || Infinity, maxValue[this.durationFormat]);
        this.el = el;

        this.setUnits();
        this.init();
    }

    _createClass(Selection, [{
        key: 'setUnits',
        value: function setUnits() {
            var _this = this;

            var units = [{ increment: 36000 }, { increment: 3600 }, { increment: 600 }, { increment: 60 }, { increment: 10 }, { increment: 1 }];

            this.units = units.slice.apply(units, _toConsumableArray(unitView[this.durationFormat]));

            //create start & end for input selection (excluding :)
            this.durationFormat.split(':').forEach(function (val, i) {
                _this.units[i * 2].start = i * 3;
                _this.units[i * 2].end = i * 3 + 1;

                _this.units[i * 2 + 1].start = i * 3 + 1;
                _this.units[i * 2 + 1].end = i * 3 + 2;
            });
        }
    }, {
        key: 'formatDuration',
        value: function formatDuration() {
            return _moment2.default.duration(this.value, 'seconds').format(this.durationFormat, { trim: false });
        }
    }, {
        key: 'setSelection',
        value: function setSelection() {
            var data = this.units[this.index];

            if (data === undefined) {
                this.el.blur();
                return;
            }

            this.el.selectionStart = data.start;
            this.el.selectionEnd = data.end;
        }
    }, {
        key: 'displayValue',
        value: function displayValue(value) {
            this.el.value = value;
        }
    }, {
        key: 'getNormalizedMax',
        value: function getNormalizedMax() {
            var data = this.units[this.index];
            var max = this.max;

            if (this.max % data.increment !== 0) {
                max = this.max + data.increment - this.max % data.increment;
            }

            return max;
        }
    }, {
        key: 'decrement',
        value: function decrement(amount) {
            var max = this.getNormalizedMax();

            if (this.value - amount < 0) {
                this.value = this.value + max - amount;
            } else {
                this.value -= amount;
            }
        }
    }, {
        key: 'increment',
        value: function increment(amount) {
            var max = this.getNormalizedMax();

            if (this.value + amount >= this.max) {
                this.value = Math.max(this.value - max + amount, 0);
            } else {
                this.value += amount;
            }
        }
    }, {
        key: 'getDigit',
        value: function getDigit(e) {
            if (e.key) {
                return Number(e.key);
            }

            return (e.which || e.keyCode) - 48;
        }
    }, {
        key: 'init',
        value: function init() {
            var _this2 = this;

            this.onclick = function (e) {
                e.preventDefault();

                _this2.index = formatSelectionPoints[_this2.durationFormat][_this2.el.selectionStart];
                _this2.setSelection();
                _this2.mousedown = false;
            };

            this.onfocus = function (e) {
                e.preventDefault();

                //focus was from tab not click.
                //click event always follows focus.
                if (_this2.mousedown !== true) {
                    _this2.index = 0;
                    window.requestAnimationFrame(function () {
                        _this2.el.setSelectionRange(0, 1);
                    });
                }
            };

            this.onmousedown = function () {
                _this2.mousedown = true;
            };

            this.onkeydown = function (e) {
                var data = _this2.units[_this2.index];
                var key = e.key || e.which || e.keyCode;
                var shouldPreventDefault = true;

                switch (key) {
                    case "ArrowUp":
                    case KEYUP:
                        _this2.increment(data.increment);
                        _this2.displayValue(_this2.formatDuration());
                        break;
                    case "ArrowDown":
                    case KEYDOWN:
                        _this2.decrement(data.increment);
                        _this2.displayValue(_this2.formatDuration());
                        break;
                    case "ArrowLeft":
                    case KEYLEFT:
                        _this2.index -= 1;
                        break;
                    case "ArrowRight":
                    case KEYRIGHT:
                        _this2.index += 1;
                        break;
                    case "0":
                    case "1":
                    case "2":
                    case "3":
                    case "4":
                    case "5":
                    case "6":
                    case "7":
                    case "8":
                    case "9":
                    case 48:
                    case 49:
                    case 50:
                    case 51:
                    case 52:
                    case 53:
                    case 54:
                    case 55:
                    case 56:
                    case 57:
                        var number = _this2.getDigit(e);
                        var prev = Number(_this2.formatDuration().substring(data.start, data.end));
                        var amount = number * data.increment - prev * data.increment;

                        _this2.increment(amount);
                        _this2.index += 1;
                        _this2.displayValue(_this2.formatDuration());
                        break;
                    case "Tab":
                    case 9:
                        shouldPreventDefault = false;
                        break;
                }

                if (shouldPreventDefault) {
                    e.preventDefault();
                }

                _this2.setSelection();
            };

            this.el.value = this.formatDuration();
            this.el.addEventListener("click", this.onclick);
            this.el.addEventListener("mousedown", this.onmousedown);
            this.el.addEventListener("focus", this.onfocus);
            this.el.addEventListener("keydown", this.onkeydown);
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.el.removeEventListener("click", this.onclick);
            this.el.removeEventListener("mousedown", this.onmousedown);
            this.el.removeEventListener("focus", this.onfocus);
            this.el.removeEventListener("keydown", this.onkeydown);
        }
    }]);

    return Selection;
}();

module.exports = exports['default'];
