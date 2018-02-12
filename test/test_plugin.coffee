path = require 'path'
vows = require 'vows'
assert = require 'assert'

coffeePlugin = require(path.resolve(__dirname, '../dist'))
CLIEngine = require('eslint').CLIEngine
cli = new CLIEngine {

	'parser': path.resolve(__dirname, '../dist'),
	'parserOptions': { # original parser config goes here
		'parser': 'babel-eslint',
		'sourceType': 'module',
		'ecmaVersion': 8,
		'coffeeExtensions': ['.cjsx', '.coffeescript', '.coffee']
	},
	'env': {
		'node': true,
	},
	settings: {
		'coffee-extensions': ['.cjsx', '.coffeescript', '.coffee']
	}
}
cli.addPlugin "eslint-plugin-coffee", coffeePlugin

lintFile = (file) -> cli.executeOnFiles [path.resolve(__dirname, file)]

lintSource = (filename, source) -> cli.executeOnText source, filename

vows.describe('plugin').addBatch
	'Lints clean':
		topic: lintSource 'clean.coffee', '''
			class Parent
				constructor: (@name)->

			export class Child extends Parent
				constructor: (name="") ->
					super()
					@name = name

			'''

		'no lint': ({ results }) ->
			assert.lengthOf results[0].messages, 0

	'Lints dirty':
		topic: lintSource 'incorrect.coffee', '''
			class Parent
				constructor: (@name) ->

			export class Child extends Parent
				constructor: (name="") ->
					super()
					@name = unused = name

			'''

		'found lint': ({ results }) ->
			message = results[0]?.messages?.map((x) -> x.message)
			assert.deepEqual message, ["'unused' is assigned a value but never used."]

	'Bad Syntax':
		topic: ['dirty.coffee', '''
			class Parent
				constructor: (@name) ->

			export class Child extends Parent
				constructor: (@parent) ->

			''']

		'throws syntax error': (args) ->
			try
				{ results } = lintSource(...args)
				message = results[0]?.messages?.map((x) -> x.message).join('')
			catch e
				return assert

			assert.isTrue message.startsWith("Parsing error"), "Expected parser error"
.export(module)
