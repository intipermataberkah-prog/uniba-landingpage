"""
Generate the hero sky.

The previous asset failed for a reason worth writing down: the Nano Banana prompt asked
for "subtle, minimal, high-key" clouds and got exactly that -- three generations whose
middle 70% is a flat pale wash with a few wisps in the corners. Scaled into the hero and
covered by the horizon fade, nothing was visible at all.

So this is procedural instead of prompted, which buys three things the generator could
not: the composition is placed rather than hoped for, the bright corridor the headline
sits in is guaranteed rather than discovered, and it can be re-tuned in seconds.

How the clouds are built:

  1. fBm value noise -- coarse random grids resampled up bicubically and summed at
     falling amplitude. On its own this gives soft blobs, not clouds.
  2. Domain warping -- the coordinates fed to the noise are themselves displaced by two
     further noise fields. This is the step that matters: it shears and folds the blobs
     into the billowed, cauliflower-edged masses that read as cumulus.
  3. Two fields, not one. A low-frequency SHAPE field owns the silhouette and a
     high-frequency DETAIL field is mixed in at low amplitude. Thresholding a single
     detailed field is what produced shredded, scratchy clouds on the first attempt --
     every small wiggle became its own hole. Real cumulus are big smooth masses that are
     broken up only at their margins.
  4. A composition mask decides where clouds may sit: banked left, right and top, cleared
     through the middle. Its coordinates are perturbed by noise BEFORE the mask is
     evaluated, so the corridor wanders instead of cutting two straight vertical lines
     down the frame like a stage curtain.
  5. Shading by vertical density offset. Sampling the field slightly above a point
     approximates how much cloud lies between it and the sun, so tops light and
     undersides fall into soft blue-grey shadow. Without it the clouds are flat paper.

The corridor is not decorative. The headline, the price deck and the primary CTA all sit
inside it, and it is what guarantees navy type lands on a near-white ground rather than
on cloud detail. Contrast is asserted at the end of this script rather than eyeballed.

Palette stays locked to blue per the campaign, with only a faint warm bias in the
highlights so the light reads as sun rather than as a screen at full brightness.

    python scripts/make-sky.py                  # write the three public/sky assets
    python scripts/make-sky.py --preview x.png  # one fast frame to look at
"""

import sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "public" / "sky"

SEED = 20260902

# The navy ink the hero sets over this image, as sRGB components in 0..1.
INK = (0x1E / 255, 0x29 / 255, 0x3B / 255)


def _smooth_grid(rng, cells_y, cells_x, h, w, periodic_x=False):
    """
    One octave: a coarse random grid resampled up to full size with bicubic easing.

    `periodic_x` makes the octave seamless left-to-right. The coarse grid is tiled three
    times across, resized, and the middle period cropped back out. Because the source
    repeats with period `cells_x`, the crop meets itself exactly at the seam -- including
    the bicubic interpolation running across it, which wrapping the finished image would
    not reproduce. This is what lets the drifting cloud strip loop with no visible join.
    """
    grid = rng.random((cells_y, cells_x)).astype(np.float32)
    if periodic_x:
        img = Image.fromarray((np.tile(grid, (1, 3)) * 255).astype(np.uint8), "L")
        big = np.asarray(img.resize((w * 3, h), Image.BICUBIC)).astype(np.float32) / 255.0
        return big[:, w:w * 2]
    img = Image.fromarray((grid * 255).astype(np.uint8), "L")
    return np.asarray(img.resize((w, h), Image.BICUBIC)).astype(np.float32) / 255.0


def fbm(rng, h, w, octaves=6, base=3, aspect=1.0, gain=0.5, lacunarity=2.0,
        periodic_x=False):
    """Fractal Brownian motion: octaves of value noise at falling amplitude."""
    total = np.zeros((h, w), np.float32)
    amp, norm, cells = 1.0, 0.0, float(base)
    for _ in range(octaves):
        cy = max(2, int(round(cells)))
        cx = max(2, int(round(cells * aspect)))
        total += amp * _smooth_grid(rng, cy, cx, h, w, periodic_x)
        norm += amp
        amp *= gain
        cells *= lacunarity
    return total / norm


