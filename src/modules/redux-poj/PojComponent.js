import { Component, createElement } from 'react'


class PojComponent extends Component {
	constructor ({ poj }) {
		super()
		this.state = poj.props
	}
	shouldComponentUpdate (_, nextState) {
		return this.state !== nextState
	}
	componentDidMount () {
		this.off = this.props.poj.mount((props) => {
			this.setState(() => (props))
		})
	}
	componentWillUnmount () {
		this.props.poj.unmount()
	}
	render () {
		return createElement(this.props.view, this.state)
	}
}

export default (poj, definition) => {
	const props = {
		poj,
		key: poj.key,
		view: definition ? definition.view : `No view in definition of ${poj.pid}`,
	}
	return createElement(PojComponent, props)
}
