module.exports =
	extends: require.resolve('./base'),
	rules:
		'coffee/arrow-spacing': ['error',
			spacing: { before: 1, after: 1 }
		]
		'coffee/camel-case-classes': ['error', {}]
		'coffee/coffeescript-error': ['error', {}]
		'coffee/duplicate-key': ['error', {}]
		'coffee/ensure-comprehensions': ['error', {}]
		'coffee/eol-last': ['warn', {}]
		'coffee/braces-spacing': ['warn',
			spaces: 1,
			empty_object_spaces: 0
		]
		'coffee/colon-assignment-spacing': ['warn',
			spacing: { left: 0, right: 1 }
		]
		'coffee/cyclomatic-complexity': ['error', value: 10 ]
		'coffee/indentation': ['error', value: 1 ]
		'coffee/line-endings': ['error', value: 'unix' ]
		'coffee/max-line-length': ['warn',
			value: 150,
			limitComments: false
		]
		'coffee/missing-fat-arrows': ['warn', is_strict: false ]
		'coffee/newlines-after-classes': ['off', value: 2 ]
		'coffee/no-debugger': ['warn', console: true ]
		'coffee/no-empty-functions': ['off', {}]
		'coffee/no-empty-param-list': ['off', {}]
		'coffee/no-implicit-braces': ['off', warn: true ]
		'coffee/no-implicit-parens': ['off', warn: true ]
		'coffee/no-interpolation-in-single-quotes': ['error', {}]
		'coffee/no-nested-string-interpolation': ['error', {}]
		'coffee/no-trailing-whitespace': ['error',
			allowed_in_comments: false,
			allowed_in_empty_lines: false
		]
		'coffee/no-tabs': ['off', {}]
		'coffee/no-this': ['error', {}]
		'coffee/no-backticks': ['error', {}]
		'coffee/no-plusplus': ['off', {}]
		'coffee/no-stand-alone-at': ['off', {}]
		'coffee/no-private-function-fat-arrows': ['warn', {}]
		'coffee/no-throwing-strings': ['error', {}]
		'coffee/no-trailing-semicolons': ['error', {}]
		'coffee/no-unnecessary-fat-arrows': ['warn', {}]
		'coffee/space-operators': ['off', {}]
		'coffee/spacing-after-comma': ['warn', {}]
		'coffee/transform-messes-up-line-numbers': ['error', {}]
		'coffee/empty-constructor-needs-parens': ['off', {}]
		'coffee/non-empty-constructor-needs-parens': ['off', {}]
