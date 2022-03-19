let chartData = null;
$(document).ready(function () {
  let socket = new WebSocket("ws://websocketb2c.herokuapp.com/");
  socket.onopen = function (e) {
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);
    console.log("Connection opened"+ e.data);
  };
  socket.onclose = function (event) {
    if (event.wasClean) {
      alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    } else {
      alert('[close] Connection died');
    }
  };
  socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
    chartData = event.data;
    drawChart();
  });

  socket.onerror = function (error) {
    alert(`[error] ${error.message}`);
  };

  function drawChart() {
    if (!chartData) {
      return false;
    }
    var data = google.visualization.arrayToDataTable(JSON.parse(chartData), true);

    var options = {
      legend: 'none',
      title:'Bitcoin Price'
    };

    var chart = new google.visualization.CandlestickChart(document.getElementById('chart_div'));

    chart.draw(data, options);
  }
});