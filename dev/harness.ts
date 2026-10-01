/**
 * Dev harness: mounts the card in the two kiosk arrangements (metro and
 * state) against the live WeatherWise services, plus a broken
 * configuration that exercises the setConfig error path.
 */

import "../src/weatherwise-card";

interface LovelaceCardElement extends HTMLElement {
  setConfig(config: unknown): void;
  hass: unknown;
}

const POINT = { latitude: 32.391, longitude: -96.7 };

const scenarios: Record<string, unknown[]> = {
  "two views": [
    { type: "custom:weatherwise-card", title: "Metro radar", view: "metro", ...POINT },
    {
      type: "custom:weatherwise-card",
      title: "State radar",
      view: "state",
      show_conditions: false,
      show_hourly: false,
      show_daily: true,
      ...POINT,
    },
  ],
  "metro only": [{ type: "custom:weatherwise-card", view: "metro", hourly_count: 8, ...POINT }],
  "app ui shown": [
    { type: "custom:weatherwise-card", view: "metro", map_ui: true, map_autoplay: false, map_interactive: true, ...POINT },
  ],
  "state, celsius, gfs": [
    {
      type: "custom:weatherwise-card",
      view: "state",
      model: "gfs_seamless",
      temperature_unit: "celsius",
      wind_speed_unit: "kmh",
      precipitation_unit: "mm",
      show_daily: true,
      ...POINT,
    },
  ],
  "composite and satellite": [
    {
      type: "custom:weatherwise-card",
      title: "MRMS precipitation type",
      view: "state",
      map_mode: "COMPOSITE",
      composite_product: "SeamlessHSRPRT",
      show_hourly: false,
      ...POINT,
    },
    {
      type: "custom:weatherwise-card",
      title: "GOES East sandwich",
      view: "state",
      map_mode: "SATELLITE",
      satellite_product: "RGB-sandwich",
      show_hourly: false,
      ...POINT,
    },
  ],
  "pasted model url": [
    {
      type: "custom:weatherwise-card",
      title: "HRRR reflectivity",
      map_url:
        "https://web.weatherwise.app/#map=6.1/29.882/-97.866&m=MODEL&mid=HRRR&mr=CONUS&mn=2026_10_01_00_00_00&mp=REFC_0_atmosphere_instant",
      map_url_camera: true,
      show_hourly: false,
      ...POINT,
    },
  ],
  "forecast only": [
    { type: "custom:weatherwise-card", show_map: false, show_daily: true, ...POINT },
  ],
  "report layout": [
    {
      type: "custom:weatherwise-card",
      title: "Forecast report",
      show_map: false,
      layout: "report",
      show_daily: true,
      daily_count: 7,
      hourly_count: 12,
      ...POINT,
    },
  ],
  "alerts with outlooks": [
    {
      type: "custom:weatherwise-card",
      title: "Alerts",
      show_map: false,
      show_hourly: false,
      alerts_include_outlooks: true,
      alerts_max: 10,
      ...POINT,
    },
  ],
  "alerts by zone": [
    {
      type: "custom:weatherwise-card",
      title: "Alerts by zone",
      show_map: false,
      show_hourly: false,
      alert_zones: "TXZ133, TXC139",
      ...POINT,
    },
  ],
  "unreachable host": [
    {
      type: "custom:weatherwise-card",
      show_map: false,
      hosts: ["https://invalid.invalid"],
      ...POINT,
    },
  ],
  "bad config": [
    { type: "custom:weatherwise-card", latitude: "x", view: "county", hourly_count: 0, typo: 1 },
  ],
};

const stage = document.getElementById("stage")!;
const toolbar = document.getElementById("toolbar")!;
const errorBox = document.getElementById("config-error")!;

function activate(name: string): void {
  for (const btn of toolbar.querySelectorAll("button")) {
    btn.classList.toggle("active", btn.dataset.name === name);
  }
  stage.replaceChildren();
  errorBox.textContent = "";
  errorBox.style.display = "none";
  for (const config of scenarios[name] ?? []) {
    const card = document.createElement("weatherwise-card") as LovelaceCardElement;
    card.hass = { locale: { language: "en" } };
    try {
      card.setConfig(config);
      stage.appendChild(card);
    } catch (err) {
      errorBox.textContent = err instanceof Error ? err.message : String(err);
      errorBox.style.display = "block";
    }
  }
}

for (const name of Object.keys(scenarios)) {
  const btn = document.createElement("button");
  btn.textContent = name;
  btn.dataset.name = name;
  btn.addEventListener("click", () => activate(name));
  toolbar.appendChild(btn);
}

activate("two views");