def _bilinear(field, sy, sx, wrap_x=False):
    """
    Sample `field` at fractional coordinates.

    Truncating to integers here is what made the first cloud pass look scratched: the
    displacement field varies smoothly, so rounding quantises whole runs of neighbouring
    pixels onto one source row and prints thin streaks across the cloud faces.

    `wrap_x` takes x modulo the width instead of clamping it. Clamping is right for a
    fixed frame -- it stops the warp dragging in garbage at the edge -- but it destroys
    horizontal periodicity, which the looping strip depends on.
    """
    w = field.shape[1]
    x0 = np.floor(sx).astype(np.int32)
    y0 = np.floor(sy).astype(np.int32)
    fx, fy = sx - x0, sy - y0
    x1, y1 = x0 + 1, y0 + 1
    if wrap_x:
        x0, x1 = x0 % w, x1 % w

    top = field[y0, x0] * (1 - fx) + field[y0, x1] * fx
    bot = field[y1, x0] * (1 - fx) + field[y1, x1] * fx
    return top * (1 - fy) + bot * fy


def warped_fbm(rng, h, w, octaves, base, aspect, warp, gain=0.5, periodic_x=False):
    """fBm sampled through a displaced coordinate field."""
    kw = {"aspect": aspect, "periodic_x": periodic_x}
    field = fbm(rng, h, w, octaves=octaves, base=base, gain=gain, **kw)
    # Four octaves in the displacement, not three. A displacement field that is too
    # smooth drags long coherent runs of pixels the same way and prints horizontal
    # smears across the cloud faces; the extra octave breaks the drag up.
    dx = (fbm(rng, h, w, octaves=4, base=2, **kw) - 0.5) * 2.0
    dy = (fbm(rng, h, w, octaves=4, base=3, **kw) - 0.5) * 2.0

    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    # Horizontal displacement runs wider than vertical: cumulus shear sideways on wind,
    # and equal displacement on both axes reads as a smudge rather than a cloud.
    sx = xx + dx * warp * w
    sy = np.clip(yy + dy * warp * 0.5 * h, 0, h - 1.001)
    if not periodic_x:
        sx = np.clip(sx, 0, w - 1.001)
    return _bilinear(field, sy, sx, wrap_x=periodic_x)


def normalise(field, lo_pct=2.0, hi_pct=98.0):
    """
    Stretch a field to fill 0..1.

    Normalised fBm piles up in a narrow band around 0.5, so a threshold written as an
    absolute value catches only the extreme tail -- which is precisely how the first pass
    produced four wisps in the corners and nothing else. Rescaling on percentiles makes a
    threshold mean what it says.
    """
    lo, hi = np.percentile(field, (lo_pct, hi_pct))
    return np.clip((field - lo) / max(float(hi - lo), 1e-6), 0.0, 1.0)


def smoothstep(x):
    return x * x * (3.0 - 2.0 * x)


def composition_mask(rng, h, w, aspect, corridor):
    """
    Where clouds are allowed to be.

    Coordinates are perturbed by low-frequency noise BEFORE the analytic mask is
    evaluated. Warping the finished mask instead requires sampling it, and sampling
    clamps at the frame edge, which stamps replicated rows along the top as hard vertical
    bars. Perturbing the input has no such edge: the corridor simply wanders, and the
    left/right mirror symmetry the bare formula would impose is broken for free.
    """
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    u, v = xx / (w - 1), yy / (h - 1)

    u = u + (fbm(rng, h, w, octaves=3, base=2, aspect=aspect) - 0.5) * 0.30
    v = v + (fbm(rng, h, w, octaves=3, base=2, aspect=aspect) - 0.5) * 0.22

    if h > w:
        # Portrait crop. There is no room for side banks in a 375 px column -- squeezing
        # the landscape composition into it is what emptied the first mobile asset, which
        # shipped as a bare gradient with one cloud in the corner. So the composition
        # turns 90 degrees: cloud gathers along the top, clears through the middle where
        # the headline and CTA sit, and comes back as a low bank near the foot.
        crown = np.clip(1.0 - (v - 0.02) / 0.58, 0.0, 1.0) ** 0.65
        floor = np.clip((v - 0.62) / 0.38, 0.0, 1.0) ** 1.3
        # A small floor everywhere so the clear middle still carries a few drifting
        # clouds. At exactly zero the mask makes the threshold unreachable and the middle
        # of the frame comes out as bare gradient.
        return np.clip(crown * 1.10 + floor * 0.50 + 0.20, 0.0, 1.0)

    # Distance from the centre column, eased. 0 in the corridor, 1 at the edges.
    edge = np.clip((np.abs(u - 0.5) * 2.0 - 0.05) / 0.60, 0.0, 1.0) ** 1.1
    edge = edge ** corridor

    # Cloud hangs from the top and thins toward the horizon, where the section fades into
    # the white band that follows it.
    top = np.clip(1.0 - (v - 0.12) / 1.20, 0.0, 1.0) ** 0.7

    # A low bank along the bottom gives the frame a floor rather than letting the sky
    # simply run out mid-gradient.
    floor = np.clip((v - 0.55) / 0.45, 0.0, 1.0) ** 1.5

    return np.clip(edge * top * 1.25 + floor * 0.30, 0.0, 1.0)


