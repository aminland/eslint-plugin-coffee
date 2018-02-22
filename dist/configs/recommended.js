'use strict';

module.exports = {
  extends: require.resolve('./base'),
  rules: {
    '@fellow/coffee/coffeescript-error': ['error', {}],
    '@fellow/coffee/arrow-spacing': ['warn', {}],
    '@fellow/coffee/camel-case-classes': ['warn', {}],
    '@fellow/coffee/duplicate-key': ['error', {}],
    '@fellow/coffee/ensure-comprehensions': ['error', {}],
    '@fellow/coffee/eol-last': ['warn', {}],
    '@fellow/coffee/braces-spacing': ['warn', {
      spaces: 1,
      empty_object_spaces: 0
    }],
    '@fellow/coffee/colon-assignment-spacing': ['warn', {
      spacing: {
        left: 0,
        right: 1
      }
    }],
    '@fellow/coffee/cyclomatic-complexity': ['error', {
      value: 10
    }],
    '@fellow/coffee/indentation': ['error', {
      value: 4
    }],
    '@fellow/coffee/line-endings': ['error', {
      value: 'unix'
    }],
    '@fellow/coffee/max-line-length': ['warn', {
      value: 150,
      limitComments: false
    }],
    '@fellow/coffee/missing-fat-arrows': ['error', {
      is_strict: true
    }],
    '@fellow/coffee/newlines-after-classes': ['off', {
      value: 2
    }],
    '@fellow/coffee/no-debugger': ['warn', {
      console: true
    }],
    '@fellow/coffee/no-empty-functions': ['off', {}],
    '@fellow/coffee/no-empty-param-list': ['off', {}],
    '@fellow/coffee/no-implicit-braces': ['off', {
      warn: true
    }],
    '@fellow/coffee/no-implicit-parens': ['off', {
      warn: true
    }],
    '@fellow/coffee/no-interpolation-in-single-quotes': ['error', {}],
    '@fellow/coffee/no-nested-string-interpolation': ['error', {}],
    '@fellow/coffee/no-trailing-whitespace': ['error', {
      allowed_in_comments: false,
      allowed_in_empty_lines: false
    }],
    '@fellow/coffee/no-tabs': ['off', {}],
    '@fellow/coffee/no-this': ['error', {}],
    '@fellow/coffee/no-backticks': ['error', {}],
    '@fellow/coffee/no-plusplus': ['off', {}],
    '@fellow/coffee/no-stand-alone-at': ['off', {}],
    '@fellow/coffee/no-private-function-fat-arrows': ['warn', {}],
    '@fellow/coffee/no-throwing-strings': ['error', {}],
    '@fellow/coffee/no-trailing-semicolons': ['error', {}],
    '@fellow/coffee/no-unnecessary-fat-arrows': ['warn', {}],
    '@fellow/coffee/space-operators': ['off', {}],
    '@fellow/coffee/spacing-after-comma': ['warn', {}],
    '@fellow/coffee/transform-messes-up-line-numbers': ['error', {}],
    '@fellow/coffee/empty-constructor-needs-parens': ['off', {}],
    '@fellow/coffee/non-empty-constructor-needs-parens': ['off', {}]
  }
};