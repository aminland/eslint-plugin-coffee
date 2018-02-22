import ModuleRequire from 'eslint-module-utils/module-require'
import * as CoffeeLint from '@fellow/coffeelint2'

import _ from 'lodash'

import { isLiterate, isCoffeeFile } from './helpers'
import g from './globals'

export rules = {}

export registerCoffeeLintRule = (ruleName, config={}, ruleConstructor=null) ->
	if ruleConstructor
		wrappedRule = ruleConstructor

	else if typeof ruleName != 'string'
		wrappedRule = ruleName
		ruleName = wrappedRule.prototype.rule.name
	else if ruleConstructor
		wrappedRule = ruleName
	else
		try
			wrappedRule = require("@fellow/coffeelint2/lib/rules/#{ruleName}")
		catch e
			try
				wrappedRule = require("coffeelint/lib/rules/#{ruleName}")
			catch e
				wrappedRule = ModuleRequire("#{ruleName}")

	# by default we want these rules to be ignored.
	wrappedRule.prototype?.rule?.level = 'ignore'
	_.extend(wrappedRule.prototype, config)

	if ruleName != 'coffeescript_error'
		#this is the default fallback, we dont want to mess with it.
		CoffeeLint.registerRule wrappedRule, ruleName

	name = _.kebabCase(ruleName.split('/').reverse()[0].split('.').reverse()[0])
	return rules[name]  = {
		meta:
			docs:
				name: ruleName
				description: wrappedRule.prototype.rule.description
				category: "CoffeeLint Rule"
				url: "http://www.coffeelint.org/"

			schema: [
				type: "object",
				properties: {}
				additionalProperties: true
			]
		create: (context) ->
			# level cannot be known from inside an eslint rule.
			# if we've gotten here already, the assumption is that the rule is not off
			options = { ...context.options[0], level: 'warn' }

			ruleConf = _.omit { ...wrappedRule.prototype.rule, ...options}, ['name', 'description', 'message']

			g.CoffeeLintConfig[ruleName] = {...g.CoffeeLintConfig[ruleName], ...ruleConf}
			return {
				Program: (node) ->
					# By this point all rules are created, so we will run this rule from eslint once, and cache that value
					filename = context.getFilename()
					return unless isCoffeeFile filename

					current = g.CoffeeCache[filename]
					if not current.clErrors?
						try
							current.clErrors = CoffeeLint.lint current.source, g.CoffeeLintConfig, isLiterate(filename)
						catch e
							console.log e
						g.CoffeeCache[filename] = current

					rule_errors = current.clErrors
						.filter (el) ->
							_.kebabCase(el.name) == _.kebabCase(ruleName) or
								not el.name? and ruleName == 'coffeescript_error'
						.map (el) ->
							location = {}
							if el.lineNumber
								location.start = { line: el.lineNumber, column: (el.columnNumber ? 0) - 1 }
							if el.lineNumberEnd or el.columnNumberEnd
								location.end = { line: el.lineNumberEnd or el.lineNumber, column: (el.columnNumberEnd ? el.columnNumber) - 1 }

							node: {type: "coffeelint"}
							message: "#{el.message}" + (if el.context then " [#{el.context}]" else "")
							loc: location

					rule_errors.forEach (el) -> context.report el
			}
	}

class CoffeescriptError
	rule:
		name: 'coffeescript_error'
		description: 'CoffeeScript error'
		level: 'error'
		message: ''

registerCoffeeLintRule require '@fellow/coffeelint2/lib/rules/arrow_spacing'
registerCoffeeLintRule require '@fellow/coffeelint2/lib/rules/braces_spacing'
registerCoffeeLintRule require '@fellow/coffeelint2/lib/rules/no_tabs'
registerCoffeeLintRule require '@fellow/coffeelint2/lib/rules/no_trailing_whitespace'
registerCoffeeLintRule require '@fellow/coffeelint2/lib/rules/max_line_length'
registerCoffeeLintRule require '@fellow/coffeelint2/lib/rules/line_endings'
registerCoffeeLintRule require '@fellow/coffeelint2/lib/rules/no_trailing_semicolons'
registerCoffeeLintRule require '@fellow/coffeelint2/lib/rules/indentation'
registerCoffeeLintRule require '@fellow/coffeelint2/lib/rules/camel_case_classes'
registerCoffeeLintRule require '@fellow/coffeelint2/lib/rules/colon_assignment_spacing'
registerCoffeeLintRule require '@fellow/coffeelint2/lib/rules/no_implicit_braces'
registerCoffeeLintRule require '@fellow/coffeelint2/lib/rules/no_nested_string_interpolation'
registerCoffeeLintRule require '@fellow/coffeelint2/lib/rules/no_plusplus'
registerCoffeeLintRule require '@fellow/coffeelint2/lib/rules/no_throwing_strings'
registerCoffeeLintRule require '@fellow/coffeelint2/lib/rules/no_backticks'
registerCoffeeLintRule require '@fellow/coffeelint2/lib/rules/no_implicit_parens'
registerCoffeeLintRule require '@fellow/coffeelint2/lib/rules/no_empty_param_list'
registerCoffeeLintRule require '@fellow/coffeelint2/lib/rules/no_stand_alone_at'
registerCoffeeLintRule require '@fellow/coffeelint2/lib/rules/space_operators'
registerCoffeeLintRule require '@fellow/coffeelint2/lib/rules/duplicate_key'
registerCoffeeLintRule require '@fellow/coffeelint2/lib/rules/empty_constructor_needs_parens'
registerCoffeeLintRule require '@fellow/coffeelint2/lib/rules/cyclomatic_complexity'
registerCoffeeLintRule require '@fellow/coffeelint2/lib/rules/newlines_after_classes'
registerCoffeeLintRule require '@fellow/coffeelint2/lib/rules/no_unnecessary_fat_arrows'
registerCoffeeLintRule require '@fellow/coffeelint2/lib/rules/missing_fat_arrows'
registerCoffeeLintRule require '@fellow/coffeelint2/lib/rules/no_unnecessary_double_quotes'
registerCoffeeLintRule require '@fellow/coffeelint2/lib/rules/no_debugger'
registerCoffeeLintRule require '@fellow/coffeelint2/lib/rules/no_interpolation_in_single_quotes'
registerCoffeeLintRule require '@fellow/coffeelint2/lib/rules/no_empty_functions'
registerCoffeeLintRule require '@fellow/coffeelint2/lib/rules/prefer_english_operator'
registerCoffeeLintRule require '@fellow/coffeelint2/lib/rules/spacing_after_comma'
registerCoffeeLintRule require '@fellow/coffeelint2/lib/rules/transform_messes_up_line_numbers'
registerCoffeeLintRule require '@fellow/coffeelint2/lib/rules/ensure_comprehensions'
registerCoffeeLintRule require '@fellow/coffeelint2/lib/rules/no_this'
registerCoffeeLintRule require '@fellow/coffeelint2/lib/rules/eol_last'
registerCoffeeLintRule require '@fellow/coffeelint2/lib/rules/no_private_function_fat_arrows'
registerCoffeeLintRule CoffeescriptError

#registerCoffeeLintRule require '@fellow/coffeelint2/lib/rules/non_empty_constructor_needs_parens'
