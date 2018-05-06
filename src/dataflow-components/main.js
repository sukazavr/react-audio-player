import xs from 'xstream'

import T from '../modules/T'
import player from './player'
import searchBar from './search-bar'
import playlist from './data-playlist'


export default (sources) => {
	const sinks = {}
	const $player = player(sources)
	const $searchBar = searchBar(sources)

	sinks.REDUX_ACTION = xs.merge(
		$player.REDUX_ACTION,
		$searchBar.REDUX_ACTION,
		xs.of(T.PLAYLIST_INIT([ 'shell.playlist' ], playlist)),
	).debug('action$')

	sinks.PLAYBACK = $player.PLAYBACK.debug('playback$')

	return sinks
}
