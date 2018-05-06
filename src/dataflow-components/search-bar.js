import Wade from 'wade'

import T from '../modules/T'
import playlist from './data-playlist'
import SearchBar from '../ui-components/SearchBar'


const search = Wade(playlist.map(({ artist, title }) => (`${artist} ${title}`)))

export default (sources) => {
	const sinks = {}
	const { REDUX_ACTION, REACTIONS } = sources

	const $searchBar = REACTIONS.poj(SearchBar)

	sinks.REDUX_ACTION = $searchBar.type.map(([ scope, text ]) => ([
		T.SEARCHBAR_TYPE([ scope ], { text }),
		T.PLAYLIST_FILTER([ 'shell.playlist' ], {
			filter: (text ? search(text) : null),
		}),
	]))

	return sinks
}
