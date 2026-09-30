/**
 * Inline condition icons owned by the card, so no Home Assistant built-in
 * component is needed. Each is a 24x24 path set drawn with currentColor.
 */

import { svg, type TemplateResult } from "lit";
import type { ConditionKey } from "./types";

const sun = svg`<circle cx="12" cy="12" r="4" fill="currentColor"/><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="2" x2="12" y2="4.5"/><line x1="12" y1="19.5" x2="12" y2="22"/><line x1="2" y1="12" x2="4.5" y2="12"/><line x1="19.5" y1="12" x2="22" y2="12"/><line x1="4.9" y1="4.9" x2="6.7" y2="6.7"/><line x1="17.3" y1="17.3" x2="19.1" y2="19.1"/><line x1="4.9" y1="19.1" x2="6.7" y2="17.3"/><line x1="17.3" y1="6.7" x2="19.1" y2="4.9"/></g>`;
const moon = svg`<path fill="currentColor" d="M14.5 2.5a9.5 9.5 0 1 0 7 15.6A8 8 0 0 1 14.5 2.5z"/>`;
const cloud = svg`<path fill="currentColor" d="M6.5 19a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 17.6 9.1 4 4 0 0 1 17.5 19H6.5z"/>`;
const smallCloud = svg`<path fill="currentColor" d="M9 20a3.5 3.5 0 0 1-.5-6.96A5 5 0 0 1 18.2 12 3.2 3.2 0 0 1 18 20H9z"/>`;
const drops = (y: number) =>
  svg`<g stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="8" y1="${y}" x2="7" y2="${y + 3}"/><line x1="12" y1="${y}" x2="11" y2="${y + 3}"/><line x1="16" y1="${y}" x2="15" y2="${y + 3}"/></g>`;
const cloudHigh = svg`<path fill="currentColor" d="M6.5 15a4 4 0 0 1-.5-7.97A5.5 5.5 0 0 1 16.6 6 3.6 3.6 0 0 1 17.2 15H6.5z"/>`;

const ICONS: Record<ConditionKey, TemplateResult> = {
  "clear-day": sun,
  "clear-night": moon,
  "partly-cloudy-day": svg`<g transform="translate(-3 -3) scale(0.8)">${sun}</g>${smallCloud}`,
  "partly-cloudy-night": svg`<g transform="translate(-2 -3) scale(0.7)">${moon}</g>${smallCloud}`,
  cloudy: cloud,
  fog: svg`${cloudHigh}<g stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="5" y1="18" x2="19" y2="18"/><line x1="7" y1="21.5" x2="17" y2="21.5"/></g>`,
  rain: svg`${cloudHigh}${drops(18)}`,
  pouring: svg`${cloudHigh}${drops(17)}<g stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="10" y1="21" x2="9.5" y2="23"/><line x1="14" y1="21" x2="13.5" y2="23"/></g>`,
  sleet: svg`${cloudHigh}<g stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="8" y1="18" x2="7" y2="21"/><line x1="16" y1="18" x2="15" y2="21"/></g><circle cx="12" cy="20" r="1.5" fill="currentColor"/>`,
  snow: svg`${cloudHigh}<g fill="currentColor"><circle cx="8" cy="19" r="1.5"/><circle cx="12" cy="21.5" r="1.5"/><circle cx="16" cy="19" r="1.5"/></g>`,
  thunderstorm: svg`${cloudHigh}<path fill="currentColor" d="M12.5 15.5 9.5 20h2.5l-1 3.5 3.5-5h-2.5z"/>`,
  hail: svg`${cloudHigh}<path fill="currentColor" d="M11 15.5 8.5 19.5h2l-.8 3 3-4.5h-2z"/><circle cx="16" cy="19.5" r="1.6" fill="currentColor"/>`,
  unknown: svg`<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><text x="12" y="16.5" text-anchor="middle" font-size="12" fill="currentColor">?</text>`,
};

export function conditionIcon(key: ConditionKey, size = 24): TemplateResult {
  return svg`<svg viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true">${ICONS[key]}</svg>`;
}
