import React from 'react'
import FlexView from 'react-flexview'
import { InputGroup } from '@blueprintjs/core'

import T from '../../modules/T'
import { definePoj } from '../../modules/redux-poj'
import { createReactions } from '../../modules/reactions'


export default definePoj({
	id: 'SearchBar',
	state: {
		init: {
			text: '',
		},
		reducer: {
			[T.SEARCHBAR_TYPE]: (state, { text }) => ({ text }),
		},
	},
	asset: createReactions({
		type: (R, e) => R(e.target.value),
	}),
	view: ({ state: { text }, asset: { type } }) => {
		const props = {
			large: true,
			type: 'text',
			value: text,
			onChange: type,
			leftIcon: 'search',
			className: 'pt-fill',
			placeholder: 'Search for artists or tracks',
		}
		return (
			<FlexView>
				<InputGroup {...props}/>
			</FlexView>
		)
	}
})
