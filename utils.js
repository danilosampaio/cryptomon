const ws = require('ws')
const HttpsProxyAgent = require('https-proxy-agent')
const url = require('url')

exports.values2json = function (values, props) {
	const json = {}
	for (let i = 0; i < props.length; i++) {
		json[props[i]] = values[i]
	}
	return json
}

exports.getWS = function (config) {
	if (config.proxy) {
		const options = url.parse(config.proxy);
		const agent = new HttpsProxyAgent(options)
		return new ws(config.endpoint, { agent: agent })
	} else {
		return new ws(config.endpoint)
	}
}