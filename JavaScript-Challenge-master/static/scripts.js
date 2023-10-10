const canvas = document.getElementById("chart");
const ctx = canvas.getContext("2d");

function drawLine(start, end, style) {
  ctx.beginPath();
  ctx.strokeStyle = style || "black";
  ctx.moveTo(...start);
  ctx.lineTo(...end);
  ctx.stroke();
}

function drawTriangle(apex1, apex2, apex3) {
  ctx.beginPath();
  ctx.moveTo(...apex1);
  ctx.lineTo(...apex2);
  ctx.lineTo(...apex3);
  ctx.fill();
}

drawLine([50, 50], [50, 550]);
drawTriangle([35, 50], [65, 50], [50, 35]);

drawLine([50, 550], [950, 550]);
drawTriangle([950, 535], [950, 565], [965, 550]);

let allStocksData = []; //array that stores all stocks data
let tableData = {};

/**
 * Query the backend for list of available stocks
 */

fetch("http://localhost:3000/stocks")
  .then((res) => res.json())
  .then((data) => {
    const stockSymbols = data.stockSymbols;
    //console.log("List of available stocks: ", stockSymbols);

    /**
     * Hide the spinner after all data is loaded
     */
    const spinner = document.getElementById("spinner");
    spinner.style.display = "none";

    /**
     * Query the backend for data about each stock
     */

    Promise.all(
      stockSymbols.map(async (stockSymbol) => {
        try {
          const res = await fetch(
            `http://localhost:3000/stocks/${stockSymbol}`
          );
          const stockData = await res.json();
         

          if (stockData.length > 0) {
            const formattedStockData = stockData.map((data) => ({
              Symbol: stockSymbol,
              Value: data.value,
              Timestamp: data.timestamp,
            }));

            allStocksData.push(formattedStockData);
            //console.log(stockData);
            //console.log(formattedStockData);
            // console.log(allStocksData);
          } else {
            console.warn(`No data found for ${stockSymbol}`);
          }
        } catch (error) {
          console.error("Error retriving stock data", error);
          return null;
        }
      })
    ).then(() => {
      plotData(allStocksData);

      /**
       * Log the data in a table
       */
      tableData = allStocksData.flat().map((data) => {
        return {
          Symbol: data.Symbol,
          Value: data.Value,
          Timestamp: new Date(data.Timestamp).toLocaleString(), // Format the timestamp as date and time
        };
      });

      console.table(tableData);
      //console.log(allStocksData);
    });
  })
  .catch((error) => {
    console.error("Error retriving list of available stocks", error);

    /**
     * Hide the stock table in the HTML
     * if the list of stocks is not retrieved
     */
    const stock_table = document.getElementById("stock-table");
    stock_table.style.display = "none";
  });

/**
 * Function that plots the stock data
 * into the line chart
 */

function plotData(allStocksData) {
  let minValue = 0;
  let maxValue = 0;

  let minTimestamp = 0;
  let maxTimestamp = 0;

  allStocksData.forEach((stockData) => {
    stockData.forEach((data) => {
      if (data.Value < minValue) {
        minValue = data.Value;
      } else if (data.Value > maxValue) {
        maxValue = data.Value;
      }

      const timestamp = new Date(data.Timestamp);
      if (timestamp < minTimestamp) {
        minTimestamp = timestamp;
      } else if (timestamp > maxTimestamp) {
        maxTimestamp = timestamp;
      }
    });
  });
  const xAxis = canvas.width / (allStocksData[0].length - 1);
  const yAxis = canvas.height / (maxValue - minValue);

  //Set min and max time range (8am to 6pm)
  const minTime = 8;
  const maxTime = 18;
  const totalTime = maxTime - minTime;

  //x-axis labels
  ctx.font = "8px";
  ctx.fillStyle = "black";

  for (let i = 0; i < totalTime; i++) {
    const currentTime = minTime + i;
    const timestamp = new Date(minTimestamp);
    timestamp.setHours(currentTime, 0, 0, 0);
    const xLabels = (i / totalTime) * canvas.width + 40;
    ctx.fillText(currentTime.toString() + ":00", xLabels, canvas.height - 20);
  }

  //y-axis labels
  for (let i = 10; i <= 100; i += 10) {
    const ylabel = canvas.height - (i - minValue) * yAxis;
    ctx.fillText(i.toString(), 10, ylabel);
  }

  /**
   * Assigned colour to each stock symbol in
   * the chart for better plot reading
   */

  const colourList = {};
  const setSymbols = Array.from(
    new Set(allStocksData.map((data) => data[0].Symbol))
  );
  const arrayColours = ["red", "blue", "green", "orange", "purple"];
  ctx.lineWidth = 2;

  setSymbols.forEach((symbol, index) => {
    colourList[symbol] = arrayColours[index % arrayColours.length];
  });

  allStocksData.forEach((stockData, stockIndex) => {
    const symbol = stockData[0].Symbol;
    ctx.beginPath();
    ctx.strokeStyle = colourList[symbol];
  
    stockData.forEach((data, dataIndex) => {
      const x = dataIndex * xAxis + 50; //plot the graph after the drawLine
      const y = canvas.height - (data.Value - minValue) * yAxis;

      if (dataIndex === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      /**
       * Populated table in HTML with
       * stock data
       */

      const tableBody = document.querySelector("#stock-table tbody");
      const row = tableBody.insertRow();
      const symbolCell = row.insertCell(0);
      const valueCell = row.insertCell(1);
      const timestampCell = row.insertCell(2);

      symbolCell.textContent = symbol;
      valueCell.textContent = data.Value;
      timestampCell.textContent = new Date(data.Timestamp);
    });

    ctx.stroke();
  });
}
