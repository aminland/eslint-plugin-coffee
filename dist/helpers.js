'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isCoffeeFile = exports.isLiterate = exports.arrayToObject = undefined;

var _globals = require('./globals');

var _globals2 = _interopRequireDefault(_globals);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var arrayToObject = exports.arrayToObject = function arrayToObject(arr) {
  return Object.assign.apply(Object, [{}].concat(_toConsumableArray(arr.map(function (item) {
    return _defineProperty({}, Array.isArray(item) && item[0] || item, Array.isArray(item) && item[1] || item);
  }))));
};

var isLiterate = exports.isLiterate = function isLiterate(filename) {
  return filename.toLocaleLowerCase().split('.').slice(-1)[0].startsWith('lit');
};

var isCoffeeFile = exports.isCoffeeFile = function isCoffeeFile(f) {
  return f.match(new RegExp(_globals2.default.CoffeeExtensions.join('|').replace(/\./g, '\\.')));
};