"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
const ModuleRequire = require('eslint-module-utils/module-require').default
const CoffeeScript = require('coffeescript');
const SourceMap = require('source-map');

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------
const arrayToObject = (arr) =>
  Object.assign({}, ...arr.map(item => ({
        [Array.isArray(item) && item[0] || item]: 
          Array.isArray(item) && item[1] || item })))

const coffeeCache = {};


// These are some of the rules you cannot fix due to the way coffeescript compiles.
const unfixableRules = arrayToObject([
  'no-var',
  'one-var',
  'vars-on-top',
  'one-var-declaration-per-line',
  'func-names',
  'arrow-body-style',
  'space-before-function-paren',
  'import/first',
  'comma-dangle',
  'padded-blocks',
  'no-extra-semi',
  'no-cond-assign',
  'quotes',
  'no-shadow',
  'wrap-iife',
  'no-plusplus',
  'no-multi-assign',
  'no-restricted-syntax',
  'object-curly-spacing',
  'no-else-return',
  'max-len',
  'no-nested-ternary',
  'object-curly-newline',
  'import/no-mutable-exports', // Coffeescript defines everything as var
  'no-void', // this is used heavily by coffee (? operator)
  'no-sequences', // this is used heavily by coffee (e.g. storing a nested reference to make property access faster)
  'prefer-arrow-callback', // this is a style thing, and functions are ALL arrows in coffee
  'no-underscore-dangle', // functions like _extend are auto-added
  'consistent-return', // theoretically possible to fix these errors, but doesn't jibe well with the coffee way of implicit returns.
  'guard-for-in', // theoretically possible to fix these errors by not using coffee syntax, but that goes agains the spirit of the language.
  'react/jsx-closing-tag-location',
  'react/jsx-first-prop-new-line',
  'react/jsx-max-props-per-line',
  ['no-param-reassign', m => m.line ==1 && m.column == 1 ],
  ['prefer-rest-params', m => m.line ==1 && m.column == 1 ],
  ['no-unused-vars', m => m.line == 1 && m.column == 1 ]

]);

// must match ESLint default options or we'll miss the cache every time
const parserOptions = {
  loc: true,
  range: true,
  raw: true,
  tokens: true,
  comment: true,
  attachComment: true,
}
const coffeeRegex = /\.(cjsx|coffee)$/gi;

module.exports.parse = function parse(content, options) {
  options = Object.assign({}, options, parserOptions);

  const realParser = ModuleRequire(options.parser);

  if (!options.filePath) {
    throw new Error("no file path provided!")
  }

  if (options.filePath.match(coffeeRegex)) {
    content = preprocess(content, options.filePath)[0]
  }
``
  // file is coffeescript at this point
  return realParser.parse(content, options)
}

// takes text of the file and filename
function preprocess (content, filename) {
  if (coffeeCache[filename]) {
    content = coffeeCache[filename].js
  } else {
    var results = CoffeeScript.compile(content, {
      sourceMap: true,
      bare: true,
      header: false,
      filename: filename,
    })
    results.originalLines = content.split('\n');
    // save result for later
    coffeeCache[filename] = results;
    content = results.js
  }

  return [content]; 
}

function postprocess (messages, filename) {
  // maps the messages received to original line numbers and returns

  var compiled = coffeeCache[filename];
  var map = new SourceMap.SourceMapConsumer(compiled.v3SourceMap);
  var output = messages[0]
    .map(m => {
      var start = map.originalPositionFor({line:m.line, column:m.column, bias: map.LEAST_UPPER_BOUND});
      var end = map.originalPositionFor({line:m.endLine, column:m.endColumn, bias: map.GREATEST_LOWER_BOUND});
      if (start.column !== null) start.column += 1;
      if (end.column !== null) end.column += 1;
      return {
        ...m, 
        ...{
          line:start.line,
          column: start.column,
          endLine:end.line,
          endColumn: end.column
        }
      };
    })
    .filter(m => {
      if (
          (unfixableRules[m.ruleId] && 
            (typeof unfixableRules[m.ruleId] !== 'function' || unfixableRules[m.ruleId](m)))  ||
          m.line == null
        ) {
        return false;
      }
      return true;
    });
  setTimeout(function(){
    delete coffeeCache[filename];
  }, 0);
  return output;
}

// import processors
module.exports.processors = {
  '.cjsx': {
    preprocess: preprocess,
    postprocess: postprocess
  },
  '.coffee': {
    preprocess: preprocess,
    postprocess: postprocess
  }
};
