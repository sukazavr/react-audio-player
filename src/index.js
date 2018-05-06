import './dataflow-components/actions'
import initUI from './modules/init-ui'
import initCycle from './modules/init-cycle'
import main from './dataflow-components/main'


initCycle(main)
initUI()
