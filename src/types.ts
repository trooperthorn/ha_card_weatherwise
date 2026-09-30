/**
 * Shared types: the card configuration, the subset of the Home Assistant
 * frontend object the card touches, and the normalized forecast model.
 */

declare global {
  const __CARD_VERSION__: string;

  interface Window {
    customCards?: Array<{
      type: string;
      name: string;
      description: string;
      preview?: boolean;
      documentationURL?: string;
    }>;
  }
}

/** The card reads only the current user's locale settings from hass. */
export interface HomeAssistant {
  locale?: { language?: string; time_format?: string };
  language?: string;
}

export type ViewPreset = "metro" | "state";
export type ForecastModel = "ecmwf_ifs025" | "gfs_seamless";
export type TemperatureUnit = "fahrenheit" | "celsius";
export type WindSpeedUnit = "mph" | "kmh" | "ms" | "kn";
export type PrecipitationUnit = "mm" | "inch";

export interface WeatherWiseConfig {
  title?: string;
  latitude: number;
  longitude: number;
  view: ViewPreset;
  zoom: number;
  map_mode: string;
  show_map: boolean;
  map_height: number;
  map_reload_minutes: number;
  map_interactive: boolean;
  map_ui: boolean;
  map_autoplay: boolean;
  show_conditions: boolean;
  show_hourly: boolean;
  hourly_count: number;
  show_daily: boolean;
  daily_count: number;
  model: ForecastModel;
  temperature_unit: TemperatureUnit;
  wind_speed_unit: WindSpeedUnit;
  precipitation_unit: PrecipitationUnit;
  refresh_minutes: number;
  hosts: string[];
}

export const DEFAULT_ZOOM: Record<ViewPreset, number> = {
  metro: 9,
  state: 5.79,
};

export const DEFAULT_HOSTS = [
  "https://data2.weatherwise.app",
  "https://data1.weatherwise.app",
];

export const MAP_ORIGIN = "https://web.weatherwise.app";

export interface HourlyPoint {
  /** Epoch seconds, start of the hour. */
  time: number;
  temperature: number | null;
  apparentTemperature: number | null;
  humidity: number | null;
  precipitationProbability: number | null;
  precipitation: number | null;
  windSpeed: number | null;
  windBearing: number | null;
  weatherCode: number | null;
  isDay: boolean | null;
}

export interface DailyPoint {
  time: number;
  temperatureMax: number | null;
  temperatureMin: number | null;
  weatherCode: number | null;
  precipitationProbabilityMax: number | null;
  sunrise: number | null;
  sunset: number | null;
}

export interface ForecastUnits {
  temperature: string;
  windSpeed: string;
  precipitation: string;
}

export interface Forecast {
  hourly: HourlyPoint[];
  daily: DailyPoint[];
  units: ForecastUnits;
  timezone: string;
  utcOffsetSeconds: number;
  /** Grid point the model actually answered for, not the requested point. */
  gridLatitude: number;
  gridLongitude: number;
  model: ForecastModel;
}

export type ConditionKey =
  | "clear-day"
  | "clear-night"
  | "partly-cloudy-day"
  | "partly-cloudy-night"
  | "cloudy"
  | "fog"
  | "rain"
  | "pouring"
  | "sleet"
  | "snow"
  | "thunderstorm"
  | "hail"
  | "unknown";

export interface Condition {
  key: ConditionKey;
  label: string;
}
