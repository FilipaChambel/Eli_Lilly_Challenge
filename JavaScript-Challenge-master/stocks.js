/* PLEASE DO NOT MODIFY THIS FILE AT ALL! */
const stocks = ['MSFT', 'AAPL', 'FB', 'EA', 'IBM']

const HOUR = 1000 * 60 * 60
const TIME_RANGE = HOUR * 10
const VALUE_RANGE_MIN = 10
const VALUE_RANGE_MAX = 100
const FAILUE_RATE = 0.1

function getTimestamps (timestamp, resolution) {
  const timestamps = []
  for (let idx = 0; idx < resolution; idx++) {
    timestamps.push(timestamp - (resolution - idx - 1) / resolution * TIME_RANGE)
  }
  return timestamps
}

function calculate (cyclesPerDay, cycleOffset, timestamp) {
  return scaleValue(Math.sin(timestamp / (HOUR * 24) * Math.PI * cyclesPerDay + cycleOffset))
}

function scaleValue (value) {
  const diff = VALUE_RANGE_MAX - VALUE_RANGE_MIN
  return VALUE_RANGE_MIN + diff * ((value + 1) / 2)
}

function strSum (str) {
  return Array.prototype.map.call(str, char => char.charCodeAt()).reduce((a, b) => a + b)
}

function getSeries (stockName, timestamps) {
  const sum = strSum(stockName)
  const cyclesPerDay = sum % 11 + 1 / 4
  const cycleOffset = Math.PI * (sum % 10) / 10
  return timestamps.map(calculate.bind(null, cyclesPerDay, cycleOffset))
}

module.exports = {
  async getStocks () {
    return stocks
  },
  async getStockPoints (stockName, timestamp) {
    if (Math.random() < FAILUE_RATE) {
      throw new Error('Failed to generate stock data')
    }
    if (!stocks.includes(stockName)) {
      throw new Error(`Uknown stock ${stockName}`)
    }
    const timestamps = getTimestamps(+timestamp, 10)
    return getSeries(stockName, timestamps).map((value, idx) => ({
      value,
      timestamp: timestamps[idx]
    }))
  }
}
