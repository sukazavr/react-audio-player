
const createActionCreator = (type) => (pojScope, payload) => {
	const action = { type }

	if (Array.isArray(pojScope)) {
		action.pojScope = pojScope.map((scope) => {
			return (typeof scope === 'string')
				? scope.split('.')
				: scope
		})
	}
	else if (!payload) {
		payload = pojScope
	}

	if (typeof payload === 'object') {
		action.payload = payload
	}

	return action
}

export default new Proxy({}, {
	get: (actionCreators, type) => {
		let actionCreator = actionCreators[type]
		if (actionCreator) {
			return actionCreator
		}
		else {
			throw new Error(`Action type "${type}" doesn't exist`)
		}
	},
	set: (actionCreators, type) => {
		let actionCreator = actionCreators[type]
		if (actionCreator) {
			throw new Error(`Action type "${type}" is already defined`)
		}
		else {
			actionCreator = createActionCreator(type)
			actionCreator.toString = () => (type)
			actionCreators[type] = actionCreator
			return true
		}
	},
})
