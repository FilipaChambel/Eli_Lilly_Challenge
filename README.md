# Javascript Recruitment Task

Javascript recruitment task
**Filipa Chambel Vieira**


## Completed Tasks

* Spinner rotates using CSS3.
* Queried the backend for list of available stocks.
* Queried the backend for data about each stock.
* The spinner is hidden after all data is loaded.
* Logged to the console the result stock data in a structured way (in a table).
* Fixed backend (app.js) to return a meaningful error message when stock data cannot be retrieved (now the request just hangs!).
* Plotted the stock data on the chart (as a line chart).


## Additional Tasks Completed

* Populated table with the stock data in the HTML page for better user experience
* Assigned colours to each Stock Symbol in the Line Chart to improve readability
* Populated X Axis with timestamp values and Y Axis with stock value
* Hid the table of stocks if the list of stock data is not retrieved


## The application

The goal of the application is to display how stock prices change over time.

In this starter template you get:
* A backend application written in `node.js` that serves information about stocks (for the last 10 hours).
* A frontend template that renders an empty chart and static spinner.

Getting stock data has a **10% chance of failure** (by design). The application needs to account for that.

## Constraints

* You are **not** to modify the code in `stocks.js`
* The stocks API is designed to return errors sometimes. The application should gain the ability to cope with that.
* You can use the provided mini-API for canvas operations, but you can also use other solution.
