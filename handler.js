const chalk = require('chalk')
const utils = require('./utils')

exports.ticker = function(response) {
	const props = ['BID', 'BID_SIZE', 'ASK', 'ASK_SIZE',
		'DAILY_CHANGE', 'DAILY_CHANGE_PERC', 'LAST_PRICE', 'VOLUME', 'HIGH', 'LOW']
	
	if (response instanceof Array && response.length === props.length){
		const json = utils.values2json(response, props)
		const lastPrice = json.LAST_PRICE.toFixed(5).toString().padStart(15, " ")
		const change = (json.DAILY_CHANGE_PERC *100).toFixed(2)
		const volume = (json.VOLUME * json.LAST_PRICE).toFixed(3).toString().padStart(20, " ")
		const perc = (change + '%').padStart(15, " ")
		const low = json.LOW.toFixed(5).toString().padStart(15, " ")
		const high = json.HIGH.toFixed(5).toString().padStart(15, " ")

		if (change > 0) {
			return `${lastPrice}${chalk.green(perc)}${volume}${low}${high}`
		} else {
			return `${lastPrice}${chalk.red(perc)}${volume}${low}${high}`
		}
	}
}

exports.fibonacciRetracement = function(candles) {
	const current = candles[0][3]
	let higher = candles[0][3]
	let lower = candles[0][4]
	let peek = null
	let trough = null

	for (let i = 0; i < candles.length; i++) {
		const candle = candles[i]
		const high = candle[3]
		const low = candle[4]

		if (high > higher) {
			higher = high
		}

		if (low < lower) {
			lower = low
		}

		if (higher >= (current * 1.38)) {
			peek = higher
		}

		if (lower <= (current * 0.49)) {
			trough = lower
		}

		if (peek && trough) {
			break
		}
	}

	if (peek && trough) {
		return ((peek - current) / current * 100).toFixed(2).toString() + '%'
	} else {
		return ''
	}
}