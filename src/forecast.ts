/**
 * Forecast normalization: turns the WeatherWise/Open-Meteo style response
 * into typed points, validates array lengths, and selects the interval
 * that is valid now. Missing or non-finite values stay null; the card
 * never turns a gap into a zero.
 */

import type {
  DailyPoint,
  Forecast,
  ForecastModel,
  HourlyPoint,
  WeatherWiseConfig,
} from "./types";

const HOURLY_FIELDS = [
  "temperature_2m",
  "apparent_temperature",
  "relative_humidity_2m",
  "precipitation_probability",
  "precipitation",
  "wind_speed_10m",
  "wind_direction_10m",
  "weather_code",
  "is_day",
] as const;

const DAILY_FIELDS = [
  "temperature_2m_max",
  "temperature_2m_min",
  "weather_code",
  "precipitation_probability_max",
  "sunrise",
  "sunset",
] as const;

export function forecastUrl(host: string, config: WeatherWiseConfig): string {
  const path = config.model === "gfs_seamless" ? "/api/om/v1/gfs" : "/api/om/v1/forecast";
  const url = new URL(path, host);
  const hours = Math.min(48, Math.max(2, config.hourly_count + 2));
  const days = Math.max(1, config.show_daily ? config.daily_count : 1);
  const params: Record<string, string> = {
    models: config.model,
    latitude: String(config.latitude),
    longitude: String(config.longitude),
    hourly: HOURLY_FIELDS.join(","),
    daily: DAILY_FIELDS.join(","),
    timezone: "auto",
    timeformat: "unixtime",
    forecast_hours: String(hours),
    forecast_days: String(days),
    temperature_unit: config.temperature_unit,
    wind_speed_unit: config.wind_speed_unit,
    precipitation_unit: config.precipitation_unit,
  };
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return url.toString();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function finite(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function column(
  block: Record<string, unknown>,
  name: string,
  length: number,
  errors: string[],
): unknown[] {
  const value = block[name];
  if (value === undefined) {
    return new Array<unknown>(length).fill(null);
  }
  if (!Array.isArray(value)) {
    errors.push(`${name} is not an array`);
    return new Array<unknown>(length).fill(null);
  }
  if (value.length !== length) {
    errors.push(`${name} has ${value.length} values, expected ${length}`);
    return new Array<unknown>(length).fill(null);
  }
  return value;
}

/** The API labels miles per hour as "mp/h"; everything else is passed through. */
const UNIT_LABELS: Record<string, string> = { "mp/h": "mph" };

function unitOf(units: unknown, name: string, fallback: string): string {
  if (isRecord(units) && typeof units[name] === "string") {
    const label = units[name] as string;
    return UNIT_LABELS[label] ?? label;
  }
  return fallback;
}

export class ForecastParseError extends Error {}

export function parseForecast(raw: unknown, model: ForecastModel): Forecast {
  if (!isRecord(raw)) {
    throw new ForecastParseError("response is not an object");
  }
  const errors: string[] = [];
  const hourlyBlock = isRecord(raw.hourly) ? raw.hourly : undefined;
  const dailyBlock = isRecord(raw.daily) ? raw.daily : undefined;
  if (!hourlyBlock || !Array.isArray(hourlyBlock.time)) {
    throw new ForecastParseError("response has no hourly.time array");
  }

  const hourlyTimes = hourlyBlock.time;
  const h = Object.fromEntries(
    HOURLY_FIELDS.map((f) => [f, column(hourlyBlock, f, hourlyTimes.length, errors)]),
  ) as Record<(typeof HOURLY_FIELDS)[number], unknown[]>;

  const hourly: HourlyPoint[] = [];
  for (const [i, t] of hourlyTimes.entries()) {
    const time = finite(t);
    if (time === null) {
      errors.push(`hourly.time[${i}] is not a number`);
      continue;
    }
    const isDay = finite(h.is_day[i]);
    hourly.push({
      time,
      temperature: finite(h.temperature_2m[i]),
      apparentTemperature: finite(h.apparent_temperature[i]),
      humidity: finite(h.relative_humidity_2m[i]),
      precipitationProbability: finite(h.precipitation_probability[i]),
      precipitation: finite(h.precipitation[i]),
      windSpeed: finite(h.wind_speed_10m[i]),
      windBearing: finite(h.wind_direction_10m[i]),
      weatherCode: finite(h.weather_code[i]),
      isDay: isDay === null ? null : isDay === 1,
    });
  }

  const daily: DailyPoint[] = [];
  if (dailyBlock && Array.isArray(dailyBlock.time)) {
    const dailyTimes = dailyBlock.time;
    const d = Object.fromEntries(
      DAILY_FIELDS.map((f) => [f, column(dailyBlock, f, dailyTimes.length, errors)]),
    ) as Record<(typeof DAILY_FIELDS)[number], unknown[]>;
    for (const [i, t] of dailyTimes.entries()) {
      const time = finite(t);
      if (time === null) {
        errors.push(`daily.time[${i}] is not a number`);
        continue;
      }
      daily.push({
        time,
        temperatureMax: finite(d.temperature_2m_max[i]),
        temperatureMin: finite(d.temperature_2m_min[i]),
        weatherCode: finite(d.weather_code[i]),
        precipitationProbabilityMax: finite(d.precipitation_probability_max[i]),
        sunrise: finite(d.sunrise[i]),
        sunset: finite(d.sunset[i]),
      });
    }
  }

  if (hourly.length === 0) {
    throw new ForecastParseError(`no usable hourly data: ${errors.join("; ")}`);
  }

  return {
    hourly,
    daily,
    units: {
      temperature: unitOf(raw.hourly_units, "temperature_2m", ""),
      windSpeed: unitOf(raw.hourly_units, "wind_speed_10m", ""),
      precipitation: unitOf(raw.hourly_units, "precipitation", ""),
    },
    timezone: typeof raw.timezone === "string" ? raw.timezone : "UTC",
    utcOffsetSeconds: finite(raw.utc_offset_seconds) ?? 0,
    gridLatitude: finite(raw.latitude) ?? Number.NaN,
    gridLongitude: finite(raw.longitude) ?? Number.NaN,
    model,
  };
}

/**
 * Index of the hour valid now: the first point whose end (start plus one
 * hour) is still in the future. Returns -1 when the whole forecast has
 * expired, so the caller can show it as stale rather than as current.
 */
export function currentIndex(hourly: HourlyPoint[], nowSeconds: number): number {
  return hourly.findIndex((p) => p.time + 3600 > nowSeconds);
}

export interface Window_ {
  current: HourlyPoint | null;
  upcoming: HourlyPoint[];
  expired: boolean;
}

export function selectWindow(forecast: Forecast, nowSeconds: number, count: number): Window_ {
  const index = currentIndex(forecast.hourly, nowSeconds);
  if (index < 0) {
    return { current: null, upcoming: [], expired: true };
  }
  return {
    current: forecast.hourly[index] ?? null,
    upcoming: forecast.hourly.slice(index + 1, index + 1 + count),
    expired: false,
  };
}

/** Today's remaining hourly maximum rain chance, or null when unknown. */
export function maxRainChance(points: HourlyPoint[]): number | null {
  let max: number | null = null;
  for (const p of points) {
    if (p.precipitationProbability !== null) {
      max = max === null ? p.precipitationProbability : Math.max(max, p.precipitationProbability);
    }
  }
  return max;
}
