'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cache = require('./cache');

var _cache2 = _interopRequireDefault(_cache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CoffeeCache, CoffeeExtensions, CoffeeLintConfig;

CoffeeExtensions = ['.cjsx', '.cjs', '.coffeescript', '.coffee', '.xcoffee', '.litcoffee', '.litxcoffee', '.litcjsx'];

CoffeeLintConfig = {};

CoffeeCache = new _cache2.default();

exports.default = { CoffeeCache: CoffeeCache, CoffeeLintConfig: CoffeeLintConfig, CoffeeExtensions: CoffeeExtensions };