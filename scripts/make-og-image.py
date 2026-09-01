"""
Generate the Open Graph share card.

    python scripts/make-og-image.py

The card that shipped before this was a full Independence Day poster: red and white,
"1-31 Agustus 2026", "Promo Spesial Kemerdekaan". It survived the campaign changeover
because the sweep for that promo checked the visible page and never checked the share
card -- which on this project is close to the most-seen asset there is, since the traffic
arrives and gets forwarded through WhatsApp.

Every claim on the card is READ OUT OF `data/unibaData.ts`, not typed here. The fee table
is the contract for this project and a share card is exactly the kind of asset that goes
stale silently: nobody looks at it, so nobody notices it lying. If a figure moves in the
data and this is re-run, the card follows. If a field this depends on is renamed, the
script aborts instead of quietly rendering a blank.

Type is Geist and Instrument Serif, pulled from the woff2 files `next/font` has already
downloaded for the site, so the card is set in the same faces the page is.
"""

import glob
import re
import sys
from pathlib import Path

from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont

sys.path.insert(0, str(Path(__file__).resolve().parent))
import importlib.util

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data" / "unibaData.ts"
OUT_IMG = ROOT / "app" / "opengraph-image.jpg"
OUT_ALT = ROOT / "app" / "opengraph-image.alt.txt"

W, H = 1200, 630
NAVY = (15, 44, 89)
SKY_DEEP = (3, 105, 161)
INK_SOFT = (15, 44, 89, 175)


def read_facts() -> dict:
    """Pull the campaign numbers out of the content contract, or refuse to run."""
    src = DATA.read_text(encoding="utf-8")

    def one(pattern, label):
        m = re.findall(pattern, src)
        if len(m) != 1:
            raise SystemExit(
                "abort: expected exactly one %s in unibaData.ts, found %d. The contract "
                "moved; fix this script rather than shipping a card that guesses."
                % (label, len(m))
            )
        return m[0]

    lines = one(r"lines:\s*\[\s*\"([^\"]+)\",\s*\"([^\"]+)\"\s*\]", "campaignTagline.lines")
    return {
        "line1": lines[0],
        "line2": lines[1],
        "down": int(one(r"downPayment:\s*([\d_]+)", "paymentScheme.downPayment").replace("_", "")),
        "pendaftaran": int(one(r"pendaftaran:\s*([\d_]+),\n\s*spi:", "feeGroups[].pendaftaran").replace("_", "")) if False else None,
        "wave": one(r'name:\s*"(Gelombang[^"]+)"', "promoPeriod.name"),
        "end": one(r'endDate:\s*"([\d-]+)"', "promoPeriod.endDate"),
    }


def waived_total(src: str) -> int:
    """Pendaftaran + SPI, taken from the first fee group like the Hero does."""
    p = re.search(r"pendaftaran:\s*([\d_]+),\s*\n\s*spi:\s*([\d_]+),", src)
    if not p:
        raise SystemExit("abort: could not read pendaftaran/spi out of feeGroups")
    return int(p.group(1).replace("_", "")) + int(p.group(2).replace("_", ""))


def rupiah(n: int) -> str:
    return "Rp" + f"{n:,}".replace(",", ".")


# Every character the card can print. Faces are chosen by whether they cover this, not
# by name: next/font splits each family into unicode-range subsets, and picking the first
# file whose name matches gets you a Cyrillic or Vietnamese slice that renders the whole
# card as tofu boxes. Which is exactly what the first run produced.
REQUIRED = set(
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,:;!?()+-/&'·—"
)

_face_cache: dict = {}


