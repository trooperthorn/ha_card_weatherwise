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
        {
          name: "map_mode",
          selector: {
            select: {
              mode: "dropdown",
              options: [
                { value: "RADAR", label: "Radar (single site)" },
                { value: "COMPOSITE", label: "Composite (MRMS mosaic)" },
                { value: "SATELLITE", label: "Satellite" },
                { value: "MODEL", label: "Model" },
                { value: "OUTLOOKS", label: "Outlooks" },
              ],
            },
          },
        },
      ]),
      grid([
        {
          name: "composite_product",
          selector: {
            select: {
              mode: "dropdown",
              options: [
                { value: "SeamlessHSR", label: "Reflectivity" },
                { value: "SeamlessHSRPRT", label: "Precipitation type" },
                { value: "VIL", label: "Vertically integrated liquid" },
                { value: "EchoTop_18", label: "Echo top (18 dBZ)" },
                { value: "MESH", label: "Max hail size (MESH)" },
                { value: "MESH_Max_60min", label: "Hail swath, 1 hour" },
                { value: "RotationTrack60min", label: "Rotation track, 1 hour" },
                { value: "CREF_1HR_MAX", label: "Composite reflectivity, hourly max" },
              ],
            },
          },
        },
        {
          name: "satellite",
          selector: {
            select: {
              mode: "dropdown",
              options: [
                { value: "GOES-19", label: "GOES East" },
                { value: "GOES-18", label: "GOES West" },
              ],
            },
          },
        },
        {
          name: "satellite_product",
          selector: {
            select: {
              mode: "dropdown",
              options: [
                { value: "RGB-geo_color", label: "GeoColor" },
                { value: "RGB-true_color", label: "True color" },
                { value: "ABI-L1b-C02", label: "Visible (Band 2)" },
                { value: "ABI-L1b-C13", label: "Clean IR (Band 13)" },
                { value: "ABI-L1b-C09", label: "Mid-level water vapor (Band 9)" },
                { value: "RGB-sandwich", label: "Sandwich" },
                { value: "RGB-air_mass", label: "Air mass" },
                { value: "RGB-day_convection", label: "Day convection" },
              ],
            },
          },
        },
        {
          name: "model_source",
          selector: {
            select: {
              mode: "dropdown",
              options: [
                { value: "HRRR", label: "HRRR" },
                { value: "NAM-NEST", label: "NAM Nest" },
                { value: "RAP", label: "RAP" },
                { value: "GFS", label: "GFS" },
                { value: "ECMWF-IFS", label: "ECMWF IFS" },
                { value: "NBM", label: "NBM" },
              ],
            },
          },
        },
        {
          name: "model_field",
          selector: {
            select: {
              mode: "dropdown",
              options: [
                { value: "REFC_0_atmosphere_instant", label: "Composite reflectivity" },
                { value: "CAPE_0_surface_instant", label: "Surface CAPE" },
              ],
            },
          },
        },
      ]),
      { name: "map_url", selector: { text: {} } },
      grid([{ name: "map_url_camera", selector: { boolean: {} } }]),
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
  composite_product: "Composite product",
  satellite: "Satellite",
  satellite_product: "Satellite product",
  model_source: "Model",
  model_field: "Model field",
  map_url: "Paste a WeatherWise URL (optional)",
  map_url_camera: "Use the pasted URL's position and zoom",
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
  map_mode:
    "What the embedded map shows. The product choices below apply only in their own mode; leave them empty for the app's default.",
  composite_product: "Used in Composite mode. Empty shows reflectivity.",
  satellite_product: "Used in Satellite mode. Empty shows GeoColor.",
  model_source: "Used in Model mode. Empty shows HRRR; the latest run is always loaded.",
  model_field:
    "Used in Model mode. Field ids differ between models; for others, set the view in the WeatherWise app and paste its URL below.",
  map_url:
    "Set up any view in the WeatherWise app, copy the address, and paste it here. The card takes the mode and layer from it. Choices made above override it.",
  map_url_camera:
    "Off: the map stays centered on this card's latitude, longitude, and zoom. On: it uses the pasted URL's framing; the forecast and alerts still use the card's point.",
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
