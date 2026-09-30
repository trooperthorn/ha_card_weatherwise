# WeatherWise Card

A custom dashboard card for Home Assistant, built for a kiosk display board.
It embeds the WeatherWise radar map at a configurable zoom and adds a
modeled-conditions headline, an hourly strip, and an optional daily strip
from the WeatherWise forecast API. Put two cards on the board: one zoomed
into the metro area, one pulled back to the whole state.

```yaml
type: custom:weatherwise-card
title: Metro radar
view: metro
latitude: 32.391
longitude: -96.7
```

```yaml
type: custom:weatherwise-card
title: State radar
view: state
latitude: 32.391
longitude: -96.7
show_conditions: false
show_hourly: false
show_daily: true
```

## What the card shows

| Section | Source | Default |
| --- | --- | --- |
| Headline: condition icon, temperature, feels-like, rain chance now and the maximum for the shown hours, wind speed and direction, humidity, the hour the values are valid for | The hourly forecast point valid now | on |
| Map | `https://web.weatherwise.app/#map=<zoom>/<lat>/<lon>&m=RADAR&ui=0&autoplay=1` in an iframe | on, 480 px tall, not interactive, app chrome hidden, playing |
| Hourly strip: hour, icon, temperature, rain chance | Following hourly points | on, 12 hours |
| Daily strip: weekday, icon, high and low, maximum rain chance | Daily forecast | off, 5 days |
| Footer: link to WeatherWise, model and grid point, sunrise and sunset | Response metadata and daily block | on |

Every number is a model forecast, not a station observation. The card
labels the hour it is valid for and how long ago it was fetched, marks the
data stale after two missed refreshes, and shows "unavailable" rather than
zeros when no forecast has been received.

## The two views

`view: metro` centers tightly on the point at zoom 9. `view: state` pulls
back to zoom 5.79, the zoom from the WeatherWise URL this card was built
from. `zoom` overrides either preset. The map is centered on `latitude` and
`longitude`, which are also the forecast point.

By default the embedded map ignores touch, mouse, and wheel input, because
on a display board a stray touch or scroll pans or zooms the map away and
it stays there until the next reload. Set `map_interactive: true` for a
dashboard people use by hand, and consider `map_reload_minutes` to bring a
touched map back to its configured framing on a schedule.

## Installation

The built card is delivered two ways, and HACS accepts either: as an
asset named `weatherwise-card.js` on each GitHub Release, and as a
committed `dist/weatherwise-card.js` in the repository tree. CI fails if
the committed file ever drifts from a fresh build of the source.

**HACS (custom repository):**