def load_face(family: str, style: str, size: int) -> ImageFont.FreeTypeFont:
    """Find a next/font woff2 that can actually SET this card, and hand PIL a TTF."""
    key = (family, style)
    if key not in _face_cache:
        best, best_cover = None, -1
        for f in glob.glob(str(ROOT / ".next" / "**" / "*.woff2"), recursive=True):
            try:
                t = TTFont(f, lazy=True)
            except Exception:
                continue
            fam = (t["name"].getDebugName(1) or "").lower()
            sub = (t["name"].getDebugName(2) or "").lower()
            if family.lower() not in fam or style.lower() != sub:
                continue
            cmap = set(t.getBestCmap().keys())
            cover = sum(1 for ch in REQUIRED if ord(ch) in cmap)
            if cover > best_cover:
                best, best_cover = f, cover

        if best is None:
            raise SystemExit(
                "abort: %s %s not found in .next. Run `npx next build` first so next/font "
                "has downloaded the faces this card is set in." % (family, style)
            )
        if best_cover < len(REQUIRED):
            missing = len(REQUIRED) - best_cover
            raise SystemExit(
                "abort: the best %s %s subset is missing %d of the characters this card "
                "prints. Rendering it would produce tofu." % (family, style, missing)
            )

        out = ROOT / ".font-cache" / ("%s-%s.ttf" % (family.replace(" ", ""), style))
        out.parent.mkdir(exist_ok=True)
        t2 = TTFont(best)
        t2.flavor = None
        t2.save(out)
        _face_cache[key] = out

    return ImageFont.truetype(str(_face_cache[key]), size)


def main() -> int:
    src = DATA.read_text(encoding="utf-8")
    f = read_facts()
    waived = waived_total(src)

    spec = importlib.util.spec_from_file_location("sky", ROOT / "scripts" / "make-sky.py")
    sky = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(sky)
    card = Image.fromarray(
        (sky.render(W, H, sky.SEED, base=3) * 255).round().astype("uint8"), "RGB"
    ).convert("RGBA")

    d = ImageDraw.Draw(card)

    logo = Image.open(ROOT / "public" / "logo-uniba.png").convert("RGBA")
    logo.thumbnail((74, 74), Image.LANCZOS)
    card.alpha_composite(logo, (72, 56))

    mark = load_face("Geist", "Regular", 27)
    d.text((160, 66), "UNIBA", font=mark, fill=NAVY)
    wm = d.textlength("UNIBA ", font=mark)
    d.text((160 + wm, 66), "Surakarta", font=mark, fill=SKY_DEEP)

    eyebrow = load_face("Geist", "Regular", 20)
    end = f["end"]
    months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli",
              "Agustus", "September", "Oktober", "November", "Desember"]
    y, m, dd = (int(x) for x in end.split("-"))
    closes = "%d %s %d" % (dd, months[m - 1], y)
    d.text((72, 178), ("%s  ·  Ditutup %s" % (f["wave"], closes)).upper(),
           font=eyebrow, fill=SKY_DEEP)

    head = load_face("Geist", "Regular", 74)
    accent = load_face("Instrument Serif", "Italic", 78)
    d.text((72, 218), f["line1"], font=head, fill=NAVY)
    d.text((72, 306), f["line2"], font=accent, fill=SKY_DEEP)

    deck = load_face("Geist", "Regular", 31)
    d.text((72, 424), "Mulai kuliah cukup %s" % rupiah(f["down"]), font=deck, fill=NAVY)

    proof = load_face("Geist", "Regular", 24)
    d.text((72, 482), "Gratis Uang Gedung  ·  Potongan %s (Pendaftaran + SPI)" % rupiah(waived),
           font=proof, fill=(15, 44, 89, 170))

    d.text((72, 546), "daftaruniba.site", font=proof, fill=SKY_DEEP)

    card.convert("RGB").save(OUT_IMG, "JPEG", quality=88, optimize=True, progressive=True)

    alt = ("%s UNIBA Surakarta — mulai kuliah cukup %s, gratis uang gedung, "
           "potongan %s. Ditutup %s." % (f["wave"], rupiah(f["down"]), rupiah(waived), closes))
    OUT_ALT.write_text(alt + "\n", encoding="utf-8")

    print("wrote %s  %dx%d  %.1f KB" % (OUT_IMG.relative_to(ROOT), W, H,
                                        OUT_IMG.stat().st_size / 1024))
    print("wrote %s" % OUT_ALT.relative_to(ROOT))
    print("  " + alt)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
