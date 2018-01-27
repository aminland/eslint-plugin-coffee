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
  'one-var-declaration-per-line',
  'func-names',
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
  'object-curly-spacing',
  'no-else-return',
  'react/jsx-closing-tag-location',
  'react/jsx-first-prop-new-line',
  'react/jsx-max-props-per-line',
  ['no-unused-vars', m => m.line==1 && m.column == 1 ]

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
      var start = map.originalPositionFor({line:m.line, column:m.column, bias: map.GREATEST_LOWER_BOUND});
      var end = map.originalPositionFor({line:m.endLine, column:m.endColumn, bias: map.LEAST_UPPER_BOUND});
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
