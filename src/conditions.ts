/**
 * WMO weather code to display condition. The grouping follows the mapping
 * recorded in docs/design.md; unknown codes stay visible as "unknown"
 * with the raw code preserved by the caller.
 */

import type { Condition, ConditionKey } from "./types";

const LABELS: Record<ConditionKey, string> = {
  "clear-day": "Clear",
  "clear-night": "Clear",
  "partly-cloudy-day": "Partly cloudy",
  "partly-cloudy-night": "Partly cloudy",
  cloudy: "Cloudy",
  fog: "Fog",
  rain: "Rain",
  pouring: "Heavy rain",
  sleet: "Freezing rain",
  snow: "Snow",
  thunderstorm: "Thunderstorm",
  hail: "Thunderstorm with hail",
  unknown: "Unknown",
};

export function conditionFor(code: number | null, isDay: boolean | null): Condition {
  const day = isDay !== false;
  let key: ConditionKey;
  switch (code) {
    case 0:
      key = day ? "clear-day" : "clear-night";
      break;
    case 1:
    case 2:
      key = day ? "partly-cloudy-day" : "partly-cloudy-night";
      break;
    case 3:
      key = "cloudy";
      break;
    case 45:
    case 48:
      key = "fog";
      break;
    case 51:
    case 53:
    case 55:
    case 61:
    case 63:
    case 80:
    case 81:
      key = "rain";
      break;
    case 65:
    case 82:
      key = "pouring";
      break;
    case 56:
    case 57:
    case 66:
    case 67:
      key = "sleet";
      break;
    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
      key = "snow";
      break;
    case 95:
      key = "thunderstorm";
      break;
    case 96:
    case 99:
      key = "hail";
      break;
    default:
      key = "unknown";
  }
  return { key, label: LABELS[key] };
}

/** Compass label for a bearing in degrees (direction the wind blows from). */
export function compass(bearing: number | null): string {
  if (bearing === null || !Number.isFinite(bearing)) {
    return "";
  }
  const points = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round((((bearing % 360) + 360) % 360) / 45) % 8;
  return points[index] ?? "";
}
