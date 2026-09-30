import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { fetchForecast, ForecastFetchError } from "../src/api";
import { parseConfig } from "../src/config";

const FIXTURE = readFileSync(
  new URL("./fixtures/forecast-ecmwf-24h-5d.json", import.meta.url),
  "utf8",
);

const config = parseConfig({
  type: "custom:weatherwise-card",
  latitude: 32.391,
  longitude: -96.7,
  hosts: ["https://a.example", "https://b.example"],
}).config!;

const noSleep = (): Promise<void> => Promise.resolve();

function jsonResponse(body: string, status = 200): Response {
  return new Response(body, { status, headers: { "content-type": "application/json" } });
}

describe("fetchForecast", () => {
  it("returns the parsed forecast from the first healthy host", async () => {
    const urls: string[] = [];
    const f = await fetchForecast(config, {
      sleep: noSleep,
      fetch: async (url) => {
        urls.push(url);
        return jsonResponse(FIXTURE);
      },
    });
    expect(f.hourly).toHaveLength(24);
    expect(urls).toHaveLength(1);
    expect(urls[0]).toMatch(/^https:\/\/a\.example\/api\/om\/v1\/forecast\?/);
  });

  it("fails over to the next host on HTTP errors and bad JSON", async () => {
    const urls: string[] = [];
    const f = await fetchForecast(
      { ...config, hosts: ["https://a.example", "https://b.example", "https://c.example"] },
      {
        sleep: noSleep,
        fetch: async (url) => {
          urls.push(url);
          if (url.startsWith("https://a.")) {
            return jsonResponse("", 503);
          }
          if (url.startsWith("https://b.")) {
            return jsonResponse("<html>", 200);
          }
          return jsonResponse(FIXTURE);
        },
      },
    );
    expect(f.timezone).toBe("America/Chicago");
    expect(urls.map((u) => new URL(u).host)).toEqual(["a.example", "b.example", "c.example"]);
  });

  it("gives up after one attempt per host and reports every attempt", async () => {
    await expect(
      fetchForecast(config, {
        sleep: noSleep,
        fetch: async () => jsonResponse("", 429),
      }),
    ).rejects.toMatchObject({
      attempts: ["https://a.example: HTTP 429", "https://b.example: HTTP 429"],
    } satisfies Partial<ForecastFetchError>);
  });

  it("treats an aborted attempt as a timeout and moves on", async () => {
    let calls = 0;
    const f = await fetchForecast(config, {
      sleep: noSleep,
      timeoutMs: 5,
      fetch: (url, init) => {
        calls += 1;
        if (calls === 1) {
          return new Promise((_resolve, reject) => {
            init?.signal?.addEventListener("abort", () => reject(new Error("aborted")));
          });
        }
        return Promise.resolve(jsonResponse(FIXTURE));
      },
    });
    expect(calls).toBe(2);
    expect(f.hourly).toHaveLength(24);
  });

  it("surfaces a schema problem as a failure, not as empty weather", async () => {
    await expect(
      fetchForecast(config, {
        sleep: noSleep,
        fetch: async () => jsonResponse(JSON.stringify({ hourly: {} })),
      }),
    ).rejects.toBeInstanceOf(Error);
  });
});
