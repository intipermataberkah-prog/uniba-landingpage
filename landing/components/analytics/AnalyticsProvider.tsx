"use client";

import { useEffect } from "react";

import {
  captureAttribution,
  decorateUrl,
  pushEventOncePerSession,
} from "@/lib/analytics";
import { contactInfo } from "@/data/unibaData";

/** Host of the off-site registration portal, derived so it tracks the contract. */
const PMB_HOST = (() => {
  try {
    return new URL(contactInfo.pmbWebsite).host;
  } catch {
    return "pmb.uniba.ac.id";
  }
})();

/**
 * Best-effort label for which CTA produced a WhatsApp click. Reported as an event
 * parameter only — the conversion itself is deduplicated regardless of source.
 */
function describeSource(anchor: HTMLAnchorElement): string {
  const label = anchor.getAttribute("aria-label");
  if (label) return label;
  const section = anchor.closest("section[id]")?.id;
  if (section) return `section:${section}`;
  if (anchor.closest('[role="dialog"]')) return "dialog";
  return "unknown";
}

/**
 * Site-wide analytics wiring, mounted once from the root layout.
 *
 * Two jobs:
 *
 *  1. WhatsApp intent. The page has several WA entry points and they are ordinary
 *     anchors, so one delegated capture-phase listener catches all of them —
 *     including any added later — without touching each component. The push is
 *     deduplicated per session so a visitor who taps two different WA buttons
 *     still counts as one conversion.
 *
 *  2. Cross-domain attribution. Registration completes on the PMB portal, a
 *     different host, so the gclid is rewritten onto those links at click time.
 *     Doing it on click rather than at render means it also covers links inside
 *     server-rendered pages, where sessionStorage is not readable.
 *
 * The form in RegistrationDialog opens WhatsApp via window.open() rather than an
 * anchor, so it reports itself explicitly. The per-session dedup makes that
 * double-reporting harmless by construction.
 */
export function AnalyticsProvider() {
  useEffect(() => {
    const attribution = captureAttribution();

    const onClick = (nativeEvent: Event) => {
      const target = nativeEvent.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href") ?? "";
      if (!href) return;

      if (href.includes("wa.me")) {
        pushEventOncePerSession("wa_click", {
          wa_source: describeSource(anchor),
          page_path: window.location.pathname,
        });
        return;
      }

      if (href.includes(PMB_HOST)) {
        const decorated = decorateUrl(anchor.href, attribution);
        if (decorated !== anchor.href) anchor.href = decorated;
        pushEventOncePerSession("pmb_portal_click", {
          page_path: window.location.pathname,
        });
      }
    };

    // Capture phase so the href is rewritten before navigation begins, and so a
    // component's own onClick cannot stop the event before it reaches us.
    document.addEventListener("click", onClick, true);
    // Middle-click / ctrl-click open in a new tab without firing `click`.
    document.addEventListener("auxclick", onClick, true);

    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("auxclick", onClick, true);
    };
  }, []);

  return null;
}

export default AnalyticsProvider;
