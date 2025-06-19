import { MainDashboard } from "../components/appComponents/MainDashboard";
import { fetchLast5SensorData } from "../services/influxService";
import { renderChart } from "../utils/dashboard";
import { renderLayout } from "./viewTemplte";

export async function dashboard() {
  const mainApp = renderLayout();
  mainApp.innerHTML = "";
  mainApp.appendChild(MainDashboard);

  async function updateCharts() {
    try {
      const datos = await fetchLast5SensorData(); // SensorData[] con _time, brightness, humidity, temperature

      // Extraemos los ejes de tiempo (mismo para las tres series)
      const times = datos.map((d) => d._time);

      // Para cada campo, construimos un array de valores
      const brightnessValues  = datos.map((d) => d.brightness);
      const humidityValues    = datos.map((d) => d.humidity);
      const temperatureValues = datos.map((d) => d.temperature);

      // Ahora llamamos a renderChart pasando series completas:
      renderChart(1, "brightness", { times, values: brightnessValues });
      renderChart(2, "humidity",   { times, values: humidityValues   });
      renderChart(3, "temperature",{ times, values: temperatureValues});

    } catch (err) {
      console.error("Error al obtener datos de sensor:", err);
    }
  }

  // Llamada inicial y refresco cada segundo
  updateCharts();
  setInterval(updateCharts, 2000);
}