def render(w, h, seed, base, corridor=1.0):
    rng = np.random.default_rng(seed)
    aspect = max(1.0, w / h)

    # Silhouette: heavy warp, moderate gain. Big folded masses.
    shape = normalise(
        warped_fbm(rng, h, w, octaves=6, base=base, aspect=aspect, warp=0.17, gain=0.55)
    )
    # Surface: fine grain, mixed in lightly. Enough to break the margins into vapour,
    # not enough to perforate the body.
    detail = normalise(fbm(rng, h, w, octaves=6, base=base * 4, aspect=aspect))
    density = np.clip(shape * 0.84 + detail * 0.16, 0.0, 1.0)

    # Capped below 1.0 on purpose. At a full 1.0 the threshold in the banks drops under
    # the whole density distribution, every pixel passes, and the cloud becomes a solid
    # grey slab with no internal structure -- which is what the side banks looked like
    # for three iterations. Holding the ceiling at 0.9 keeps the threshold inside the
    # distribution everywhere, so cloud and gap continue to form even at the frame edge.
    mask = composition_mask(rng, h, w, aspect, corridor) * 0.90

    # Coverage: subtract a threshold that rises where the mask says "keep this clear",
    # then rescale. This turns a continuous field into distinct clouds with sky between
    # them, rather than an even haze over everything.
    threshold = 0.46 + (1.0 - mask) * 0.46
    cover = smoothstep(np.clip((density - threshold) / 0.18, 0.0, 1.0))

    # Lighting. Sampling the density a little above each point approximates the depth of
    # cloud between it and the sun: little above means a lit top, a lot means an
    # underside in shadow.
    # Single-scattering approximation. March upward from every pixel and accumulate the
    # cloud material lying between it and the sun; light falls off exponentially with
    # that accumulation.
    #
    # The first attempt shaded on a one-step vertical gradient of the density field
    # (`density - above`), which only detects EDGES. It draws a bright rim wherever the
    # field happens to be rising and leaves the interior an even mid-tone, so the clouds
    # came out as flat paint with mottling rather than as volumes. Integrating over
    # several steps is what separates a lit crown from a shadowed belly.
    steps = 7
    stride = max(2, int(h * 0.013))
    occl = np.zeros_like(cover)
    for k in range(1, steps + 1):
        off = k * stride
        occl += np.vstack([np.repeat(cover[:1], off, axis=0), cover[:-off]])
    shade = np.exp(-(occl / steps) * 1.30)

    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    u, v = xx / (w - 1), yy / (h - 1)

    # Sky behind the clouds: saturated at the zenith, washing out toward the horizon.
    sky = np.empty((h, w, 3), np.float32)
    t = np.clip(v / 0.92, 0.0, 1.0) ** 0.95
    for i, (top_c, bot_c) in enumerate(((0.502, 0.973), (0.714, 0.988), (0.894, 1.0))):
        sky[..., i] = top_c + (bot_c - top_c) * t

    # Cloud body. Lit tops are near-white with a trace of warmth; shadowed undersides
    # take a cool blue-grey. Both stay light: this is a bright-day sky, and navy type has
    # to stay readable even where it strays off the corridor.
    shadow = np.array([0.729, 0.800, 0.878], np.float32)
    highlight = np.array([1.0, 0.998, 0.992], np.float32)
    body = shadow + (highlight - shadow) * shade[..., None]

    # Thin cloud is translucent: let sky through the wispy margins so edges do not
    # terminate in a hard line.
    alpha = (cover ** 0.9)[..., None]
    out = sky * (1.0 - alpha) + body * alpha

    # A second, higher veil of thin cloud drawn across the whole frame, the middle
    # included. Without it the composition is two banks of cumulus either side of an
    # empty blue channel, which reads as a stage flat rather than as sky. The veil is
    # near-white and never fully opaque, so it FILLS the corridor while raising its
    # luminance rather than lowering it -- it helps the contrast floor instead of
    # fighting it.
    veil = normalise(
        warped_fbm(rng, h, w, octaves=4, base=max(2, base - 1), aspect=aspect,
                   warp=0.16, gain=0.5)
    )
    veil_a = smoothstep(np.clip((veil - 0.26) / 0.56, 0.0, 1.0))
    # Thicker high up, thinning toward the horizon so it does not muddy the fade-out.
    veil_a = veil_a * np.clip(1.0 - (v - 0.05) / 0.95, 0.0, 1.0) * 0.30
    out = out * (1.0 - veil_a[..., None]) + np.array(
        [0.988, 0.996, 1.0], np.float32
    ) * veil_a[..., None]

    # Sun glow, sitting just above the headline.
    glow = np.exp(-(((u - 0.5) / 0.44) ** 2 + ((v - 0.28) / 0.42) ** 2))
    return np.clip(out + glow[..., None] * 0.09, 0.0, 1.0)


