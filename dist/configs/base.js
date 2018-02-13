'use strict';

module.exports = {
  root: true,
  parser: "@fellow/eslint-plugin-coffee",
  parserOptions: {
    parser: 'babel-eslint', // Original parser config goes here
    sourceType: 'module',
    ecmaVersion: 8,
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true
    }
  },
  env: {
    node: true,
    es6: true
  },
  plugins: ['@fellow/eslint-plugin-coffee'],
  rules: {
    '@fellow/coffee/coffeescript-error': ['error', {}]
  }
};