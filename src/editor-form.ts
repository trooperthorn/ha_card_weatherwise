/**
 * Visual editor schema for the static getConfigForm() contract. Home
 * Assistant renders it with its own form component; the card ships no
 * editor element.
 */

type Schema = Record<string, unknown>;

const grid = (schema: Schema[]): Schema => ({ name: "", type: "grid", flatten: true, schema });

export const CONFIG_FORM_SCHEMA: Schema[] = [
  { name: "title", selector: { text: {} } },
  grid([
    { name: "latitude", required: true, selector: { number: { min: -90, max: 90, step: "any", mode: "box" } } },
    { name: "longitude", required: true, selector: { number: { min: -180, max: 180, step: "any", mode: "box" } } },
  ]),
  grid([
    {
      name: "view",
      selector: {
        select: {
          mode: "dropdown",
          options: [
            { value: "metro", label: "Metro area (zoom 9)" },
            { value: "state", label: "State (zoom 5.79)" },
          ],
        },
      },
    },
    { name: "zoom", selector: { number: { min: 1, max: 18, step: 0.01, mode: "box" } } },
  ]),
  {
    name: "",
    type: "expandable",
    flatten: true,
    title: "Map",
    schema: [
      grid([
        { name: "show_map", selector: { boolean: {} } },
        { name: "map_interactive", selector: { boolean: {} } },
        { name: "map_ui", selector: { boolean: {} } },
        { name: "map_autoplay", selector: { boolean: {} } },
        { name: "map_mode", selector: { text: {} } },
      ]),
      grid([
        { name: "map_height", selector: { number: { min: 120, max: 4000, mode: "box", unit_of_measurement: "px" } } },
        { name: "map_reload_minutes", selector: { number: { min: 0, max: 1440, mode: "box", unit_of_measurement: "min" } } },
      ]),
    ],
  },
  {
    name: "",
    type: "expandable",
    flatten: true,
    title: "Forecast",
    schema: [
      grid([
        { name: "show_conditions", selector: { boolean: {} } },
        { name: "show_hourly", selector: { boolean: {} } },
        { name: "show_daily", selector: { boolean: {} } },
        {
          name: "layout",
          selector: {
            select: {
              mode: "dropdown",
              options: [
                { value: "strips", label: "Compact strips" },
                { value: "report", label: "Report tables" },
              ],
            },
          },
        },
      ]),
      grid([
        { name: "hourly_count", selector: { number: { min: 1, max: 48, mode: "box" } } },
        { name: "daily_count", selector: { number: { min: 1, max: 16, mode: "box" } } },
        { name: "refresh_minutes", selector: { number: { min: 10, max: 1440, mode: "box", unit_of_measurement: "min" } } },
      ]),
      grid([
        {
          name: "model",
          selector: {
            select: {
              mode: "dropdown",
              options: [
                { value: "ecmwf_ifs025", label: "ECMWF IFS 0.25" },
                { value: "gfs_seamless", label: "GFS seamless" },
              ],
            },
          },
        },
        {
          name: "temperature_unit",
          selector: { select: { mode: "dropdown", options: ["fahrenheit", "celsius"] } },
        },
        {
          name: "wind_speed_unit",
          selector: { select: { mode: "dropdown", options: ["mph", "kmh", "ms", "kn"] } },
        },
        {
          name: "precipitation_unit",
          selector: { select: { mode: "dropdown", options: ["inch", "mm"] } },
        },
      ]),
    ],
  },
  {
    name: "",
    type: "expandable",
    flatten: true,
    title: "Alerts",
    schema: [
      grid([
        { name: "show_alerts", selector: { boolean: {} } },
        { name: "alerts_include_outlooks", selector: { boolean: {} } },
      ]),
      grid([
        { name: "alerts_max", selector: { number: { min: 1, max: 10, mode: "box" } } },
        {
          name: "alerts_refresh_minutes",
          selector: { number: { min: 2, max: 60, mode: "box", unit_of_measurement: "min" } },
        },
      ]),
      grid([
        { name: "alert_zones", selector: { text: {} } },
        { name: "alert_country", selector: { text: {} } },
      ]),
    ],
  },
];

const LABELS: Record<string, string> = {
  title: "Title",
  latitude: "Latitude",
  longitude: "Longitude",
  view: "View preset",
  zoom: "Zoom (overrides the preset)",
  show_map: "Show the WeatherWise map",
  map_interactive: "Allow touch, mouse, and wheel input on the map",
  map_ui: "Show the WeatherWise app controls and popups",
  map_autoplay: "Start radar playback automatically",
  map_mode: "Map mode",
  map_height: "Map height",
  map_reload_minutes: "Reload the map every",
  show_conditions: "Show modeled conditions headline",
  show_hourly: "Show hourly strip",
  show_daily: "Show daily strip",
  hourly_count: "Hours to show",
  daily_count: "Days to show",
  refresh_minutes: "Forecast refresh interval",
  model: "Forecast model",
  temperature_unit: "Temperature unit",
  wind_speed_unit: "Wind speed unit",
  precipitation_unit: "Precipitation unit",
  layout: "Forecast layout",
  show_alerts: "Show local alerts",
  alerts_include_outlooks: "Include outlooks and short term forecasts",
  alerts_max: "Alerts to show",
  alerts_refresh_minutes: "Alert refresh interval",
  alert_zones: "Zone codes (optional)",
  alert_country: "Warnings feed country",
};

const HELPERS: Record<string, string> = {
  layout:
    "Strips show one tile per hour and day. Report shows tables with feels-like, rain amount, wind, humidity, sunrise and sunset.",
  show_alerts:
    "Warnings, watches, advisories, and statements from the WeatherWise warnings feed that cover this point, matched by polygon or by the zone codes below.",
  alerts_include_outlooks:
    "Off by default: Hazardous Weather Outlooks, Hydrologic Outlooks, and Short Term Forecasts are routine products, not hazards.",
  alert_zones:
    "NWS UGC codes for this point, comma separated, such as TXZ133 or TXC139. A listed code matches without a polygon lookup; leave empty to rely on the polygon test alone.",
  alert_country: "The country token in the feed path. Only USA is verified.",
  view: "Metro centers tightly on the point; State pulls back to the whole state. Set zoom to override.",
  map_interactive:
    "Off by default for display boards: a stray touch or wheel event would otherwise pan or zoom the map away until the next reload.",
  map_ui:
    "Off by default: the app then hides its mode selector, buttons, and the App Updates announcement that otherwise covers the map on a kiosk.",
  map_mode: "Upper-case token from the WeatherWise URL, RADAR by default. Other modes are unverified.",
  map_reload_minutes: "0 never reloads. A periodic reload guards a kiosk against a stuck embedded page.",
  refresh_minutes: "Minimum 10 minutes. Forecast data is modeled, not measured; it changes on model runs, not by the minute.",
};

export function getConfigForm(): {
  schema: Schema[];
  computeLabel: (s: { name: string }) => string | undefined;
  computeHelper: (s: { name: string }) => string | undefined;
} {
  return {
    schema: CONFIG_FORM_SCHEMA,
    computeLabel: (s) => LABELS[s.name],
    computeHelper: (s) => HELPERS[s.name],
  };
}
