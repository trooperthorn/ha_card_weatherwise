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
    });
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
      "map_mode: must be an upper-case token such as RADAR",
      "hourly_count: must be at least 1",
      "refresh_minutes: must be at least 10",
      "hosts[0]: must be a bare https origin such as https://data2.weatherwise.app",
      'hosts[1]: "not a url" is not a URL',
      "hosts[2]: must be a bare https origin such as https://data2.weatherwise.app",
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
