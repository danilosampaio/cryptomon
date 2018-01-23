const ws = require('ws')
const HttpsProxyAgent = require('https-proxy-agent')
const url = require('url')
const sortBy = require('lodash.sortby')
const logUpdate = require('log-update')

exports.values2json = function (values, props) {
	const json = {}
	for (let i = 0; i < props.length; i++) {
		json[props[i]] = values[i]
	}
	return json
}

exports.getWS = function (config, wsPool) {
	for (let i = 0; i < wsPool.length; i++) {
		const w = wsPool[i]
		if (w.listenerCount('open') < 5) {
			return w
		} else {
			if (config.proxy) {
				const options = url.parse(config.proxy)
				const agent = new HttpsProxyAgent(options)
				const nw = new ws(config.endpoint, { agent: agent })
				wsPool.push(nw)
				return nw
			} else {
				const nw = new ws(config.endpoint)
				wsPool.push(nw)
				return nw
			}
		}
	}	

	const nw = new ws(config.endpoint)
	wsPool.push(nw)
	return nw
}

exports.updateScreen = function (symbols, tickers) {
	const header = 'SYMBOL               LAST           24h%                 VOL            LOW           HIGH   FIB.'
	const output = header + '\n' + 
	sortBy(symbols.map(s => {
		const sym = s.toString().padEnd(10, " ")
		const t = tickers[s] || '?         ?         ?'
		return `${sym}${t}`
	})).join('\n')
	
	logUpdate(`${output}`)
}