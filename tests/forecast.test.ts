import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parseConfig } from "../src/config";
import {
  currentIndex,
  ForecastParseError,
  forecastUrl,
  maxRainChance,
  parseForecast,
  selectWindow,
} from "../src/forecast";

const FIXTURE = JSON.parse(
  readFileSync(new URL("./fixtures/forecast-ecmwf-24h-5d.json", import.meta.url), "utf8"),
);

const POINT = { type: "custom:weatherwise-card", latitude: 32.391, longitude: -96.7 };

describe("forecastUrl", () => {
  it("builds the verified request shape with unixtime and explicit units", () => {
    const c = parseConfig({ ...POINT, hourly_count: 12 }).config!;
    const url = new URL(forecastUrl("https://data2.weatherwise.app", c));
    expect(url.origin + url.pathname).toBe("https://data2.weatherwise.app/api/om/v1/forecast");
    expect(url.searchParams.get("models")).toBe("ecmwf_ifs025");
    expect(url.searchParams.get("timeformat")).toBe("unixtime");
    expect(url.searchParams.get("timezone")).toBe("auto");
    expect(url.searchParams.get("forecast_hours")).toBe("14");
    expect(url.searchParams.get("forecast_days")).toBe("1");
    expect(url.searchParams.get("temperature_unit")).toBe("fahrenheit");
    expect(url.searchParams.get("wind_speed_unit")).toBe("mph");
    expect(url.searchParams.get("precipitation_unit")).toBe("inch");
    expect(url.searchParams.get("hourly")).toContain("is_day");
  });

  it("switches route and model for GFS and caps hours at 48", () => {
    const c = parseConfig({ ...POINT, model: "gfs_seamless", hourly_count: 48, show_daily: true, daily_count: 7 }).config!;
    const url = new URL(forecastUrl("https://data1.weatherwise.app", c));
    expect(url.pathname).toBe("/api/om/v1/gfs");
    expect(url.searchParams.get("models")).toBe("gfs_seamless");
    expect(url.searchParams.get("forecast_hours")).toBe("48");
    expect(url.searchParams.get("forecast_days")).toBe("7");
  });
});

describe("parseForecast", () => {
  it("normalizes the recorded fixture", () => {
    const f = parseForecast(FIXTURE, "ecmwf_ifs025");
    expect(f.hourly).toHaveLength(24);
    expect(f.daily).toHaveLength(5);
    expect(f.timezone).toBe("America/Chicago");
    expect(f.utcOffsetSeconds).toBe(-18000);
    expect(f.units).toEqual({ temperature: "°F", windSpeed: "mph", precipitation: "mm" });
    expect(f.gridLatitude).toBe(32.5);
    expect(f.hourly[0]?.time).toBe(1790787600);
    expect(f.hourly[0]?.isDay).toBe(true);
    expect(typeof f.hourly[0]?.temperature).toBe("number");
    expect(f.daily[0]?.sunrise).toBe(1790770838);
  });

  it("keeps nulls as nulls and never invents zeros", () => {
    const raw = structuredClone(FIXTURE);
    raw.hourly.temperature_2m[3] = null;
    raw.hourly.precipitation_probability[3] = "n/a";
    const f = parseForecast(raw, "ecmwf_ifs025");
    expect(f.hourly[3]?.temperature).toBeNull();
    expect(f.hourly[3]?.precipitationProbability).toBeNull();
  });

  it("blanks a column whose length disagrees with time", () => {
    const raw = structuredClone(FIXTURE);
    raw.hourly.wind_speed_10m = raw.hourly.wind_speed_10m.slice(0, 5);
    const f = parseForecast(raw, "ecmwf_ifs025");
    expect(f.hourly.every((p) => p.windSpeed === null)).toBe(true);
    expect(f.hourly[0]?.temperature).not.toBeNull();
  });

  it("tolerates a missing daily block and missing units", () => {
    const raw = structuredClone(FIXTURE);
    delete raw.daily;
    delete raw.hourly_units;
    const f = parseForecast(raw, "ecmwf_ifs025");
    expect(f.daily).toEqual([]);
    expect(f.units.temperature).toBe("");
  });

  it("rejects shapes without hourly time", () => {
    expect(() => parseForecast({}, "ecmwf_ifs025")).toThrow(ForecastParseError);
    expect(() => parseForecast("nope", "ecmwf_ifs025")).toThrow(ForecastParseError);
    expect(() => parseForecast({ hourly: { time: ["a"] } }, "ecmwf_ifs025")).toThrow(ForecastParseError);
  });
});

describe("interval selection", () => {
  const f = parseForecast(FIXTURE, "ecmwf_ifs025");
  const first = f.hourly[0]!.time;

  it("picks the hour whose end is still in the future", () => {
    expect(currentIndex(f.hourly, first)).toBe(0);
    expect(currentIndex(f.hourly, first + 3599)).toBe(0);
    expect(currentIndex(f.hourly, first + 3600)).toBe(1);
    expect(currentIndex(f.hourly, first + 5 * 3600 + 1)).toBe(5);
  });

  it("reports an expired forecast instead of showing the last hour as current", () => {
    const w = selectWindow(f, first + 24 * 3600, 6);
    expect(w.expired).toBe(true);
    expect(w.current).toBeNull();
    expect(w.upcoming).toEqual([]);
  });

  it("returns the requested number of upcoming hours after the current one", () => {
    const w = selectWindow(f, first + 1800, 6);
    expect(w.current?.time).toBe(first);
    expect(w.upcoming.map((p) => p.time)).toEqual([1, 2, 3, 4, 5, 6].map((i) => first + i * 3600));
  });

  it("computes the maximum rain chance ignoring nulls", () => {
    expect(maxRainChance([])).toBeNull();
    expect(
      maxRainChance([
        { precipitationProbability: null } as never,
        { precipitationProbability: 4 } as never,
        { precipitationProbability: 9 } as never,
      ]),
    ).toBe(9);
  });
});
