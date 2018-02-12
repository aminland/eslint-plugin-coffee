'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parse = undefined;

var _moduleRequire = require('eslint-module-utils/module-require');

var _moduleRequire2 = _interopRequireDefault(_moduleRequire);

var _processors = require('./processors');

var _cache = require('./cache');

var _cache2 = _interopRequireDefault(_cache);

var _globals = require('./globals');

var _globals2 = _interopRequireDefault(_globals);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parserOptions;

// must match ESLint default options or we'll miss the cache every time
parserOptions = {
  loc: true,
  range: true,
  raw: true,
  tokens: true,
  comment: true,
  attachComment: true
};

var parse = exports.parse = function parse(content, options) {
  var realParser;
  options = Object.assign({}, options, parserOptions);
  realParser = (0, _moduleRequire2.default)(options.parser);
  if (parserOptions.cachepath) {
    _globals2.default.CoffeeCache = new _cache2.default(parserOptions.cachePath);
  }
  if (!options.filePath) {
    throw new Error("no file path provided!");
  }
  if (options.filePath.match(new RegExp(_globals2.default.CoffeeExtensions.join('|')))) {
    content = _processors.generic_processor.preprocess(content, options.filePath)[0];
  }
  // file is coffeescript at this point
  return realParser.parse(content, options);
};