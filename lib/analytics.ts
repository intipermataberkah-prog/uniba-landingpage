/**
 * dataLayer plumbing for GTM → Google Ads conversion tracking.
 *
 * Why events are pushed to dataLayer rather than calling gtag() directly: the
 * Google Ads conversion tag must live in GTM so it fires in real time. Importing
 * a GA4 key event into Google Ads instead carries a 24–48h delay, which starves
 * Smart Bidding of the signal it needs while a campaign is still learning.
 *
 * Nothing here fires unless a GTM container is configured; the pushes are inert
 * no-ops otherwise, so local dev and previews stay clean.
 */

export type DataLayerEvent = Record<string, unknown> & { event: string };

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[];
  }
}

/** Session-scoped dedup keys. sessionStorage, so a new tab is a new session. */
const DEDUP_PREFIX = "uniba_evt_";
/** Where landing-time campaign attribution is parked for the rest of the session. */
const ATTRIBUTION_KEY = "uniba_attribution";

/** Params we carry from the ad click through to off-site destinations. */
const TRACKED_PARAMS = [
  "gclid",
  "gbraid",
  "wbraid",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

export type Attribution = Partial<Record<(typeof TRACKED_PARAMS)[number], string>>;

/** Push an event. Safe on the server and before GTM has booted — GTM replays the queue. */
export function pushEvent(event: string, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...params });
}

/**
 * Push at most once per session.
 *
 * This is the whole point of the WhatsApp instrumentation: the landing page has
 * four separate WA entry points (floating FAB, the Daftar dialog, the Simulasi
 * Biaya result, and the scholarship form). One visitor bouncing between them
 * would otherwise report as three or four conversions, inflating the count and
 * teaching Smart Bidding to overpay for a single lead.
 *
 * Returns true if the event was actually pushed.
 */
export function pushEventOncePerSession(
  event: string,
  params: Record<string, unknown> = {}
): boolean {
  if (typeof window === "undefined") return false;

  const key = `${DEDUP_PREFIX}${event}`;
  try {
    if (sessionStorage.getItem(key)) return false;
    sessionStorage.setItem(key, "1");
  } catch {
    // Private mode / storage disabled: fire rather than lose the conversion.
    // Over-counting a storage-blocked minority beats losing the signal entirely.
  }

  pushEvent(event, params);
  return true;
}

/**
 * Read campaign params off the current URL and remember them for the session.
 *
 * Called once on landing. Merges rather than replaces so an internal navigation
 * that drops the query string cannot wipe the original ad attribution.
 */
export function captureAttribution(): Attribution {
  if (typeof window === "undefined") return {};

  const search = new URLSearchParams(window.location.search);
  const incoming: Attribution = {};
  for (const param of TRACKED_PARAMS) {
    const value = search.get(param);
    if (value) incoming[param] = value;
  }

  const stored = getAttribution();
  const merged = { ...stored, ...incoming };

  if (Object.keys(incoming).length > 0) {
    try {
      sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(merged));
    } catch {
      // Non-fatal — decoration simply falls back to whatever is on the URL.
    }
  }

  return merged;
}

export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(ATTRIBUTION_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : {};
  } catch {
    return {};
  }
}

/**
 * Append stored attribution to an outbound URL.
 *
 * The real registration happens on pmb.uniba.ac.id — a different domain — so
 * without this the gclid dies at the boundary and that traffic shows up as
 * direct in the destination's own analytics. Existing params on the target win,
 * so a hand-tagged link is never overwritten.
 */
export function decorateUrl(url: string, attribution: Attribution = getAttribution()): string {
  const entries = Object.entries(attribution).filter(([, v]) => Boolean(v));
  if (entries.length === 0) return url;

  try {
    const parsed = new URL(url, window.location.origin);
    for (const [key, value] of entries) {
      if (!parsed.searchParams.has(key)) parsed.searchParams.set(key, value as string);
    }
    return parsed.toString();
  } catch {
    return url;
  }
}
