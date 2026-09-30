/**
 * Bounded fetches: one attempt per host in order, a fixed timeout per
 * attempt, and a short backoff between hosts. Retries across polls are the
 * caller's job (the card keeps its last good data and marks it stale). The
 * WeatherWise app's own aggressive retry loop is deliberately not
 * reproduced; see docs/design.md.
 */

import { geometryUrl, parseGeometryResponse, parseWarnings, warningsUrl } from "./alerts";
import { forecastUrl, parseForecast } from "./forecast";
import type { Alert, Forecast, Geometry, WeatherWiseConfig } from "./types";

export const ATTEMPT_TIMEOUT_MS = 30_000;
export const BACKOFF_MS = 1_000;

export type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

export class HostsFetchError extends Error {
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

/**
 * Fetches JSON from the first host that answers. A parse failure of a good
 * response is not retried on the next host: the same document would come
 * back, so it surfaces as the error.
 */
export async function fetchJson(
  hosts: string[],
  urlFor: (host: string) => string,
  options: FetchOptions = {},
): Promise<unknown> {
  const doFetch = options.fetch ?? ((input, init) => globalThis.fetch(input, init));
  const sleep = options.sleep ?? defaultSleep;
  const timeoutMs = options.timeoutMs ?? ATTEMPT_TIMEOUT_MS;
  const attempts: string[] = [];

  for (const [i, host] of hosts.entries()) {
    if (i > 0) {
      await sleep(BACKOFF_MS * i);
    }
    const url = urlFor(host);
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
      try {
        return await response.json();
      } catch (err) {
        attempts.push(`${host}: invalid JSON (${(err as Error).message})`);
        continue;
      }
    } catch (err) {
      const reason = controller.signal.aborted ? "timeout" : (err as Error).message;
      attempts.push(`${host}: ${reason}`);
    } finally {
      clearTimeout(timer);
    }
  }
  throw new HostsFetchError("unavailable from every host", attempts);
}

export async function fetchForecast(
  config: WeatherWiseConfig,
  options: FetchOptions = {},
): Promise<Forecast> {
  const body = await fetchJson(config.hosts, (host) => forecastUrl(host, config), options);
  return parseForecast(body, config.model);
}

export async function fetchWarnings(
  config: WeatherWiseConfig,
  options: FetchOptions = {},
): Promise<Alert[]> {
  const body = await fetchJson(config.hosts, (host) => warningsUrl(host, config.alert_country), options);
  return parseWarnings(body);
}

/**
 * Fetches one warning's complete geometry. Failure is returned as null
 * rather than thrown: a single unreachable polygon must not take the whole
 * alert list down, and the caller records the warning as unresolved.
 */
export async function fetchGeometry(
  hosts: string[],
  id: string,
  options: FetchOptions = {},
): Promise<Geometry | null> {
  try {
    const body = await fetchJson(hosts, (host) => geometryUrl(host, id), options);
    return parseGeometryResponse(body);
  } catch {
    return null;
  }
}
