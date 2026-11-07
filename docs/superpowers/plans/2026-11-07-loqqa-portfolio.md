# Loqqa Destination Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Loqqa as the first destination of the portfolio: a neon stellar-nursery billboard in space and a five-part project page, with the About copy updated for a third app.

**Architecture:** A new `nebula: true` destination type, rendered like the existing sun and black hole: one camera-facing 64×64 billboard (`HOLE_VS` + a new `NEBULA_FS`) branched in `createSpace`. All copy goes in `src/content.js` as `PROJECTS[0]`. Nothing else in the renderer changes unless the performance fallbacks in Task 1 are needed.

**Tech Stack:** Vite 5, React 18, three.js 0.160 (hand-written GLSL). No test runner exists. Verification is `npm run build` plus checks in the in-app browser against the dev server.

**Spec:** `docs/superpowers/specs/2026-11-07-loqqa-portfolio-design.md`. Read it first; the page's substance and the anti-goals live there.

## Global Constraints

- Route order after this change: **Loqqa → Phase6 → Unload → Blaulichtschule → PlanetPop → Traqa** (Loqqa is `PROJECTS[0]`).
- Loqqa's tint is `#dfff1f`, used everywhere the tint is used. No other new colours, except the nebula's blue/teal edges and white-hot core from the reference shader.
- Loqqa is iOS only. Use the App Store link `https://apps.apple.com/app/id6826156839` with label `App Store` and the default `external` icon. No Play Store link.
- No invented facts. Every claim on the page traces to `~/Desktop/lifting-app` or to the spec. Don't claim PostHog funnels are built. Write the build numbers as floors (e.g. "700+").
- No rating, quote, funnel or waffle block on Loqqa's page, and no `media`.
- The `content.js` header rules apply: `[[highlight]]` syntax, never one chart directly after another, and a list opens and closes with a sentence.
- Mark the opening paragraph and the "what building with Claude Code was like" sentences for Timo's rewrite. Collect them in the final report rather than leaving comments in the shipped copy.
- Commits go on the current branch `claude/lifting-app-portfolio-9fa546`. Don't push without Timo's go-ahead.

## Review Focus

1. **Old deep links after the index shift.** `/#phase6`, `/#unload` and `/#traqa` must still open their own destination, now at index +1; no hash must land on Loqqa. Task 4 step 2 tests this.
2. **Landing on a phone.** On a narrow portrait screen at pixel ratio 1 (coarse pointer), the cloud must be framed and smooth, not cut off by the screen edge and not stuttering. Task 1 step 6 tests this.
3. **Warping back to Loqqa.** Flying back from Phase6 to Loqqa at full speed must not blow the nebula out under the warp's bloom. `uSpeed` compensation is the fix. Task 1 step 5 tests this.
4. **Hover over the billboard's empty corners.** The raycast hits the whole 64×64 plane. Any hover brightening must stay subtle enough that hovering empty sky near the cloud doesn't look broken. Task 1 step 5 tests this.
5. **The About page and the black-hole lens.** The new `detail` copy must render within the About layout on mobile. `holeScreen()` must still find Unload, now at index 2. Task 4 step 3 tests this.

---

### Task 1: The nebula destination type

**Files:**
- Modify: `src/space/shaders.js`: add `export const NEBULA_FS` after `SUN_FS`.
- Modify: `src/space/scene.js`: import `NEBULA_FS`; create `nebulaMat` next to `sunMat` (around line 66); add a `n.nebula` branch in `galaxies` before the `n.star` branch (around line 75); change `arrival()`'s `fx` (line 19) to `nodes[i].blackhole || nodes[i].star || nodes[i].nebula`.
- Modify: `src/content.js`: add the Loqqa entry as `PROJECTS[0]` with every field final except `tagline` and `sections`. Those get a one-line placeholder that Task 2 replaces: tagline `'Loqqa'`, sections `[{ text: true, body: 'Draft.' }]`.

**Interfaces:**
- Produces: `NEBULA_FS`, a fragment shader string with the same uniform contract as `SUN_FS`: `uTime`, `uSpeed`, `uFade`, `uHov`, `varying vec2 vUv` from `HOLE_VS`. Output is `gl_FragColor = vec4(tonemapped premultiplied colour * edge * comp * uFade, alpha * uFade)`.
- Produces: a node flag `nebula: true` that `createSpace` and `arrival` honour. The `galaxies` entry for it is `{ mesh, glow, center, phase, nebula: true, fx: nebulaMat }`. Leave out `noHover` unless step 5 shows hover looks wrong.
- Produces: `PROJECTS[0]`, with these exact fields:
  ```js
  { id: 'loqqa', meta: ['Independent project', '2026', 'Founder', 'Team of 1', '1 month'],
    kind: 'Independent · 03', title: 'Loqqa', tint: '#dfff1f', nebula: true,
    links: [{ url: 'https://apps.apple.com/app/id6826156839', label: 'App Store' }],
    tagline, sections, stack: [ 'React Native', 'Expo', 'TypeScript', 'Supabase', 'PowerSync',
      'SQLite', 'Drizzle', 'PostHog', 'RevenueCat', 'OpenAI', 'Claude Code' ].map(title => ({ title })) }
  ```
  Write `stack` as literal `{ title }` objects, the way the other entries do.

