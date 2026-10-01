import { describe, expect, it } from "vitest";
import { compass, conditionFor } from "../src/conditions";
import { formatAge, formatHour, formatTime, round } from "../src/format";
import { mapUrl, parseMapUrl } from "../src/map-url";

describe("mapUrl", () => {
  const base = { map_latitude: 32.391, map_longitude: -96.7, zoom: 5.79, map_mode: "RADAR", map_params: {} };

  it("reproduces the handoff URL for the state view when the app UI is shown", () => {
    expect(mapUrl({ ...base, map_ui: true, map_autoplay: false })).toBe(
      "https://web.weatherwise.app/#map=5.79/32.391/-96.7&m=RADAR",
    );
  });
  it("hides the app UI and starts playback by default", () => {
    expect(mapUrl({ ...base, map_ui: false, map_autoplay: true })).toBe(
      "https://web.weatherwise.app/#map=5.79/32.391/-96.7&m=RADAR&ui=0&autoplay=1",
    );
  });
  it("trims coordinate noise", () => {
    expect(
      mapUrl({ map_latitude: 32.39100004, map_longitude: -96.70000001, zoom: 9, map_mode: "RADAR", map_params: {}, map_ui: true, map_autoplay: false }),
    ).toBe("https://web.weatherwise.app/#map=9/32.391/-96.7&m=RADAR");
  });
});

describe("map modes and parameters", () => {
  const base = { map_latitude: 32.391, map_longitude: -96.7, zoom: 6, map_ui: false, map_autoplay: true };

  it("emits allowlisted parameters in a fixed order between the mode and the card flags", () => {
    expect(
      mapUrl({ ...base, map_mode: "MODEL", map_params: { mp: "REFC_0_atmosphere_instant", mid: "HRRR", mr: "CONUS" } }),
    ).toBe(
      "https://web.weatherwise.app/#map=6/32.391/-96.7&m=MODEL&mid=HRRR&mr=CONUS&mp=REFC_0_atmosphere_instant&ui=0&autoplay=1",
    );
  });

  it("reads the mode, camera, and layer from a pasted URL and drops the model run", () => {
    const parsed = parseMapUrl(
      "https://web.weatherwise.app/#map=6.1/29.882/-97.866&m=OUTLOOKS&mid=HRRR&mr=CONUS&mn=2026_10_01_00_00_00&mp=REFC_0_atmosphere_instant",
    );
    expect(parsed).toEqual({
      mode: "OUTLOOKS",
      camera: { zoom: 6.1, latitude: 29.882, longitude: -97.866 },
      params: { mid: "HRRR", mr: "CONUS", mp: "REFC_0_atmosphere_instant" },
    });
  });

  it("ignores parameters outside the allowlist, including account and server overrides", () => {
    const parsed = parseMapUrl(
      "https://web.weatherwise.app/#map=6.49/30.898/-97.442&m=composite&token=abc&email=a@b.c&data_server=https://evil.example&ui=1&cp=VIL&sp=<script>",
    );
    expect(parsed).toMatchObject({ mode: "COMPOSITE", params: { cp: "VIL" } });
    expect(Object.keys((parsed as { params: object }).params)).toEqual(["cp"]);
  });

  it("rejects other sites, unknown modes, and non-URLs", () => {
    expect(parseMapUrl("https://example.com/#map=6/1/1&m=RADAR")).toBe("must start with https://web.weatherwise.app");
    expect(parseMapUrl("https://web.weatherwise.app/#m=HOME")).toBe('has an unknown mode "HOME"');
    expect(parseMapUrl("radar please")).toBe("is not a URL");
  });

  it("keeps a URL without a usable camera", () => {
    expect(parseMapUrl("https://web.weatherwise.app/#map=99/1/1&m=RADAR")).toEqual({ mode: "RADAR", params: {} });
  });
});

describe("conditionFor", () => {
  it("distinguishes day and night for clear and partly cloudy", () => {
    expect(conditionFor(0, true).key).toBe("clear-day");
    expect(conditionFor(0, false).key).toBe("clear-night");
    expect(conditionFor(2, false).key).toBe("partly-cloudy-night");
    expect(conditionFor(1, null).key).toBe("partly-cloudy-day");
  });
  it("maps the documented groups", () => {
    expect(conditionFor(3, true).key).toBe("cloudy");
    expect(conditionFor(48, true).key).toBe("fog");
    expect(conditionFor(61, true).key).toBe("rain");
    expect(conditionFor(82, true).key).toBe("pouring");
    expect(conditionFor(66, true).key).toBe("sleet");
    expect(conditionFor(75, true).key).toBe("snow");
    expect(conditionFor(95, true).key).toBe("thunderstorm");
    expect(conditionFor(99, true).key).toBe("hail");
  });
  it("keeps unknown codes visible as unknown", () => {
    expect(conditionFor(42, true)).toEqual({ key: "unknown", label: "Unknown" });
    expect(conditionFor(null, true).key).toBe("unknown");
  });
});

describe("compass", () => {
  it("rounds bearings to eight points", () => {
    expect(compass(0)).toBe("N");
    expect(compass(170)).toBe("S");
    expect(compass(359)).toBe("N");
    expect(compass(-45)).toBe("NW");
    expect(compass(null)).toBe("");
  });
});

describe("format", () => {
  it("renders hours in the forecast timezone, not the host timezone", () => {
    expect(formatHour(1790787600, "America/Chicago", "en-US")).toBe("12 PM");
    expect(formatHour(1790787600, "UTC", "en-US")).toBe("5 PM");
    expect(formatTime(1790770838, "America/Chicago", "en-US")).toBe("7:20 AM");
  });
  it("falls back when the timezone is invalid", () => {
    expect(formatHour(1790787600, "Not/AZone", "en-US")).toBe("17:00");
  });
  it("formats ages and rounds with a placeholder for nulls", () => {
    expect(formatAge(20_000)).toBe("just now");
    expect(formatAge(5 * 60_000)).toBe("5 min ago");
    expect(formatAge(125 * 60_000)).toBe("2 h 5 min ago");
    expect(round(null)).toBe("--");
    expect(round(85.34)).toBe("85");
    expect(round(32.456, 2)).toBe("32.46");
  });
});
