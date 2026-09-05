# Portfolio Universe

An interactive 3D portfolio. Each project is a destination in space — a particle
galaxy, a black hole or a sun — and you warp between them along a curved flight
path. Opening a destination fades a reading page in over the scene.

Built with Vite + React and a hand-written three.js renderer (instanced bokeh
stars, a baked procedural sky, two-scale bloom and a gravitational-lens
composite). There is no scene graph library and no post-processing library.

## Running it

```sh
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/
npm run preview  # serve the production build
```

Requires a browser with WebGL. `npm run build` warns that the three.js chunk is
over 500 kB — that is three.js itself, already split into its own chunk, and is
expected.

## Deploying to GitHub Pages

`.github/workflows/deploy.yml` builds and deploys on every push to `main` — no
`gh-pages` branch, no committed `dist/`. One manual, one-time step: in the
repo's **Settings → Pages**, set **Source** to **GitHub Actions**. After that,
every push to `main` publishes automatically; watch it under the repo's
**Actions** tab.

The build is served from `/portfolio-universe/`, not the domain root — see the
conditional `base` in `vite.config.js` — because that's the path a GitHub Pages
project site (as opposed to a `<user>.github.io` user site) is served from.
Deep links use `location.hash` (`/#traqa`), not real paths, so unlike most
single-page apps this needs no 404-redirect trick to work on a static host.

## Where things live

```
index.html                 Fonts, favicon, mount point
src/
  main.jsx                 Entry point
  index.css                Global resets, the gpRise keyframe, hover states
  config.js                Scene knobs: ambience voice, quality, bloom
  content.js               All copy. Edit this to change the portfolio.
  layout.js                The two layout tables (mobile / desktop)
  GalaxyPortfolio.jsx      Stateful shell: renderer, camera, warps, input, frame loop
  components/
    Hud.jsx                Hints, nav dock, About and Sound buttons
    ArrivalCard.jsx        The label under the destination you have arrived at
    Overlay.jsx            The reading surface: About page and project pages
  space/
    scene.js               Sky, star field, one object per destination, hover, culling
    shaders.js             All GLSL
    shapes.js              Galaxy shape generators (spiral, barred, ring, …)
    post.js                Bloom and the composite pass
  audio/ambience.js        Generative Web Audio ambience
design/                    The Claude Design handoff this was built from
```

## Editing the portfolio

Everything a non-developer needs is in `src/content.js`.

**Projects** — `PROJECTS` is an ordered array; the order is the flight route and
the order of the pills in the bottom dock. Per entry:

| field | meaning |
| --- | --- |
| `id` | URL fragment, so `/#traqa` deep-links to that destination |
| `kind`, `title`, `tagline` | shown on the arrival card and the project page |
| `meta` | the mono line under the title, joined with `·` (year · role · team · duration) |
| `stack` | chips under the tagline |
| `github` | optional; the "View on GitHub" pill disappears when absent |
| `media` | caption of the hero slot |
| `sections` | body of the page — see below |
| `tint` | accent colour for the nav dot and the galaxy's core glow |
| `star` / `blackhole` | render this destination as a sun or a black hole instead of a particle galaxy |
| `offset` | nudge from the computed route position, so a destination does not sit behind the previous one |

A galaxy's shape is not configured — it is assigned by position in the array,
cycling through `SHAPE_ORDER` in `src/space/shapes.js`.

`sections` entries take one of three shapes, and may be mixed and repeated:

```js
{ text: true, body: '…' }                                  // a paragraph
{ stats: true, items: [{ meta, title, text }, …] }          // the card row
{ label: 'Stack', chips: true, items: [{ title }, …] }      // a labelled chip row
```

**About** — `ABOUT` holds the name, the two paragraphs, the contact links and
the toolkit chips. The portrait is `src/assets/portrait.jpg`.

**Scene knobs** — `src/config.js`: `AMBIENCE` (`drone`, `wind`, `pulsar`,
`choir`), `QUALITY` (`balanced` or `high` — particle counts and pixel-ratio cap)
and `BLOOM`.

## Notes for whoever picks this up

- **Placeholder content.** Projects 04–06 are unwritten. They are also the two
  most distinctive destinations — 05 is the black hole, 06 the sun — so replace
  the copy rather than deleting the entries, or move the `blackhole` / `star`
  flags onto projects you keep. The `github` URLs on all six are placeholders,
  and the hero slots are empty by design, awaiting real art.
- **Sound is off on touch devices** and has no toggle there; on desktop it
  starts on and begins at the first interaction, because browsers block
  autoplay.
- **The frame loop clamps `dt` to 50 ms.** On a machine rendering at a few
  frames a second, a warp therefore takes far longer in wall-clock time than its
  nominal ~4 s. That is deliberate — it stops a backgrounded tab from teleporting
  the camera — but it makes the app look stuck under software WebGL.
- **`prefers-reduced-motion` is not honoured.** Doing it properly means damping
  the idle camera drift and shortening warps, not just the page-entry animation,
  which is a product decision rather than a CSS one.
- **The bottom dock is a fixed 320 px on mobile**, because the active pill uses a
  fixed 150 px label slot so the dock never changes width as you travel. At a
  320 px viewport that leaves no side margin. Phones that narrow are rare, but
  the fix — if you want one — is to narrow the label slot, not to let it size to
  content.
- **No StrictMode.** Its double mount/unmount in development disposes the WebGL
  context and then asks for a second one on the same canvas, which the browser
  will not grant.
- In development only, `window.galaxy` exposes `capture(dt, scale)`,
  `resume()` and `jumpTo(i)` — the still/sequence capture used to produce the
  teaser stills and the GIF in `design/project/assets`.