def render_strip(w, h, seed, base=3):
    """
    A horizontally seamless band of cloud on transparent ground.

    This is the drifting layer that replaced the batik pattern on the navy surfaces. It
    is one asset used at three scales and speeds, so the parallax costs a single request.

    Everything here is periodic in x -- the noise octaves, the displacement fields, and
    the sampler that reads through them -- because the layer is animated by translating
    it exactly one period. Any non-periodic step anywhere in the chain shows up as a
    vertical seam sliding across the section once per loop.

    The composition mask is a function of v alone for the same reason: introduce any x
    term and the periodicity is gone.
    """
    rng = np.random.default_rng(seed)
    aspect = w / h

    shape = normalise(
        warped_fbm(rng, h, w, octaves=6, base=base, aspect=aspect, warp=0.11,
                   gain=0.50, periodic_x=True)
    )
    detail = normalise(
        fbm(rng, h, w, octaves=6, base=base * 4, aspect=aspect, periodic_x=True)
    )
    density = np.clip(shape * 0.84 + detail * 0.16, 0.0, 1.0)

    v = (np.mgrid[0:h, 0:w][0].astype(np.float32)) / (h - 1)
    # Feathered top and bottom so the band has no cut edge when it is laid over a
    # section: it has to fade into the surface, not sit on it as a rectangle.
    # Clamp the sine at zero before the fractional power: at v = 1 it lands a hair
    # below zero in float32, and a negative base raised to 0.55 is NaN, which then
    # poisons the alpha channel and every seam measurement taken from it.
    band = np.clip(np.sin(np.pi * np.clip(v, 0.0, 1.0)), 0.0, 1.0) ** 0.55

    threshold = 0.40 + (1.0 - band) * 0.55
    cover = smoothstep(np.clip((density - threshold) / 0.34, 0.0, 1.0))

    steps = 7
    stride = max(2, int(h * 0.016))
    occl = np.zeros_like(cover)
    for k in range(1, steps + 1):
        off = k * stride
        occl += np.vstack([np.repeat(cover[:1], off, axis=0), cover[:-off]])
    shade = np.exp(-(occl / steps) * 1.15)

    # White cloud, cool grey where it self-shadows. Sits on navy and on white alike,
    # because the layer carries no colour of its own beyond that.
    shadow = np.array([0.784, 0.843, 0.910], np.float32)
    highlight = np.array([1.0, 1.0, 1.0], np.float32)
    rgb = shadow + (highlight - shadow) * shade[..., None]

    rgba = np.dstack([rgb, cover * band])
    return (np.clip(rgba, 0.0, 1.0) * 255).round().astype(np.uint8)


