import type { SVGProps } from "react";

/**
 * lucide-react 1.x ships no brand/social marks, so these are small
 * generic glyphs (not traced logos) styled to match the lucide stroke set.
 */

function baseProps(props: SVGProps<SVGSVGElement>) {
  return {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...props,
  };
}

export function InstagramGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps(props)}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="16.8" cy="7.2" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function YoutubeGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps(props)}>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10.5 9.2 15 12l-4.5 2.8Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M13.8 21v-7h2.3l.35-2.7h-2.65V9.6c0-.78.22-1.3 1.33-1.3h1.42V5.9c-.25-.03-1.09-.1-2.08-.1-2.06 0-3.47 1.26-3.47 3.56v2.03H8.6v2.7h2.3v7Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TiktokGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps(props)}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <path d="M13.2 7.2v7.35a2.15 2.15 0 1 1-1.6-2.08" />
      <path d="M13.2 7.2c.28 1.42 1.2 2.32 2.7 2.45" />
    </svg>
  );
}
