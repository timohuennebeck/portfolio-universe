# Galaxy portfolio language switch

_Started 2026-09-05 06:14 UTC_

---

## User

Let's also have a button to switch our apps language to german for the galaxy portfolio.

## Assistant

_[tool: read_file]_

_[tool: read_file]_

_[tool: grep]_

Scene uses only pos/tint/flags, so swapping text content is safe. Adding German content and a language toggle.

_[tool: run_script]_

Now wire the template and logic.

_[tool: dc_html_str_replace]_

_[tool: run_script]_

_[tool: ready_for_verification]_

Added an EN / DE toggle (top-left pill). It switches all UI labels plus project and about copy; the choice persists and German browsers default to DE. German copy for the 3 real projects and the About page lives in `content.js` (`PROJECTS_DE`, `ABOUT_DE`, `STRINGS`) if you want to adjust wording.

## User

at this point its quite a lot of information since in every corner we now have something. create me some designs on how to best approach this

## Assistant

_[tool: read_file]_

_[tool: dc_write]_

_[tool: ready_for_verification]_

Three HUD layouts in `HUD Options.dc.html`:

- **1a One dock** – About, project nav, sound and DE all in the bottom bar; corners empty; hints shown as a faint line under the card button.
- **1b Name + utilities** – your name top-left (opens About), a quiet mono cluster top-right (sound · EN/DE · ?), nav-only bottom; hints hide behind the ?.
- **1c Nav + one menu** – only the nav visible; a single Menu pill opens a sheet with About, Sound, Language and controls.

Tell me which to apply (or mix, e.g. 1a's dock with 1b's name).