- [ ] **Step 1: Port the reference shader.** The look Timo picked is the `nebula` entry in `.superpowers/brainstorm/9783-1794057977/content/space-object-v2.html`: domain-warped fbm gas, dust lanes, six young stars with diffraction spikes. Port it into `NEBULA_FS` with `vec2 p = vUv * 1.1;` as the site's other billboards do. Make these changes from the reference, all of which the spec requires:
  - **Centre the mass:** offset the warp's input, or weight the falloff, so the densest gas and the brightest stars sit within `r < .15` of the centre.
  - **Fade out inside the billboard:** multiply by `edge = smoothstep(.55, .35, r)`.
  - **Warp compensation:** multiply by `comp = 1. / ((1. + uSpeed * .6) * (1. + uSpeed * .185))`.
  - **Hover:** brighten by `(1. + .15 * uHov)`.
  - **Alpha:** keep it at roughly 0 for the gas and the stars' cores, so the sky shows through.
  - **Star positions:** fixed via `hash(vec2(i, k))`, as in the reference, not random per load.

- [ ] **Step 2: Wire it into the scene.** `nebulaMat` uses the same `ShaderMaterial` options as `sunMat` (custom blending, `depthTest: false`). Its uniforms are `{ uTime: shared.uTime, uSpeed: shared.uSpeed, uFade: { value: 0 }, uHov: { value: 0 } }`. The branch mirrors the `n.star` branch, with the glow sprite colour `'#dfff1f'`. Then add the Loqqa entry from the Interfaces block to `content.js`.

- [ ] **Step 3: Build.**
  Run: `npm run build`
  Expected: exits 0 with `✓ built in`. The existing three.js chunk-size warning is expected.

- [ ] **Step 4: Check the landing in the browser.** Create `.claude/launch.json` with a `dev` configuration (`npm run dev`, port 5173). Open it with `preview_start`, load `/`, wait 3 s and take a screenshot.
  Expected: the camera arrives at a centred neon nebula, with the "Independent · 03 / Loqqa" card below it. There are no console errors (`read_console_messages` with `onlyErrors`) and no visible square edge on the billboard.

- [ ] **Step 5: Check warp-back and hover.** Warp to Phase6 by setting `location.hash = "phase6"` (or clicking its nav dot), wait for arrival, then set `location.hash = "loqqa"` to warp back. Take screenshots during the warp and on arrival. Then move the pointer over an empty corner of the billboard area, and over the cloud.
  Expected: the nebula is never blown out to a white blob mid-warp. Hover brightening is subtle and doesn't flash on empty sky. If it does, set `noHover: true` on the entry and note why in the commit.

- [ ] **Step 6: Measure performance.** Run this in the page:
  `await new Promise(r => { let n = 0, t0 = performance.now(); const f = () => (++n, performance.now() - t0 < 5000 ? requestAnimationFrame(f) : r(n / 5)); requestAnimationFrame(f); })`
  Run it on `/` and on `/#phase6` at desktop size. Then switch to the `mobile` preset, reload, and repeat both.
  Expected: Loqqa's fps is within 5 fps of Phase6's in both sizes. On mobile the cloud is framed inside the portrait screen. If either fails, apply the spec's fallbacks in order and re-measure after each:
  1. fewer octaves in the warp layers (add an `fbm3` with 3 octaves);
  2. a half-resolution render target composited in `post.js`;
  3. bake the gas into a texture once.

  Don't simplify the warping without asking Timo. Reset the viewport with the `desktop` preset afterwards.

- [ ] **Step 7: Commit.**
  ```bash
  git add src/space/shaders.js src/space/scene.js src/content.js .claude/launch.json
  git commit -m "Loqqa as the first destination: a neon stellar nursery"
  ```

### Task 2: Loqqa's page copy

**Files:**
- Modify: `src/content.js`: Loqqa's `tagline` and `sections`.

**Interfaces:**
- Consumes: the `PROJECTS[0]` entry from Task 1, and the section types documented in `content.js`'s header (`text`, `list`, `numbers`).

