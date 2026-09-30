# WeatherWise endpoints used by the card

Everything below was checked on 2026-09-30 with plain unauthenticated HTTP
from a workstation and, where stated, in the dev harness in Chromium. No API
key, cookie, or token was sent. WeatherWise publishes no API contract that
was found; it credits Open-Meteo and the forecast routes accept Open-Meteo
style parameters. Treat availability, limits, and terms as unverified.

## Map

| Item | Value | Status |
| --- | --- | --- |
| URL | `https://web.weatherwise.app/#map=<zoom>/<lat>/<lon>&m=<MODE>` | verified: renders in an iframe at the requested camera |
| Response headers | no `X-Frame-Options`, no `Content-Security-Policy` | verified with `curl -I` |
| Frame busting | none found in `/assets/v1/index-BUPEwI1g.js` (`top.location`, `self !== top`, `frameElement`) | verified by grep of the 4.7 MB bundle |
| Hash handling | Mapbox `hash: "map"`; `url_hash` in localStorage restored only when no hash is present | read from the bundle |
| `m=RADAR` | radar mode | verified |
| other `m=` values | `SATELLITE`, `MODEL`, `OUTLOOKS`, `COMPOSITE` and more appear in the bundle's mode list | unverified |
| `ui=0` | hides the app's mode selector, side buttons, and drawer; a WeatherWise watermark remains | verified in the harness |
| `ui` flag and the App Updates dialog | the bundle calls `showModal()` only when `ui === 1` | read from the bundle; the dialog appeared on a live install with the UI shown |
| `autoplay=1` | starts radar (or satellite) playback after the layer loads | read from the bundle, playback observed in the harness |
| `ui_drawer=1`, `watermark=0`, `rs=1` | open the drawer, hide the watermark, fit bounds | present in the bundle, not used by the card |
| Onboarding overlay | suppressed when the hash has more than one parameter and shown otherwise on a fresh profile | read from the bundle, not observed |

## Forecast

Base hosts: `https://data2.weatherwise.app` (default first), `https://data1.weatherwise.app` (verified to answer the same request).

Route `/api/om/v1/forecast` with `models=ecmwf_ifs025`, or `/api/om/v1/gfs` with `models=gfs_seamless`.

Request the card sends (line-wrapped):

```text
GET /api/om/v1/forecast
  ?models=ecmwf_ifs025
  &latitude=32.391&longitude=-96.7
  &hourly=temperature_2m,apparent_temperature,relative_humidity_2m,
          precipitation_probability,precipitation,wind_speed_10m,
          wind_direction_10m,weather_code,is_day
  &daily=temperature_2m_max,temperature_2m_min,weather_code,
         precipitation_probability_max,sunrise,sunset
  &timezone=auto&timeformat=unixtime
  &forecast_hours=<hourly_count+2, max 48>&forecast_days=<daily_count or 1>
  &temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch
```

| Check | Result |
| --- | --- |
| HTTP status | 200, `application/json` |
| CORS | `Access-Control-Allow-Origin: *`, `Access-Control-Allow-Methods: GET, POST, OPTIONS`, `Access-Control-Max-Age: 600` |
| `forecast_hours=24&forecast_days=5` | 24 hourly and 5 daily points, all columns equal length |
| `hourly_units` | `time: unixtime`, `temperature_2m: °F`, `wind_speed_10m: mp/h`, `precipitation: mm` (before `precipitation_unit`), `weather_code: wmo code`, `is_day: ""` |
| `daily_units` | `sunrise: unixtime`, `sunset: unixtime` |
| `wind_speed_unit=kmh`, `ms`, `kn` | labels `km/h`, `m/s`, `kn` |
| `temperature_unit=celsius` | label `°C` |
| `precipitation_unit=inch` | label `inch` |
| `/api/om/v1/gfs&models=gfs_seamless` | 200 with hourly data |
| Returned `latitude`, `longitude` | the model grid point (32.5, -96.75 for ECMWF), not the request |
| `utc_offset_seconds`, `timezone` | -18000, `America/Chicago` for this point |

