'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerCoffeeLintRule = exports.rules = undefined;

var _omit2 = require('lodash/omit');

var _omit3 = _interopRequireDefault(_omit2);

var _kebabCase2 = require('lodash/kebabCase');

var _kebabCase3 = _interopRequireDefault(_kebabCase2);

var _extend2 = require('lodash/extend');

var _extend3 = _interopRequireDefault(_extend2);

var _moduleRequire = require('eslint-module-utils/module-require');

var _moduleRequire2 = _interopRequireDefault(_moduleRequire);

var _coffeelint = require('@fellow/coffeelint2');

var CoffeeLint = _interopRequireWildcard(_coffeelint);

var _helpers = require('./helpers');

var _globals = require('./globals');

var _globals2 = _interopRequireDefault(_globals);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CoffeescriptError,
    _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }return target;
};

var rules = exports.rules = {};

var registerCoffeeLintRule = exports.registerCoffeeLintRule = function registerCoffeeLintRule(ruleName) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var ruleConstructor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  var e, name, ref, ref1, wrappedRule;
  if (ruleConstructor) {
    wrappedRule = ruleConstructor;
  } else if (typeof ruleName !== 'string') {
    wrappedRule = ruleName;
    ruleName = wrappedRule.prototype.rule.name;
  } else if (ruleConstructor) {
    wrappedRule = ruleName;
  } else {
    try {
      wrappedRule = require('@fellow/coffeelint2/lib/rules/' + ruleName);
    } catch (error) {
      e = error;
      console.log(e);
      try {
        wrappedRule = require('coffeelint/lib/rules/' + ruleName);
      } catch (error) {
        e = error;
        wrappedRule = (0, _moduleRequire2.default)('' + ruleName);
      }
    }
  }
  // by default we want these rules to be ignored.
  if ((ref = wrappedRule.prototype) != null) {
    if ((ref1 = ref.rule) != null) {
      ref1.level = 'ignore';
    }
  }
  (0, _extend3.default)(wrappedRule.prototype, config);
  if (ruleName !== 'coffeescript_error') {
    //this is the default fallback, we dont want to mess with it.
    CoffeeLint.registerRule(wrappedRule, ruleName);
  }
  name = (0, _kebabCase3.default)(ruleName.split('/').reverse()[0].split('.').reverse()[0]);
  return rules[name] = {
    meta: {
      docs: {
        name: ruleName,
        description: wrappedRule.prototype.rule.description,
        category: "CoffeeLint Rule",
        url: "http://www.coffeelint.org/"
      },
      schema: [{
        type: "object",
        properties: {},
        additionalProperties: true
      }]
    },
    create: function create(context) {
      var options, ruleConf;
      // level cannot be known from inside an eslint rule.
      // if we've gotten here already, the assumption is that the rule is not off
      options = _extends({}, context.options[0], {
        level: 'warn'
      });
      ruleConf = (0, _omit3.default)(_extends({}, wrappedRule.prototype.rule, options), ['name', 'description', 'message']);
      _globals2.default.CoffeeLintConfig[ruleName] = _extends({}, _globals2.default.CoffeeLintConfig[ruleName], ruleConf);
      return {
        Program: function Program(node) {
          var current, filename, rule_errors;
          // By this point all rules are created, so we will run this rule from eslint once, and cache that value
          filename = context.getFilename();
          if (!(0, _helpers.isCoffeeFile)(filename)) {
            return;
          }
          current = _globals2.default.CoffeeCache[filename];
          if (current.clErrors == null) {
            current.clErrors = CoffeeLint.lint(current.source, _globals2.default.CoffeeLintConfig, (0, _helpers.isLiterate)(filename));
            _globals2.default.CoffeeCache[filename] = current;
          }
          rule_errors = current.clErrors.filter(function (el) {
            return (0, _kebabCase3.default)(el.name) === ruleName;
          }).map(function (el) {
            var location, ref2, ref3;
            location = {};
            if (el.lineNumber) {
              location.start = {
                line: el.lineNumber,
                column: ((ref2 = el.columnNumber) != null ? ref2 : 0) - 1
              };
            }
            if (el.lineNumberEnd || el.columnNumberEnd) {
              location.end = {
                line: el.lineNumberEnd || el.lineNumber,
                column: ((ref3 = el.columnNumberEnd) != null ? ref3 : el.columnNumber) - 1
              };
            }
            return {
              node: {
                type: "coffeelint"
              },
              message: '' + el.message + (el.context ? ' [' + el.context + ']' : ""),
              loc: location
            };
          });
          return rule_errors.forEach(function (el) {
            return context.report(el);
          });
        }
      };
    }
  };
};

