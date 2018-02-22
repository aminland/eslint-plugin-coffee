'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NoSpaces,
    indentationRegex,
    indexOf = [].indexOf;

indentationRegex = /\S/;

module.exports = NoSpaces = function () {
  var NoSpaces = function () {
    function NoSpaces() {
      _classCallCheck(this, NoSpaces);
    }

    _createClass(NoSpaces, [{
      key: 'lintLine',
      value: function lintLine(line, lineApi) {
        var indentation;
        // Only check lines that have compiled tokens. This helps
        // us ignore tabs in the middle of multi line strings, heredocs, etc.
        // since they are all reduced to a single token whose line number
        // is the start of the expression.
        indentation = line.split(indentationRegex)[0];
        if (lineApi.lineHasToken() && indexOf.call(indentation, ' ') >= 0) {
          return {
            columnNumber: indentation.indexOf(' ')
          };
        } else {
          return null;
        }
      }
    }]);

    return NoSpaces;
  }();

  ;

  NoSpaces.prototype.rule = {
    name: 'no_spaces',
    level: 'error',
    message: 'Line contains space indentation',
    description: 'This rule forbids spaces in indentation. Enough said. It is disabled by\ndefault.'
  };

  return NoSpaces;
}.call(undefined);