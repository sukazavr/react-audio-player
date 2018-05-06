import { makeStreamFire } from './utils'


const [ reactions$, fire ] = makeStreamFire()

const createScoped = (pojDefinition) => {
	const scoped$ = reactions$.filter((p) => (p.pojDefinition === pojDefinition))
	return new Proxy({}, {
		get: (reactions, reactionName) => {
			let reaction$ = reactions[reactionName]
			if (!reaction$) {
				reaction$ = scoped$
					.filter((p) => (p.reactionName === reactionName))
					.map((p) => (p.v))
				reactions[reactionName] = reaction$
			}
			return reaction$
		}
	})
}

export const reactionsDriver = () => {
	const cache = {}
	return {
		poj: (pojDefinition) => {
			let scoped = cache[pojDefinition.id]
			if (!scoped) {
				scoped = createScoped(pojDefinition)
				cache[pojDefinition.id] = scoped
			}
			return scoped
		}
	}
}

export const createReactions = (reg) => ({ definition, scope }) => {
	const pojDefinition = definition
	return Object.entries(reg).reduce((reactions, [ reactionName, reaction ]) => {
		const R = (val) => fire({ pojDefinition, reactionName, v: [ scope, val ] })
		if (typeof reaction === 'function') {
			reactions[reactionName] = reaction.bind(null, R)
		}
		else {
			reactions[reactionName] = R
		}
		return reactions
	}, {})
}
