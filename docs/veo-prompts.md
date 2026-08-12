# RIO video prompts (Google Flow, image-to-video)

Seed image: `docs/assets/rio-seed.jpg` (2048x2048, RIO on white).
Output goes in `public/veo/`. The site picks the files up with no code change.

These are **image-to-video** prompts. Do not paste them into text-to-video. The whole point
is that the footage starts from the real RIO render, so it is genuinely UNIBA rather than a
generic campus a model invented.

## Settings in Flow

| Setting | Value |
|---|---|
| Mode | Image to video, start frame = `rio-seed.jpg` |
| Aspect ratio | 16:9 |
| Length | 8s |
| Motion strength | Low |
| Audio | Ignore, the site plays video muted always |

## Art direction

Premium university modern. The reference is a flagship product film, not a mascot cartoon:
studio sweep instead of scenery, soft key with gold rim separation, shallow depth of field,
and a camera that moves slowly because confidence reads as stillness. One idea per clip.

The batik pattern on the wings is lit as material and texture, the way a watch bezel is lit.
It is not the story.

## Four rules that matter more than the wording

1. **Move the camera, not RIO.** Image-to-video holds a subject best when the subject stays
   still and the camera does the work. Asking RIO to walk or wave invites limb warping.
2. **Never let it regenerate text.** The book already reads UNIBA SURAKARTA in the seed. Every
   prompt says preserve it. If you ask a model to render lettering it produces garbage.
3. **Loopable.** One continuous move, first and last frame close, or the 8s cut visibly jumps.
4. **Check RIO stayed on model.** Compare the output to the seed. If the beak, cap or wing
   motif deform, lower motion strength or shorten the move. An off-model RIO is worse than no
   video, because RIO is brand IP.

---

## Clip 1: `hero.mp4` (produce this one first)

Verify the navy relight works here before spending time on clips 2 and 3.

```
Slow cinematic orbit around the character. The camera arcs gently about 20 degrees to the
right at eye level, nothing else moves. Keep the character perfectly still, centred, and
identical in proportion, colour and design to the source image.

Replace the plain white background with a deep navy studio seamless sweep: rich indigo behind
the subject falling off to near-black at the frame edges. Large soft key light from the upper
left, and a warm gold rim light along the right edge of the silhouette separating it from the
background. Subtle specular highlights travelling across the graduation cap and the gold trim.

Shallow depth of field, background softly defocused, shot on a cinema prime lens. Premium
collectible product film. Calm, restrained, expensive.

Preserve the existing lettering on the book exactly as it appears in the source image. Do not
regenerate, translate or alter any text. No added objects, no sparkles, no confetti, no
character limb movement, no expression change. Seamless loop: first and last frame nearly
identical.
```

## Clip 2: `rio-book.mp4`

The credibility beat. Candidate for the final CTA band or a future `/rpl` slot.

```
Very slow push-in toward the character, starting at a three-quarter view and settling on the
book held at chest height. Rack focus: the face begins slightly soft and the book comes into
crisp focus as the camera arrives. The character does not move.

Deep navy studio seamless background, soft key from the upper left, gold rim light on the
silhouette edge. Shallow depth of field throughout, cinema prime lens, gentle falloff.

Preserve the existing lettering on the book exactly as it appears in the source image. Do not
regenerate or alter any text. No added objects, no sparkles, no limb movement. Loopable, first
and last frame close.
```

## Clip 3: `rio-detail.mp4`

Texture only, no face. Lowest risk of the three and the most reusable.

```
Macro drift across the surface of the character's graduation cap and the gold trim of the
gown, so close that the face is out of frame. The camera glides slowly left to right while
specular highlights travel over the edges and the woven pattern on the wing catches light.
Nothing else moves.

Deep navy environment, single soft key from the upper left with a warm gold accent. Extremely
shallow depth of field, macro cinema lens, fine surface detail and material realism.

No text anywhere in frame. No added objects, no sparkles. Seamless loop, first and last frame
nearly identical.
```

---

## After generating

1. Put the MP4 in `public/veo/` using the exact filenames above. `hero.mp4` is the only slot
   wired today; the hero falls back to the batik ground until it exists, so nothing breaks
   while you work through the clips.
2. Optional but worth it: also export WebM, and a JPEG still as `hero-poster.jpg`. The
   component already prefers WebM and shows the poster while the clip loads.
3. Keep each file under roughly 2 MB. The clip only loads when it scrolls near the viewport,
   but this is a landing page bought with ad spend, and a heavy hero costs conversions on
   mobile.

If a clip comes out oversized or the navy relight fails, send it over. `ffmpeg` is available
locally for compression and WebM export, and if the relight cannot be made to work the slot
can move to a light section instead.
