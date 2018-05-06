import StateOps from './StateOps.js'
import { PID, OWN, CHI } from './constants.js'


const noId = new Error('Poj should has an id')
const noView = new Error('Poj should contain view')
const noStateAndPojes = new Error('Poj should contain state or pojes')
const wrongAssetType = new Error('Poj asset type should be a function')

class Definition {
	constructor (id, state, pojes, asset, view) {
		this.id = id
		this.view = view
		this.asset = asset
		this.reducer = this.reducer.bind(this)

		if (state) {
			this.hasState = true
			const { init, reducer } = state
			if (typeof init === 'function') {
				this.stateInit = init
			}
			else if (typeof init === 'object') {
				this.stateRef = init
			}
			if (typeof reducer === 'function') {
				this.stateReducer = reducer
			}
			else if (typeof reducer === 'object') {
				this.stateReducer = (state, action) => {
					const { type, payload } = action
					const reduce = reducer[type]
					return reduce ? reduce(state, payload) : state
				}
			}
		}

		if (pojes) {
			this.hasPojes = true
			const { init, control } = pojes
			if (typeof init === 'function') {
				this.pojesInit = init
			}
			if (typeof control === 'function') {
				this.pojesControl = control
			}
			else if (typeof control === 'object') {
				this.pojesControl = (stateOps, action) => {
					const { type, payload } = action
					const comand = control[type]
					comand && comand(stateOps, payload)
				}
			}
		}
	}

	reducer (state, action, pojScope) {
		const { stateReducer, pojesControl } = this
		const nextState = {
			[PID]: state[PID],
		}

		const ownState = state[OWN]
		if (ownState) {
			if (stateReducer) {
				const possibleOwnState = stateReducer(ownState, action)
				const isOwnStateChanged = ownState !== possibleOwnState
				nextState[OWN] = isOwnStateChanged ? possibleOwnState : ownState
			}
			else {
				nextState[OWN] = ownState
			}
		}

		const chiState = state[CHI]
		if (chiState) {
			let isChiStateChanged
			let possibleChiState = chiState

			if (pojesControl) {
				const stateOps = new StateOps()
				pojesControl(stateOps, action)
				possibleChiState = stateOps.reduce(chiState)
				if (possibleChiState !== chiState) {
					isChiStateChanged = true
				}
			}

			const { canGoDown, plsGoUp } = pojScope
			possibleChiState = Object.entries(possibleChiState).reduce((nextState, [ key, state ]) => {
				if (canGoDown(key)) {
					const definition = getDefinition(state[PID])
					if (definition) {
						const next = definition.reducer(state, action, pojScope)
						if (!isChiStateChanged && next !== state) isChiStateChanged = true
						nextState[key] = next
					}
					else {
						nextState[key] = state
					}
					plsGoUp()
				}
				else {
					nextState[key] = state
				}
				return nextState
			}, {})

			nextState[CHI] = isChiStateChanged ? possibleChiState : chiState
		}

		return (ownState !== nextState[OWN] || chiState !== nextState[CHI]) ? nextState : state
	}

	getInitialState (args) {
		const { id, stateInit, stateRef, pojesInit } = this

		const initialState = {
			[PID]: id,
		}

		if (this.hasState) {
			if (stateInit) {
				initialState[OWN] = stateInit(args)
			}
			else if (stateRef) {
				initialState[OWN] = Object.assign({}, stateRef)
			}
			else {
				initialState[OWN] = {}
			}
		}

		if (this.hasPojes) {
			if (pojesInit) {
				const stateOps = new StateOps()
				pojesInit(stateOps, args)
				initialState[CHI] = stateOps.reduce({})
			}
			else {
				initialState[CHI] = {}
			}
		}

		return initialState
	}
}

const _definitions = {}

export const setDefinition = ({ id, state, pojes, asset, view }) => {
	if (typeof id !== 'string') throw noId
	if (_definitions[id]) throw new Error(`Poj id "${id}" already exists`)
	if (!state && !pojes) throw noStateAndPojes
	if (typeof view !== 'function') throw noView
	if (asset && typeof asset !== 'function') throw wrongAssetType
	return _definitions[id] = new Definition(id, state, pojes, asset, view)
}

export const getDefinition = (id) => {
	const definition = _definitions[id]
	!definition && console.error(`There is no "${id}" poj definition`)
	return definition
}
