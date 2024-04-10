document.addEventListener("DOMContentLoaded", function () {
    const chartCanvas = document.getElementById("chart").getContext("2d");
  
    // grafico
    const initialChartData = {
      labels: [],
      datasets: [
        {
          label: "Valor de la moneda",
          data: [],
          fill: false,
          borderColor: "#ff0000",
        },
      ],
    };
  
    const chartConfig = {
      type: "line",
      data: initialChartData,
    };
  
    const chart = new Chart(chartCanvas, chartConfig);
  
  
    function updateChart(labels, values) {
      chart.data.labels = labels;
      chart.data.datasets[0].data = values;
      chart.update();
    }
  
    const seleccionMoneda = document.getElementById("seleccionMoneda");
  
    seleccionMoneda.addEventListener("change", () => {
      const selectedCurrency = seleccionMoneda.value;
      const historyUrl = `https://mindicador.cl/api/${selectedCurrency}`;
  
      fetch(historyUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al cargar los datos");
          }
          return response.json();
        })
        .then((data) => {
          if (data.serie && data.serie.length > 0) {
            const history = data.serie.slice(0, 10);
            const dates = history.map((item) => {
              const date = new Date(item.fecha);
              return `${date.getDate()}-${date.getMonth() + 1}-${date
                .getFullYear()
                .toString()
                .slice(-2)}`;
            });
            const values = history.map((item) => item.valor);
  
            updateChart(dates.reverse(), values.reverse());
          } else {
            throw new Error("Sin datos");
          }
        })
        .catch((error) => {
          console.error("Error en Api:", error);
        });
    });
  });
  