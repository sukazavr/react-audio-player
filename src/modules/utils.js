import xs from 'xstream'


export const makeStreamFire = () => {
	let _next
	const fire = (val) => (_next && _next(val))
	const stream$ = xs.create({
		start: (l) => {
			_next = l.next.bind(l)
		},
		stop: () => {
			_next = null
		}
	})
	return [ stream$, fire ]
}

export const objShallowEqual = (a, b) => {
	const aKeys = Object.keys(a)
	const bKeys = Object.keys(b)
	const aLen = aKeys.length
	const bLen = bKeys.length

	if (aLen === bLen) {
		for (let i = 0; i < aLen; ++i) {
			const key = aKeys[i]
			if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key) || a[key] !== b[key]) {
				return false
			}
		}
		return true
	}

	return false
}
