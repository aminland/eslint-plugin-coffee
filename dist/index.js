'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configs = exports.parse = exports.processors = exports.rules = undefined;

var _rules = require('./rules');

var _processors = require('./processors');

var _parser = require('./parser');

var _base = require('./configs/base');

var _base2 = _interopRequireDefault(_base);

var _recommended = require('./configs/recommended');

var _recommended2 = _interopRequireDefault(_recommended);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var configs;

exports.configs = configs = {
  base: _base2.default,
  recommended: _recommended2.default
};

exports.rules = _rules.rules;
exports.processors = _processors.processors;
exports.parse = _parser.parse;
exports.configs = configs;