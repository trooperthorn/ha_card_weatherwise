/**
 * weatherwise-card: an embedded WeatherWise radar map for kiosk displays
 * with a modeled-conditions headline and hourly and daily strips from the
 * WeatherWise forecast API. Configure one card per view (metro, state).
 */

import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { keyed } from "lit/directives/keyed.js";
import { fetchForecast, ForecastFetchError } from "./api";
import { needsForecast, parseConfig } from "./config";
import { compass, conditionFor } from "./conditions";
import { getConfigForm } from "./editor-form";
import { maxRainChance, selectWindow } from "./forecast";
import { formatAge, formatHour, formatTime, formatWeekday, round } from "./format";
import { conditionIcon } from "./icons";
import { mapUrl } from "./map-url";
import { tokens } from "./styles";
import type { Forecast, HomeAssistant, WeatherWiseConfig } from "./types";

const MINUTE_MS = 60_000;
/** A forecast older than this many refresh intervals is shown as stale. */
const STALE_INTERVALS = 2;

class WeatherWiseCard extends LitElement {
  @property({ attribute: false }) config?: WeatherWiseConfig;

  @state() private forecast?: Forecast;
  @state() private fetchedAt?: number;
  @state() private lastError?: string;
  @state() private loading = false;
  @state() private now = Date.now();
  @state() private mapGeneration = 0;

  private _hass?: HomeAssistant;
  private pollTimer?: ReturnType<typeof setInterval>;
  private tickTimer?: ReturnType<typeof setInterval>;
  private mapTimer?: ReturnType<typeof setInterval>;
  private forecastKey = "";

  static override styles = [
    tokens,
    css`
      :host {
        display: block;
      }
      .card {
        display: flex;
        flex-direction: column;
        gap: 12px;
        background: var(--wwc-bg);
        border-radius: var(--wwc-radius);
        padding: 16px;
        color: var(--wwc-text);
        box-sizing: border-box;
      }
      .header {
        display: flex;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;
      }
      .title {
        font-size: 18px;
        font-weight: 600;
        flex: 1 1 auto;
        min-width: 0;
      }
      .headline {
        display: flex;
        align-items: center;
        gap: 14px;
      }
      .headline .icon {
        color: var(--wwc-accent);
        display: inline-flex;
      }
      .temp {
        font-size: 40px;
        font-weight: 300;
        line-height: 1;
      }
      .details {
        display: grid;
        grid-template-columns: auto auto;
        gap: 2px 12px;
        font-size: 13px;
        color: var(--wwc-text-dim);
      }
      .details b {
        color: var(--wwc-text);
        font-weight: 500;
      }
      .meta {
        font-size: 12px;
        color: var(--wwc-text-dim);
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        align-items: center;
      }
      .badge {
        border-radius: 6px;
        padding: 1px 8px;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }
      .badge.stale {
        background: var(--wwc-warn);
        color: #111;
      }
      .badge.error {
        background: var(--wwc-error);
        color: #fff;
      }
      .map {
        position: relative;
        width: 100%;
        border-radius: calc(var(--wwc-radius) - 4px);
        overflow: hidden;
        background: #0b1020;
      }
      .map iframe {
        display: block;
        width: 100%;
        height: 100%;
        border: 0;
      }
      .map.locked iframe {
        pointer-events: none;
      }
      .strip {
        display: flex;
        gap: 8px;
        overflow-x: auto;
        scrollbar-width: none;
      }
      .strip::-webkit-scrollbar {
        display: none;
      }
      .tile {
        flex: 1 0 64px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        background: var(--wwc-tile);
        border-radius: 10px;
        padding: 8px 6px;
        font-size: 13px;
      }
      .tile .when {
        color: var(--wwc-text-dim);
        font-size: 12px;
      }
      .tile .icon {
        color: var(--wwc-accent);
        display: inline-flex;
      }
      .tile .rain {
        color: var(--wwc-text-dim);
        font-size: 12px;
      }
      .tile .lo {
        color: var(--wwc-text-dim);
      }
      .footer {
        display: flex;
        justify-content: space-between;
        gap: 8px;
        font-size: 11px;
        color: var(--wwc-text-dim);
        flex-wrap: wrap;
      }
      .footer a {
        color: inherit;
      }
      .problems {
        color: var(--wwc-error);
        white-space: pre-wrap;
        font-size: 13px;
      }
    `,
  ];

  setConfig(raw: unknown): void {
    const result = parseConfig(raw);
    if (!result.config) {
      throw new Error(`weatherwise-card configuration:\n- ${result.errors.join("\n- ")}`);
    }
    this.config = result.config;
    this.mapGeneration += 1;
    this.arm();
  }

  set hass(hass: HomeAssistant) {
    this._hass = hass;
  }