[![Open in HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=trooperthorn&repository=ha_card_weatherwise&category=plugin)

1. HACS, three-dot menu, Custom repositories.
2. Repository `https://github.com/trooperthorn/ha_card_weatherwise`, type
   Dashboard.
3. Install WeatherWise Card. HACS registers the resource automatically at
   `/hacsfiles/ha_card_weatherwise/weatherwise-card.js`.

**Manual:** download `weatherwise-card.js` from the latest release into
`config/www/`, then add `/local/weatherwise-card.js` as a dashboard
resource of type JavaScript module.

## Configuration

The visual editor covers every option. Invalid configuration makes
`setConfig` throw, as the Home Assistant custom card contract documents,
and the message lists every problem at once.

| Option | Default | Description |
| --- | --- | --- |
| `latitude`, `longitude` | required | Map center and forecast point |
| `title` | "Metro radar" or "State radar" | Card header |
| `view` | `metro` | `metro` (zoom 9) or `state` (zoom 5.79) |
| `zoom` | from `view` | 1 to 18, overrides the preset |
| `map_mode` | `RADAR` | The `m=` token in the WeatherWise URL; only RADAR is verified |
| `show_map` | `true` | Render the embedded map |
| `map_height` | `480` | Map height in pixels, 120 to 4000 |
| `map_interactive` | `false` | Allow touch, mouse, and wheel input on the map |
| `map_ui` | `false` | Show the WeatherWise app controls; off also suppresses its App Updates announcement |
| `map_autoplay` | `true` | Start radar playback when the map loads |
| `map_reload_minutes` | `0` | Recreate the iframe on this interval; 0 never |
| `show_conditions` | `true` | Headline from the hour valid now |
| `show_hourly` | `true` | Hourly strip |
| `hourly_count` | `12` | Hours after the current one, 1 to 48 |
| `show_daily` | `false` | Daily strip |
| `daily_count` | `5` | Days, 1 to 16; coverage beyond 5 is unverified |
| `model` | `ecmwf_ifs025` | or `gfs_seamless` |
| `temperature_unit` | `fahrenheit` | or `celsius` |
| `wind_speed_unit` | `mph` | `mph`, `kmh`, `ms`, or `kn` |
| `precipitation_unit` | `inch` | or `mm` |
| `refresh_minutes` | `30` | Forecast poll interval, minimum 10 |
| `hosts` | data2 then data1 | Ordered list of https origins to try, one attempt each |

`examples/` holds the two kiosk cards and a complete two-view dashboard.
`docs/operations.md` explains what each option changes and how to read the
stale and unavailable states.

## How it fetches data

The browser showing the dashboard calls the WeatherWise data host directly;
there is no server-side component and no credential. The host answers with
`Access-Control-Allow-Origin: *`, which was verified on 2026-09-30. Each
refresh makes one attempt per configured host with a 30 second timeout and
a short backoff between hosts, then keeps the last good forecast and shows
the failure. The card never reproduces the WeatherWise app's own retry loop.
Details and the request shape are in `docs/api.md`; the design rationale is
in `docs/design.md`.

## Development

```
npm ci
npm run dev        # harness at http://localhost:5173 against the live services
npm test           # vitest over config, forecast parsing, fetch failover, display
npm run lint
npm run typecheck
npm run build      # dist/weatherwise-card.js, one self-contained file
```

The harness mounts the two kiosk cards plus scenarios for Celsius and GFS,
forecast-only, an unreachable host, and a broken configuration.

## Versioning and releases

Versions are CalVer `YYYY.MM.DD.N` with a `v` prefix on tags. The root
`VERSION` file is the single source of truth: the build stamps it into the
console banner, `.release.json` names it as the shipped version field, and
the Release workflow refuses to publish when a fresh build of
`dist/weatherwise-card.js` differs from the committed one. `package.json`
stays at an inert `0.0.0` because npm requires SemVer there.

A merge to `main` is the only release path. `Release` runs on every push to
`main`: it validates `VERSION`, rebuilds the card and checks the committed
dist matches, creates the tag, drafts the release with
`dist/weatherwise-card.js` attached, and publishes it; a version that is
already published is left alone. `Prepare release` runs after every
successful `Release` and, when release-bearing files changed since the last
tag, writes the next version into `VERSION`, rebuilds `dist`, and opens an
auto-merging PR through the release GitHub App (variable
`RELEASE_AUTOMATION_CLIENT_ID`, secret `RELEASE_AUTOMATION_PRIVATE_KEY`).
Without those credentials, bump `VERSION` with
`python scripts/set_version.py --next-from-tags`, run `npm run build`,
commit both, and open a PR; the merge publishes.

## Verified and unverified

Verified on 2026-09-30, in the dev harness and unit tests:

- The ECMWF forecast request with `timeformat=unixtime`, Fahrenheit, mph,
  and the daily block returns 24 hourly and 5 daily points with labeled
  units; the fixture is `tests/fixtures/forecast-ecmwf-24h-5d.json`.
- The `/api/om/v1/gfs` route with `models=gfs_seamless` answers; `celsius`,
  `kmh`, `ms`, `kn`, and `precipitation_unit=inch` return the matching
  unit labels; `data1.weatherwise.app` answers the same request.
- `web.weatherwise.app` sends no `X-Frame-Options` or
  `Content-Security-Policy` header and its bundle contains no frame-busting
  code; the map renders inside the card's iframe in Chromium with the
  hash-supplied center and zoom.
- Wheel and touch input over the iframe pans and zooms the embedded map,
  which is why `map_interactive` defaults to `false`.
- Interval selection, null handling, array-length validation, host
  failover, timeout handling, and the WMO condition mapping.

Not verified yet:

- Rendering inside a live Home Assistant dashboard and the visual editor
  form; the harness stands in for the frontend.
- Map modes other than `RADAR`, and forecast coverage beyond 5 days or 48
  hours on these models.
- WeatherWise's terms for embedding and polling; the site credits
  Open-Meteo and exposes Open-Meteo style routes, but no public API
  contract was found. Keep `refresh_minutes` conservative.
- That `ui=0` suppresses the App Updates announcement on every profile. The
  first live install showed the announcement with the app UI on; the bundle
  only opens that dialog when its `ui` flag is 1, and `ui=0` was confirmed
  to hide the controls, but the dialog itself was not reproduced in the
  harness browser.

`docs/README.md` indexes the design, API, operations, decisions, and
backlog documents.

## License

MIT, see `LICENSE`.
