
export arrayToObject = (arr) -> Object.assign {}, ...arr.map (item) ->
	[Array.isArray(item) and item[0] or item]: Array.isArray(item) and item[1] or item


export isLiterate = (filename) ->
	filename.toLocaleLowerCase().split('.')[-1..][0].startsWith('lit')
