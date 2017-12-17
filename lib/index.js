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




// import processors
module.exports.processors = {
  postprocess: function (messages, filename) {
    // `messages` argument contains two-dimensional array of Message objects
    // where each top-level array item contains array of lint messages related
    // to the text that was returned in array from preprocess() method

    // you need to return a one-dimensional array of the messages you want to keep
    console.log('wat', messages)
    return messages[0];
  },
};
