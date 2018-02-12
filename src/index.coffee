

import { rules, registerCoffeeLintRule } from './rules'
import { processors } from './processors'
import { parse } from './parser'
import BaseConfig from './configs/base'
import RecommendedConfig from './configs/recommended'

configs =
	base: BaseConfig
	recommended: RecommendedConfig

export { rules, processors, parse, configs }
