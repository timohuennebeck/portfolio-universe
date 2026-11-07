# Loqqa in the portfolio — design

Date: 2026-11-07 · Status: draft, awaiting Timo's approval

## Intent

Loqqa is Timo's third iOS app, a workout logger built in October 2026 and about to go live in the App Store
(it has an App Store ID but is not released or marketed yet). It goes into the portfolio as a new destination, and as the **first** one: it
is the newest, most current thing Timo has made, and the clearest answer to "how do you work with
AI?" — the question a 2026 reader is most likely to bring.

The page is about **a product**, not about AI tooling. It opens on why Loqqa exists, the way every
other page opens on a real moment (Traqa's knee, Unload's 2 a.m.). How it got built — a month,
with Claude Code — is the main thread after that.

## Goals

- Loqqa is destination #1 on the route; visitors land on it.
- It has its own look in space, distinct from the galaxies (client work), the black hole (Unload)
  and the sun (Traqa): a **stellar nursery** — a nebula with young stars forming inside it.
- Its page tells, in order: why it exists → built in a month with Claude Code → the lessons from
  Unload and Traqa, applied → local-first engineering.
- The site's About copy stays true with three apps instead of two.

## Non-goals

- No launch numbers, funnel, rating or quote block — there are no real numbers yet. Add them later
  as a separate change once they exist.
- No hero image or screenshots on this pass (`media` stays unset).
- No changes to the other destinations' pages, or to the renderer beyond what the nebula needs.

## Anti-goals (would make this a failure even if it works)

- The page reads as an AI-tools demo or a Claude ad rather than a product Timo made.
- Any invented fact: a feeling, a number, a user quote Timo didn't give. Every claim on the page
  traces back to the app repo (`~/Desktop/lifting-app`) or to Timo's own words in this design.
- The nebula reads as just another galaxy, or as an off-centre smudge that is hard to frame on
  arrival.
- The landing experience gets slower or janky — the nebula is the first thing every visitor's GPU
  draws.

## Decided

### Position

`PROJECTS[0]` in `src/content.js`. New route order:
**Loqqa → Phase6 → Unload → Blaulichtschule → PlanetPop → Traqa.**
`routePosition(i)` is index-based, so every other destination shifts one slot; that is accepted.
Deep links are by `id`, so `/#phase6` etc. keep working. Phase6 loses the landing spot on purpose.

### Data entry

```js
{ id: 'loqqa',
  meta: ['Independent project', '2026', 'Founder', 'Team of 1', '1 month'],
  kind: 'Independent · 03',          // own apps numbered chronologically: Unload 01, Traqa 02
  title: 'Loqqa',
  tint: '#dfff1f',                   // Loqqa's brand accent (lifting-app src/global.css --color-accent)
  nebula: true,                      // new destination type, alongside star / blackhole
  links: [{ url: 'https://apps.apple.com/app/id6826156839', label: 'App Store' }],  // icon: default 'external'
  tagline: '…', sections: [ … ], stack: [ … ] }
```

The App Store link goes in now even though the app isn't marketed yet — Timo's call.
Loqqa launches on **iOS only** (Timo, 7 Nov) — the `android/` folder in the app repo is not a
release. So: "third iOS app" in the About copy, App Store link only, no Play Store link. If Android
ships later, that is a separate change.

### In space: the stellar nursery

A new `nebula: true` destination type, rendered as a billboard like the sun and the black hole
(`HOLE_VS` + a new `NEBULA_FS` in `src/space/shaders.js`, a branch in `createSpace` in
`src/space/scene.js`). Reference implementation — the version Timo picked — is shader **D** in
`.superpowers/brainstorm/9783-1794057977/content/space-object-v2.html`:

- Domain-warped fbm gas, blue/teal at the thin edges, Loqqa neon where it is dense, a white-hot
  core where it is densest.
- Dark dust lanes cutting through it.
- About six young stars inside, each with a four-point diffraction spike and a gentle twinkle.
- Slow drift; nothing fast.

