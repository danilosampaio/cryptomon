const r2 = require('r2')
const endpoint = 'https://api.bitfinex.com/v2'
const handler = require('./handler')

exports.candles = async function (symbol, timeFrame, section) {	
	try {
		const candles = await r2(`${endpoint}/candles/trade:${timeFrame}:${symbol}/${section}`).json
		return handler.fibonacciRetracement(candles)		
	} catch (err) {
		console.log(err)
	}
}