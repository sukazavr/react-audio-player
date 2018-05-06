import React from 'react'
import FlexView from 'react-flexview'

import 'sanitize.css/sanitize.css'
import '@blueprintjs/core/lib/css/blueprint.css'
import 'react-flexview/lib/flexView.css'

import T from '../../modules/T'
import { definePoj, entryPoj } from '../../modules/redux-poj'

import Player from '../Player'
import Playlist from '../Playlist'
import SearchBar from '../SearchBar'
import $ from './style'


const Shell = definePoj({
	id: 'Shell',
	pojes: {
		init: ({ add }) => {
			add('player', Player)
			add('searchBar', SearchBar)
			add('playlist', Playlist)
		},
	},
	view: ({ pojesIndex: { player, searchBar, playlist } }) => {
		return (
			<FlexView className={$.shell}>
				<FlexView column className={$.container}>
					<div className={$.section}>{player}</div>
					<div className={$.section}>{searchBar}</div>
					<div className={$.section}>{playlist}</div>
				</FlexView>
			</FlexView>
		)
	}
})

export default () => entryPoj('shell', Shell)
