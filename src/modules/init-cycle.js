import { run } from '@cycle/run'
import { playbackDriver } from './playback'
import { reactionsDriver } from './reactions'
import { cycleMiddleware } from './init-store'


export default (main) => run(main, {
	PLAYBACK: playbackDriver,
	REACTIONS: reactionsDriver,
	REDUX_STATE: cycleMiddleware.makeStateDriver(),
	REDUX_ACTION: cycleMiddleware.makeActionDriver(),
})
