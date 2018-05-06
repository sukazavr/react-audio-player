import React from 'react'
import FlexView from 'react-flexview'
import { set, merge } from 'unchanged'
import { Card, Icon, Slider, Text } from '@blueprintjs/core'

import T from '../../modules/T'
import { definePoj } from '../../modules/redux-poj'
import { createReactions } from '../../modules/reactions'
import SecFormat from '../SecFormat'
import $ from './style'


const initialState = {
	trackID: null,
	trackInfo: null,
	isPlaying: false,
	elapsedTime: 0,
	volume: 100,
}

export default definePoj({
	id: 'Player',
	state: {
		init: initialState,
		reducer: {
			[T.PLAYER_PLAY]: (state, { trackID, trackInfo }) => {
				return merge(null, { trackID, trackInfo, isPlaying: true }, state)
			},
			[T.PLAYER_PAUSE]: (state) => set('isPlaying', false, state),
			[T.PLAYER_PROGRESS_SET]: (state, { prop, val }) => set(prop, val, state),
		},
	},
	asset: createReactions({
		seekRelease: null,
		instaProgress: (R, prop) => (val) => R({ prop, val }),
		skip: (R, trackID, shift) => () => R({ trackID, shift }),
		play: (R, trackID) => () => R(trackID),
		pause: (R, trackID) => () => R(trackID),
	}),
	view: ({ state, asset }) => {
		const { trackID, trackInfo, elapsedTime, volume, isPlaying } = state
		const { play, pause, seekRelease, skip, instaProgress } = asset
		const primaryBtnClick = isPlaying ? pause(trackID) : play(trackID)
		const primaryBtnIconProps = {
			iconSize: 32,
			icon: isPlaying ? 'pause' : 'play',
		}

		let trackElements = null
		if (trackInfo) {
			const trackName = `${trackInfo.artist} — ${trackInfo.title}`
			trackElements = (
				<React.Fragment>
					<FlexView grow={1}>
						<FlexView column grow={1}>
							<Text ellipsize={true}>{trackName}</Text>
						</FlexView>
						<FlexView column>
							<SecFormat sec={elapsedTime}/>
						</FlexView>
					</FlexView>
					<FlexView>
						<Slider
							onRelease={seekRelease}
							value={elapsedTime}
							labelRenderer={false}
							max={trackInfo.duration}
							onChange={instaProgress('elapsedTime')}
						/>
					</FlexView>
				</React.Fragment>
			)
		}

		return (
			<Card elevation={2}>
				<FlexView>
					<FlexView shrink={0} marginRight={24}>
						<FlexView className={$.control} onClick={skip(trackID, -1)}>
							<Icon icon='step-backward' iconSize={24}/>
						</FlexView>
						<FlexView className={$.control} onClick={primaryBtnClick}>
							<Icon {...primaryBtnIconProps}/>
						</FlexView>
						<FlexView className={$.control} onClick={skip(trackID, 1)}>
							<Icon icon='step-forward' iconSize={24}/>
						</FlexView>
					</FlexView>
					<FlexView column grow={1} marginRight={24}>
						{trackElements}
					</FlexView>
					<FlexView shrink={0} width={150} vAlignContent='bottom' className={$.volume}>
						<Slider
							max={100}
							value={volume}
							labelRenderer={false}
							onChange={instaProgress('volume')}
						/>
					</FlexView>
				</FlexView>
			</Card>
		)
	}
})
