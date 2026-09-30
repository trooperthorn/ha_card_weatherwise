/**
 * Bounded forecast fetch: one attempt per host in order, a fixed timeout
 * per attempt, and a short backoff between hosts. Retries across polls are
 * the caller's job (the card keeps its last good forecast and marks it
 * stale). The WeatherWise app's own aggressive retry loop is deliberately
 * not reproduced; see docs/design.md.
 */

import { forecastUrl, parseForecast } from "./forecast";
import type { Forecast, WeatherWiseConfig } from "./types";

export const ATTEMPT_TIMEOUT_MS = 30_000;
export const BACKOFF_MS = 1_000;

export type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

export class ForecastFetchError extends Error {
  constructor(
    message: string,
    public readonly attempts: string[],
  ) {
    super(message);
  }
}

export interface FetchOptions {
  fetch?: FetchLike;
  sleep?: (ms: number) => Promise<void>;
  timeoutMs?: number;
}

const defaultSleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchForecast(
  config: WeatherWiseConfig,
  options: FetchOptions = {},
): Promise<Forecast> {
  const doFetch = options.fetch ?? ((input, init) => globalThis.fetch(input, init));
  const sleep = options.sleep ?? defaultSleep;
  const timeoutMs = options.timeoutMs ?? ATTEMPT_TIMEOUT_MS;
  const attempts: string[] = [];

  for (const [i, host] of config.hosts.entries()) {
    if (i > 0) {
      await sleep(BACKOFF_MS * i);
    }
    const url = forecastUrl(host, config);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await doFetch(url, {
        signal: controller.signal,
        headers: { accept: "application/json" },
        cache: "no-store",
      });
      if (!response.ok) {
        attempts.push(`${host}: HTTP ${response.status}`);
        continue;
      }
      let body: unknown;
      try {
        body = await response.json();
      } catch (err) {
        attempts.push(`${host}: invalid JSON (${(err as Error).message})`);
        continue;
      }
      return parseForecast(body, config.model);
    } catch (err) {
      const reason = controller.signal.aborted ? "timeout" : (err as Error).message;
      attempts.push(`${host}: ${reason}`);
    } finally {
      clearTimeout(timer);
    }
  }
  throw new ForecastFetchError("forecast unavailable from every host", attempts);
}
