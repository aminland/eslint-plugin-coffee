import g from './globals'

export arrayToObject = (arr) -> Object.assign {}, ...arr.map (item) ->
	[Array.isArray(item) and item[0] or item]: Array.isArray(item) and item[1] or item


export isLiterate = (filename) ->
	filename.toLocaleLowerCase().split('.')[-1..][0].startsWith('lit')

export isCoffeeFile = (f) ->
	f.match new RegExp g.CoffeeExtensions.join('|').replace(/\./g,'\\.')
