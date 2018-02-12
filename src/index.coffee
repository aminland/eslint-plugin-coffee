import ModuleRequire from 'eslint-module-utils/module-require'
import { rules, registerCoffeeLintRule } from './rules'
import { generic_processor, processors } from './processors'

import BaseConfig from './configs/base'
import RecommendedConfig from './configs/recommended'

import g from './globals'


configs =
	base: BaseConfig
	recommended: RecommendedConfig

isCoffeeFile = (f) -> f.match new RegExp g.CoffeeExtensions.join('|').replace(/\./g,'\\.')
# must match ESLint default options or we'll miss the eslint cache every time
parserOptions =
	loc: true
	range: true
	raw: true
	tokens: true
	comment: true
	attachComment: true

parse = (content, options) ->
	options = Object.assign {}, options, parserOptions

	realParser = ModuleRequire options.parser

	if not options.filePath
		throw new Error("no file path provided!")

	if isCoffeeFile(options.filePath) and not g.CoffeeCache[options.filePath]
		# processor hasn't run on this coffeefile (probably from the `import` plugin)
		content = generic_processor.preprocess(content, options.filePath)[0]

	# file is coffeescript at this point
	return realParser.parse(content, options)

export { rules, processors, parse, configs }
