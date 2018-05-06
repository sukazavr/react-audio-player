import { reduxBatch } from '@manaflair/redux-batch'
import { createCycleMiddleware } from 'redux-cycles'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { attachPojStore, reducer as POJ } from './redux-poj'


const reducer = combineReducers({ POJ })

const composeEnhancers = composeWithDevTools({
	serialize: {
		options: true
	}
})

export const cycleMiddleware = createCycleMiddleware()

const middleware = applyMiddleware(cycleMiddleware)

const enhancers = composeEnhancers(
	middleware,
	reduxBatch,
)

export const store = createStore(reducer, enhancers)

export const dispatch = store.dispatch

attachPojStore(store)
