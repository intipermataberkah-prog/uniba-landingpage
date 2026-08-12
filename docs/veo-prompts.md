# Veo prompts for daftaruniba.site (Google Flow)

Generate these in Google Flow, then drop the files into `public/veo/`.
The site requests them already. If a file is missing the hero simply renders the
batik ground instead, so nothing breaks while you are still producing them.

## Settings to use in Flow

| Setting | Value | Why |
|---|---|---|
| Aspect ratio | **16:9** | The site crops with `object-cover`, so keep the subject centred and give the edges room to be cut on mobile portrait. |
| Length | **8s** | The slot loops. Longer clips cost bandwidth for no gain. |
| Audio | **Off / ignore** | The page plays video muted, always. Anything Veo generates on the audio track is discarded. |
| Motion | **Slow** | See the looping rule below. |

## Four rules that matter more than the prompt wording

1. **Never ask for on-screen text, signage, banners or logos.** Generative video
   renders lettering as garbled pseudo-text, and a fake sign on what claims to be
   a real campus is a misrepresentation problem, not just an ugly one.
2. **No recognisable faces held in close-up.** Use mid and wide shots, figures
   from behind, over-shoulder, hands, silhouettes. You are not licensed to imply
   a specific real person endorses the university.
3. **Make it loopable.** Ask for one slow continuous move and have the first and
   last frame land on similar framing. A clip that ends somewhere far from where
   it started will visibly jump every 8 seconds.
4. **Do not depict a specific real building as UNIBA** unless you filmed it.
   Keep architecture generic or abstract.

## Prompt 1: hero background (wire this one first)

Save as `public/veo/hero.mp4`. This is the only slot currently wired.

```
Slow cinematic push-in across a sunlit Indonesian university courtyard in the
late afternoon, shot on 35mm with a shallow depth of field. Warm golden light
rakes across textured stone and greenery. Out-of-focus students in modest
smart-casual clothing and hijabs walk through the far background, unrecognisable
and never in close-up. Foreground holds a softly blurred batik textile edge,
deep indigo and gold, moving very slightly in the breeze. Calm, prestigious,
academic mood. Muted navy and warm gold palette. No text, no signage, no logos,
no faces in focus. Locked slow dolly, minimal camera shake, first and last frame
nearly identical for seamless looping.
```

## Prompt 2: kelas malam (for a future slot on /rpl)

Save as `public/veo/kelas-malam.mp4`.

```
Evening interior of a modern Indonesian university classroom, warm practical
lighting against blue dusk through the windows. Adult working students in their
late twenties and thirties, seen from behind and in mid-shot, sit with notebooks
and laptops. One figure in the foreground, shot over the shoulder so the face is
not visible, writes by hand. Quiet focused atmosphere, the feeling of study after
a working day. Shallow depth of field, warm amber key light, deep navy shadows.
No text on screens or whiteboards, no signage, no logos. Very slow lateral dolly,
loopable, first and last frame nearly identical.
```

## Prompt 3: batik detail (abstract, safest option)

Save as `public/veo/batik.mp4`. This one carries the least risk because it shows
no people at all, and it ties directly to the university's identity as
Universitas Islam Batik.

```
Extreme close-up macro of hand-drawn batik kawung fabric, indigo and gold dye on
woven cotton, lit by soft raking window light. The cloth moves almost
imperceptibly. Fine canting wax lines and the interlocking oval kawung motif fill
the frame in crisp detail. Slow drift across the surface revealing the repeating
geometry. Museum-quality, contemplative, premium. Deep navy and antique gold
palette. No hands, no people, no text. Seamless loop, first and last frame nearly
identical.
```

## After you generate

1. Put the MP4s in `public/veo/`.
2. Optional but worth it: also export a WebM, and a single JPEG still as
   `hero-poster.jpg`. The component already prefers WebM and uses the poster
   while the clip loads.
3. Keep each file under roughly 2 MB. The clip loads only when it scrolls near
   the viewport, but this is a landing page bought with ad money and a heavy hero
   costs conversions on mobile.

If the clips come out larger, tell me and I will transcode and compress them.
