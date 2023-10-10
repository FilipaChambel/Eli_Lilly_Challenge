const canvas = document.getElementById('chart')
const ctx = canvas.getContext('2d')

function drawLine (start, end, style) {
  ctx.beginPath()
  ctx.strokeStyle = style || 'black'
  ctx.moveTo(...start)
  ctx.lineTo(...end)
  ctx.stroke()
}

function drawTriangle (apex1, apex2, apex3) {
  ctx.beginPath()
  ctx.moveTo(...apex1)
  ctx.lineTo(...apex2)
  ctx.lineTo(...apex3)
  ctx.fill()
}

drawLine([50, 50], [50, 550])
drawTriangle([35, 50], [65, 50], [50, 35])

drawLine([50, 550], [950, 550])
drawTriangle([950, 535], [950, 565], [965, 550])

const spinner = document.getElementById("spinner");

/**
 * Query the backend for list of available stocks
 */

fetch("http://localhost:3000/stocks")
  .then((res) => res.json())
  .then((data) => {
    const stockSymbols = data.stockSymbols;
    console.log("List of available stocks: ", stockSymbols);

      /**
     * Hide the spinner after all data is loaded
     */
    spinner.style.display = "none";

    /**
     * Query the backend for data about each stock
     */

    let allStocksData = []; //array that stores all stocks data
    let tableData = {};
    Promise.all(
      
      stockSymbols.map(async (stockSymbol) => {
       try {
          const res = await fetch(`http://localhost:3000/stocks/${stockSymbol}`)
          const stockData = await res.json()
          // console.log(`Data for ${stockSymbol}: `);
          for (let i = 0; i < stockData.length; i++) {
            const formattedStockData = {
              Symbol: stockSymbol,
              Value: stockData[i].value,
              Timestamp: stockData[i].timestamp,
            }
//console.log(stockData)
//console.log(formattedStockData);

            allStocksData.push(formattedStockData)
          }
          console.log(allStocksData);
          plotData(stockData)
        } catch (error) {
          console.error("Error retriving stock data", error)
          return null
        }
      })
      
    ).then(() => {
        /**
             * Log the data in a table
             */
        tableData = allStocksData.map((data) => {
          return {
            Symbol: data.Symbol,
            Value: data.Value,
            Timestamp: new Date(data.Timestamp).toLocaleString(), // Format the timestamp as date and time
          };
        });

        console.table(tableData);
 
      
    });
   
    
  })
  .catch((error) => {
    console.error("Error retriving list of available stocks", error);
  });
 
  function plotData(stockData){
const xAxis = canvas.width / (stockData.length-1);
const yAxis = canvas.height / 100; //Consider stock values between 0 to 100

ctx.beginPath();

//x-axis labels
ctx.font ='8px';
ctx.fillStyle = "black";

for(let i =100; i<=1000; i+=100){
  const xlabel = i * xAxis/100;
  ctx.fillText(i.toString(), xlabel, canvas.height-30);//adjust labels to the height of the axis
}

//y-axis labels
for(let i=10; i<=1000; i+=10){
  const ylabel = canvas.height - i * yAxis;
  ctx.fillText(i.toString(), 10, ylabel)
}


for(let i = 0; i< stockData.length; i++){
const x = i * xAxis;
const y = canvas.height - stockData[i].value * yAxis;

if(i===0){
  ctx.moveTo(x, y)
} else {
 
  ctx.lineWidth = 2;
  ctx.lineTo(x,y);
  ctx.stroke();

 
}

}

  }
