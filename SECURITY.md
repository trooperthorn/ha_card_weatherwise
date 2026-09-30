# Security Policy

## Reporting a vulnerability

Do not open a public issue containing exploit details or private network
information. Use GitHub's private vulnerability-reporting feature for this
repository. If private reporting is unavailable, open a minimal issue asking
the maintainer to establish a private channel; omit technical details.

Include the affected version/commit, prerequisites, impact, a minimal
reproduction, and suggested remediation. Remove coordinates, hostnames, and
any other private installation details from reports and logs.

## Response targets

These are project targets, not an SLA: acknowledge critical/high reports in
three business days, establish severity and containment in seven, and publish
a coordinated fix as soon as safely validated. Lower-severity issues are
prioritized by exploitability and impact.

## Supported version

Only the latest published release and the default branch receive security
fixes.

## Security boundaries

WeatherWise Card is a dashboard card: static frontend code that runs in the
browser of whoever is viewing the dashboard. It has no server-side component,
reads no Home Assistant secrets, makes no service calls, and cannot escalate
the permissions of the viewing user.

It does two things that cross the Home Assistant origin, both visible to the
viewer and both configurable:

- It embeds `https://web.weatherwise.app` in an iframe. The iframe is
  loaded with `referrerpolicy="no-referrer"` and an empty `allow` list, so
  the embedded page receives no referrer and no delegated permissions
  (geolocation, camera, and so on). The embedded page runs its own code
  under its own origin; this card cannot inspect or restrict it further.
- It fetches forecast JSON from the configured `hosts` (by default the two
  WeatherWise data hosts). Hosts must be bare https origins; the card sends
  no credentials, cookies, or identifying headers beyond what the browser
  adds. The requested coordinates are part of the URL and are therefore
  visible to those hosts.

The card sends nothing to Home Assistant and stores nothing in the browser.
