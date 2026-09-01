from PIL import Image
import numpy as np

SRC = r"C:\Users\Win11\Downloads\Batik_ornament_vector_banner_2K_202608251445.jpeg"
im = Image.open(SRC).convert("RGB").resize((1400, 1400), Image.LANCZOS)
a = np.asarray(im).astype(np.float32) / 255.0

# Ink coverage: distance from white. White ground -> 0, gold motifs -> high.
d = 1.0 - a.min(axis=2)

# Alpha ramp. The floor kills JPEG noise in the white ground; the ceiling makes
# both gold tones fully solid so the result keeps its flat-vector look.
alpha = np.clip((d - 0.045) / 0.33, 0.0, 1.0)

# Tone split: the source's darker gold is the primary motif, the tan is secondary.
t = np.clip((d - 0.45) / 0.35, 0.0, 1.0)[..., None]

def build(primary, secondary, out_name):
    p = np.array(primary, dtype=np.float32) / 255.0
    s = np.array(secondary, dtype=np.float32) / 255.0
    rgb = s * (1.0 - t) + p * t
    out = np.concatenate([rgb, alpha[..., None]], axis=2)
    Image.fromarray((out * 255).round().astype(np.uint8), "RGBA").save(out_name, optimize=True)
    return out_name

# Light slides keep the on-white palette from the design system.
build((0xC9, 0x92, 0x2F), (0xD9, 0xB5, 0x7A), "batik-light.png")
# Navy slides: bright gold leads so it glows against #123A7E.
build((0xFF, 0xC2, 0x20), (0xC9, 0x92, 0x2F), "batik-navy.png")

cov = float((alpha > 0.5).mean())
print(f"ink coverage: {cov:.1%}")
print(f"alpha: min={alpha.min():.2f} max={alpha.max():.2f} mean={alpha.mean():.2f}")
