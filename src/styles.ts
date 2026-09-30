/**
 * Design tokens. Values defer to Home Assistant theme variables where they
 * exist, with dark fallbacks suited to a wall display.
 */

import { css } from "lit";

export const tokens = css`
  :host {
    --wwc-bg: var(--ha-card-background, var(--card-background-color, #14161c));
    --wwc-text: var(--primary-text-color, #e9e9ee);
    --wwc-text-dim: var(--secondary-text-color, #9a9aa3);
    --wwc-tile: rgba(127, 127, 127, 0.14);
    --wwc-divider: var(--divider-color, rgba(127, 127, 127, 0.3));
    --wwc-accent: var(--primary-color, #38bdf8);
    --wwc-warn: var(--warning-color, #f59e0b);
    --wwc-error: var(--error-color, #ef4444);
    --wwc-radius: var(--ha-card-border-radius, 12px);
  }
`;
