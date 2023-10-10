const express = require('express')
const path = require('path')
const stocks = require('./stocks')

const app = express()
app.use(express.static(path.join(__dirname, 'static')))

app.get("/stocks", async (req, res) => {
  /**
   * Return a meaningful error message
   * when stock data cannot be retrieved
   */
  try {
    const stockSymbols = await stocks.getStocks();
    res.send({ stockSymbols });
  } catch (error) {
    res.status(500).json({ error: "Failed to load stock data" });
  }
});

app.get("/stocks/:symbol", async (req, res) => {
  const {
    params: { symbol },
  } = req;

  /**
   * Return a meaningful error message
   * when stock data cannot be retrieved
   */
  try {
    const data = await stocks.getStockPoints(symbol, new Date());
    res.send(data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to retrieve stock data for stock item" });
  }
});

app.listen(3000, () => console.log('Server is running!'))
