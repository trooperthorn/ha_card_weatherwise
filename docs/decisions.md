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

## 2026-09-30: the app UI is hidden by default (`ui=0`)

The first live install showed WeatherWise's App Updates announcement over
both maps, and with input locked it could not be dismissed. The bundle
reads a `ui` hash parameter and only opens that dialog when it is 1, so the
card sends `ui=0` unless `map_ui` is true. Rejected: leaving the UI on and
asking users to dismiss the dialog once, because the app re-shows it on
every release it ships, and a kiosk profile would need a hand each time.
`autoplay=1` was added at the same time so the radar loop plays on load.

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

## 2026-09-30: alerts match by polygon or zone code, never by bounding box

The handoff warned that inventory geometry may be insufficient and that a
nearby centroid must not be treated as a hit. Verified the same day: only
storm-based products carry inline polygons; the rest expose a complete
polygon at `/warnings/archive/<id>-geometry.geojson`. The card uses the
feed's bounding box only to avoid fetching polygons for the whole country,
then requires either a configured UGC code in the warning's `ugcs` or a
point-in-polygon hit on the complete geometry. Rejected: bounding box or
centroid distance matching (a Texas-wide Flood Watch box covers points the
watch does not), and requiring zone codes (they are optional because the
polygon route works without them; a person who knows their zones saves the
lookups).

## 2026-09-30: alerts are on by default, outlooks are off

Sean wanted alerts on the board this week. The feed is public with
wildcard CORS and the default point already sat inside an active Flood
Watch, so the feature defaults on with a 5 minute floor of 2. Hazardous
Weather Outlooks, Hydrologic Outlooks, and Short Term Forecasts are issued
routinely and would keep a banner on the board most days, so significance O
and F are hidden unless asked for.

## 2026-09-30: the report layout is a presentation of the same request

A table of hourly and daily values was wanted alongside the strips. The
report reads the fields the request already returns (feels-like, rain
amount, wind, humidity, sunrise, sunset) rather than adding parameters, so
switching layouts changes no traffic and the two layouts cannot disagree.
Rejected: a separate card element for the report, which would have
duplicated the fetch, timers, and status handling.

## 2026-09-30: not submitted to the HACS default store

Sean decided the card stays a custom repository. The HACS validation job
remains informational, and the terms check that was a precondition for a
store submission is dropped from the backlog.

## 2026-09-30: CodeQL ignores `dist/`

The first pull request was blocked by a high-severity CodeQL alert,
`js/bad-tag-filter`, at `dist/weatherwise-card.js` line 257. That line is
the Lit library's template parser (its HTML comment-end regular expression),
bundled into the committed build. The card's own source in `src/` contains
no HTML filtering. CodeQL now analyzes `src/`, `dev/`, and `tests/` and
ignores `dist/` and `node_modules/` through `.github/codeql/codeql-config.yml`;
alert 1 was dismissed as won't fix with a comment pointing here. Rejected:
patching the bundle or pinning an older Lit, which would trade a false
positive for a real maintenance burden. Dependency advisories for Lit are
still covered by `npm audit` in the same workflow.
