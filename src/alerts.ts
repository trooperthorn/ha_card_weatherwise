/**
 * Local alerts from the WeatherWise warnings feed. The country feed lists
 * every active NWS product with a bounding box and the UGC zones it covers;
 * only storm-based products carry their polygon inline, the rest have it at
 * a per-warning geometry route. A warning applies to the configured point
 * only when a configured zone code is listed for it or the point lies inside
 * its complete polygon. A bounding box hit alone is never a match; see
 * docs/design.md.
 */

import type { Alert, Geometry, MatchedAlert, Ring } from "./types";

export const UGC_RE = /^[A-Z]{2}[CZ]\d{3}$/;
export const COUNTRY_RE = /^[A-Z]{2,3}$/;

export function warningsUrl(host: string, country: string): string {
  return new URL(`/warnings/${country}.geojson`, host).toString();
}

export function geometryUrl(host: string, id: string): string {
  return new URL(`/warnings/archive/${id}-geometry.geojson`, host).toString();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function finite(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function text(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}

function isRing(value: unknown): value is Ring {
  return (
    Array.isArray(value) &&
    value.length >= 4 &&
    value.every(
      (p) => Array.isArray(p) && p.length >= 2 && finite(p[0]) !== null && finite(p[1]) !== null,
    )
  );
}

/** Accepts a GeoJSON geometry object; anything else, including null, is null. */
export function parseGeometry(value: unknown): Geometry | null {
  if (!isRecord(value) || !Array.isArray(value.coordinates)) {
    return null;
  }
  if (value.type === "Polygon" && value.coordinates.every(isRing)) {
    return { type: "Polygon", coordinates: value.coordinates as Ring[] };
  }
  if (
    value.type === "MultiPolygon" &&
    value.coordinates.every((poly) => Array.isArray(poly) && poly.every(isRing))
  ) {
    return { type: "MultiPolygon", coordinates: value.coordinates as Ring[][] };
  }
  return null;
}

/** The geometry route answers with a Feature; a bare geometry is accepted too. */
export function parseGeometryResponse(raw: unknown): Geometry | null {
  if (!isRecord(raw)) {
    return null;
  }
  if (raw.type === "Feature") {
    return parseGeometry(raw.geometry);
  }
  return parseGeometry(raw);
}

function parseBbox(value: unknown): [number, number, number, number] | null {
  if (!Array.isArray(value) || value.length !== 4) {
    return null;
  }
  const nums = value.map(finite);
  if (nums.some((n) => n === null)) {
    return null;
  }
  return nums as [number, number, number, number];
}

function parseFeature(feature: unknown): Alert | null {
  if (!isRecord(feature) || !isRecord(feature.properties)) {
    return null;
  }
  const p = feature.properties;
  const id = text(p.id);
  const title = text(p.title);
  if (id === null || title === null) {
    return null;
  }
  const tags = isRecord(p.tags) ? p.tags : {};
  return {
    id,
    title,
    product: text(p.product) ?? "",
    significance: text(p.significance) ?? "",
    emergency: p.emergency === true,
    office: text(p.office),
    issuedAt: finite(p.issued_at_ms),
    startsAt: finite(p.starts_at_ms),
    expiresAt: finite(p.expires_at_ms),
    ugcs: Array.isArray(p.ugcs) ? p.ugcs.filter((u): u is string => typeof u === "string") : [],
    bbox: parseBbox(p.bbox),
    what: text(tags.WHAT),
    where: text(tags.WHERE),
    when: text(tags.WHEN),
    impacts: text(tags.IMPACTS),
    geometry: parseGeometry(feature.geometry),
  };
}

export class WarningsParseError extends Error {}

export function parseWarnings(raw: unknown): Alert[] {
  if (!isRecord(raw) || !Array.isArray(raw.features)) {
    throw new WarningsParseError("response is not a FeatureCollection");
  }
  const alerts: Alert[] = [];
  for (const feature of raw.features) {
    const alert = parseFeature(feature);
    if (alert) {
      alerts.push(alert);
    }
  }
  return alerts;
}

function pointInRing(lon: number, lat: number, ring: Ring): boolean {
  let inside = false;
  const n = ring.length;
  for (let i = 0, j = n - 1; i < n; j = i, i += 1) {
    const [xi, yi] = ring[i] as [number, number];
    const [xj, yj] = ring[j] as [number, number];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

function pointInPolygon(lon: number, lat: number, rings: Ring[]): boolean {
  const [outer, ...holes] = rings;
  if (!outer || !pointInRing(lon, lat, outer)) {
    return false;
  }
  return !holes.some((hole) => pointInRing(lon, lat, hole));
}

/** Ray-casting test with holes honored; a point on an edge may go either way. */
export function pointInGeometry(lon: number, lat: number, geometry: Geometry): boolean {
  if (geometry.type === "Polygon") {
    return pointInPolygon(lon, lat, geometry.coordinates);
  }
  return geometry.coordinates.some((poly) => pointInPolygon(lon, lat, poly));
}

export function bboxContains(bbox: [number, number, number, number], lon: number, lat: number): boolean {
  const [west, south, east, north] = bbox;
  return lon >= west && lon <= east && lat >= south && lat <= north;
}

/** True while the alert has not expired; a missing expiry is treated as active. */
export function isActive(alert: Alert, nowMs: number): boolean {
  return alert.expiresAt === null || alert.expiresAt > nowMs;
}

/** Outlooks (O) and forecasts (F) are routine products, not hazards. */
export function isOutlook(alert: Alert): boolean {
  return alert.significance === "O" || alert.significance === "F";
}

const SIGNIFICANCE_ORDER: Record<string, number> = { W: 0, A: 1, Y: 2, S: 3, F: 4, O: 5 };

export function severityRank(alert: Alert): number {
  const base = SIGNIFICANCE_ORDER[alert.significance] ?? 6;
  return alert.emergency ? -1 : base;
}

/** Most severe first, then most recently issued. */
export function compareAlerts(a: Alert, b: Alert): number {
  const rank = severityRank(a) - severityRank(b);
  if (rank !== 0) {
    return rank;
  }
  return (b.issuedAt ?? 0) - (a.issuedAt ?? 0);
}

export interface MatchOptions {
  latitude: number;
  longitude: number;
  zones: string[];
  nowMs: number;
  includeOutlooks: boolean;
  /** Resolves the complete geometry for a warning id; null when unavailable. */
  fetchGeometry: (id: string) => Promise<Geometry | null>;
}

/**
 * Selects the alerts that apply to the point. Cheap tests first (expiry,
 * outlook filter, bounding box), then zone codes, then the polygon: inline
 * when the feed carried it, fetched otherwise. A warning whose geometry
 * cannot be obtained is not a match; it is reported through the returned
 * `unresolved` list so the card can say so instead of staying silent.
 */
export async function matchAlerts(
  alerts: Alert[],
  options: MatchOptions,
): Promise<{ matched: MatchedAlert[]; unresolved: Alert[] }> {
  const { latitude, longitude, zones, nowMs, includeOutlooks, fetchGeometry } = options;
  const zoneSet = new Set(zones);
  const matched: MatchedAlert[] = [];
  const unresolved: Alert[] = [];
  const candidates = alerts.filter(
    (a) =>
      isActive(a, nowMs) &&
      (includeOutlooks || !isOutlook(a)) &&
      (a.bbox === null || bboxContains(a.bbox, longitude, latitude)),
  );
  for (const alert of candidates) {
    if (alert.ugcs.some((u) => zoneSet.has(u))) {
      matched.push({ ...alert, matchedBy: "zone" });
      continue;
    }
    let geometry = alert.geometry;
    if (geometry === null) {
      geometry = await fetchGeometry(alert.id);
    }
    if (geometry === null) {
      unresolved.push(alert);
      continue;
    }
    if (pointInGeometry(longitude, latitude, geometry)) {
      matched.push({ ...alert, matchedBy: "polygon" });
    }
  }
  matched.sort(compareAlerts);
  return { matched, unresolved };
}
