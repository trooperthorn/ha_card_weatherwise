/**
 * Configuration normalization and validation. Every problem is collected
 * and reported together so a configuration can be fixed in one edit.
 */

import { COUNTRY_RE, UGC_RE } from "./alerts";
import type {
  ForecastModel,
  Layout,
  PrecipitationUnit,
  TemperatureUnit,
  ViewPreset,
  WeatherWiseConfig,
  WindSpeedUnit,
} from "./types";
import { DEFAULT_HOSTS, DEFAULT_ZOOM } from "./types";

export interface ParseResult {
  config?: WeatherWiseConfig;
  errors: string[];
}

const KNOWN_KEYS = new Set([
  "type",
  "title",
  "latitude",
  "longitude",
  "view",
  "zoom",
  "map_mode",
  "show_map",
  "map_height",
  "map_reload_minutes",
  "map_interactive",
  "map_ui",
  "map_autoplay",
  "show_conditions",
  "show_hourly",
  "hourly_count",
  "show_daily",
  "daily_count",
  "model",
  "temperature_unit",
  "wind_speed_unit",
  "precipitation_unit",
  "refresh_minutes",
  "hosts",
  "layout",
  "show_alerts",
  "alerts_refresh_minutes",
  "alerts_max",
  "alerts_include_outlooks",
  "alert_zones",
  "alert_country",
  "view_layout",
  "layout_options",
  "grid_options",
  "visibility",
]);

const VIEWS: ReadonlySet<string> = new Set(["metro", "state"]);
const MODELS: ReadonlySet<string> = new Set(["ecmwf_ifs025", "gfs_seamless"]);
const TEMPERATURE_UNITS: ReadonlySet<string> = new Set(["fahrenheit", "celsius"]);
const WIND_UNITS: ReadonlySet<string> = new Set(["mph", "kmh", "ms", "kn"]);
const PRECIPITATION_UNITS: ReadonlySet<string> = new Set(["mm", "inch"]);
const LAYOUTS: ReadonlySet<string> = new Set(["strips", "report"]);
const MAP_MODE_RE = /^[A-Z0-9_-]{1,32}$/;

export const MIN_REFRESH_MINUTES = 10;
export const MIN_ALERTS_REFRESH_MINUTES = 2;
export const MAX_HOURLY = 48;
export const MAX_DAILY = 16;
export const MAX_ALERTS = 10;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function number(
  obj: Record<string, unknown>,
  key: string,
  errors: string[],
  opts: { min?: number; max?: number; integer?: boolean; fallback?: number; required?: boolean },
): number | undefined {
  const value = obj[key];
  if (value === undefined) {
    if (opts.required) {
      errors.push(`${key}: required`);
    }
    return opts.fallback;
  }
  if (typeof value !== "number" || !Number.isFinite(value)) {
    errors.push(`${key}: must be a number`);
    return opts.fallback;
  }
  if (opts.integer && !Number.isInteger(value)) {
    errors.push(`${key}: must be a whole number`);
    return opts.fallback;
  }
  if (opts.min !== undefined && value < opts.min) {
    errors.push(`${key}: must be at least ${opts.min}`);
    return opts.fallback;
  }
  if (opts.max !== undefined && value > opts.max) {
    errors.push(`${key}: must be at most ${opts.max}`);
    return opts.fallback;
  }
  return value;
}

function boolean(
  obj: Record<string, unknown>,
  key: string,
  errors: string[],
  fallback: boolean,
): boolean {
  const value = obj[key];
  if (value === undefined) {
    return fallback;
  }
  if (typeof value !== "boolean") {
    errors.push(`${key}: must be true or false`);
    return fallback;
  }
  return value;
}

function choice<T extends string>(
  obj: Record<string, unknown>,
  key: string,
  allowed: ReadonlySet<string>,
  errors: string[],
  fallback: T,
): T {
  const value = obj[key];
  if (value === undefined) {
    return fallback;
  }
  if (typeof value !== "string" || !allowed.has(value)) {
    errors.push(`${key}: must be one of ${[...allowed].join(", ")}`);
    return fallback;
  }
  return value as T;
}

function hosts(obj: Record<string, unknown>, errors: string[]): string[] {
  const value = obj.hosts;
  if (value === undefined) {
    return [...DEFAULT_HOSTS];
  }
  if (!Array.isArray(value) || value.length === 0) {
    errors.push("hosts: must be a non-empty list of https origins");
    return [...DEFAULT_HOSTS];
  }
  const out: string[] = [];
  for (const [i, host] of value.entries()) {
    if (typeof host !== "string") {
      errors.push(`hosts[${i}]: must be a string`);
      continue;
    }
    let url: URL;
    try {
      url = new URL(host);
    } catch {
      errors.push(`hosts[${i}]: "${host}" is not a URL`);
      continue;
    }
    if (url.protocol !== "https:" || url.pathname !== "/" || url.search || url.hash) {
      errors.push(`hosts[${i}]: must be a bare https origin such as https://data2.weatherwise.app`);
      continue;
    }
    out.push(url.origin);
  }
  return out.length > 0 ? out : [...DEFAULT_HOSTS];
}

/**
 * Zone codes come as a YAML list or, from the visual editor's text field,
 * as one comma or space separated string. Codes are upper-cased; NWS UGC
 * codes are two letters, C or Z, three digits.
 */
