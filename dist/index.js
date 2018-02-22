'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerCoffeeLintRule = exports.configs = exports.parse = exports.processors = exports.rules = undefined;

var _moduleRequire = require('eslint-module-utils/module-require');

var _moduleRequire2 = _interopRequireDefault(_moduleRequire);

var _rules = require('./rules');

var _processors = require('./processors');

var _helpers = require('./helpers');

var _base = require('./configs/base');

var _base2 = _interopRequireDefault(_base);

var _recommended = require('./configs/recommended');

var _recommended2 = _interopRequireDefault(_recommended);

var _recommendedTabs = require('./configs/recommended-tabs');

var _recommendedTabs2 = _interopRequireDefault(_recommendedTabs);

var _globals = require('./globals');

var _globals2 = _interopRequireDefault(_globals);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var configs, parse, parserOptions;

exports.configs = configs = {
  base: _base2.default,
  recommended: _recommended2.default,
  'recommended-tabs': _recommendedTabs2.default
};

// must match ESLint default options or we'll miss the eslint cache every time
parserOptions = {
  loc: true,
  range: true,
  raw: true,
  tokens: true,
  comment: true,
  attachComment: true
};

exports.parse = parse = function parse(content, options) {
  var realParser;
  options = Object.assign({}, options, parserOptions);
  realParser = (0, _moduleRequire2.default)(options.parser);
  if (!options.filePath) {
    throw new Error("no file path provided!");
  }
  if ((0, _helpers.isCoffeeFile)(options.filePath) && !_globals2.default.CoffeeCache[options.filePath]) {
    // processor hasn't run on this coffeefile (probably from the `import` plugin)
    content = _processors.generic_processor.preprocess(content, options.filePath)[0];
  }
  // file is coffeescript at this point
  return realParser.parse(content, options);
};

exports.rules = _rules.rules;
exports.processors = _processors.processors;
exports.parse = parse;
exports.configs = configs;
exports.registerCoffeeLintRule = _rules.registerCoffeeLintRule;