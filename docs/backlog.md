# Backlog

- 2026-09-30: Verify the card and the visual editor inside a live Home
  Assistant dashboard (sections view sizing, theme variables, the
  `getConfigForm` layout with `flatten` sections, the alert banners and the
  report tables). The dev harness stands in for the frontend until then.
- 2026-09-30: Test forecast coverage beyond 48 hours and 5 days on
  `ecmwf_ifs025` and `gfs_seamless` before raising the option caps or
  documenting them as supported. Sean will test once the report layout is
  installed.
- 2026-09-30: The companion integration `ha_int_weatherwise` (a `weather`
  entity plus alert entities from the same endpoints) was started as a
  separate repository; the alert facts it needs are in `api.md`.

Closed 2026-09-30: `ui=0` confirmed on the kiosk to keep the App Updates
announcement away; local alerts shipped; the HACS default store submission
and its terms check were dropped by decision (see `decisions.md`).
