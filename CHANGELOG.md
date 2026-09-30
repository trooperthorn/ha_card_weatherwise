# Changelog

## 2026.09.30.3

- Local alerts. The card polls the WeatherWise warnings feed on its own
  interval and shows the warnings, watches, advisories, and statements that
  cover the point, matched by a configured UGC zone code or by
  point-in-polygon against the warning's complete geometry (inline or
  fetched from the archive geometry route, never by bounding box). New
  options `show_alerts` (default true), `alerts_refresh_minutes`,
  `alerts_max`, `alerts_include_outlooks`, `alert_zones`, `alert_country`.
  Unmatched-but-unresolvable warnings are named in the status line.
- Report layout. `layout: report` renders the hourly and daily forecast as
  tables with feels-like, rain amount, wind, humidity, sunrise, and sunset
  in place of the strips.
- The host failover fetch is shared by the forecast, feed, and geometry
  requests; `HostsFetchError` replaces `ForecastFetchError`.

## 2026.09.30.2

- The map URL now carries `ui=0` and `autoplay=1` by default. The first
  live install showed WeatherWise's App Updates announcement over the map
  with no way to dismiss it while input was locked; the app only opens that
  dialog when its UI flag is on. New options `map_ui` (default false) and
  `map_autoplay` (default true) control both.

## 2026.09.30.1

Initial implementation.

- Embedded WeatherWise map with `metro` (zoom 9) and `state` (zoom 5.79)
  presets, explicit `zoom` override, configurable height, optional periodic
  reload, and input locked by default for display boards.
- Modeled-conditions headline from the hourly point valid now: condition,
  temperature, feels-like, rain chance now and maximum, wind, humidity,
  valid hour, fetch age, stale and unavailable states.
- Hourly and daily strips with inline condition icons owned by the card.
- Forecast fetched in the browser from the WeatherWise data hosts with one
  attempt per host, a 30 second timeout, and short backoff; ECMWF or GFS
  model; Fahrenheit or Celsius; mph, km/h, m/s, or knots; inch or mm.
- Visual editor via `getConfigForm`, sections-view sizing via
  `getGridOptions`, and `setConfig` that throws with every collected
  problem.
- CalVer release pipeline on merge to `main`, committed `dist` checked
  against a fresh build, HACS validation, CodeQL, and npm audit.
