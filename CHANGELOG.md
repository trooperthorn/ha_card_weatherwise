# Changelog

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
