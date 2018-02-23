import CoffeeScript from 'coffeescript'
import SourceMap from 'source-map'

import { arrayToObject, isLiterate } from './helpers'
import g from './globals'

# These are some of the rules you cannot fix due to the way coffeescript compiles.
export unfixableRules = arrayToObject [
	'no-var'
	'one-var'
	'vars-on-top'
	'one-var-declaration-per-line'
	'func-names'
	'arrow-body-style',
	'space-before-function-paren'
	'import/first'
	'comma-dangle'
	'padded-blocks'
	'no-extra-semi'
	'no-cond-assign'
	'quotes'
	'no-shadow'
	'wrap-iife'
	'no-plusplus'
	'no-multi-assign'
	'no-restricted-syntax'
	'object-curly-spacing'
	'no-else-return'
	'max-len'
	'no-nested-ternary'
	'object-curly-newline'
	'newline-per-chained-call'
	'import/no-mutable-exports' # Coffeescript defines everything as var
	'no-void' # this is used heavily by coffee (? operator)
	'no-sequences' # this is used heavily by coffee (e.g. storing a nested reference to make property access faster)
	'prefer-arrow-callback' # this is a style thing, and functions are ALL arrows in coffee
	'no-underscore-dangle' # functions like _extend are auto-added
	'consistent-return' # theoretically possible to fix these errors, but doesn't jibe well with the coffee way of implicit returns.
	'guard-for-in' # theoretically possible to fix these errors by not using coffee syntax, but that goes agains the spirit of the language.
	'react/jsx-closing-tag-location'
	'react/jsx-first-prop-new-line'
	'react/jsx-max-props-per-line'
	['no-param-reassign', (m) -> m.line == 1 and m.column == 1 ]
	['prefer-rest-params', (m) -> m.line == 1 and m.column == 1 ]
	['no-unused-vars', (m) -> m.line == 1 and m.column == 1 ]
]


export generic_processor =
	preprocess: (content, filename) ->
		if g.CoffeeCache[filename]
			content = g.CoffeeCache[filename].js
		else
			try
				results = CoffeeScript.compile content,
					sourceMap: true,
					bare: true,
					header: false,
					filename: filename
					literate: isLiterate filename
			catch
				results =
					js: '// Syntax Error'

			results.source = content
			# save result for later
			g.CoffeeCache[filename] = results
			content = results.js

		return [content]

	postprocess: (messages, filename) ->
		# maps the messages received to original line numbers and returns
		compiled = g.CoffeeCache[filename]

		map = undefined
		if compiled.v3SourceMap
			map = new SourceMap.SourceMapConsumer compiled.v3SourceMap

		output = messages[0]
			.map((m) ->
				if m.nodeType == "coffeelint" or not map?
					return m

				start = map.originalPositionFor line:m.line, column:m.column, bias: map.GREATEST_LOWER_BOUND
				end = map.originalPositionFor line:m.endLine, column:m.endColumn, bias: map.LEAST_UPPER_BOUND

				start.column += 1 if start.column != null
				end.column += 1 if end.column != null
				if end.line < start.line
					end.line = start.line
					end.column = start.column
				else if end.line == start.line and end.column < start.column
					end.column = start.column
				out = {
					...m,
					...{
						line:start.line,
						column: start.column,
						endLine:end.line,
						endColumn: end.column
					}
				}

				return out
			)
			.filter((m) ->
				if m.line is null or (unfixableRules[m.ruleId] and
							(typeof unfixableRules[m.ruleId] != 'function' || unfixableRules[m.ruleId](m)))
					return false

				return true
			)

		delete g.CoffeeCache[filename]

		return output

export processors = new Proxy {},
	ownKeys: (target) ->
		return g.CoffeeExtensions

	getOwnPropertyDescriptor: (target, k) ->
		if k in g.CoffeeExtensions
			return
				value: generic_processor
				enumerable: true
				configurable: true

	get: (target, name) ->
		if name in g.CoffeeExtensions
			return generic_processor

	set: (target, name, value) ->
		return false
