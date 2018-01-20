const ws = require('ws')
const utils = require('./utils')
const sortBy = require('lodash.sortby')
const logUpdate = require('log-update')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

const symbols = JSON.parse(fs.readFileSync(path.join(__dirname, '/config.json'), 'utf8')).symbols
const tickers = {}

for (let i = 0; i < symbols.length; i++) {
	const symbol = symbols[i]
	const w = new ws('wss://api.bitfinex.com/ws/2')

	w.on('message', (msg) => {
		const values = JSON.parse(msg)
		const props = ['BID', 'BID_SIZE', 'ASK', 'ASK_SIZE', 'DAILY_CHANGE', 'DAILY_CHANGE_PERC',
	    'LAST_PRICE', 'VOLUME', 'HIGH', 'LOW']
		if (values instanceof Array && values[1].length === props.length) {
			const json = utils.values2json(values[1], props)
			const lastPrice = json.LAST_PRICE.toFixed(5).toString().padStart(15, " ")
			const change = (json.DAILY_CHANGE_PERC *100).toFixed(2)
			const volume = (json.VOLUME * json.LAST_PRICE).toFixed(3).toString().padStart(20, " ")
			const perc = (change + '%').padStart(15, " ")

			if (change > 0) {
				tickers[symbol] = `${lastPrice}${chalk.green(perc)}${volume}`
			} else {
				tickers[symbol] = `${lastPrice}${chalk.red(perc)}${volume}`
			}
			
			const output = 'SYMBOL               LAST           24h%                 VOL\n' + sortBy(symbols.map(s => {
				const sym = s.toString().padEnd(10, " ")
				const t = tickers[s] || '?         ?         ?'
				return `${sym}${t}`
			})).join('\n')
			logUpdate(`${output}`)
		}
	})

	let msg = JSON.stringify({ 
	  event: 'subscribe', 
	  channel: 'ticker', 
	  symbol: ('t' + symbol + 'USD')
	})

	w.on('open', () => w.send(msg))
}
