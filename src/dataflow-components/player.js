import xs from 'xstream'
import flattenConcurrently from 'xstream/extra/flattenConcurrently'

import T from '../modules/T'
import playlist from './data-playlist'
import Track from '../ui-components/Track'
import Player from '../ui-components/Player'


const plSize = playlist.length

export default (sources) => {
	const sinks = {}
	const { REDUX_ACTION, REACTIONS, PLAYBACK } = sources

	const $track = REACTIONS.poj(Track)
	const $player = REACTIONS.poj(Player)

	const pause$ = xs.merge($player.pause, $track.pause)
		.map(([ , trackID ]) => (trackID))

	const play$ = xs.merge($player.play, $track.play)
		.map(([ , trackID ]) => {
			return (trackID !== null)
				? trackID
				: Math.floor(Math.random() * plSize)
		})

	const skipTo$ = $player.skip
		.map(([ , { trackID, shift } ]) => {
			if (trackID === null) {
				return shift > 0 ? 0 : (plSize - 1)
			}
			const sum = (trackID + shift)
			if (sum >= plSize) return plSize - sum
			if (sum < 0) return plSize + sum
			return sum
		})

	const nextTrackOnEnd$ = PLAYBACK.end$
		.map((trackID) => {
			const nextTrackID = (trackID + 1)
			return (nextTrackID < plSize)
				? nextTrackID
				: 0
		})

	const anyPlay$ = xs.merge(play$, skipTo$, nextTrackOnEnd$)

	const playToAction$ = anyPlay$
		.map((trackID) => xs.merge(

			// Запуск трека в плеере
			xs.of(T.PLAYER_PLAY([
				'shell.player',
				[ 'shell', 'playlist', trackID ],
			], {
				trackID,
				trackInfo: playlist[trackID],
			})),

			// Пауза запущенного трека
			pause$.map(() => T.PLAYER_PAUSE([
				'shell.player',
				[ 'shell', 'playlist', trackID ],
			])),

			// Пауза запущенного трека, когда запускается другой трек
			anyPlay$.map(() => T.PLAYER_PAUSE([
				[ 'shell', 'playlist', trackID ],
			]))
		).take(2))
		.compose(flattenConcurrently)

	const stepAsReaction$ = PLAYBACK.step$.map((val) => ([ 'shell.player', { prop: 'elapsedTime', val } ]))

	const progressToAction$ = xs.merge($player.instaProgress, stepAsReaction$)
		.map(([ scope, payload ]) => T.PLAYER_PROGRESS_SET([ scope ], payload))

	sinks.REDUX_ACTION = xs.merge(playToAction$, progressToAction$)


	const playToPlayback$ = anyPlay$
		.map((trackID) => [ 'play', { trackID, src: playlist[trackID].src } ])

	const pauseToPlayback$ = pause$.map(() => [ 'pause' ])

	const seekToPlayback$ = $player.seekRelease.map(([ , sec ]) => [ 'seek', sec ])

	const setVolumeToPlayback$ = $player.instaProgress
		.filter(([ , { prop } ]) => (prop === 'volume'))
		.map(([ , { val } ]) => [ 'volume', (val / 100) ])

	sinks.PLAYBACK = xs.merge(playToPlayback$, pauseToPlayback$, seekToPlayback$, setVolumeToPlayback$)


	return sinks
}
