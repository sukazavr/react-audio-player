let _cb
let _state
let _getState
let _unsubscribe
let _defaultSelector = (state) => (state.POJ)

export const subscribe = (cb) => {
	_cb = cb
}

const updatePojesState = () => {
	const state = _getState()
	if (_state !== state) {
		_cb && _cb(state)
		_state = state
	}
}

export const attachStore = (store, selector = _defaultSelector) => {
	_unsubscribe && _unsubscribe()
	_getState = () => selector(store.getState())
	_unsubscribe = store.subscribe(updatePojesState)
}

export const getPojState = (key) => {
	if (_getState) {
		return _getState()[key]
	}
}
