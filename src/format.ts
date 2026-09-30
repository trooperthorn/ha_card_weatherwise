/**
 * Display formatting. Times are rendered in the forecast point's own
 * timezone (returned by the API), never the browser's, so a kiosk in
 * another zone still labels the hours correctly.
 */

export function formatHour(epochSeconds: number, timeZone: string, locale?: string): string {
  try {
    return new Intl.DateTimeFormat(locale, { hour: "numeric", timeZone }).format(
      new Date(epochSeconds * 1000),
    );
  } catch {
    return new Date(epochSeconds * 1000).toISOString().slice(11, 16);
  }
}

export function formatTime(epochSeconds: number, timeZone: string, locale?: string): string {
  try {
    return new Intl.DateTimeFormat(locale, {
      hour: "numeric",
      minute: "2-digit",
      timeZone,
    }).format(new Date(epochSeconds * 1000));
  } catch {
    return new Date(epochSeconds * 1000).toISOString().slice(11, 16);
  }
}

export function formatWeekday(epochSeconds: number, timeZone: string, locale?: string): string {
  try {
    return new Intl.DateTimeFormat(locale, { weekday: "short", timeZone }).format(
      new Date(epochSeconds * 1000),
    );
  } catch {
    return new Date(epochSeconds * 1000).toISOString().slice(0, 10);
  }
}

/** Weekday plus clock time, for alert start and end times. */
export function formatWhen(epochSeconds: number, timeZone: string | undefined, locale?: string): string {
  try {
    return new Intl.DateTimeFormat(locale, {
      weekday: "short",
      hour: "numeric",
      minute: "2-digit",
      timeZone,
    }).format(new Date(epochSeconds * 1000));
  } catch {
    return new Date(epochSeconds * 1000).toISOString().slice(0, 16).replace("T", " ");
  }
}

export function formatAge(ms: number): string {
  const minutes = Math.round(ms / 60_000);
  if (minutes < 1) {
    return "just now";
  }
  if (minutes < 60) {
    return `${minutes} min ago`;
  }
  const hours = Math.floor(minutes / 60);
  return `${hours} h ${minutes % 60} min ago`;
}

export function round(value: number | null, digits = 0): string {
  if (value === null || !Number.isFinite(value)) {
    return "--";
  }
  return value.toFixed(digits);
}