Recorded fixture: `tests/fixtures/forecast-ecmwf-24h-5d.json` (values are
historical evidence, not current weather).

Coverage, checked 2026-09-30 with the card's request shape on both routes:

| Request | ECMWF `ecmwf_ifs025` | GFS `gfs_seamless` |
| --- | --- | --- |
| 96 hours, 7 days | complete | complete |
| 168 hours, 10 days | complete | complete |
| 240 hours, 16 days | hourly complete; daily max temperature null on 1 day and rain chance null on 2 of the last days | hourly complete; daily rain chance null on the last 5 days |
| 384 hours, 16 days | temperature null on 31 hours and rain chance on 55 hours at the tail | temperature null on 9 hours and rain chance on 123 hours at the tail |

The card caps `forecast_hours` at 48 and `daily_count` at 16; a null in
the tail renders as `--`, never as zero.

Unverified: rate limits, `current=` parameters (not used), any endpoint not
listed here. The handoff
document lists many more routes (radar frames, METARs, outlooks); only the
warnings routes below are used besides the forecast.

## Warnings

Checked 2026-09-30 with curl from a workstation and from Python, no
credential.

| Item | Value | Status |
| --- | --- | --- |
| Feed | `GET https://data2.weatherwise.app/warnings/USA.geojson` (also answered by `data1`) | verified: 200, `application/geo+json`, 665 KB, 241 features that day |
| CORS | `Access-Control-Allow-Origin: *`, `Access-Control-Allow-Methods: *`, `Access-Control-Allow-Headers: *` | verified, including with an `Origin: http://homeassistant.local:8123` request header |
| Cache | `cf-cache-status: DYNAMIC`, `Etag`, `Last-Modified`; the app appends `?_=<epoch ms>` | the card sends `cache: no-store` and no cache-buster |
| Feature shape | `properties`: `id`, `title`, `common_id`, `action` (NEW, CON, EXT, EXA, EXB), `office`, `product`, `significance`, `event_number`, `issued_at`/`starts_at`/`expires_at` plus `_ms` variants, `generated_at`, `text`, `emergency`, `tags` {WHAT, WHERE, WHEN, IMPACTS}, `previous_id`, `country_iso`, `ugcs`, `states` [{name, code}], `center` [lon, lat], `area`, `bbox` [west, south, east, north], `metadata.upstream`, `population`, `geometry: {type: "REMOTE"}` | verified on every feature that day |
| `significance` values seen | W (warning), A (watch), Y (advisory), S (statement), O (outlook), F (forecast) | verified; the VTEC meanings are the NWS ones |
| Inline `geometry` | present on 61 of 241 features, all storm-based or river products (Flood Warning, Flash Flood Warning, Severe Thunderstorm Warning, Flood Advisory, some Flood Watches, Marine and Special Weather Statements); `null` on zone products | verified |
| Per-warning geometry | `GET /warnings/archive/<id>-geometry.geojson`, a Feature with Polygon or MultiPolygon geometry and `properties` {generated_at, states} | verified on data2 and data1 with CORS `*` |
| `GET /warnings/USA-<id>.geojson` and `-opt` | 404 | the route named in the handoff did not answer for any id tried |
| `GET /warnings/archive/<id>.geojson` | the full feature without geometry | verified, not used |
| User agent | `Python-urllib/3.14` gets 403 on every route; curl, `python-requests`, `Python/3.14 aiohttp/3.13`, and `HomeAssistant/2026.9.4 aiohttp/3.13 Python/3.14` get 200 | verified; browsers are unaffected |
| Other countries | the path token is passed through from `alert_country` | unverified beyond USA |

Recorded fixtures: `tests/fixtures/warnings-usa-sample.json` (six features
from the feed with `text` truncated) and
`tests/fixtures/warnings-geometry-flood-watch.json` (the fetched polygon of
a Flood Watch that contained the example point that day).

## Account and vendor boundaries

The app server `https://api.weatherwise.app` has login, user, location, and
billing routes that use Bearer tokens. The card never calls them. The
bundle embeds Mapbox and other vendor tokens; the card copies none of them
and loads the map only through the public page URL.
