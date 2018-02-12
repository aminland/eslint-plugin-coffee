module.exports =
	root: true
	parser: "eslint-plugin-coffee",
	parserOptions:
		parser: 'babel-eslint' # Original parser config goes here
		sourceType: 'module'
		ecmaVersion: 8
		ecmaFeatures:
			jsx: true
			experimentalObjectRestSpread: true

	env:
		node: true
		es6: true

	plugins: ['eslint-plugin-coffee']
	rules:
		'coffee/coffeescript-error': ['error', {}]