def seam_error(rgba, margin=24):
    """
    How visible the wrap-around join is, relative to ordinary detail BESIDE it.

    Returns the mean absolute difference across the seam divided by the mean
    column-to-column difference in the strip either side of it. About 1.0 means the join
    is indistinguishable from any other pair of adjacent columns.

    The baseline is local on purpose. Averaged over the whole strip it is dominated by
    the large fully transparent regions, where adjacent columns are identical and the
    difference is ~0; that tiny denominator reported a 3x seam on a strip whose join is
    not visible at all when composited. Comparing like with like is the point of the
    measurement.
    """
    a = rgba.astype(np.float32)
    seam = np.abs(a[:, -1] - a[:, 0]).mean()
    near = np.concatenate([a[:, :margin], a[:, -margin:]], axis=1)
    local = np.abs(np.diff(near, axis=1)).mean()
    return float(seam / max(local, 1e-6))


def contrast_floor(rgb, w, h):
    """
    Worst-case contrast ratio of the hero's navy ink against the corridor.

    The band checked is the middle 56% of the width and the top 62% of the height, which
    is where the eyebrow, headline, deck, price pill and both buttons render. Reported
    rather than assumed: WCAG AA wants 4.5:1 for body text.
    """
    if h > w:
        # Portrait puts the type in the vertical middle rather than the upper corridor.
        x0, x1, y0, y1 = int(w * 0.06), int(w * 0.94), int(h * 0.30), int(h * 0.78)
    else:
        x0, x1, y0, y1 = int(w * 0.22), int(w * 0.78), int(h * 0.06), int(h * 0.62)
    band = rgb[y0:y1, x0:x1]

    def rel_lum(c):
        c = np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
        return 0.2126 * c[..., 0] + 0.7152 * c[..., 1] + 0.0722 * c[..., 2]

    ink = float(rel_lum(np.array(INK, np.float32).reshape(1, 1, 3))[0, 0])
    ground = rel_lum(band)
    return float(((ground + 0.05) / (ink + 0.05)).min())


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    if "--preview" in sys.argv:
        out = Path(sys.argv[sys.argv.index("--preview") + 1])
        w, h = 1200, 670
        rgb = render(w, h, SEED, base=3)
        Image.fromarray((rgb * 255).round().astype(np.uint8), "RGB").save(out)
        print("preview -> " + str(out) + "   contrast floor "
              + format(contrast_floor(rgb, w, h), ".1f") + ":1")
        return 0

    targets = [
        # name, width, height, seed, base cells, corridor exponent
        ("hero-sky.webp", 2000, 1116, SEED, 3, 1.0),
        # Portrait: composition_mask switches to its top-and-foot layout for h > w, so
        # the corridor exponent is not used here.
        ("hero-sky-mobile.webp", 1100, 1970, SEED + 23, 4, 1.0),
        ("band-sky.webp", 2000, 700, SEED + 21, 3, 1.0),
    ]
    failed = False
    for name, w, h, seed, base, corridor in targets:
        rgb = render(w, h, seed, base=base, corridor=corridor)
        ratio = contrast_floor(rgb, w, h)
        path = OUT_DIR / name
        Image.fromarray((rgb * 255).round().astype(np.uint8), "RGB").save(
            path, "WEBP", quality=88, method=6
        )
        failed = failed or ratio < 4.5
        print("wrote " + str(path.relative_to(ROOT)) + "  " + str(w) + "x" + str(h)
              + "  " + format(path.stat().st_size / 1024, ".1f") + " KB"
              + "  contrast " + format(ratio, ".1f") + ":1"
              + ("" if ratio >= 4.5 else "   *** BELOW AA ***"))

    strip = render_strip(1800, 520, SEED + 101, base=3)
    err = seam_error(strip)
    path = OUT_DIR / "cloud-strip.webp"
    Image.fromarray(strip, "RGBA").save(path, "WEBP", quality=72, method=6)
    print("wrote " + str(path.relative_to(ROOT)) + "  1800x520  "
          + format(path.stat().st_size / 1024, ".1f") + " KB"
          + "  seam " + format(err, ".2f") + "x interior detail"
          + ("" if err < 2.0 else "   *** VISIBLE SEAM ***"))
    if err >= 2.0:
        failed = True

    if failed:
        print("a generated asset failed its check", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
