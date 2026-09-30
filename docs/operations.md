# Operations

## The two kiosk views

Two cards, same point, different framing. `examples/metro.yaml` and
`examples/state.yaml` are the individual cards; `examples/kiosk-dashboard.yaml`
is a complete two-view dashboard with a panel view per card so each fills
the screen.

| | Metro | State |
| --- | --- | --- |
| `view` | `metro` | `state` |
| zoom | 9 | 5.79 |
| headline and hourly strip | on | off (the state view is about the radar) |
| daily strip | off | on |

Adjust `zoom` when the presets do not frame your area: one zoom level
halves or doubles the width of the visible region. The values were chosen
for the Dallas area point in the examples; a coastal or mountain metro may
want 8 or 10.

## Options and their consequences

| Option | Consequence |
| --- | --- |
| `latitude`, `longitude` | Map center and forecast point. The API answers for the nearest model grid point, shown in the footer; for ECMWF 0.25 degree that can be 15 km away. |
| `map_height` | Fixed pixel height. In a panel view size it to the screen minus the strips; the `getCardSize` estimate follows it for masonry layouts. |
| `map_interactive` | `false` blocks all pointer input to the iframe. `true` lets viewers pan and zoom; nothing brings the map back except `map_reload_minutes` or a page reload. |
| `map_reload_minutes` | Recreates the iframe on the interval. Costs a full reload of the WeatherWise app (several MB) each time; 60 or more is a reasonable kiosk value. |
| `map_ui` | `false` adds `ui=0`, which hides the app's own controls and, per the bundle, its App Updates announcement. Set `true` only on a dashboard used by hand together with `map_interactive: true`. |
| `map_autoplay` | `true` adds `autoplay=1` so the radar loop plays on load. |
| `map_mode` | Passed through as `m=`. Only `RADAR` is verified. An unknown token is the app's problem, not the card's; expect a default view. |
| `refresh_minutes` | Forecast poll interval, minimum 10. The model runs update a few times a day; 30 is a sensible default and 60 is fine. |
| `hourly_count` | Hours after the current one. The request asks for two more than this so the current hour is always covered; 48 is the cap the widget code enforces. |
| `show_daily`, `daily_count` | The daily strip or table. Both models answer 16 days; the last day or two can carry null high or rain values, shown as `--`. Sunrise and sunset in the footer come from the daily block regardless. |
| `model` | `ecmwf_ifs025` (default) or `gfs_seamless`; the route changes with it. |
| `temperature_unit`, `wind_speed_unit`, `precipitation_unit` | Sent to the API; the labels shown come from the response, so they always match the numbers. |
| `hosts` | Ordered list of bare https origins, one attempt each per refresh. Put a mirror first if data2 misbehaves. Anything other than the WeatherWise hosts is your own choice; the request shape is Open-Meteo style. The same list serves the warnings feed and geometry routes. |
| `layout` | `strips` (tiles) or `report` (tables with feels-like, rain amount, wind, humidity, sunrise, sunset). Same data, same request. In a panel view the report needs about 24 px per row. |
| `show_alerts` | Polls the warnings feed and shows the warnings, watches, advisories, and statements that cover the point. Default on. |
| `alerts_refresh_minutes` | Alert poll interval, default 5, minimum 2. Each poll downloads the country feed (about 650 KB) plus one small geometry request per new candidate warning. |
| `alerts_max` | How many matched alerts render, most severe first; the status line still counts all of them. |
| `alerts_include_outlooks` | Also show Hazardous Weather Outlooks, Hydrologic Outlooks, and Short Term Forecasts. Off by default; they are routine. |
| `alert_zones` | NWS UGC codes for the point (`TXZ133` zone, `TXC139` county), as a list or one comma separated string. A listed code matches a warning without a polygon lookup. Find yours on the NWS zone maps; the card does not derive them. |
| `alert_country` | The token in the feed path, `USA` by default. Nothing else is verified. |

## Reading the status line

| Shown | Meaning | What to do |
| --- | --- | --- |
| `Loading forecast` | First fetch in progress | Wait up to 30 seconds per host |
| `unavailable` plus reasons | No forecast has ever arrived; each host's failure is listed (`HTTP 503`, `timeout`, `invalid JSON`) | Check network egress from the kiosk browser to the hosts; try the URL from `docs/api.md` in a browser on the same network |
| `fetched N min ago` | Age of the data on screen | Normal |
| `stale` | Data is older than two refresh intervals | A refresh has been failing; the reason follows |
| `refresh failed` plus reasons | Last poll failed, older data still shown | Same as unavailable |
| `expired` | Every cached hour has passed | Only possible after hours of failed refreshes; same as above |
| `--` in a value | The API returned null or a non-number for that field | Nothing; the card never substitutes zero |
| `no local alerts` | The warnings feed was fetched and nothing covers the point | Normal |
| `N local alerts` | Matched alerts; the first `alerts_max` are shown above the map | Normal |
| `alerts unavailable` plus reasons | The feed could not be fetched; earlier matches stay on screen | Same as unavailable; the feed URL is in `docs/api.md` |
| `unresolved` plus titles | A warning's box covers the point but its polygon could not be fetched, so it is not shown | Check the geometry route from the kiosk network; add `alert_zones` so zone products match without it |

## Kiosk notes

- The embedded app is a full web application with WebGL. A low-power kiosk
  may need hardware acceleration enabled in its browser for the map to
  render.
- With the defaults the embedded app shows no controls. If you set `map_ui:
  true`, its mode selector and buttons render inside the frame and, with
  `map_interactive: false`, cannot be pressed; any announcement it opens
  then stays on screen until a reload.
- Two cards means two copies of the app running. If the kiosk struggles,
  alternate two dashboard views (one card each) instead of stacking both.
- A browser refresh of the dashboard restarts the timers; a Home Assistant
  restart does not affect the card, which has no backend.
