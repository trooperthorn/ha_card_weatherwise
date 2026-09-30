# Backlog

- 2026-09-30: Verify the card and the visual editor inside a live Home
  Assistant dashboard (sections view sizing, theme variables, the
  `getConfigForm` layout with `flatten` sections). The dev harness stands in
  for the frontend until then.
- 2026-09-30: Confirm the embedded app shows no onboarding or update
  overlay on a fresh kiosk browser profile. The bundle suppresses onboarding
  when the hash has more than one parameter; that was read, not observed.
- 2026-09-30: Decide whether a companion integration exposing a `weather`
  entity is wanted so the native weather forecast card can be used; the
  mapping contract is in the handoff document that started this repository.
- 2026-09-30: Check WeatherWise terms for embedding and polling before
  publishing the repository to the HACS default store.
- 2026-09-30: Test forecast coverage beyond 48 hours and 5 days on
  `ecmwf_ifs025` and `gfs_seamless` before raising the option caps or
  documenting them as supported.
- 2026-09-30: Local alerts (point-in-polygon against `/warnings/USA.geojson`
  geometry) were scoped out of the first release; revisit if the board
  needs a warning banner.
