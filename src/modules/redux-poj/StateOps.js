export default class StateOps {
	constructor () {
		this._ops = []
		this.add = this.add.bind(this)
		this.remove = this.remove.bind(this)
		this.reduce = this.reduce.bind(this)
	}
	add (key, definition, args) {
		if (definition) {
			const state = definition.getInitialState(args)
			this._ops.push([ key, state ])
		}
	}
	remove (key) {
		this._ops.push([ key ])
	}
	reduce (state) {
		const operations = this._ops
		if (operations.length) {
			let isStateChanged
			const nextState = Object.assign({}, state)
			const possibleState = operations.reduce((nextState, [ key, state ]) => {
				if (state) {
					nextState[key] = state
					isStateChanged = true
				}
				else {
					if (nextState[key]) {
						delete nextState[key]
						isStateChanged = true
					}
				}
				return nextState
			}, nextState)
			operations.length = 0
			return isStateChanged ? possibleState : state
		}
		return state
	}
}
