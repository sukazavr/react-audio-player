import Poj from './Poj.js'
import PojScope from './PojScope.js'
import { setDefinition } from './Definition.js'
import { attachStore, subscribe, getPojState } from './store.js'


export const definePoj = setDefinition
export const attachPojStore = attachStore

let _entryPojes
const _entryPojesComponents = {}

export const entryPoj = (key, definition, args) => {
	if (_entryPojesComponents[key]) {
		return _entryPojesComponents[key]
	}
	else {
		if (definition) {
			const initialState = getPojState(key) || definition.getInitialState(args)
			const poj = new Poj(initialState, [], key)
			if (!_entryPojes) {
				_entryPojes = []
				subscribe((state) => {
					_entryPojes.forEach(({ key, setState }) => {
						setState(state[key])
					})
				})
			}
			_entryPojes.push({
				key,
				initialState,
				setState: poj.setState,
				reducer: definition.reducer,
			})
			return _entryPojesComponents[key] = poj.component
		}
		else {
			return null
		}
	}
}

export const reducer = (state = {}, action) => {
	if (_entryPojes && action.pojScope) {
		let isChanged
		const pojScope = new PojScope(action.pojScope)
		const possibleState = _entryPojes.reduce((nextState, { key, initialState, reducer }) => {
			let next
			const pojState = state[key]
			if (pojScope.canGoDown(key)) {
				next = reducer(pojState || initialState, action, pojScope)
				pojScope.plsGoUp()
			}
			else {
				next = (pojState || initialState)
			}
			if (next !== pojState) {
				if (!isChanged) isChanged = true
				nextState[key] = next
			}
			return nextState
		}, {})
		return isChanged ? possibleState : state
	}
	else {
		return state
	}
}
