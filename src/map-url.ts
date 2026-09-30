/**
 * Builds the WeatherWise map URL. The fragment is zoom/latitude/longitude
 * followed by the app's own parameters; see docs/api.md for what was
 * verified about each.
 */

import type { WeatherWiseConfig } from "./types";
import { MAP_ORIGIN } from "./types";

function trim(value: number, digits: number): string {
  return Number(value.toFixed(digits)).toString();
}

export type MapUrlConfig = Pick<
  WeatherWiseConfig,
  "latitude" | "longitude" | "zoom" | "map_mode" | "map_ui" | "map_autoplay"
>;

export function mapUrl(config: MapUrlConfig): string {
  const parts = [
    `map=${trim(config.zoom, 2)}/${trim(config.latitude, 4)}/${trim(config.longitude, 4)}`,
    `m=${config.map_mode}`,
  ];
  if (!config.map_ui) {
    parts.push("ui=0");
  }
  if (config.map_autoplay) {
    parts.push("autoplay=1");
  }
  return `${MAP_ORIGIN}/#${parts.join("&")}`;
}
