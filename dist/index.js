'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processors = exports.parse = undefined;

var _moduleRequire = require('eslint-module-utils/module-require');

var _moduleRequire2 = _interopRequireDefault(_moduleRequire);

var _coffeescript = require('coffeescript');

var _coffeescript2 = _interopRequireDefault(_coffeescript);

var _sourceMap = require('source-map');

var _sourceMap2 = _interopRequireDefault(_sourceMap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var arrayToObject,
    coffeeCache,
    coffeeExtensions,
    configured_extensions,
    generic_processor,
    parserOptions,
    unfixableRules,
    _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }return target;
},
    indexOf = [].indexOf;

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------
arrayToObject = function arrayToObject(arr) {
  return _extends({}, arr.map(function (item) {
    return _defineProperty({}, Array.isArray(item) && item[0] || item, Array.isArray(item) && item[1] || item);
  }));
};

coffeeCache = {};

unfixableRules = arrayToObject(['no-var', 'one-var', 'vars-on-top', 'one-var-declaration-per-line', 'func-names', 'arrow-body-style', 'space-before-function-paren', 'import/first', 'comma-dangle', 'padded-blocks', 'no-extra-semi', 'no-cond-assign', 'quotes', 'no-shadow', 'wrap-iife', 'no-plusplus', 'no-multi-assign', 'no-restricted-syntax', 'object-curly-spacing', 'no-else-return', 'max-len', 'no-nested-ternary', 'object-curly-newline', 'import/no-mutable-exports', // Coffeescript defines everything as var
'no-void', // this is used heavily by coffee (? operator)
'no-sequences', // this is used heavily by coffee (e.g. storing a nested reference to make property access faster)
'prefer-arrow-callback', // this is a style thing, and functions are ALL arrows in coffee
'no-underscore-dangle', // functions like _extend are auto-added
'consistent-return', // theoretically possible to fix these errors, but doesn't jibe well with the coffee way of implicit returns.
'guard-for-in', // theoretically possible to fix these errors by not using coffee syntax, but that goes agains the spirit of the language.
'react/jsx-closing-tag-location', 'react/jsx-first-prop-new-line', 'react/jsx-max-props-per-line', ['no-param-reassign', function (m) {
  return m.line === 1 && m.column === 1;
}], ['prefer-rest-params', function (m) {
  return m.line === 1 && m.column === 1;
}], ['no-unused-vars', function (m) {
  return m.line === 1 && m.column === 1;
}]]);

// must match ESLint default options or we'll miss the cache every time
parserOptions = {
  loc: true,
  range: true,
  raw: true,
  tokens: true,
  comment: true,
  attachComment: true
};

coffeeExtensions = ['.cjsx', '.coffeescript', '.coffee'];

configured_extensions = [];

var parse = exports.parse = function parse(content, options) {
  var realParser, ref;
  options = Object.assign({}, options, parserOptions);
  realParser = (0, _moduleRequire2.default)(options.parser);
  if (!options.filePath) {
    throw new Error("no file path provided!");
  }
  configured_extensions = (ref = options.coffeeExtensions) != null ? ref : coffeeExtensions;
  if (options.filePath.match(new RegExp(coffeeExtensions.join('|')))) {
    content = generic_processor.preprocess(content, options.filePath)[0];
  }
  // file is coffeescript at this point
  return realParser.parse(content, options);
};

generic_processor = {
  preprocess: function preprocess(content, filename) {
    var results;
    if (coffeeCache[filename]) {
      content = coffeeCache[filename].js;
    } else {
      results = _coffeescript2.default.compile(content, {
        sourceMap: true,
        bare: true,
        header: false,
        filename: filename
      });
      results.originalLines = content.split('\n');
      // save result for later
      coffeeCache[filename] = results;
      content = results.js;
    }
    return [content];
  },
  postprocess: function postprocess(messages, filename) {
    var compiled, map, output;
    // maps the messages received to original line numbers and returns
    compiled = coffeeCache[filename];
    map = new _sourceMap2.default.SourceMapConsumer(compiled.v3SourceMap);
    output = messages[0].map(function (m) {
      var end, start;
      start = map.originalPositionFor({
        line: m.line,
        column: m.column,
        bias: map.LEAST_UPPER_BOUND
      });
      end = map.originalPositionFor({
        line: m.endLine,
        column: m.endColumn,
        bias: map.GREATEST_LOWER_BOUND
      });
      if (start.column !== null) {
        start.column += 1;
      }
      if (end.column !== null) {
        end.column += 1;
      }
      return _extends({}, m, {
        line: start.line,
        column: start.column,
        endLine: end.line,
        endColumn: end.column
      });
    }).filter(function (m) {
      if (m.line === null || unfixableRules[m.ruleId] && (typeof unfixableRules[m.ruleId] !== 'function' || unfixableRules[m.ruleId](m))) {
        return false;
      }
      return true;
    });
    setTimeout(function () {
      return delete coffeeCache[filename];
    }, 0);
    return output;
  }
};

var processors = exports.processors = new Proxy({}, {
  ownKeys: function ownKeys(target) {
    return configured_extensions;
  },
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(k) {
    if (indexOf.call(configured_extensions, k) >= 0) {
      return {
        value: generic_processor,
        enumerable: true,
        configurable: true
      };
    }
  },
  get: function get(target, name) {
    if (indexOf.call(configured_extensions, name) >= 0) {
      return generic_processor;
    }
  },
  set: function set(target, name, value) {
    return false;
  }
});