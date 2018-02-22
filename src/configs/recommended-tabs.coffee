module.exports =
    extends: require.resolve('./recommended'),
    rules:
        '@fellow/coffee/indentation': ['error', value: 1 ]
        '@fellow/coffee/no-tabs': ['off', {}]
        '@fellow/coffee/no-spaces': ['error', {}]
