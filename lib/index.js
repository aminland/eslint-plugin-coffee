/**
 * @fileoverview Transpile coffee files before eslint checks will be run
 * @author invntrm
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var requireIndex = require("requireindex");

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

// takes text of the file and filename
function preprocess (text, filename) {
  // here, you can strip out any non-JS content
  // and split into multiple strings to lint
  console.log('aa?', text, filename)
  return [text];  // return an array of strings to lint
}

function postprocess (messages, filename) {
  // `messages` argument contains two-dimensional array of Message objects
  // where each top-level array item contains array of lint messages related
  // to the text that was returned in array from preprocess() method

  // you need to return a one-dimensional array of the messages you want to keep
  console.log('wat', messages)
  return messages[0];
}

// import processors
module.exports.processors = {
  '.js': {
    preprocess: preprocess,
    postprocess: postprocess,
  },
  '.cjsx': {
    preprocess: preprocess,
    postprocess: postprocess
  },
  '.coffee': {
    preprocess: preprocess,
    postprocess: postprocess
  }
};