  getCardSize(): number {
    const c = this.config;
    if (!c) {
      return 4;
    }
    let units = 1;
    if (c.show_conditions) {
      units += 2;
    }
    if (c.show_map) {
      units += Math.ceil(c.map_height / 50);
    }
    if (c.show_hourly) {
      units += 2;
    }
    if (c.show_daily) {
      units += 2;
    }
    return units;
  }

  getGridOptions(): Record<string, number | string> {
    return { columns: "full", min_columns: 6 };
  }

  static getConfigForm(): ReturnType<typeof getConfigForm> {
    return getConfigForm();
  }

  static getStubConfig(): Record<string, unknown> {
    return { latitude: 32.391, longitude: -96.7, view: "metro" };
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.arm();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.disarm();
  }

  private arm(): void {
    this.disarm();
    if (!this.config || !this.isConnected) {
      return;
    }
    this.tickTimer = setInterval(() => {
      this.now = Date.now();
    }, MINUTE_MS);
    if (needsForecast(this.config)) {
      const key = JSON.stringify([
        this.config.latitude,
        this.config.longitude,
        this.config.model,
        this.config.temperature_unit,
        this.config.wind_speed_unit,
        this.config.precipitation_unit,
        this.config.hourly_count,
        this.config.show_daily ? this.config.daily_count : 0,
        this.config.hosts,
      ]);
      if (key !== this.forecastKey) {
        this.forecastKey = key;
        this.forecast = undefined;
        this.fetchedAt = undefined;
        this.lastError = undefined;
      }
      void this.refresh();
      this.pollTimer = setInterval(() => void this.refresh(), this.config.refresh_minutes * MINUTE_MS);
    }
    if (this.config.show_map && this.config.map_reload_minutes > 0) {
      this.mapTimer = setInterval(() => {
        this.mapGeneration += 1;
      }, this.config.map_reload_minutes * MINUTE_MS);
    }
  }

  private disarm(): void {
    for (const t of [this.pollTimer, this.tickTimer, this.mapTimer]) {
      if (t !== undefined) {
        clearInterval(t);
      }
    }
    this.pollTimer = this.tickTimer = this.mapTimer = undefined;
  }

  private async refresh(): Promise<void> {
    if (!this.config || this.loading) {
      return;
    }
    this.loading = true;
    const key = this.forecastKey;
    try {
      const forecast = await fetchForecast(this.config);
      if (key !== this.forecastKey) {
        return;
      }
      this.forecast = forecast;
      this.fetchedAt = Date.now();
      this.lastError = undefined;
    } catch (err) {
      if (key !== this.forecastKey) {
        return;
      }
      this.lastError =
        err instanceof ForecastFetchError ? err.attempts.join("; ") : (err as Error).message;
    } finally {
      this.loading = false;
      this.now = Date.now();
    }
  }

  private locale(): string | undefined {
    return this._hass?.locale?.language ?? this._hass?.language;
  }

  override render(): TemplateResult {
    const c = this.config;
    if (!c) {
      return html`<div class="card"><div class="problems">No configuration</div></div>`;
    }
    return html`
      <div class="card">
        ${this.renderHeader(c)}
        ${c.show_map ? this.renderMap(c) : nothing}
        ${c.show_hourly ? this.renderHourly(c) : nothing}
        ${c.show_daily ? this.renderDaily(c) : nothing}
        ${this.renderFooter(c)}
      </div>
    `;
  }

  private renderHeader(c: WeatherWiseConfig): TemplateResult {
    const title = c.title ?? (c.view === "state" ? "State radar" : "Metro radar");
    return html`
      <div class="header">
        <div class="title">${title}</div>
        ${c.show_conditions ? this.renderHeadline(c) : nothing}
      </div>
    `;
  }

  private renderHeadline(c: WeatherWiseConfig): TemplateResult {
    const f = this.forecast;
    if (!f) {
      return html`<div class="meta">
        ${this.lastError
          ? html`<span class="badge error">unavailable</span><span>${this.lastError}</span>`
          : html`<span>Loading forecast</span>`}
      </div>`;
    }
    const nowSeconds = Math.floor(this.now / 1000);
    const window = selectWindow(f, nowSeconds, c.hourly_count);
    const point = window.current;
    if (!point) {
      return html`<div class="meta"><span class="badge stale">expired</span><span>Forecast window has passed; waiting for refresh</span></div>`;
    }
    const cond = conditionFor(point.weatherCode, point.isDay);
    const locale = this.locale();
    const rainToday = maxRainChance([point, ...window.upcoming]);
    return html`
      <div class="headline">
        <span class="icon" title=${cond.label}>${conditionIcon(cond.key, 44)}</span>
        <span class="temp">${round(point.temperature)}${f.units.temperature}</span>
        <div class="details">
          <span>${cond.label}</span>
          <span>Feels <b>${round(point.apparentTemperature)}${f.units.temperature}</b></span>
          <span>Rain <b>${round(point.precipitationProbability)}%</b>${rainToday !== null && rainToday !== point.precipitationProbability ? html` (max ${round(rainToday)}%)` : nothing}</span>
          <span>Wind <b>${round(point.windSpeed)} ${f.units.windSpeed}</b> ${compass(point.windBearing)}</span>
          <span>Humidity <b>${round(point.humidity)}%</b></span>
          <span>Valid <b>${formatHour(point.time, f.timezone, locale)}</b></span>
        </div>
      </div>
      ${this.renderStatus(c)}
    `;
  }

