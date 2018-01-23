const fs = require('fs')
const path = require('path')
const utils = require('./utils')
const handler = require('./handler')
const api = require('./api')

exports.main = async function () {
	const config = JSON.parse(fs.readFileSync(path.join(__dirname, '/config.json'), 'utf8'))
	const symbols = config.symbols
	const tickers = {}
	const channels = {}

	for (let i = 0; i < symbols.length; i++) {
		const symbol = symbols[i]
		const tSymbol = 't' + symbol + 'USD'
		const w = utils.getWS(config)
		const msg = JSON.stringify({ 
		  event: 'subscribe', 
		  channel: 'ticker', 
		  symbol: tSymbol
		})

		w.on('open', () => w.send(msg))
		w.on('message', (msg) => {
			const values = JSON.parse(msg)

			if (values.chanId) {
				channels[values.channel] = values.chanId
			} else {
				if (values[0] === channels.ticker) {
					let handled = handler.ticker(values[1])
					if (handled) {
						//candles
						setTimeout(async function(){
							handled += (await api.candles(tSymbol, '1h', 'hist')).padStart(7, " ")
							tickers[symbol] = handled
							utils.updateScreen(symbols, tickers)
						}, i * 3000)
					}
				}
			}
		})
	}
}