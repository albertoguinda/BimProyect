// src/services/influxService.ts
import { InfluxDB } from '@influxdata/influxdb-client';

const url    = "https://us-east-1-1.aws.cloud2.influxdata.com/"
const token  = "mzqAW37YYaX7tkIM6zVmxd-k9gmmFfeME9BoFbkJLtZQ5g-tN-ShLrNEFNnB4ekoS7Vb3db4Gl6__LNaTVkKdA=="
const org    = "CTO ACADEMY"
const bucket = "DIC_FabLab";

const influxDB = new InfluxDB({ url, token });
const queryApi = influxDB.getQueryApi(org);

const lastfluxQuery = `
  from(bucket: "${bucket}")
    |> range(start: 0)
    |> filter(fn: (r) =>
         r._measurement == "sensor_data" and
         (r._field == "brightness" or r._field == "humidity" or r._field == "temperature")
       )
    |> group(columns: ["_field"])
    |> last()
`;

const last5FluxQuery = `
  from(bucket: "${bucket}")
    |> range(start: -30d)                              // rango amplio para cubrir al menos 5 puntos
    |> filter(fn: (r) =>
         r._measurement == "sensor_data" and
         (r._field == "brightness" or r._field == "humidity" or r._field == "temperature")
       )
    |> sort(columns: ["_time"], desc: true)            // orden descendente para tener los más recientes primero
    |> limit(n: 5)                                     // solo los 5 primeros de todo el conjunto
    |> pivot(
         rowKey: ["_time"],
         columnKey: ["_field"],
         valueColumn: "_value"
       )
    |> sort(columns: ["_time"], desc: false)           // opcional: vuelve a orden ascendente por tiempo
`;


export interface SensorData {
  _time:      string;
  brightness: number;
  humidity:   number;
  temperature:number;
}

export async function fetchLastSensorData(): Promise<SensorData> {
    // Sólo alojará brightness, humidity y temperature
    const result: Partial<Omit<SensorData, "_time">> = {};
    let lastTime: string | undefined;
  
    return new Promise<SensorData>((resolve, reject) => {
      queryApi.queryRows(lastfluxQuery, {
        next(row, tableMeta) {
          const o = tableMeta.toObject(row);
          lastTime = o._time;
          // "_field" aquí sólo será uno de estos tres
          const field = o._field as keyof typeof result;
          result[field] = parseFloat(o._value);
        },
        error(err) {
          reject(err);
        },
        complete() {
          if (
            !lastTime ||
            result.brightness   == null ||
            result.humidity     == null ||
            result.temperature  == null
          ) {
            return reject(
              new Error("Faltan datos de alguno de los sensores")
            );
          }
          // ya tenemos timestamp + los 3 valores numéricos
          resolve({
            _time:      lastTime,
            brightness: result.brightness,
            humidity:   result.humidity,
            temperature:result.temperature,
          });
        },
      });
    });
  }

export async function fetchLast5SensorData(): Promise<SensorData[]> {
  const rows: SensorData[] = [];

  return new Promise<SensorData[]>((resolve, reject) => {
    queryApi.queryRows(last5FluxQuery, {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row);
        rows.push({
          _time:      o._time,
          brightness: parseFloat(o.brightness),
          humidity:   parseFloat(o.humidity),
          temperature:parseFloat(o.temperature),
        });
      },
      error(err) {
        reject(err);
      },
      complete() {
        if (rows.length === 0) {
          return reject(new Error("No se encontraron datos en el rango especificado"));
        }
        resolve(rows);
      },
    });
  });
}
  