  private renderStatus(c: WeatherWiseConfig): TemplateResult {
    const parts: TemplateResult[] = [];
    if (this.fetchedAt !== undefined) {
      const age = this.now - this.fetchedAt;
      const stale = age > c.refresh_minutes * MINUTE_MS * STALE_INTERVALS;
      if (stale) {
        parts.push(html`<span class="badge stale">stale</span>`);
      }
      parts.push(html`<span>fetched ${formatAge(age)}</span>`);
    }
    if (this.lastError) {
      parts.push(html`<span class="badge error">refresh failed</span><span>${this.lastError}</span>`);
    }
    return html`<div class="meta">${parts}</div>`;
  }

  private renderMap(c: WeatherWiseConfig): TemplateResult {
    const url = mapUrl(c);
    return html`
      <div class="map ${c.map_interactive ? "" : "locked"}" style="height:${c.map_height}px">
        ${keyed(
          this.mapGeneration,
          html`<iframe
            src=${url}
            title="WeatherWise map"
            referrerpolicy="no-referrer"
            allow=""
            loading="eager"
          ></iframe>`,
        )}
      </div>
    `;
  }

  private renderHourly(c: WeatherWiseConfig): TemplateResult | typeof nothing {
    const f = this.forecast;
    if (!f) {
      return nothing;
    }
    const window = selectWindow(f, Math.floor(this.now / 1000), c.hourly_count);
    if (window.upcoming.length === 0) {
      return nothing;
    }
    const locale = this.locale();
    return html`<div class="strip">
      ${window.upcoming.map((p) => {
        const cond = conditionFor(p.weatherCode, p.isDay);
        return html`<div class="tile">
          <span class="when">${formatHour(p.time, f.timezone, locale)}</span>
          <span class="icon" title=${cond.label}>${conditionIcon(cond.key, 26)}</span>
          <span>${round(p.temperature)}${f.units.temperature}</span>
          <span class="rain">${round(p.precipitationProbability)}%</span>
        </div>`;
      })}
    </div>`;
  }

  private renderDaily(c: WeatherWiseConfig): TemplateResult | typeof nothing {
    const f = this.forecast;
    if (!f || f.daily.length === 0) {
      return nothing;
    }
    const locale = this.locale();
    return html`<div class="strip">
      ${f.daily.slice(0, c.daily_count).map((d) => {
        const cond = conditionFor(d.weatherCode, true);
        return html`<div class="tile">
          <span class="when">${formatWeekday(d.time, f.timezone, locale)}</span>
          <span class="icon" title=${cond.label}>${conditionIcon(cond.key, 26)}</span>
          <span>${round(d.temperatureMax)}${f.units.temperature} <span class="lo">${round(d.temperatureMin)}${f.units.temperature}</span></span>
          <span class="rain">${round(d.precipitationProbabilityMax)}%</span>
        </div>`;
      })}
    </div>`;
  }

  private renderFooter(c: WeatherWiseConfig): TemplateResult {
    const f = this.forecast;
    const today = f?.daily[0];
    const locale = this.locale();
    return html`<div class="footer">
      <span>
        <a href=${mapUrl(c)} target="_blank" rel="noopener noreferrer">WeatherWise</a>
        ${f ? html` · ${f.model === "gfs_seamless" ? "GFS" : "ECMWF"} model, grid ${round(f.gridLatitude, 2)}, ${round(f.gridLongitude, 2)}` : nothing}
      </span>
      ${today && today.sunrise !== null && today.sunset !== null && f
        ? html`<span>Sunrise ${formatTime(today.sunrise, f.timezone, locale)} · Sunset ${formatTime(today.sunset, f.timezone, locale)}</span>`
        : nothing}
    </div>`;
  }
}

customElements.define("weatherwise-card", WeatherWiseCard);

window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "weatherwise-card",
  name: "WeatherWise Card",
  description:
    "Embedded WeatherWise radar map at metro or state zoom with a modeled-conditions headline and hourly strip. Built for kiosk displays.",
  documentationURL: "https://github.com/trooperthorn/ha_card_weatherwise",
});

const cardVersion = typeof __CARD_VERSION__ !== "undefined" ? __CARD_VERSION__ : "dev";

console.info(
  `%c WEATHERWISE-CARD %c v${cardVersion} `,
  "background: #444; color: #fff; border-radius: 3px 0 0 3px; padding: 2px 0;",
  "background: #38bdf8; color: #111; border-radius: 0 3px 3px 0; padding: 2px 0;",
);

export { WeatherWiseCard };
