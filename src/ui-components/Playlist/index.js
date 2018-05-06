import React from 'react'
import FlexView from 'react-flexview'
import { NonIdealState } from '@blueprintjs/core'

import T from '../../modules/T'
import { definePoj } from '../../modules/redux-poj'

import Track from '../Track'


export default definePoj({
	id: 'Playlist',
	state: {
		init: { filter: null },
		reducer: {
			[T.PLAYLIST_FILTER]: (state, { filter }) => ({ filter }),
		},
	},
	pojes: {
		control: {
			[T.PLAYLIST_INIT]: ({ add }, playlist) => {
				playlist.forEach((trackInfo, trackID) => {
					add(trackID, Track, { trackID, trackInfo })
				})
			},
		},
	},
	view: ({ pojes, pojesIndex, state: { filter } }) => {
		let list = <NonIdealState
			visual='add-to-artifact'
			title='Playlist Is Empty'
			description='Try to populate playlist'
		/>
		if (pojes.length) {
			if (filter) {
				const filtered = filter.map(({ index }) => (pojesIndex[index]))
				if (filtered.length) list = filtered
				else {
					list = <NonIdealState
						visual='search-template'
						title='No Results Were Found'
						description='Try different & more general keywords'
					/>
				}
			}
			else {
				list = pojes.map(([ , track ]) => (track))
			}
		}
		return (
			<FlexView column>
				{list}
			</FlexView>
		)
	}
})
