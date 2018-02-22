'use strict';

module.exports = {
  extends: require.resolve('./recommended'),
  rules: {
    '@fellow/coffee/indentation': ['error', {
      value: 4
    }],
    '@fellow/coffee/no-tabs': ['off', {}]
  }
};