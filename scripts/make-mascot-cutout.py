"""
Cut RIO out of a studio render onto transparency.

Usage:
    python scripts/make-mascot-cutout.py "C:/path/to/render.jpeg"

The source is a product render on a flat white sweep, so the subject can be separated
from the ground by how far each pixel sits from white.

That distance is used to find the subject. It is deliberately NOT used as the alpha.

The logo script does use it as alpha, and that is correct there: a logo is one known ink
on white, so P = a*C + (1-a)*255 inverts exactly. RIO is not one ink. His body is cream,
which is CLOSE to white, so the same inversion hands it an alpha around 0.25-0.35 and
declares the character two-thirds transparent. On the pale sky hero that is invisible --
translucent cream over pale blue still looks like cream. Composited on the navy
testimonial band it is obvious: the navy pours straight through and RIO turns into a dark
silhouette of himself. The bug was only found by testing on both grounds.

So the matte is built as a SILHOUETTE instead. Threshold low, close the gaps, fill the
holes, keep the largest component: that is where the subject is. Inside it, alpha is a
flat 1. Only the outer edge is softened, by blurring the mask, which is where partial
coverage genuinely exists.

The mask is also eroded by a pixel before blurring. Edge pixels in the source are the
subject blended toward white, so carrying them through at full opacity prints a pale
fringe -- barely visible on the sky, a bright outline on navy.

Two more things this handles:

  * The contact shadow under the model is a separate blob, so keeping only the largest
    component drops it. That also removed the keyring and chain from the earlier standing
    render, where thin metal was all that joined them to the cap.
  * The alpha floor is derived per render rather than fixed. See FLOOR_MARGIN.
"""

import sys
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "mascot" / "rio.webp"

# The floor is derived per render, not fixed. A hardcoded 0.045 rejected a perfectly
# usable sweep that peaked at 0.047 -- a 0.002 margin is not a quality judgement, it is a
# coin toss. Measuring the frame and clearing it by a quarter adapts to whatever the
# generator produced, and the abort below still catches a background genuinely too dirty
# to separate.
FLOOR_MARGIN = 1.25
FLOOR_MIN = 0.030
# Above this the floor would start eating the subject: RIO's palest region, the lit crown
# of the head, only reaches about 0.25.
FLOOR_MAX = 0.120
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

    # Sample all four edges, not just top and bottom: a vignette shows up at the corners
    # first, and a studio sweep is often dirtiest where it curves away.
    edge = np.concatenate([
        raw[: h // 40].ravel(), raw[-h // 40 :].ravel(),
        raw[:, : w // 40].ravel(), raw[:, -w // 40 :].ravel(),
    ])
    bg = float(np.percentile(edge, 99.9))
    floor = max(FLOOR_MIN, bg * FLOOR_MARGIN)
    if floor > FLOOR_MAX:
        print(
            "abort: background is not clean enough (edges reach %.3f, so the floor would "
            "have to be %.3f and would start cutting into the subject). Re-render on a "
            "flat white sweep." % (bg, floor),
            file=sys.stderr,
        )
        return 1

    # Where the subject is. Closing first so a thin highlight across a wing does not
    # split it, then filling holes so an interior specular does not punch through.
    mask = raw > floor
    mask = ndimage.binary_closing(mask, structure=np.ones((3, 3)), iterations=2)
    mask = ndimage.binary_fill_holes(mask)

    lbl, n = ndimage.label(mask)
    if n == 0:
        print("abort: no subject found", file=sys.stderr)
        return 1
    sizes = ndimage.sum(np.ones_like(lbl), lbl, range(1, n + 1))
    biggest = int(np.argmax(sizes))
    dropped = int(sizes.sum() - sizes[biggest])
    mask = lbl == biggest + 1

    # Pull in one pixel to drop the white-contaminated rim, then blur to restore a soft
    # edge. Rescaling after the blur keeps the silhouette on its original outline instead
    # of leaving it a pixel thin all round.
    mask = ndimage.binary_erosion(mask, structure=np.ones((3, 3)), iterations=1)
    alpha = ndimage.gaussian_filter(mask.astype(np.float32), sigma=0.9)
    alpha = np.clip((alpha - 0.30) / 0.45, 0.0, 1.0)

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
    print("background measured at %.3f, alpha floor set to %.3f" % (bg, floor))
    print("kept the largest of %d components; dropped %d px of speckle and hardware"
          % (n, dropped))
    print("subject fills %.1f%% of its own bounding box" % (coverage * 100 * h * w /
                                                            max(rgba.shape[0] * rgba.shape[1], 1)))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
