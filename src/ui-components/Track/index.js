import React from 'react'
import FlexView from 'react-flexview'
import { set } from 'unchanged'
import { Card, Icon, Text } from '@blueprintjs/core'

import T from '../../modules/T'
import { definePoj } from '../../modules/redux-poj'
import { createReactions } from '../../modules/reactions'
import SecFormat from '../SecFormat'
import $ from './style'


export default definePoj({
	id: 'Track',
	state: {
		init: ({ trackID, trackInfo }) => ({
			trackID,
			trackInfo,
			isPlaying: false,
		}),
		reducer: {
			[T.PLAYER_PLAY]: (state) => set('isPlaying', true, state),
			[T.PLAYER_PAUSE]: (state) => set('isPlaying', false, state),
		},
	},
	asset: createReactions({
		play: (R, trackID) => () => R(trackID),
		pause: (R, trackID) => () => R(trackID),
	}),
	view: ({ state: { trackID, trackInfo, isPlaying }, asset: { play, pause } }) => {
		const { artist, title, duration } = trackInfo
		const trackName = `${artist} — ${title}`
		const toggle = isPlaying ? pause(trackID) : play(trackID)
		const btnProps = {
			iconSize: 24,
			icon: isPlaying ? 'pause' : 'play',
			className: $.control,
		}
		return (
			<Card interactive={true} elevation={1} onClick={toggle} className={$.container}>
				<FlexView>
					<Icon {...btnProps}/>
					<FlexView grow={1} vAlignContent='center'>
						<Text ellipsize={true}>{trackName}</Text>
					</FlexView>
					<FlexView vAlignContent='center'>
						<SecFormat sec={duration}/>
					</FlexView>
				</FlexView>
			</Card>
		)
	}
})
