"""
Turn a generated clip of RIO into a sprite sheet the page can animate.

Usage:
    python scripts/make-sprite-sheet.py <video> <name> [--frames 8] [--start 0] [--end 0]

    python scripts/make-sprite-sheet.py rio-flap.mp4 flap --frames 8
    python scripts/make-sprite-sheet.py rio-perch.mp4 perch --frames 6 --start 1.2

Why a sprite sheet and not the video itself:

A video is an excellent SOURCE and a poor runtime asset. As a source it gives what
multi-image generation is worst at -- frames of the same character that actually match,
because they came out of one temporally coherent clip. As a runtime asset it drags in the
transparency problem: no video codec carries alpha across every browser, so a transparent
mascot means shipping two encodes and still missing some. It also decodes continuously
for a decorative element that CSS can animate for free.

Extracting frames sidesteps all of it. One WebP, one `steps()` animation, alpha handled by
the same matte the still cutout uses, and it is correct on every browser regardless of how
the codec support matrix moves.

Alignment is the part that decides whether this looks like animation or like a fault.
Generators drift the subject around the frame between frames, and registering on the
bounding box does not work here because the wings change that box on every frame -- which
is the entire point of the clip. So frames are registered on the centroid of the navy gown
and cap, which barely moves during a flap. Residual drift is reported: if it is large, the
clip wandered and is worth regenerating rather than shipping.
"""

import argparse
import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent))
from _matte import MatteError, load_rgb, matte, navy_centroid  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "public" / "mascot"

# Cells are drawn at 150-180 CSS px; 320 covers 2x DPR with headroom, and a sheet of
# eight at that size still lands well under the still cutout it replaces.
CELL_HEIGHT = 320
# Above this the clip wandered enough that a cycle will visibly slide.
MAX_DRIFT_PX = 40


def probe(video: Path) -> dict:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
         "stream=width,height,r_frame_rate,nb_frames:format=duration",
         "-of", "json", str(video)],
        capture_output=True, text=True, check=True,
    )
    return json.loads(out.stdout)


def extract(video: Path, into: Path, count: int, start: float, end: float) -> list[Path]:
    """Pull `count` evenly spaced frames from the requested span."""
    args = ["ffmpeg", "-v", "error", "-y"]
    if start:
        args += ["-ss", str(start)]
    args += ["-i", str(video)]
    if end:
        args += ["-to", str(end - start if start else end)]
    # Evenly spaced rather than every frame: a flap cycle wants 6-10 keys, and thinning
    # here is cheaper than matting 90 frames and throwing most away.
    args += ["-vsync", "0", "-frames:v", str(count * 4), str(into / "raw-%03d.png")]
    subprocess.run(args, check=True)

    raw = sorted(into.glob("raw-*.png"))
    if len(raw) < count:
        return raw
    idx = np.linspace(0, len(raw) - 1, count).round().astype(int)
    return [raw[i] for i in idx]


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("name", help="output stem, e.g. flap or perch")
    ap.add_argument("--frames", type=int, default=8)
    ap.add_argument("--start", type=float, default=0.0)
    ap.add_argument("--end", type=float, default=0.0)
    a = ap.parse_args()

    video = Path(a.video)
    if not video.exists():
        print("abort: %s not found" % video, file=sys.stderr)
        return 1
    if not shutil.which("ffmpeg"):
        print("abort: ffmpeg is not on PATH", file=sys.stderr)
        return 1

    meta = probe(video)
    stream = meta["streams"][0]
    print("source %sx%s  %.2fs  %s fps"
          % (stream["width"], stream["height"],
             float(meta["format"]["duration"]), stream["r_frame_rate"]))

    with tempfile.TemporaryDirectory() as tmp:
        tmpdir = Path(tmp)
        frames = extract(video, tmpdir, a.frames, a.start, a.end)
        if not frames:
            print("abort: ffmpeg produced no frames", file=sys.stderr)
            return 1

        matted, centroids = [], []
        for f in frames:
            rgb = load_rgb(f)
            try:
                alpha, rep = matte(rgb)
            except MatteError as e:
                print("abort on %s: %s" % (f.name, e), file=sys.stderr)
                return 1
            matted.append((rgb, alpha))
            centroids.append(navy_centroid(rgb, alpha))

        if any(c is None for c in centroids):
            print("abort: could not find the navy gown in every frame -- is the clip "
                  "actually RIO on a white sweep?", file=sys.stderr)
            return 1

        cy = np.array([c[0] for c in centroids])
        cx = np.array([c[1] for c in centroids])
        drift = float(max(cy.max() - cy.min(), cx.max() - cx.min()))
        print("landmark drift across %d frames: %.0f px" % (len(frames), drift))

        # Register every frame onto the mean landmark position, then crop all of them
        # with one box so the sprite does not swim inside its cell.
        ty = (cy.mean() - cy).round().astype(int)
        tx = (cx.mean() - cx).round().astype(int)

        h, w = matted[0][1].shape
        canvas = []
        for (rgb, alpha), dy, dx in zip(matted, ty, tx):
            shifted_rgb = np.zeros_like(rgb)
            shifted_a = np.zeros_like(alpha)
            ys0, ys1 = max(0, dy), min(h, h + dy)
            xs0, xs1 = max(0, dx), min(w, w + dx)
            shifted_rgb[ys0:ys1, xs0:xs1] = rgb[ys0 - dy : ys1 - dy, xs0 - dx : xs1 - dx]
            shifted_a[ys0:ys1, xs0:xs1] = alpha[ys0 - dy : ys1 - dy, xs0 - dx : xs1 - dx]
            canvas.append((shifted_rgb, shifted_a))

        union = np.zeros((h, w), bool)
        for _, alpha in canvas:
            union |= alpha > 0.04
        ys, xs = np.nonzero(union)
        box = (slice(ys.min(), ys.max() + 1), slice(xs.min(), xs.max() + 1))

        cells = []
        for rgb, alpha in canvas:
            cell = np.dstack([rgb, alpha * 255])[box].astype(np.uint8)
            img = Image.fromarray(cell, "RGBA")
            img = img.resize(
                (round(img.width * CELL_HEIGHT / img.height), CELL_HEIGHT), Image.LANCZOS
            )
            cells.append(img)

        cw, ch = cells[0].size
        sheet = Image.new("RGBA", (cw * len(cells), ch), (0, 0, 0, 0))
        for i, c in enumerate(cells):
            sheet.paste(c, (i * cw, 0))

        OUT_DIR.mkdir(parents=True, exist_ok=True)
        out = OUT_DIR / ("rio-%s.webp" % a.name)
        sheet.save(out, "WEBP", quality=88, method=6)

    print("wrote %s  %dx%d  %d frames of %dx%d  %.1f KB"
          % (out.relative_to(ROOT), sheet.width, sheet.height, len(cells), cw, ch,
             out.stat().st_size / 1024))
    print("CSS: background-size: %dpx %dpx; animation: ... steps(%d)"
          % (sheet.width, ch, len(cells)))
    if drift > MAX_DRIFT_PX:
        print("warning: %.0f px of drift will show as the cycle sliding. Regenerate the "
              "clip with an explicitly locked-off camera." % drift, file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
