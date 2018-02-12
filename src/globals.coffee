import Cache from './cache'

CoffeeExtensions = ['.cjsx', '.cjs', '.coffeescript', '.coffee', '.xcoffee', '.litcoffee', '.litxcoffee', '.litcjsx']
CoffeeLintConfig = {}
CoffeeCache = new Cache()

export default { CoffeeCache, CoffeeLintConfig, CoffeeExtensions }
