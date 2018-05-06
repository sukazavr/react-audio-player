export default ({ sec }) => {
	const minutes = Math.floor(sec / 60) || 0
	const seconds = Math.floor(sec - minutes * 60) || 0
	return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
}
