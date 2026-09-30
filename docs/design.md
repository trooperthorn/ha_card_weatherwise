# Design

## Purpose

A wall-mounted kiosk shows two WeatherWise radar views side by side or on
alternating dashboard views: one zoomed into the metro area around a point,
one covering the state. The card wraps the WeatherWise web map so the
kiosk shows the same radar the WeatherWise app shows, and adds the numbers
a glance needs (temperature, feels-like, rain chance, wind) from the same
provider's forecast API so the two never disagree about the source.

## Structure

| Module | Responsibility |
| --- | --- |
| `src/weatherwise-card.ts` | The Lit element: card contract, timers, rendering |
| `src/config.ts` | Validation and defaults; collects every error |
| `src/map-url.ts` | Builds the `#map=zoom/lat/lon&m=MODE` URL |
| `src/forecast.ts` | Request URL, response normalization, interval selection |
| `src/api.ts` | Bounded fetch with per-host attempts and timeout |
| `src/conditions.ts` | WMO code to condition key and label; compass points |
| `src/icons.ts` | Inline SVG condition icons |
| `src/format.ts` | Timezone-aware time formatting, ages, rounding |
| `src/editor-form.ts` | `getConfigForm` schema for the visual editor |

The card owns every element it renders. It uses no Home Assistant built-in
component (`ha-icon`, `ha-card`, and so on) because the frontend team states
those are not supported for custom cards and changed them in every release
from 2026.4 to 2026.8. Theme variables are read with fallbacks so the card
still follows a dashboard theme.

## The map

The WeatherWise web app initializes its Mapbox map with the `hash: "map"`
option, so the URL fragment `#map=<zoom>/<lat>/<lon>` is the documented
Mapbox camera hash and `m=<MODE>` is the app's own map mode parameter. The
app also persists the last camera in `localStorage` under `url_hash`, but
its restore path only runs when the URL carries no hash, so the card's URL
always wins on load.

The iframe is recreated (Lit `keyed` on a generation counter) when the
configuration changes and, optionally, every `map_reload_minutes`. A hash
change on an existing iframe would not reload the document and might not
move the camera, and a periodic reload also recovers from a stuck embedded
page on a kiosk that runs for weeks.

Input to the iframe is blocked with `pointer-events: none` unless
`map_interactive` is true. During development a wheel event over the map
zoomed it out several levels and it stayed there; on a touch display board
the same happens with a brush of a hand.

The iframe carries `referrerpolicy="no-referrer"` and `allow=""` so the
embedded app receives neither the dashboard URL nor delegated permissions
such as geolocation. The app's own controls (mode selector, alert buttons)
render inside the frame and cannot be hidden from outside it.

## The forecast

### Fetched in the browser, by design

The handoff recommended a backend coordinator. This card fetches from the
browser instead because the data host answers with
`Access-Control-Allow-Origin: *` (verified 2026-09-30), no credential is
involved, and a card-only repository installs through HACS in one step with
no integration to configure. The cost is one request per browser tab per
refresh interval; on a kiosk that is one tab. The backend route remains the
right answer if a `weather` entity is ever wanted, and is listed in
`backlog.md`.

### One request, bounded

Each refresh builds one request covering the headline, hourly strip, and
daily strip (`forecast_hours` is the hourly count plus two so the current
hour and the requested following hours are always present, capped at 48;
`forecast_days` is the daily count when the daily strip is on, otherwise 1
for sunrise and sunset). The card tries each configured host once in order
with a 30 second timeout and a one second backoff step, then stops. It does
not retry within a poll. The WeatherWise app's generic client retries
across hosts aggressively; reproducing that from every kiosk would multiply
load on a provider whose terms are unverified.

### Interval selection

The current hour is the first point whose start plus one hour is later than
now, the same rule the WeatherWise hourly widget uses. It is recomputed
every minute from the cached forecast, so the headline advances at the top
of the hour without waiting for the next poll. If every cached point has
expired the card says "expired" rather than showing the last hour as
current.

### Staleness and gaps

- No forecast yet and the last fetch failed: "unavailable" with the
  per-host reasons.
- Forecast present and older than two refresh intervals: a "stale" badge
  plus the fetch age.
- A refresh failed after a good one: "refresh failed" with reasons, while
  the last good data stays on screen with its age.
- A missing or non-finite value is `null` and renders as `--`. A column
  whose length disagrees with `hourly.time` is discarded whole rather than
  misaligned.

Times are formatted in the timezone the API returns for the point, not the
browser's zone, so a kiosk configured in another zone labels the hours
correctly. Unit labels are taken from `hourly_units` in the response, with
the API's `mp/h` normalized to `mph`.

## WMO condition mapping

| Codes | Key | Notes |
| --- | --- | --- |
| 0 | clear-day or clear-night | by `is_day` |
| 1, 2 | partly-cloudy-day or -night | by `is_day` |
| 3 | cloudy | |
| 45, 48 | fog | |
| 51, 53, 55, 61, 63, 80, 81 | rain | |
| 65, 82 | pouring | |
| 56, 57, 66, 67 | sleet | freezing drizzle and rain |
| 71, 73, 75, 77, 85, 86 | snow | |
| 95 | thunderstorm | |
| 96, 99 | hail | thunderstorm with hail |
| anything else, or null | unknown | rendered as a question mark |

This is the standard grouping from the handoff; the WeatherWise app refines
its own icons from precipitation, cloud, and temperature fields and the card
does not claim visual parity with it.
