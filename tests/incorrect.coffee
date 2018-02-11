
class Parent
	constructor: (@name) ->

export class Child extends Parent
	constructor: (name="") ->
		super()
		@name = unused = name
