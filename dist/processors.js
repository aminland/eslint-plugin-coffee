'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processors = exports.generic_processor = exports.unfixableRules = undefined;

var _coffeescript = require('coffeescript');

var _coffeescript2 = _interopRequireDefault(_coffeescript);

var _sourceMap = require('source-map');

var _sourceMap2 = _interopRequireDefault(_sourceMap);

var _helpers = require('./helpers');

var _globals = require('./globals');

var _globals2 = _interopRequireDefault(_globals);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }return target;
},
    indexOf = [].indexOf;

// These are some of the rules you cannot fix due to the way coffeescript compiles.
var unfixableRules = exports.unfixableRules = (0, _helpers.arrayToObject)(['no-var', 'one-var', 'vars-on-top', 'one-var-declaration-per-line', 'func-names', 'function-paren-newline', // Impossible to affect this give that code is transpiled
'arrow-body-style', 'space-before-function-paren', 'import/first', 'comma-dangle', 'padded-blocks', 'no-extra-semi', 'no-cond-assign', 'quotes', 'no-shadow', 'wrap-iife', 'no-plusplus', 'no-multi-assign', 'no-restricted-syntax', 'object-curly-spacing', 'no-else-return', 'max-len', 'no-nested-ternary', 'no-return-assign', 'object-curly-newline', 'newline-per-chained-call', 'import/no-mutable-exports', // Coffeescript defines everything as var
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
}], ['no-unused-expressions', function (m) {
  return m.line === 1 && m.column === 1; // due to objectWithoutKeys
}]]);

var generic_processor = exports.generic_processor = {
  preprocess: function preprocess(content, filename) {
    var results;
    if (_globals2.default.CoffeeCache[filename]) {
      content = _globals2.default.CoffeeCache[filename].js;
    } else {
      try {
        results = _coffeescript2.default.compile(content, {
          sourceMap: true,
          bare: true,
          header: false,
          filename: filename,
          literate: (0, _helpers.isLiterate)(filename)
        });
      } catch (error) {
        results = {
          js: '// Syntax Error'
        };
      }
      results.source = content;
      // save result for later
      _globals2.default.CoffeeCache[filename] = results;
      content = results.js;
    }
    return [content];
  },
  postprocess: function postprocess(messages, filename) {
    var compiled, map, output;
    // maps the messages received to original line numbers and returns
    compiled = _globals2.default.CoffeeCache[filename];
    map = void 0;
    if (compiled.v3SourceMap) {
      map = new _sourceMap2.default.SourceMapConsumer(compiled.v3SourceMap);
    }
    output = messages[0].map(function (m) {
      var end, out, start;
      if (m.nodeType === "coffeelint" || map == null) {
        return m;
      }
      start = map.originalPositionFor({
        line: m.line,
        column: m.column,
        bias: map.GREATEST_LOWER_BOUND
      });
      end = map.originalPositionFor({
        line: m.endLine,
        column: m.endColumn,
        bias: map.LEAST_UPPER_BOUND
      });
      if (start.column !== null) {
        start.column += 1;
      }
      if (end.column !== null) {
        end.column += 1;
      }
      if (end.line < start.line) {
        end.line = start.line;
        end.column = start.column;
      } else if (end.line === start.line && end.column < start.column) {
        end.column = start.column + (m.endColumn - m.column);
      }
      out = _extends({}, m, {
        line: start.line,
        column: start.column,
        endLine: end.line,
        endColumn: end.column
      });
      return out;
    }).filter(function (m) {
      if (m.line === null || unfixableRules[m.ruleId] && (typeof unfixableRules[m.ruleId] !== 'function' || unfixableRules[m.ruleId](m))) {
        return false;
      }
      return true;
    });
    delete _globals2.default.CoffeeCache[filename];
    return output;
  }
};

var processors = exports.processors = new Proxy({}, {
  ownKeys: function ownKeys(target) {
    return _globals2.default.CoffeeExtensions;
  },
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, k) {
    if (indexOf.call(_globals2.default.CoffeeExtensions, k) >= 0) {
      return {
        value: generic_processor,
        enumerable: true,
        configurable: true
      };
    }
  },
  get: function get(target, name) {
    if (indexOf.call(_globals2.default.CoffeeExtensions, name) >= 0) {
      return generic_processor;
    }
  },
  set: function set(target, name, value) {
    return false;
  }
});