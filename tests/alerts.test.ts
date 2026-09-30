import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  bboxContains,
  compareAlerts,
  geometryUrl,
  isActive,
  isOutlook,
  matchAlerts,
  parseGeometry,
  parseGeometryResponse,
  parseWarnings,
  pointInGeometry,
  warningsUrl,
  WarningsParseError,
} from "../src/alerts";
import type { Alert, Geometry } from "../src/types";

const FEED = JSON.parse(
  readFileSync(new URL("./fixtures/warnings-usa-sample.json", import.meta.url), "utf8"),
);
const GEOMETRY = JSON.parse(
  readFileSync(new URL("./fixtures/warnings-geometry-flood-watch.json", import.meta.url), "utf8"),
);

/** The kiosk point; inside the recorded Flood Watch polygon on 2026-09-30. */
const POINT = { latitude: 32.391, longitude: -96.7 };
/** Before every fixture expiry. */
const NOW = Date.UTC(2026, 8, 30, 20, 0, 0);

const byTitle = (alerts: Alert[], title: string): Alert =>
  alerts.find((a) => a.title === title) ?? (() => {
    throw new Error(`no fixture titled ${title}`);
  })();

describe("urls", () => {
  it("builds the feed and geometry routes", () => {
    expect(warningsUrl("https://data2.weatherwise.app", "USA")).toBe(
      "https://data2.weatherwise.app/warnings/USA.geojson",
    );
    expect(geometryUrl("https://data2.weatherwise.app", "abc")).toBe(
      "https://data2.weatherwise.app/warnings/archive/abc-geometry.geojson",
    );
  });
});

describe("parseWarnings", () => {
  const alerts = parseWarnings(FEED);

  it("normalizes the recorded sample", () => {
    expect(alerts).toHaveLength(6);
    const watch = byTitle(alerts, "Flood Watch");
    expect(watch.significance).toBe("A");
    expect(watch.product).toBe("FA");
    expect(watch.geometry).toBeNull();
    expect(watch.bbox).toHaveLength(4);
    expect(watch.ugcs).toContain("TXZ133");
    expect(watch.expiresAt).toBe(1790942400000);
    expect(watch.what).toMatch(/\S/);
    const svr = byTitle(alerts, "Severe Thunderstorm Warning");
    expect(svr.geometry?.type).toBe("Polygon");
    expect(svr.significance).toBe("W");
  });

  it("skips features without an id or title and rejects non-collections", () => {
    const raw = structuredClone(FEED);
    raw.features.push({ type: "Feature", properties: { title: "Nameless" } }, null, 4);
    expect(parseWarnings(raw)).toHaveLength(6);
    expect(() => parseWarnings({})).toThrow(WarningsParseError);
    expect(() => parseWarnings("x")).toThrow(WarningsParseError);
  });

  it("keeps a missing bbox or malformed geometry as null", () => {
    const raw = structuredClone(FEED);
    raw.features[0].properties.bbox = [1, 2];
    raw.features[0].geometry = { type: "Polygon", coordinates: [[[0, 0], [1, 1]]] };
    const [a] = parseWarnings(raw);
    expect(a?.bbox).toBeNull();
    expect(a?.geometry).toBeNull();
  });
});

describe("geometry", () => {
  const square: Geometry = {
    type: "Polygon",
    coordinates: [
      [
        [0, 0],
        [10, 0],
        [10, 10],
        [0, 10],
        [0, 0],
      ],
    ],
  };
  const squareWithHole: Geometry = {
    type: "Polygon",
    coordinates: [
      square.coordinates[0]!,
      [
        [4, 4],
        [6, 4],
        [6, 6],
        [4, 6],
        [4, 4],
      ],
    ],
  };
  const multi: Geometry = {
    type: "MultiPolygon",
    coordinates: [
      square.coordinates,
      [
        [
          [20, 20],
          [30, 20],
          [30, 30],
          [20, 30],
          [20, 20],
        ],
      ],
    ],
  };

  it("tests a point against a polygon, honoring holes", () => {
    expect(pointInGeometry(5, 5, square)).toBe(true);
    expect(pointInGeometry(15, 5, square)).toBe(false);
    expect(pointInGeometry(5, 5, squareWithHole)).toBe(false);
    expect(pointInGeometry(2, 2, squareWithHole)).toBe(true);
  });

  it("tests every polygon of a MultiPolygon", () => {
    expect(pointInGeometry(25, 25, multi)).toBe(true);
    expect(pointInGeometry(15, 15, multi)).toBe(false);
  });

  it("parses the recorded geometry response and contains the kiosk point", () => {
    const g = parseGeometryResponse(GEOMETRY);
    expect(g?.type).toBe("Polygon");
    expect(pointInGeometry(POINT.longitude, POINT.latitude, g!)).toBe(true);
    expect(pointInGeometry(-101.9, 35.5, g!)).toBe(false);
  });

  it("rejects shapes that are not polygons", () => {
    expect(parseGeometry({ type: "Point", coordinates: [1, 2] })).toBeNull();
    expect(parseGeometry(null)).toBeNull();
    expect(parseGeometryResponse({ type: "Feature", geometry: null })).toBeNull();
    expect(parseGeometry({ type: "MultiPolygon", coordinates: [[[[0, 0]]]] })).toBeNull();
  });

  it("checks bounding boxes as west, south, east, north", () => {
    expect(bboxContains([-97, 32, -96, 33], -96.7, 32.391)).toBe(true);
    expect(bboxContains([-97, 32, -96, 33], -95, 32.391)).toBe(false);
  });
});

