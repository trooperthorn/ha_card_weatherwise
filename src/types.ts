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
export type Layout = "strips" | "report";

export interface WeatherWiseConfig {
  title?: string;
  latitude: number;
  longitude: number;
  view: ViewPreset;
  zoom: number;
  map_mode: string;
  /** Map center; the forecast point unless a pasted URL's camera is used. */
  map_latitude: number;
  map_longitude: number;
  /** Resolved fragment parameters: pasted URL, then map_params, then the product options. */
  map_params: Record<string, string>;
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
  layout: Layout;
  show_alerts: boolean;
  alerts_refresh_minutes: number;
  alerts_max: number;
  alerts_include_outlooks: boolean;
  alert_zones: string[];
  alert_country: string;
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

/** GeoJSON positions are [longitude, latitude]; extra ordinates are ignored. */
export type Ring = number[][];

export type Geometry =
  | { type: "Polygon"; coordinates: Ring[] }
  | { type: "MultiPolygon"; coordinates: Ring[][] };

/**
 * NWS VTEC significance: W warning, A watch, Y advisory, S statement,
 * F forecast, O outlook. Anything else is kept as the raw string.
 */
export type Significance = "W" | "A" | "Y" | "S" | "F" | "O";

export interface Alert {
  id: string;
  title: string;
  product: string;
  significance: string;
  emergency: boolean;
  office: string | null;
  /** Epoch milliseconds as the feed provides them; null when absent. */
  issuedAt: number | null;
  startsAt: number | null;
  expiresAt: number | null;
  ugcs: string[];
  /** [west, south, east, north] */
  bbox: [number, number, number, number] | null;
  what: string | null;
  where: string | null;
  when: string | null;
  impacts: string | null;
  /** Inline geometry when the feed carried one; most zone products do not. */
  geometry: Geometry | null;
}

/** An alert that was matched to the configured point, with how it matched. */
export interface MatchedAlert extends Alert {
  matchedBy: "zone" | "polygon";
}
