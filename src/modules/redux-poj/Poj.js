import { PID, OWN, CHI } from './constants.js'
import createComponent from './PojComponent.js'
import { getDefinition } from './Definition.js'


export default class Poj {
	constructor (state, parentPath, key) {
		const reg = {}
		const pojes = []
		const pojesIndex = {}
		const pid = state[PID]
		const path = parentPath.concat(key)
		const definition = getDefinition(pid)

		let asset = {}
		if (definition && definition.asset) {
			const scope = path.slice(0)
			asset = definition.asset({ scope, definition })
		}

		if (state[CHI]) {
			Object.entries(state[CHI]).forEach(([ key, state ]) => {
				const poj = new Poj(state, path, key)
				const component = poj.component
				reg[key] = poj
				pojes.push([ key, component ])
				pojesIndex[key] = component
			})
		}

		this.pid = pid
		this.reg = reg
		this.key = key
		this.path = path
		this.state = state
		this.parentPath = parentPath

		this.props = {
			asset,
			pojes,
			pojesIndex,
			poj: this,
			state: state[OWN] || {},
		}

		this.component = createComponent(this, definition)
		this.setState = this.setState.bind(this)
		this.mount = this.mount.bind(this)
		this.unmount = this.unmount.bind(this)
	}

	setState (state) {
		if (this.state === state) return

		const props = {}

		if (this.state[OWN] !== state[OWN]) {
			props.state = state[OWN]
		}

		const stateChi = this.state[CHI]
		const nextStateChi = state[CHI]
		if (stateChi !== nextStateChi) {
			let isChanged
			const reg = this.reg
			const path = this.path
			const nextPojes = []
			const nextPojesIndex = {}
			for (const key in nextStateChi) {
				// new
				if (!(key in stateChi)) {
					const poj = new Poj(nextStateChi[key], path, key)
					const component = poj.component
					reg[key] = poj
					nextPojes.push([ key, component ])
					nextPojesIndex[key] = component
					isChanged = true
				}
				// existed
				else {
					const poj = reg[key]
					poj.setState(nextStateChi[key])
					const component = poj.component
					nextPojes.push([ key, component ])
					nextPojesIndex[key] = component
				}
			}
			for (const key in stateChi) {
				// to remove
				if (!(key in nextStateChi)) {
					delete reg[key]
					isChanged = true
				}
			}
			if (isChanged) {
				props.pojes = nextPojes
				props.pojesIndex = nextPojesIndex
			}
		}

		this.state = state

		if (props.state || props.pojes) {
			props.poj = this
			props.asset = this.props.asset
			this.props = props
			this.updateComponent && this.updateComponent(props)
		}
	}

	mount (updateComponent) {
		this.updateComponent = updateComponent
	}

	unmount () {
		delete this.updateComponent
	}
}
