'use strict';

var path;

path = require('path');

module.exports = {
  root: true,
  parser: require.resolve('eslint-plugin-coffee'),
  parserOptions: {
    parser: 'babel-eslint', // Original parser config goes here
    cachePath: path.join(path.resolve(process.cwd(), 'node_modules'), '.eslintcoffee'),
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
  plugins: ['coffee'],
  rules: {
    'coffee/coffeescript-error': ['error', {}]
  }
};