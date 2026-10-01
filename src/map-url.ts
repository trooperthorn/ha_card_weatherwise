/**
 * Builds the WeatherWise map URL and reads one back. The app keeps its
 * whole view in the URL fragment: the Mapbox camera, the mode, and one set
 * of parameters per mode. Only an allowlist of those parameters is ever
 * copied or sent; see docs/api.md for what was verified about each.
 */

import type { WeatherWiseConfig } from "./types";
import { MAP_ORIGIN } from "./types";

/** The modes the app accepts in `m=`, from its own list. */
export const MAP_MODES = ["RADAR", "COMPOSITE", "SATELLITE", "MODEL", "OUTLOOKS"] as const;

/**
 * Fragment parameters the card will pass through, in output order.
 * Radar station and product, satellite, composite, model, outlook, and two
 * display flags. Account, token, and server-override parameters that the
 * app also reads are deliberately absent.
 */
export const MAP_PARAM_KEYS = [
  "rt",
  "rp",
  "sid",
  "sr",
  "sp",
  "cid",
  "cr",
  "cp",
  "mid",
  "mr",
  "mn",
  "mp",
  "oid",
  "ost",
  "watermark",
  "ui_drawer",
] as const;

export type MapParamKey = (typeof MAP_PARAM_KEYS)[number];

const KEY_SET: ReadonlySet<string> = new Set(MAP_PARAM_KEYS);

/** Product and station ids are plain tokens; slashes occur in outlook ids. */
export const MAP_PARAM_VALUE_RE = /^[A-Za-z0-9_./-]{1,80}$/;

export function isMapParamKey(key: string): key is MapParamKey {
  return KEY_SET.has(key);
}

function trim(value: number, digits: number): string {
  return Number(value.toFixed(digits)).toString();
}

export type MapUrlConfig = Pick<
  WeatherWiseConfig,
  "map_latitude" | "map_longitude" | "zoom" | "map_mode" | "map_ui" | "map_autoplay" | "map_params"
>;

export function mapUrl(config: MapUrlConfig): string {
  const parts = [
    `map=${trim(config.zoom, 2)}/${trim(config.map_latitude, 4)}/${trim(config.map_longitude, 4)}`,
    `m=${config.map_mode}`,
  ];
  for (const key of MAP_PARAM_KEYS) {
    const value = config.map_params[key];
    if (value !== undefined) {
      parts.push(`${key}=${value}`);
    }
  }
  if (!config.map_ui) {
    parts.push("ui=0");
  }
  if (config.map_autoplay) {
    parts.push("autoplay=1");
  }
  return `${MAP_ORIGIN}/#${parts.join("&")}`;
}

export interface ParsedMapUrl {
  mode?: string;
  camera?: { zoom: number; latitude: number; longitude: number };
  params: Partial<Record<MapParamKey, string>>;
}

/**
 * Reads a URL copied from the WeatherWise app. Returns an error string for
 * anything that is not a WeatherWise map URL. Unknown parameters are
 * ignored; `ui` and `autoplay` are the card's own options; the model run
 * `mn` is dropped because a copied run goes stale within hours and the app
 * loads the latest run when it is absent.
 */
export function parseMapUrl(text: string): ParsedMapUrl | string {
  let url: URL;
  try {
    url = new URL(text.trim());
  } catch {
    return "is not a URL";
  }
  if (url.origin !== MAP_ORIGIN) {
    return `must start with ${MAP_ORIGIN}`;
  }
  const hash = new URLSearchParams(url.hash.replace(/^#/, ""));
  const out: ParsedMapUrl = { params: {} };

  const mode = hash.get("m")?.toUpperCase();
  if (mode !== undefined) {
    if (!(MAP_MODES as readonly string[]).includes(mode)) {
      return `has an unknown mode "${mode}"`;
    }
    out.mode = mode;
  }

  const map = hash.get("map");
  if (map !== null) {
    const [zoom, latitude, longitude] = map.split("/").map(Number);
    if (
      zoom !== undefined &&
      latitude !== undefined &&
      longitude !== undefined &&
      Number.isFinite(zoom) &&
      Number.isFinite(latitude) &&
      Number.isFinite(longitude) &&
      zoom >= 1 &&
      zoom <= 18 &&
      Math.abs(latitude) <= 90 &&
      Math.abs(longitude) <= 180
    ) {
      out.camera = { zoom, latitude, longitude };
    }
  }

  for (const [key, value] of hash.entries()) {
    if (key === "mn" || !isMapParamKey(key)) {
      continue;
    }
    if (MAP_PARAM_VALUE_RE.test(value)) {
      out.params[key] = value;
    }
  }
  return out;
}