describe("filters and ordering", () => {
  const alerts = parseWarnings(FEED);

  it("treats expiry and a missing expiry correctly", () => {
    const watch = byTitle(alerts, "Flood Watch");
    expect(isActive(watch, NOW)).toBe(true);
    expect(isActive(watch, watch.expiresAt! + 1)).toBe(false);
    expect(isActive({ ...watch, expiresAt: null }, NOW)).toBe(true);
  });

  it("classifies outlooks and forecasts as routine", () => {
    expect(isOutlook(byTitle(alerts, "Hydrologic Outlook"))).toBe(true);
    expect(isOutlook(byTitle(alerts, "Flood Watch"))).toBe(false);
    expect(isOutlook({ ...byTitle(alerts, "Flood Watch"), significance: "F" })).toBe(true);
  });

  it("orders warnings before watches before advisories, emergencies first", () => {
    const w = byTitle(alerts, "Severe Thunderstorm Warning");
    const a = byTitle(alerts, "Flood Watch");
    const y = byTitle(alerts, "Heat Advisory");
    const s = byTitle(alerts, "Beach Hazards Statement");
    const sorted = [s, y, a, w].sort(compareAlerts).map((x) => x.significance);
    expect(sorted).toEqual(["W", "A", "Y", "S"]);
    expect(compareAlerts({ ...y, emergency: true }, w)).toBeLessThan(0);
    expect(compareAlerts({ ...w, issuedAt: 5 }, { ...w, issuedAt: 9 })).toBeGreaterThan(0);
  });
});

describe("matchAlerts", () => {
  const alerts = parseWarnings(FEED);
  const geometry = parseGeometryResponse(GEOMETRY)!;
  const watchId = byTitle(alerts, "Flood Watch").id;

  const base = {
    ...POINT,
    zones: [] as string[],
    nowMs: NOW,
    includeOutlooks: false,
  };

  it("matches by fetched polygon and fetches only bbox candidates", async () => {
    const requested: string[] = [];
    const { matched, unresolved } = await matchAlerts(alerts, {
      ...base,
      fetchGeometry: async (id) => {
        requested.push(id);
        return id === watchId ? geometry : null;
      },
    });
    expect(requested).toEqual([watchId]);
    expect(matched.map((a) => [a.title, a.matchedBy])).toEqual([["Flood Watch", "polygon"]]);
    expect(unresolved).toEqual([]);
  });

  it("matches by zone code without a geometry lookup", async () => {
    let fetched = 0;
    const { matched } = await matchAlerts(alerts, {
      ...base,
      zones: ["TXZ133"],
      fetchGeometry: async () => {
        fetched += 1;
        return null;
      },
    });
    expect(fetched).toBe(0);
    expect(matched[0]?.matchedBy).toBe("zone");
  });

  it("reports a candidate whose polygon cannot be obtained instead of matching it", async () => {
    const { matched, unresolved } = await matchAlerts(alerts, {
      ...base,
      fetchGeometry: async () => null,
    });
    expect(matched).toEqual([]);
    expect(unresolved.map((a) => a.title)).toEqual(["Flood Watch"]);
  });

  it("never matches on a bounding box hit when the point is outside the polygon", async () => {
    const { matched } = await matchAlerts(alerts, {
      ...base,
      latitude: 33.9,
      longitude: -96.7,
      fetchGeometry: async () => geometry,
    });
    expect(matched).toEqual([]);
  });

  it("uses inline geometry when present", async () => {
    const svr = byTitle(alerts, "Severe Thunderstorm Warning");
    const g = svr.geometry!;
    const [lon, lat] = g.type === "Polygon" ? g.coordinates[0]![0]! : [0, 0];
    // Nudge inward from the first vertex toward the centroid recorded by the feed.
    const { matched } = await matchAlerts(alerts, {
      ...base,
      latitude: (lat! + 31.4535) / 2,
      longitude: (lon! + -102.846) / 2,
      fetchGeometry: async () => {
        throw new Error("should not fetch");
      },
    });
    expect(matched.map((a) => a.title)).toContain("Severe Thunderstorm Warning");
  });

  it("drops expired alerts and hides outlooks unless asked", async () => {
    const hyo = byTitle(alerts, "Hydrologic Outlook");
    const inside: Alert = { ...hyo, bbox: null, geometry: null };
    const quiet = await matchAlerts([inside], {
      ...base,
      fetchGeometry: async () => geometry,
    });
    expect(quiet.matched).toEqual([]);
    const loud = await matchAlerts([inside], {
      ...base,
      includeOutlooks: true,
      fetchGeometry: async () => geometry,
    });
    expect(loud.matched.map((a) => a.title)).toEqual(["Hydrologic Outlook"]);
    const late = await matchAlerts(alerts, {
      ...base,
      nowMs: Date.UTC(2027, 0, 1),
      fetchGeometry: async () => geometry,
    });
    expect(late.matched).toEqual([]);
  });
});
