"""
Turn the UNIBA logo from a white-background JPG into transparent PNGs.

Why this exists: `logo-uniba.jpg` is a 512x512 JPEG, and JPEG has no alpha channel.
Everywhere the mark was placed it carried its own opaque white square with it. On the
navy footer that reads as a white sticker; over the sky hero it punches a white hole.

The extraction is not a colour-key with a tolerance slider. The source is a single
solid ink on a flat white ground, so the compositing equation is known exactly:

    P = a*C + (1 - a)*255        (ink C over white)

which inverts to a = (255 - P) / (255 - C) per channel. Using the channel that sits
furthest from white -- i.e. min(R,G,B) -- keeps the denominator large and the estimate
stable, and it recovers true fractional alpha on antialiased edges instead of the
jagged binary cutout a threshold would give.

Colour is then rewritten to the sampled ink rather than kept per-pixel. Edge pixels in
the source are ink blended toward white; if that lighter colour is kept while alpha
also drops, edges wash out twice and the mark looks faded at small sizes.

Two outputs, because one file cannot serve both grounds:
  - logo-uniba.png       ink #000ACC, for light surfaces (header, sky hero)
  - logo-uniba-white.png white ink, for the navy footer, where #000ACC on #0F172A is
                         about 1.3:1 and effectively invisible

`logo-uniba.jpg` is deliberately left in place: StructuredData points at it, and an
opaque logo is the safer thing to hand a Knowledge Panel.
"""

import sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public" / "logo-uniba.jpg"

# Sampled from the source: the median of every pixel with luminance < 90.
INK = (0, 10, 204)

# Below this, a pixel is JPEG ringing in the white field rather than real ink. Left in,
# it prints a faint grey halo around the mark on any non-white ground.
NOISE_FLOOR = 0.045


def main() -> int:
    if not SRC.exists():
        print(f"abort: {SRC} not found", file=sys.stderr)
        return 1

    src = np.asarray(Image.open(SRC).convert("RGB")).astype(np.float32)

    # Distance from white, measured on the channel furthest from it.
    alpha = 1.0 - src.min(axis=2) / 255.0

    alpha[alpha < NOISE_FLOOR] = 0.0
    # Re-normalise so the floor does not shave real coverage off soft edges, and so
    # solid interior ink lands at a true 1.0 rather than 0.98.
    alpha = np.clip((alpha - NOISE_FLOOR) / (1.0 - NOISE_FLOOR), 0.0, 1.0)
    alpha = np.clip(alpha * 1.06, 0.0, 1.0)

    # Snap the near-solid and near-clear tails, and quantise only the genuine edge
    # band. JPEG ringing leaves 231 distinct alpha values where the mark has two, and
    # PNG cannot compress that noise: unsnapped this file is 95 KB, snapped it is 45 KB,
    # smaller than the JPEG it replaces. The transition band keeps 12 steps, which is
    # more than enough to stay smooth at the 36 px this is ever drawn at.
    alpha[alpha > 0.965] = 1.0
    alpha[alpha < 0.035] = 0.0
    edge = (alpha > 0.0) & (alpha < 1.0)
    alpha[edge] = np.round(alpha[edge] * 12) / 12

    h, w = alpha.shape
    coverage = float((alpha > 0.5).mean())
    if not 0.05 < coverage < 0.75:
        print(f"abort: implausible ink coverage {coverage:.1%}", file=sys.stderr)
        return 1

    a8 = (alpha * 255).round().astype(np.uint8)

    for name, ink in (("logo-uniba.png", INK), ("logo-uniba-white.png", (255, 255, 255))):
        rgb = np.empty((h, w, 3), dtype=np.uint8)
        rgb[..., 0], rgb[..., 1], rgb[..., 2] = ink
        out = ROOT / "public" / name
        Image.fromarray(np.dstack([rgb, a8]), "RGBA").save(out, optimize=True)
        print(f"wrote {out.relative_to(ROOT)}  {w}x{h}  {out.stat().st_size / 1024:.1f} KB")

    print(f"ink coverage {coverage:.1%}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
