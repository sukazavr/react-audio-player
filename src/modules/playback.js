import xs from 'xstream'
import dropRepeats from 'xstream/extra/dropRepeats'
import { Howl, Howler } from 'howler'
import { makeStreamFire } from './utils'


let current
const cache = {}
const [ end$, fireEnd ] = makeStreamFire()

const methods = {
	play: ({ src, trackID }) => {
		let howl = cache[src]
		if (!howl) {
			howl = new Howl({
				src,
				html5: true,
				onend: () => fireEnd(trackID),
			})
			cache[src] = howl
		}
		if (current) {
			if (current !== howl) {
				current && current.stop()
				current = howl
			}
		}
		else {
			current = howl
		}
		current.play()
	},
	pause: () => {
		current && current.pause()
	},
	seek: (sec) => {
		current && current.seek(sec)
	},
	volume: (val) => {
		Howler.volume(val)
	},
}

export const playbackDriver = (methods$) => {

	methods$.addListener({
		next: ([ methodName, payload ]) => {
			const method = methods[methodName]
			method && method(payload)
		}
	})

	const step$ = methods$
		.filter(([ methodName ]) => (methodName !== 'volume'))
		.map(() => xs.merge(
			xs.of(0),
			xs.periodic(1000),
		))
		.flatten()
		.map(() => (Math.round(current && current.seek()) || 0))
		.compose(dropRepeats())

	return {
		end$,
		step$,
	}
}
