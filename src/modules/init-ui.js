import React from 'react'
import ReactDOM from 'react-dom'
import Shell from '../ui-components/Shell'


export const rootNode = document.getElementById('root')
export default () => ReactDOM.render(<Shell/>, rootNode)
