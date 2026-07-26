# ORGL Landing

Marketing site for [One Retro Game Launcher (ORGL)](https://github.com/iShafayet/OneRetroGameLauncher) — stop scrolling your library, start finishing it.

Plain HTML, CSS, and JavaScript. Source lives in `code/`; `docs/` is the GitHub Pages build output.

## Setup

```bash
npm install
```

## Develop

```bash
npm run dev
```

Open http://localhost:8080

## Build (GitHub Pages)

```bash
npm run build
```

Copies `code/` → `docs/`. In the repo settings, set Pages source to **Deploy from a branch** → `/docs`.

Preview the build locally:

```bash
npm run preview
```

## Layout

```
code/            # source (edit here)
  index.html
  styles.css
  script.js
  fonts/
  icons/         # favicon, logo
  images/        # screenshots, photos, video
docs/            # GitHub Pages output (from npm run build)
scripts/build.mjs
package.json
LICENSE          # GPL-3.0
```
