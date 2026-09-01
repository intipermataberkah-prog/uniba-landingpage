"""
Shared matte extraction for RIO, used by the still cutout and the sprite sheet.

Factored out rather than copied because the two callers must agree exactly: a sprite
sheet whose frames were matted on slightly different rules jitters at the edges as it
cycles, and that reads as a bad cutout rather than as a bad copy-paste.

The method, and why it is not the one the logo script uses:

The source is a render on a flat white sweep, so distance from white finds the subject
reliably. That distance is used to LOCATE the subject, never as the alpha.

The logo script does use it as alpha, correctly: a logo is one known ink over white, so
P = a*C + (1-a)*255 inverts exactly. RIO is not one ink. His body is cream, which is
close to white, so the same inversion hands it roughly 0.3 alpha and declares the
character two-thirds transparent. On the pale sky hero that is invisible -- translucent
cream over pale blue still looks like cream. On the navy testimonial band it is glaring:
the navy pours through and RIO becomes a dark silhouette of himself.

So the matte is a SILHOUETTE. Threshold low, close the gaps, fill the holes, keep the
largest component. Inside it alpha is a flat 1; only the outer edge is softened, which is
where partial coverage actually exists. The mask is eroded a pixel first, because edge
pixels in the source are the subject blended toward white and carrying them at full
opacity prints a pale fringe -- barely visible on sky, a bright outline on navy.
"""

import numpy as np
from PIL import Image
from scipy import ndimage

# The floor is derived per source, not fixed. A hardcoded 0.045 once rejected a perfectly
# usable render for peaking at 0.047, and a 0.002 margin is a coin toss, not a judgement.
FLOOR_MARGIN = 1.25
FLOOR_MIN = 0.030
# Above this the floor starts eating the subject: RIO's palest region, the lit crown of
# the head, only reaches about 0.25 distance-from-white.
FLOOR_MAX = 0.120


class MatteError(RuntimeError):
    """The source cannot be separated from its background."""


def background_floor(raw: np.ndarray) -> tuple[float, float]:
    """Measure the sweep at all four edges and return (measured, floor)."""
    h, w = raw.shape
    edge = np.concatenate(
        [
            raw[: max(1, h // 40)].ravel(),
            raw[-max(1, h // 40) :].ravel(),
            raw[:, : max(1, w // 40)].ravel(),
            raw[:, -max(1, w // 40) :].ravel(),
        ]
    )
    # A vignette shows at the corners first, and a studio sweep is dirtiest where it
    # curves away, so all four edges are sampled rather than just top and bottom.
    bg = float(np.percentile(edge, 99.9))
    return bg, max(FLOOR_MIN, bg * FLOOR_MARGIN)


def matte(rgb: np.ndarray, floor: float | None = None) -> tuple[np.ndarray, dict]:
    """
    Return (alpha in 0..1, report) for an RGB float array on a white sweep.

    Raises MatteError when the background is too dirty to separate, or when the subject
    it finds is an implausible fraction of the frame.
    """
    raw = 1.0 - rgb.min(axis=2) / 255.0
    bg, derived = background_floor(raw)
    floor = derived if floor is None else floor
    if floor > FLOOR_MAX:
        raise MatteError(
            "background is not clean enough (edges reach %.3f, so the floor would have to "
            "be %.3f and would start cutting into the subject)" % (bg, floor)
        )

    # Closing first so a thin specular across a wing does not split it, then filling holes
    # so an interior highlight does not punch through.
    mask = raw > floor
    mask = ndimage.binary_closing(mask, structure=np.ones((3, 3)), iterations=2)
    mask = ndimage.binary_fill_holes(mask)

    lbl, n = ndimage.label(mask)
    if n == 0:
        raise MatteError("no subject found")
    sizes = ndimage.sum(np.ones_like(lbl), lbl, range(1, n + 1))
    biggest = int(np.argmax(sizes))
    dropped = int(sizes.sum() - sizes[biggest])
    mask = lbl == biggest + 1

    # Pull in one pixel to drop the white-contaminated rim, then blur to restore a soft
    # edge, rescaling so the silhouette lands back on its original outline rather than
    # staying a pixel thin all round.
    mask = ndimage.binary_erosion(mask, structure=np.ones((3, 3)), iterations=1)
    alpha = ndimage.gaussian_filter(mask.astype(np.float32), sigma=0.9)
    alpha = np.clip((alpha - 0.30) / 0.45, 0.0, 1.0)

    coverage = float((alpha > 0.5).mean())
    if not 0.02 < coverage < 0.80:
        raise MatteError("implausible subject coverage %.1f%%" % (coverage * 100))

    return alpha, {
        "background": bg,
        "floor": floor,
        "components": n,
        "dropped": dropped,
        "coverage": coverage,
    }


def navy_centroid(rgb: np.ndarray, alpha: np.ndarray) -> tuple[float, float] | None:
    """
    Centre of RIO's navy gown and cap, in (y, x).

    Used to register sprite frames against each other. Video generators drift the subject
    around the frame, and aligning on the overall bounding box does not work here because
    the wings change that box on every frame -- which is the whole point of the clip. The
    gown and cap are the darkest thing in the image and they barely move during a flap,
    so they make a stable landmark.
    """
    lum = rgb.mean(axis=2)
    navy = (lum < 130) & (rgb[..., 2] > rgb[..., 0]) & (alpha > 0.5)
    if navy.sum() < 200:
        return None
    ys, xs = np.nonzero(navy)
    return float(ys.mean()), float(xs.mean())


def load_rgb(path) -> np.ndarray:
    return np.asarray(Image.open(path).convert("RGB")).astype(np.float32)
