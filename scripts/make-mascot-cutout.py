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

sys.path.insert(0, str(Path(__file__).resolve().parent))
from _matte import MatteError, load_rgb, matte  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "mascot" / "rio.webp"

# RIO draws at 120-190 px on screen; 620 px tall covers 3x DPR with room to spare.
TARGET_HEIGHT = 620


def main() -> int:
    if len(sys.argv) < 2:
        print("usage: python scripts/make-mascot-cutout.py <render.jpg>", file=sys.stderr)
        return 2
    src = Path(sys.argv[1])
    if not src.exists():
        print("abort: " + str(src) + " not found", file=sys.stderr)
        return 1

    rgb = load_rgb(src)
    try:
        alpha, rep = matte(rgb)
    except MatteError as e:
        print("abort: %s. Re-render on a flat white sweep." % e, file=sys.stderr)
        return 1

    ys, xs = np.where(alpha > 0.04)
    crop = (slice(ys.min(), ys.max() + 1), slice(xs.min(), xs.max() + 1))
    rgba = np.dstack([rgb, alpha * 255])[crop].astype(np.uint8)

    img = Image.fromarray(rgba, "RGBA")
    if img.height > TARGET_HEIGHT:
        img = img.resize(
            (round(img.width * TARGET_HEIGHT / img.height), TARGET_HEIGHT), Image.LANCZOS
        )

    OUT.parent.mkdir(parents=True, exist_ok=True)
    img.save(OUT, "WEBP", quality=90, method=6)

    print("wrote %s  %dx%d  %.1f KB" % (OUT.relative_to(ROOT), img.width, img.height,
                                        OUT.stat().st_size / 1024))
    print("background measured at %.3f, alpha floor %.3f" % (rep["background"], rep["floor"]))
    print("kept the largest of %d components; dropped %d px of speckle and hardware"
          % (rep["components"], rep["dropped"]))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
