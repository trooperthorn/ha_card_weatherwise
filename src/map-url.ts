/**
 * Builds the WeatherWise map URL. The fragment is zoom/latitude/longitude
 * followed by the map mode; see docs/api.md for what was verified.
 */

import type { WeatherWiseConfig } from "./types";
import { MAP_ORIGIN } from "./types";

function trim(value: number, digits: number): string {
  return Number(value.toFixed(digits)).toString();
}

export function mapUrl(
  config: Pick<WeatherWiseConfig, "latitude" | "longitude" | "zoom" | "map_mode">,
): string {
  const fragment = `map=${trim(config.zoom, 2)}/${trim(config.latitude, 4)}/${trim(config.longitude, 4)}&m=${config.map_mode}`;
  return `${MAP_ORIGIN}/#${fragment}`;
}
