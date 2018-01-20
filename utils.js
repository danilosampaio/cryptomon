exports.values2json = function (values, props) {
	const json = {}
	for (let i = 0; i < props.length; i++) {
		json[props[i]] = values[i]
	}
	return json
}