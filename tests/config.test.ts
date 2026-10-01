import { describe, expect, it } from "vitest";
import { needsForecast, parseConfig } from "../src/config";
import { DEFAULT_HOSTS } from "../src/types";

const POINT = { type: "custom:weatherwise-card", latitude: 32.391, longitude: -96.7 };

describe("parseConfig", () => {
  it("applies the metro defaults", () => {
    const { config, errors } = parseConfig(POINT);
    expect(errors).toEqual([]);
    expect(config).toMatchObject({
      view: "metro",
      zoom: 9,
      map_mode: "RADAR",
      show_map: true,
      map_height: 480,
      map_reload_minutes: 0,
      map_interactive: false,
      map_ui: false,
      map_autoplay: true,
      hourly_count: 12,
      show_daily: false,
      model: "ecmwf_ifs025",
      temperature_unit: "fahrenheit",
      wind_speed_unit: "mph",
      precipitation_unit: "inch",
      refresh_minutes: 30,
      hosts: DEFAULT_HOSTS,
      layout: "strips",
      show_alerts: true,
      alerts_refresh_minutes: 5,
      alerts_max: 3,
      alerts_include_outlooks: false,
      alert_zones: [],
      alert_country: "USA",
    });
  });

  it("accepts zone codes as a list or as one string and upper-cases them", () => {
    expect(parseConfig({ ...POINT, alert_zones: ["TXZ133", "txc139"] }).config?.alert_zones).toEqual([
      "TXZ133",
      "TXC139",
    ]);
    expect(parseConfig({ ...POINT, alert_zones: "TXZ133, txc139 TXZ119" }).config?.alert_zones).toEqual([
      "TXZ133",
      "TXC139",
      "TXZ119",
    ]);
    expect(parseConfig({ ...POINT, alert_zones: "" }).config?.alert_zones).toEqual([]);
  });

  it("rejects malformed zone codes, layouts, and country tokens", () => {
    const { errors } = parseConfig({
      ...POINT,
      alert_zones: ["TX133", 7],
      layout: "table",
      alert_country: "usa",
      alerts_refresh_minutes: 1,
      alerts_max: 11,
    });
    expect(errors).toEqual([
      "alert_country: must be an upper-case country token such as USA",
      "layout: must be one of strips, report",
      "alerts_refresh_minutes: must be at least 2",
      "alerts_max: must be at most 10",
      'alert_zones[0]: "TX133" is not a UGC code such as TXZ133 or TXC139',
      'alert_zones[1]: "7" is not a UGC code such as TXZ133 or TXC139',
    ]);
  });

  it("uses the state zoom for the state preset and lets zoom override it", () => {
    expect(parseConfig({ ...POINT, view: "state" }).config?.zoom).toBe(5.79);
    expect(parseConfig({ ...POINT, view: "state", zoom: 6.5 }).config?.zoom).toBe(6.5);
  });

  it("requires coordinates", () => {
    const { errors } = parseConfig({ type: "custom:weatherwise-card" });
    expect(errors).toEqual(["latitude: required", "longitude: required"]);
  });

  it("collects every problem in one pass", () => {
    const { config, errors } = parseConfig({
      ...POINT,
      latitude: "x",
      view: "county",
      hourly_count: 0,
      refresh_minutes: 1,
      map_mode: "radar!",
      hosts: ["http://data2.weatherwise.app", "not a url", "https://ok.example/path"],
      typo: 1,
    });
    expect(config).toBeUndefined();
    expect(errors).toEqual([
      "typo: unknown option",
      "latitude: must be a number",
      "view: must be one of metro, state",
      "map_mode: must be one of RADAR, COMPOSITE, SATELLITE, MODEL, OUTLOOKS",
      "hourly_count: must be at least 1",
      "refresh_minutes: must be at least 10",
      "hosts[0]: must be a bare https origin such as https://data2.weatherwise.app",
      'hosts[1]: "not a url" is not a URL',
      "hosts[2]: must be a bare https origin such as https://data2.weatherwise.app",
    ]);
  });

  it("centers the map on the forecast point with no extra parameters by default", () => {
    const c = parseConfig(POINT).config!;
    expect(c).toMatchObject({ map_latitude: 32.391, map_longitude: -96.7, map_params: {} });
  });

  it("applies a product option only in its own mode", () => {
    const options = { composite_product: "VIL", satellite: "GOES-18", satellite_product: "RGB-sandwich", model_source: "GFS" };
    expect(parseConfig({ ...POINT, ...options }).config?.map_params).toEqual({});
    expect(parseConfig({ ...POINT, ...options, map_mode: "COMPOSITE" }).config?.map_params).toEqual({ cp: "VIL" });
    expect(parseConfig({ ...POINT, ...options, map_mode: "SATELLITE" }).config?.map_params).toEqual({
      sid: "GOES-18",
      sp: "RGB-sandwich",
    });
    expect(parseConfig({ ...POINT, ...options, map_mode: "MODEL" }).config?.map_params).toEqual({ mid: "GFS" });
  });

  it("takes mode and layer from a pasted URL but keeps the card's framing unless asked", () => {
    const map_url =
      "https://web.weatherwise.app/#map=6.1/29.882/-97.866&m=MODEL&mid=HRRR&mr=CONUS&mn=2026_10_01_00_00_00&mp=REFC_0_atmosphere_instant";
    const kept = parseConfig({ ...POINT, map_url }).config!;
    expect(kept.map_mode).toBe("MODEL");
    expect(kept.map_params).toEqual({ mid: "HRRR", mr: "CONUS", mp: "REFC_0_atmosphere_instant" });
    expect([kept.zoom, kept.map_latitude, kept.map_longitude]).toEqual([9, 32.391, -96.7]);
    const framed = parseConfig({ ...POINT, map_url, map_url_camera: true }).config!;
    expect([framed.zoom, framed.map_latitude, framed.map_longitude]).toEqual([6.1, 29.882, -97.866]);
    expect([framed.latitude, framed.longitude]).toEqual([32.391, -96.7]);
  });

  it("lets explicit options override the pasted URL", () => {
    const c = parseConfig({
      ...POINT,
      map_url: "https://web.weatherwise.app/#map=6/30/-97&m=MODEL&mid=HRRR",
      model_source: "GFS",
      map_params: { mr: "CONUS", mn: "2026_10_01_00_00_00" },
    }).config!;
    expect(c.map_params).toEqual({ mid: "GFS", mr: "CONUS", mn: "2026_10_01_00_00_00" });
    expect(parseConfig({ ...POINT, map_url: "https://web.weatherwise.app/#m=MODEL", map_mode: "RADAR" }).config?.map_mode).toBe("RADAR");
  });

  it("rejects unsupported parameters, unsafe values, and foreign URLs", () => {
    const { errors } = parseConfig({
      ...POINT,
      map_url: "https://example.com/#m=RADAR",
      map_params: { token: "x", cp: "a b", rt: "KFWS" },
      satellite_product: "<b>",
    });
    expect(errors).toEqual([
      "map_url: must start with https://web.weatherwise.app",
      "map_params.token: not a supported parameter",
      "map_params.cp: must be a plain token",
      "satellite_product: must be a plain token",
    ]);
  });

  it("normalizes hosts to origins", () => {
    const { config } = parseConfig({ ...POINT, hosts: ["https://data1.weatherwise.app/"] });
    expect(config?.hosts).toEqual(["https://data1.weatherwise.app"]);
  });

  it("rejects non-mappings", () => {
    expect(parseConfig(null).errors).toHaveLength(1);
    expect(parseConfig([]).errors).toHaveLength(1);
  });

  it("tolerates Lovelace bookkeeping keys", () => {
    expect(parseConfig({ ...POINT, grid_options: { columns: 12 }, visibility: [] }).errors).toEqual([]);
  });
});

describe("needsForecast", () => {
  it("is false when only the map is shown", () => {
    const c = parseConfig({ ...POINT, show_conditions: false, show_hourly: false }).config!;
    expect(needsForecast(c)).toBe(false);
  });
  it("is true when any forecast section is shown", () => {
    expect(needsForecast(parseConfig(POINT).config!)).toBe(true);
  });
});
