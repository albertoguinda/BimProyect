import * as BUI from "@thatopen/ui";
import { SectionHeader } from "./SectionHeader";
import * as FRAGS from "@thatopen/fragments";
import * as THREE from "three";
import { fetchLastSensorData } from "../../services/influxService";

export const IOTtools = (
  model: FRAGS.FragmentsModel,
  fragments: FRAGS.FragmentsModels,
) => {
  // ─── Interval IDs ─────────────────
  let brightnessInterval: number | null = null;
  let temperatureInterval: number | null = null;
  let humidityInterval: number | null = null;

  // ─── Clear intervals ──────────────
  async function clearAllIntervals() {
    if (brightnessInterval !== null) { clearInterval(brightnessInterval); brightnessInterval = null; }
    if (temperatureInterval !== null) { clearInterval(temperatureInterval); temperatureInterval = null; }
    if (humidityInterval !== null) { clearInterval(humidityInterval); humidityInterval = null; }
    document.getElementById("brightness-value")!.innerText = '--';
    document.getElementById("temperature-value")!.innerText = '--';
    document.getElementById("humidity-value")!.innerText = '--';
    await model.resetHighlight([22222, 9969, 5259, 4686, 4723, 4805, 4577, 8117, 4886, 8150, 9936, 22972, 8191, 3899, 7905, 4021, 22338, 22371],)
    await fragments.update(true);
    document.getElementById("date")!.innerText = '';
}

  // ─── Color helpers ────────────────
  const BRIGHTNESS_MIN = 0, BRIGHTNESS_MAX = 3000;
  const TEMP_MIN = 0, TEMP_MAX = 35;
  const HUM_MIN = 0, HUM_MAX = 100;

  function getColorFromBrightness(v: number) {
    const t = Math.max(0, Math.min(1, (v - BRIGHTNESS_MIN) / (BRIGHTNESS_MAX - BRIGHTNESS_MIN)));
    return new THREE.Color(t, t, 0);
  }
  function getColorFromTemperature(v: number) {
    const t = Math.max(0, Math.min(1, (v - TEMP_MIN) / (TEMP_MAX - TEMP_MIN)));
    return new THREE.Color(t, 0, 0);
  }
  function getColorFromHumidity(v: number) {
    let t = Math.max(0, Math.min(1, (v - HUM_MIN) / (HUM_MAX - HUM_MIN)));
    // potencia >1 para enfatizar cambios cuando t ya es alto
    t = Math.pow(t, 3);
    return new THREE.Color(0, 0, t);
  }
  

  // ─── Highlight and UI update ─────
  async function updateHighlightBrightness() {
    try {
      const { brightness } = await fetchLastSensorData();
      const { _time } = await fetchLastSensorData();

      // Helper para rellenar con cero
      const pad2 = (n: number) => n.toString().padStart(2, "0");

      // Crea el objeto Date a partir de tu timestamp ISO
      const d = new Date(_time);

      // Extrae partes
      const year    = d.getFullYear();
      const month   = pad2(d.getMonth() + 1);
      const day     = pad2(d.getDate());
      const hours   = pad2(d.getHours());
      const minutes = pad2(d.getMinutes());
      const seconds = pad2(d.getSeconds());

      // Formatea como "YYYY-MM-DD HH:mm:ss"
      const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

      console.log(formattedTime);
      // p.ej. "2025-05-06 14:23:45"
      document.getElementById("date")!.innerText = formattedTime;
      console.log(brightness)
      // update UI value
      document.getElementById("brightness-value")!.innerText = brightness.toFixed(1) + ' lux';
      const color = getColorFromBrightness(brightness);
      const dynamicMaterial: FRAGS.MaterialDefinition = {
        color,
        renderedFaces: FRAGS.RenderedFaces.TWO,
        opacity: 0.8,
        transparent: true,
      };
      await model.highlight(
        [22222, 9969, 5259, 4686, 4723, 4805, 4577, 8117, 4886, 8150, 9936, 22972, 8191, 3899, 7905, 4021, 22338, 22371],
        dynamicMaterial
      );
      await fragments.update(true);
    } catch (err) {
      console.error("Error luminosidad:", err);
    }
  }
  async function updateHighlightTemperature() {
    try {
      const { temperature } = await fetchLastSensorData();
      const { _time } = await fetchLastSensorData();

      // Helper para rellenar con cero
      const pad2 = (n: number) => n.toString().padStart(2, "0");

      // Crea el objeto Date a partir de tu timestamp ISO
      const d = new Date(_time);

      // Extrae partes
      const year    = d.getFullYear();
      const month   = pad2(d.getMonth() + 1);
      const day     = pad2(d.getDate());
      const hours   = pad2(d.getHours());
      const minutes = pad2(d.getMinutes());
      const seconds = pad2(d.getSeconds());

      // Formatea como "YYYY-MM-DD HH:mm:ss"
      const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

      console.log(formattedTime);
      // p.ej. "2025-05-06 14:23:45"
      document.getElementById("date")!.innerText = formattedTime;
      console.log(temperature)
      document.getElementById("temperature-value")!.innerText = temperature.toFixed(1) + 'ºC';
    const color = getColorFromTemperature(temperature);
      const dynamicMaterial: FRAGS.MaterialDefinition = {
        color,
        renderedFaces: FRAGS.RenderedFaces.TWO,
        opacity: 0.8,
        transparent: true,
      };
      await model.highlight(
        [22222, 9969, 5259, 4686, 4723, 4805, 4577, 8117, 4886, 8150, 9936, 22972, 8191, 3899, 7905, 4021, 22338, 22371],
        dynamicMaterial
      );
      await fragments.update(true);
    } catch (err) {
      console.error("Error temperatura:", err);
    }
  }
  async function updateHighlightHumidity() {
    try {
      const { humidity } = await fetchLastSensorData();
      const { _time } = await fetchLastSensorData();

      // Helper para rellenar con cero
      const pad2 = (n: number) => n.toString().padStart(2, "0");

      // Crea el objeto Date a partir de tu timestamp ISO
      const d = new Date(_time);

      // Extrae partes
      const year    = d.getFullYear();
      const month   = pad2(d.getMonth() + 1);
      const day     = pad2(d.getDate());
      const hours   = pad2(d.getHours());
      const minutes = pad2(d.getMinutes());
      const seconds = pad2(d.getSeconds());

      // Formatea como "YYYY-MM-DD HH:mm:ss"
      const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

      console.log(formattedTime);
      // p.ej. "2025-05-06 14:23:45"
      document.getElementById("date")!.innerText = formattedTime;
      console.log(humidity)
      document.getElementById("humidity-value")!.innerText = humidity.toFixed(1) + '%';
      const color = getColorFromHumidity(humidity);
      const dynamicMaterial: FRAGS.MaterialDefinition = {
        color,
        renderedFaces: FRAGS.RenderedFaces.TWO,
        opacity: 0.8,
        transparent: true,
      };
      await model.highlight(
        [22222, 9969, 5259, 4686, 4723, 4805, 4577, 8117, 4886, 8150, 9936, 22972, 8191, 3899, 7905, 4021, 22338, 22371],
        dynamicMaterial
      );
      // await model.setVisible([22222, 9969, 22338], false)
      await fragments.update(true);
    } catch (err) {
      console.error("Error humedad:", err);
    }
  }

  // ─── Load handlers ────────────────
  function loadBrightness() {
    clearAllIntervals();
    updateHighlightBrightness();
    brightnessInterval = window.setInterval(updateHighlightBrightness, 2000);
  }
  function loadTemperature() {
    clearAllIntervals();
    updateHighlightTemperature();
    temperatureInterval = window.setInterval(updateHighlightTemperature, 2000);
  }
  function loadHumidity() {
    clearAllIntervals();
    updateHighlightHumidity();
    humidityInterval = window.setInterval(updateHighlightHumidity, 2000);
  }

  const ioticon = BUI.html`<img src="/iot.svg" alt="ícono IoT" class="w-6 h-6" />`;

  return BUI.html`
    <section class="bimSection">
      ${SectionHeader('IoT', true, ioticon)}
      <div class="bimContent hidden">
        <p class="text-sm text-white mb-4 select-text">
          Mediante estos botones podrás reflejar datos de tus sensores en el edificio. (En este caso solo funcionará con el modelo del DIC)
        </p>
        <div class="flex flex-col gap-4 items-center">
          <div class="flex items-center w-3/4 justify-between">
            <button
              class="bg-gray-800 text-white text-xs px-2 py-1 rounded hover:bg-red-700 transition w-2/3 select-none"
              @click=${loadTemperature}
            >
              Temperatura
            </button>
            <span id="temperature-value" class="text-white text-xs">--</span>
          </div>
          <div class="flex items-center w-3/4 justify-between">
            <button
              class="bg-gray-800 text-white text-xs px-2 py-1 rounded hover:bg-blue-700 transition w-2/3 select-none"
              @click=${loadHumidity}
            >
              Humedad
            </button>
            <span id="humidity-value" class="text-white text-xs">--</span>
          </div>
          <div class="flex items-center w-3/4 justify-between">
            <button
              class="bg-gray-800 text-white text-xs px-2 py-1 rounded hover:bg-yellow-400 hover:text-black transition w-2/3 select-none"
              @click=${loadBrightness}
            >
              Luminosidad
            </button>
            <span id="brightness-value" class="text-white text-xs">--</span>
          </div>
          <p id="date" class="text-xs text-white select-text">
          </p>
          <button
              class="bg-gray-800 text-white text-xs px-2 py-1 rounded hover:bg-gray-400 transition w-full h-full select-none"
              @click=${clearAllIntervals}
            >
              Salir modo IoT
            </button>
        </div>
      </div>
    </section>
  `;
};
