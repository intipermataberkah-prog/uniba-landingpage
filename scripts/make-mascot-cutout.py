"""
Cut RIO out of a studio render onto transparency.

Usage:
    python scripts/make-mascot-cutout.py "C:/path/to/render.jpeg"

The source is a product render on a flat white sweep, which means the matte can be
derived rather than guessed. It is the same inversion used for the logo: for one subject
over white, a pixel is P = a*C + (1-a)*255, so the channel furthest from white gives the
most stable estimate of `a`. That recovers true fractional alpha along antialiased edges
instead of the stair-stepped cutout a colour-key with a tolerance slider would leave.

Two details the first attempt got wrong, both worth keeping written down:

  * The contact shadow under the model is real ink, not background, so a plain
    distance-from-white keeps it and RIO flies around with a grey smudge trailing him.
    A floor just above the background's own noise removes it. The floor has to stay LOW,
    though -- see the next point.

  * RIO's body is cream, not white, but its lit crown only reaches about 0.25 alpha. A
    floor set for the shadow at 0.13, combined with a component threshold at 0.25, cut
    the head clean off the body: the run reported 962 components and cropped to the gown.
    Measure the palest part of the subject before choosing either number.

The largest connected component is kept, which is what finally removes the keyring and
chain when they are only joined to the cap by thin metal -- and harmlessly keeps
everything when the new render has no hardware at all.
"""

import sys
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "mascot" / "rio.webp"

# Just above the measured noise of the white sweep (max ~0.043 across the frame).
FLOOR = 0.045
# Well under the subject's palest region. Only there to island-out speckle.
COMPONENT_THRESHOLD = 0.03
# RIO draws at 120-190 px on screen; 620 px tall covers 3x DPR with room to spare.
TARGET_HEIGHT = 620


def main() -> int:
    if len(sys.argv) < 2:
        print(__doc__.strip().splitlines()[3], file=sys.stderr)
        return 2
    src = Path(sys.argv[1])
    if not src.exists():
        print("abort: " + str(src) + " not found", file=sys.stderr)
        return 1

    a = np.asarray(Image.open(src).convert("RGB")).astype(np.float32)
    h, w = a.shape[:2]
    raw = 1.0 - a.min(axis=2) / 255.0

    bg = float(np.concatenate([raw[: h // 40].ravel(), raw[-h // 40 :].ravel()]).max())
    if bg > FLOOR:
        print(
            "abort: background is not clean enough (peaks at %.3f, floor is %.3f). "
            "Re-render on a flat white sweep." % (bg, FLOOR),
            file=sys.stderr,
        )
        return 1

    alpha = np.clip((raw - FLOOR) / (1.0 - FLOOR), 0.0, 1.0)

    lbl, n = ndimage.label(alpha > COMPONENT_THRESHOLD)
    if n == 0:
        print("abort: no subject found", file=sys.stderr)
        return 1
    sizes = ndimage.sum(np.ones_like(lbl), lbl, range(1, n + 1))
    biggest = int(np.argmax(sizes))
    dropped = int(sizes.sum() - sizes[biggest])
    alpha = alpha * (lbl == biggest + 1)

    ys, xs = np.where(alpha > 0.04)
    coverage = float((alpha > 0.5).mean())
    if not 0.03 < coverage < 0.80:
        print("abort: implausible subject coverage %.1f%%" % (coverage * 100), file=sys.stderr)
        return 1

    crop = (slice(ys.min(), ys.max() + 1), slice(xs.min(), xs.max() + 1))
    rgba = np.dstack([a, alpha * 255])[crop].astype(np.uint8)

    img = Image.fromarray(rgba, "RGBA")
    if img.height > TARGET_HEIGHT:
        img = img.resize(
            (round(img.width * TARGET_HEIGHT / img.height), TARGET_HEIGHT), Image.LANCZOS
        )

    OUT.parent.mkdir(parents=True, exist_ok=True)
    img.save(OUT, "WEBP", quality=90, method=6)

    print("wrote %s  %dx%d  %.1f KB" % (OUT.relative_to(ROOT), img.width, img.height,
                                        OUT.stat().st_size / 1024))
    print("kept the largest of %d components; dropped %d px of speckle and hardware"
          % (n, dropped))
    print("subject fills %.1f%% of its own bounding box" % (coverage * 100 * h * w /
                                                            max(rgba.shape[0] * rgba.shape[1], 1)))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