function zones(obj: Record<string, unknown>, errors: string[]): string[] {
  const value = obj.alert_zones;
  if (value === undefined || value === null || value === "") {
    return [];
  }
  let items: unknown[];
  if (typeof value === "string") {
    items = value.split(/[\s,]+/).filter((s) => s !== "");
  } else if (Array.isArray(value)) {
    items = value;
  } else {
    errors.push("alert_zones: must be a list of UGC codes such as TXZ133");
    return [];
  }
  const out: string[] = [];
  for (const [i, item] of items.entries()) {
    if (typeof item !== "string" || !UGC_RE.test(item.trim().toUpperCase())) {
      errors.push(`alert_zones[${i}]: "${String(item)}" is not a UGC code such as TXZ133 or TXC139`);
      continue;
    }
    out.push(item.trim().toUpperCase());
  }
  return out;
}

export function parseConfig(raw: unknown): ParseResult {
  const errors: string[] = [];
  if (!isRecord(raw)) {
    return { errors: ["configuration must be a mapping"] };
  }
  for (const key of Object.keys(raw)) {
    if (!KNOWN_KEYS.has(key)) {
      errors.push(`${key}: unknown option`);
    }
  }
  if (raw.title !== undefined && typeof raw.title !== "string") {
    errors.push("title: must be a string");
  }

  const latitude = number(raw, "latitude", errors, { min: -90, max: 90, required: true });
  const longitude = number(raw, "longitude", errors, { min: -180, max: 180, required: true });
  const view = choice<ViewPreset>(raw, "view", VIEWS, errors, "metro");
  const zoom = number(raw, "zoom", errors, { min: 1, max: 18, fallback: DEFAULT_ZOOM[view] });

  let mapMode = "RADAR";
  if (raw.map_mode !== undefined) {
    if (typeof raw.map_mode !== "string" || !MAP_MODE_RE.test(raw.map_mode)) {
      errors.push("map_mode: must be an upper-case token such as RADAR");
    } else {
      mapMode = raw.map_mode;
    }
  }

  let alertCountry = "USA";
  if (raw.alert_country !== undefined) {
    if (typeof raw.alert_country !== "string" || !COUNTRY_RE.test(raw.alert_country)) {
      errors.push("alert_country: must be an upper-case country token such as USA");
    } else {
      alertCountry = raw.alert_country;
    }
  }

  const config: WeatherWiseConfig = {
    title: typeof raw.title === "string" ? raw.title : undefined,
    latitude: latitude ?? 0,
    longitude: longitude ?? 0,
    view,
    zoom: zoom ?? DEFAULT_ZOOM[view],
    map_mode: mapMode,
    show_map: boolean(raw, "show_map", errors, true),
    map_height: number(raw, "map_height", errors, { min: 120, max: 4000, integer: true, fallback: 480 }) ?? 480,
    map_reload_minutes:
      number(raw, "map_reload_minutes", errors, { min: 0, max: 1440, integer: true, fallback: 0 }) ?? 0,
    map_interactive: boolean(raw, "map_interactive", errors, false),
    map_ui: boolean(raw, "map_ui", errors, false),
    map_autoplay: boolean(raw, "map_autoplay", errors, true),
    show_conditions: boolean(raw, "show_conditions", errors, true),
    show_hourly: boolean(raw, "show_hourly", errors, true),
    hourly_count: number(raw, "hourly_count", errors, { min: 1, max: MAX_HOURLY, integer: true, fallback: 12 }) ?? 12,
    show_daily: boolean(raw, "show_daily", errors, false),
    daily_count: number(raw, "daily_count", errors, { min: 1, max: MAX_DAILY, integer: true, fallback: 5 }) ?? 5,
    model: choice<ForecastModel>(raw, "model", MODELS, errors, "ecmwf_ifs025"),
    temperature_unit: choice<TemperatureUnit>(raw, "temperature_unit", TEMPERATURE_UNITS, errors, "fahrenheit"),
    wind_speed_unit: choice<WindSpeedUnit>(raw, "wind_speed_unit", WIND_UNITS, errors, "mph"),
    precipitation_unit: choice<PrecipitationUnit>(raw, "precipitation_unit", PRECIPITATION_UNITS, errors, "inch"),
    refresh_minutes:
      number(raw, "refresh_minutes", errors, { min: MIN_REFRESH_MINUTES, max: 1440, integer: true, fallback: 30 }) ?? 30,
    hosts: hosts(raw, errors),
    layout: choice<Layout>(raw, "layout", LAYOUTS, errors, "strips"),
    show_alerts: boolean(raw, "show_alerts", errors, true),
    alerts_refresh_minutes:
      number(raw, "alerts_refresh_minutes", errors, {
        min: MIN_ALERTS_REFRESH_MINUTES,
        max: 60,
        integer: true,
        fallback: 5,
      }) ?? 5,
    alerts_max: number(raw, "alerts_max", errors, { min: 1, max: MAX_ALERTS, integer: true, fallback: 3 }) ?? 3,
    alerts_include_outlooks: boolean(raw, "alerts_include_outlooks", errors, false),
    alert_zones: zones(raw, errors),
    alert_country: alertCountry,
  };

  if (errors.length > 0) {
    return { errors };
  }
  return { config, errors };
}

/** True when the forecast API is needed at all for this configuration. */
export function needsForecast(config: WeatherWiseConfig): boolean {
  return config.show_conditions || config.show_hourly || config.show_daily;
}
