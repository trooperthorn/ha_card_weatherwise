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
| other `m=` values | | unverified |
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

Unverified: coverage beyond 24 hours or 5 days on these models, rate limits,
`current=` parameters (not used), any endpoint not listed here. The handoff
document lists many more routes (warnings, radar frames, METARs); none are
used by this card.

## Account and vendor boundaries

The app server `https://api.weatherwise.app` has login, user, location, and
billing routes that use Bearer tokens. The card never calls them. The
bundle embeds Mapbox and other vendor tokens; the card copies none of them
and loads the map only through the public page URL.
