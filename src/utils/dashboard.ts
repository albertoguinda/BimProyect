import * as echarts from "echarts";

export interface SeriesData {
  times:  string[];   // ISO strings
  values: number[];
}

export function renderChart(
  id:    number,
  field: string,
  data:  SeriesData
) {
  // Colores y títulos traducidos
  let chartColor = "#000";
  let titleSensor = field;
  if (field === "brightness") {
    chartColor = "#facc15";
    titleSensor = "Luminosidad Lux";
  } else if (field === "humidity") {
    chartColor = "#3b82f6";
    titleSensor = "Humedad %";
  } else if (field === "temperature") {
    chartColor = "#ef4444";
    titleSensor = "Temperatura Cº";
  }

  const dom = document.getElementById("chart" + id);
  if (!dom) {
    console.error(`chart${id} no encontrado`);
    return;
  }

  // Reusar instancia si ya existe
  let myChart = echarts.getInstanceByDom(dom);
  if (!myChart) {
    myChart = echarts.init(dom, undefined, {
      renderer:     "canvas",
      useDirtyRect: false
    });
    window.addEventListener("resize", () => myChart!.resize());
  }

  // Formatea timestamps: YYYY-MM-DD HH:mm:ss sin decimales
  const pad2 = (n: number) => n.toString().padStart(2, "0");
  const formattedTimes = data.times.map((iso) => {
    const d = new Date(iso);
    const date = `${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
    const time = `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
    return `${date}\n${time}`;
  });

  const option = {
    title:    { text: titleSensor },
    tooltip:  { trigger: "axis", axisPointer: { type: "cross" } },
    xAxis: [{
      type:        "category",
      boundaryGap: false,
      data:        formattedTimes,
      axisLabel: {
        formatter: (value: string) => value
      }
    }],
    yAxis: [{ type: "value" }],
    series: [{
      name:      titleSensor,
      type:      "line",
      smooth:    true,
      itemStyle: { color: chartColor },
      data:      data.values
    }],
    toolbox: { feature: { saveAsImage: {} } },
    grid:    { left: "3%", right: "4%", bottom: "5%", containLabel: true }
  };

  myChart.setOption(option);
}