- [ ] **Step 1: Recount the figures.** In `~/Desktop/lifting-app` on `main`, run:
  - `git rev-list --count HEAD`
  - `git log --format=%b | grep -c "Co-Authored-By: Claude"`
  - `git log --reverse --format=%ad --date=short | head -1`
  - `git ls-files 'src/*.ts' 'src/*.tsx' | xargs cat | wc -l`

  Expected: about 715 / 710 / `2026-10-08` / about 50.7k. Turn them into floors: "700+ commits", "all but a handful" or the exact share co-authored with Claude, and "50,000+ lines of TypeScript". Say in the copy that the line count is the app's code.

- [ ] **Step 2: Write the sections.** Use this order and these types; the substance of each is in the spec under "The page":
  1. `text`: why it exists. First person; spreadsheets; coming back from the runner's knee; "what to do next" and "where you stand".
  2. `text` or `list`: what it does, short.
  3. `numbers`: the build figures, each in `[[ ]]`.
  4. `text`: building with Claude Code day to day, plus the Blaulichtschule contrast without quoting it.
  5. `list`: the third try. Give it a `lead` and an `after`; the two items are Unload → analytics events, error tracking and RevenueCat on the same PostHog person, and Traqa → coach tools, clamped plans and the eval suite.
  6. `text`: local-first, as the closing paragraph.

  Then write a one-sentence tagline built on "where you stand / what to do next". Read the Unload and Traqa entries first and match their voice, length and `[[highlight]]` density (one or two per paragraph). The `numbers` section isn't a chart, but don't put it directly after another chart-type section anyway.

- [ ] **Step 3: Check every claim against its source.** Go sentence by sentence. Each fact must trace to the spec, Timo's words in the spec, or a file or commit in `~/Desktop/lifting-app`: `supabase/functions/_shared/coach/tools.ts`, `generate-plan/generate.ts`, `_shared/numbers.ts`, `_shared/coach/eval/`, `src/features/paywall/lib/revenuecat-purchases.ts`, `src/shared/lib/posthog.ts`, `powersync/`, and the commit "download exercise images ahead of time for offline use".
  Expected: every sentence traces; delete any that don't.

- [ ] **Step 4: Read the page in the browser.** Run `npm run build`, then open `/#loqqa` in the dev server and open the page with Enter. Use `get_page_text` to read it all, and take screenshots at desktop size and at the `mobile` preset.
  Expected: all six sections render in order, the highlights show in neon, the App Store link shows as a dashed "App Store" link, and the `meta` rows read Type / When / Role correctly.

- [ ] **Step 5: Commit.**
  ```bash
  git add src/content.js
  git commit -m "Loqqa's page: why it exists, a month with Claude Code, the third try, local-first"
  ```

### Task 3: About copy, docs and housekeeping

**Files:**
- Modify: `src/content.js`:
  - `ABOUT.detail`: becomes "Three iOS apps of my own, one of them to 12,000 sign-ups. In the space view, the galaxies are client work; the black hole, the sun and the nebula are mine." Keep the existing wording otherwise.
  - The header comment: after the `blackhole ·` line, add `//   nebula    · render this destination as a stellar nursery instead of a particle galaxy`.
- Modify: `README.md`: the intro sentence that lists "a particle galaxy, a black hole or a sun" also names the nebula.
- Modify: `.gitignore`: add `.superpowers/`.

- [ ] **Step 1: Make the three edits above.**
- [ ] **Step 2: Build and check.** Run `npm run build` (expect exit 0), then open the About page in the browser at desktop size and at the `mobile` preset.
  Expected: the new `detail` line renders and wraps cleanly.
- [ ] **Step 3: Confirm the ignore works.** Run `git status --short`.
  Expected: no `.superpowers/` entries.
- [ ] **Step 4: Commit.**
  ```bash
  git add src/content.js README.md .gitignore
  git commit -m "About and docs: three apps, and the nebula"
  ```

### Task 4: Whole-site check

**Files:** none. Verification only.

- [ ] **Step 1: Build.** Run `npm run build`. Expected: exit 0.
- [ ] **Step 2: Check the deep links.** In the dev server, load each of `/#loqqa`, `/#phase6`, `/#unload`, `/#blaulichtschule`, `/#planetpop` and `/#traqa`. After each, read the arrival card's title with `find` "Open".
  Expected: each card names its own project, and `/` with no hash names Loqqa.
- [ ] **Step 3: Fly the whole route.** Starting from `/`, travel forward five times and back five times with the scroll wheel (`computer` scroll, one tick per warp, waiting for each arrival), taking a screenshot on each arrival.
  Expected:
  - The order is Loqqa, Phase6, Unload, Blaulichtschule, PlanetPop, Traqa, and back.
  - Unload's black hole still lenses the stars behind it.
  - The nav dock shows six dots, the first one neon.
  - There are no console errors.
- [ ] **Step 4: Report to Timo.** List:
  - the copy marked for his rewrite (the opening paragraph and the Claude Code sentences), quoted;
  - the fps numbers from Task 1 step 6, and any fallback that was applied;
  - that the branch is committed but not pushed.