CoffeescriptError = function () {
  var CoffeescriptError = function CoffeescriptError() {
    _classCallCheck(this, CoffeescriptError);
  };

  ;

  CoffeescriptError.prototype.rule = {
    name: 'coffeescript_error',
    description: 'CoffeeScript error',
    level: 'error',
    message: ''
  };

  return CoffeescriptError;
}.call(undefined);

registerCoffeeLintRule(require('@fellow/coffeelint2/lib/rules/arrow_spacing'));

registerCoffeeLintRule(require('@fellow/coffeelint2/lib/rules/braces_spacing'));

registerCoffeeLintRule(require('@fellow/coffeelint2/lib/rules/no_tabs'));

registerCoffeeLintRule(require('@fellow/coffeelint2/lib/rules/no_trailing_whitespace'));

registerCoffeeLintRule(require('@fellow/coffeelint2/lib/rules/max_line_length'));

registerCoffeeLintRule(require('@fellow/coffeelint2/lib/rules/line_endings'));

registerCoffeeLintRule(require('@fellow/coffeelint2/lib/rules/no_trailing_semicolons'));

registerCoffeeLintRule(require('@fellow/coffeelint2/lib/rules/indentation'));

registerCoffeeLintRule(require('@fellow/coffeelint2/lib/rules/camel_case_classes'));

registerCoffeeLintRule(require('@fellow/coffeelint2/lib/rules/colon_assignment_spacing'));

registerCoffeeLintRule(require('@fellow/coffeelint2/lib/rules/no_implicit_braces'));

registerCoffeeLintRule(require('@fellow/coffeelint2/lib/rules/no_nested_string_interpolation'));

registerCoffeeLintRule(require('@fellow/coffeelint2/lib/rules/no_plusplus'));

registerCoffeeLintRule(require('@fellow/coffeelint2/lib/rules/no_throwing_strings'));

registerCoffeeLintRule(require('@fellow/coffeelint2/lib/rules/no_backticks'));

registerCoffeeLintRule(require('@fellow/coffeelint2/lib/rules/no_implicit_parens'));

registerCoffeeLintRule(require('@fellow/coffeelint2/lib/rules/no_empty_param_list'));

registerCoffeeLintRule(require('@fellow/coffeelint2/lib/rules/no_stand_alone_at'));

registerCoffeeLintRule(require('@fellow/coffeelint2/lib/rules/space_operators'));

registerCoffeeLintRule(require('@fellow/coffeelint2/lib/rules/duplicate_key'));

registerCoffeeLintRule(require('@fellow/coffeelint2/lib/rules/empty_constructor_needs_parens'));

registerCoffeeLintRule(require('@fellow/coffeelint2/lib/rules/cyclomatic_complexity'));

registerCoffeeLintRule(require('@fellow/coffeelint2/lib/rules/newlines_after_classes'));

registerCoffeeLintRule(require('@fellow/coffeelint2/lib/rules/no_unnecessary_fat_arrows'));

registerCoffeeLintRule(require('@fellow/coffeelint2/lib/rules/missing_fat_arrows'));

registerCoffeeLintRule(require('@fellow/coffeelint2/lib/rules/no_unnecessary_double_quotes'));

registerCoffeeLintRule(require('@fellow/coffeelint2/lib/rules/no_debugger'));

registerCoffeeLintRule(require('@fellow/coffeelint2/lib/rules/no_interpolation_in_single_quotes'));

registerCoffeeLintRule(require('@fellow/coffeelint2/lib/rules/no_empty_functions'));

registerCoffeeLintRule(require('@fellow/coffeelint2/lib/rules/prefer_english_operator'));

registerCoffeeLintRule(require('@fellow/coffeelint2/lib/rules/spacing_after_comma'));

registerCoffeeLintRule(require('@fellow/coffeelint2/lib/rules/transform_messes_up_line_numbers'));

registerCoffeeLintRule(require('@fellow/coffeelint2/lib/rules/ensure_comprehensions'));

registerCoffeeLintRule(require('@fellow/coffeelint2/lib/rules/no_this'));

registerCoffeeLintRule(require('@fellow/coffeelint2/lib/rules/eol_last'));

registerCoffeeLintRule(require('@fellow/coffeelint2/lib/rules/no_private_function_fat_arrows'));

registerCoffeeLintRule(CoffeescriptError);

//registerCoffeeLintRule require '@fellow/coffeelint2/lib/rules/non_empty_constructor_needs_parens'