Changes from the brainstorm version (builder's call to tune, intent fixed):
- **Centred** on the destination: the brainstorm version's mass sits right of centre. On arrival
  the bulk of the cloud and the brightest stars should sit where the camera aims, like the sun.
- **Contained**: fades to nothing inside the billboard (use the existing `edge` falloff pattern),
  so there is no hard square edge, at any orbit angle.
- **Same contract as the sun/hole shaders**: `uTime`, `uSpeed` (divide out the warp bloom/exposure
  boost the way they do), `uFade` (distance fade), `uHov`, and premultiplied output with alpha.
  Gas is additive (alpha ≈ 0) so the sky shows through.
- Hover: a gentle brightening on `uHov` like the black hole — not `noHover` like the sun — unless
  that fights the frame loop; builder's call.
- Performance *(my call — Claude)*: the bar is no visible drop from today's landing on Phase6 —
  steady 60 fps on an Apple-silicon MacBook at the `balanced` setting, and no stutter on an
  iPhone-class phone at pixel ratio 1 (check with the browser's mobile emulation and, if possible,
  a real phone). Shader D calls fbm about six times per pixel; fallbacks, in this order:
  (1) fewer octaves in the warp layers (they're blurry anyway); (2) render the nebula into a
  half-resolution target and composite it; (3) bake the gas once into a texture, as the sky is
  baked, and animate only drift, twinkle and stars. Simplifying the warping itself (which changes
  the look) only after asking Timo.

Glow sprite colour for the type: neon-tinted, mirroring how the sun uses `#ffb066`.

### The page

Order and substance are fixed; the prose is drafted by the builder, in the voice of the existing
pages (first person, plain, specific, `[[highlights]]` on the key phrase per paragraph), and
reviewed by Timo before it ships. Keep the existing rules in `content.js`'s header comment (text
between charts, lists open and close with a sentence).

1. **Why it exists** (`text`). Timo lifted and tracked his training in spreadsheets. Coming back
   from the runner's knee (the injury on Traqa's page), he had all the data and no idea where he
   stood — which lifts were moving, which muscles he was skipping, whether months of training had
   paid off. Loqqa is the app he wanted then: AI-first, holding everything about your training,
   and doing two things with it — **telling you what to do next** (sets, reps, weight) and
   **showing you where you stand** (a recap over weeks and months: where you're progressing, where
   you're missing out). For anyone coming back after an injury, or not yet happy with their
   results.
2. **What it does** (`text` or `list`, short). Import your history in one step — a spreadsheet, or
   a Hevy or Strong export — so you don't start from zero; sets per muscle over 7–90 days; Kai, the
   AI coach, for the suggestions and the questions; say your plan instead of typing it; seven
   languages. Keep this short — it serves the why, it is not a feature tour.
3. **Built in a month, with Claude Code** (`numbers` then `text`). Figures from the repo's git
   history: first commit **8 October 2026**, ready for the App Store by **early November** (not
   yet released — phrase it so it stays true after release). Commit and line counts keep moving
   (715 commits, 710 co-authored with Claude on 7 Nov), so *(my call — Claude)*: recount from
   `main` of `~/Desktop/lifting-app` while implementing and write them as floors that stay true
   as the repo grows — e.g. "700+ commits, all but a handful co-authored with Claude" and
   "50,000+ lines of TypeScript" (app code under `src/` is ~50.7k; ~60k only with tests and
   Edge Functions — use whichever definition, and say which). Then what that actually
   meant day to day — *this paragraph needs Timo's own words or a review* (see "Left to the
   builder"). Contrast, without repeating it: Blaulichtschule's rewrite was "four people and a lot
   of hours, before AI assistants" — Loqqa is one person, a month, and an AI pair.
4. **The third try** (`list`). What Unload and Traqa taught, applied here:
   - Unload: "I never mapped the flows… no crash reporting" → Loqqa had the analytics events its
     funnels need and PostHog error tracking in before launch, with RevenueCat purchases tied to
     the same PostHog person (`$posthogUserId`, commit 03daf751). Don't claim the funnels
     themselves are built — they live in PostHog and the repo can't show them.
   - Traqa: the LLM produced "confident nonsense" plans → Loqqa's coach never does the maths
     itself: the numbers come from tools in code that it quotes rather than computes, every plan
     the model writes is clamped to sensible sets/reps/rest before the app takes it, and the coach
     has its own eval suite. (Sources: `supabase/functions/_shared/coach/tools.ts`,
     `generate-plan/generate.ts`, `_shared/numbers.ts`, `_shared/coach/eval/`.)
5. **Local-first** (`text`, closing). Every set is written to SQLite on the phone first and synced
   through PowerSync to Supabase afterwards, and exercise images are downloaded ahead of time, so
   logging never waits on gym Wi-Fi. Picks up Traqa's "hard-won respect for offline-first work".
   This is the page's last word — no rating/quote block yet.

`stack`: React Native, Expo, TypeScript, Supabase, PowerSync, SQLite, Drizzle, PostHog,
RevenueCat, OpenAI, Claude Code.

Tagline: one sentence in the style of the others, built on the why (e.g. the training log that
tells you where you stand and what to do next), mentioning the month only if it fits.

### About copy (`ABOUT` in `content.js`)

- `detail`: "Two iOS apps of my own, one of them to 12,000 sign-ups" → three; and "the black
  hole and the sun are mine" → "the black hole, the sun and the nebula are mine" (or equivalent).
- `intro` unchanged.

### Housekeeping

- Add `.superpowers/` to `.gitignore` (brainstorm files live there).
- README's "Where things live" and `content.js`'s header comment: document `nebula` alongside
  `star` / `blackhole`.

## Left to the builder

- Exact shader constants, scale and framing distance (`arrival()` already frames billboards the
  same way; adjust only if the nebula needs it).
- All page prose and the tagline, within the substance above — flagged for Timo's review.
- Whether section 2 is a `text` or a `list`.
- The `[[highlight]]` choices.

## Open for Timo to confirm in review (not blocking the plan)

- The opening paragraph speaks for Timo in the first person (spreadsheets, coming back from the
  runner's knee). He confirmed the gist; the wording must be checked by him.
- Section 3 needs one or two sentences on what building with Claude Code was actually like for
  him (what he did, what Claude did, what surprised him). Draft from the repo if needed, marked
  for his rewrite.
