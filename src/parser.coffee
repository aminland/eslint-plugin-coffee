
import ModuleRequire from 'eslint-module-utils/module-require'
import { generic_processor } from './processors'
import Cache from './cache'
import g from './globals'

# must match ESLint default options or we'll miss the cache every time
parserOptions =
	loc: true
	range: true
	raw: true
	tokens: true
	comment: true
	attachComment: true

export parse = (content, options) ->
	options = Object.assign {}, options, parserOptions

	realParser = ModuleRequire options.parser

	if parserOptions.cachepath
		g.CoffeeCache = new Cache(parserOptions.cachePath)

	if not options.filePath
		throw new Error("no file path provided!")

	if options.filePath.match new RegExp g.CoffeeExtensions.join('|')
		content = generic_processor.preprocess(content, options.filePath)[0]

	# file is coffeescript at this point
	return realParser.parse(content, options)
