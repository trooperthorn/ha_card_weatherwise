# Decisions

## 2026-09-30: forecast is fetched from the browser, not a backend

The handoff recommended a backend integration with a shared coordinator.
The card fetches directly because the data host allows any origin
(`Access-Control-Allow-Origin: *`), no credential exists to protect, and a
card-only repository installs in one HACS step. The trade-off, one request
per browser per interval, is acceptable for a kiosk with one tab. Rejected
for now: a companion integration exposing a `weather` entity, kept in
`backlog.md` for when the native weather card is wanted.

## 2026-09-30: the map is the WeatherWise web app in an iframe

Rejected: a native radar rendering from `/radar/processed/...` frames. That
requires tracing station selection, a custom binary frame format, color
tables, projection, and playback, none of which is documented, and the
result would be a worse radar than the app already draws. The iframe shows
exactly what the WeatherWise app shows. Verified the same day that the page
sends no frame-denying headers and the bundle has no frame-busting code.

## 2026-09-30: `map_interactive` defaults to false

During harness testing a wheel event over the iframe zoomed the map out
several levels and it stayed there. On a display board a stray touch does
the same. Blocking pointer events by default makes the configured framing
the steady state; people who want to pan set the option to true.

## 2026-09-30: one attempt per host per refresh

The WeatherWise app's data client retries across its two hosts with a 30
second timeout. Copying that from every kiosk would multiply requests to a
provider with no published terms. The card tries each host once, keeps the
last good forecast on failure, and reports the reason. Retrying is what the
next scheduled poll is for.

## 2026-09-30: no Home Assistant built-in components

The frontend team's 2026.4 through 2026.8 release notes state that custom
card authors are not supported in using the built-in components and list
removals in each release (`ha-textfield`, `ha-fab`, `ha-radio`, size
tokens). The card renders plain elements and its own inline SVG icons.
Rejected: `ha-icon` with MDI names, which would have given richer icons at
the cost of a per-release liability.
