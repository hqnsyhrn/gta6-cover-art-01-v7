# Neon Coast — Poster Cover Studio

[![make.fun · gta6-cover-art-01](https://make.fun/badge/gta6-cover-art-01.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![rank](https://make.fun/badge/gta6-cover-art-01/hqnsyhrn/gta6-cover-art-01-v7/rank.svg)](https://make.fun/bounty/gta6-cover-art-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![reward](https://make.fun/badge/gta6-cover-art-01/hqnsyhrn/gta6-cover-art-01-v7/reward.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)

Built for the [Make GTA 6 Cover Art bounty](https://make.fun/bounty/gta6-cover-art-01) on make.fun.

Turn golden-hour photos into GTA-style poster cover art — offline, in the browser.

## What it does

- **9-panel collage poster** with the duo in the center panel (largest), plus 6 more layouts: Grid 3×3, Hero Left + 4, Hero Right + 4, Mosaic 8, Hero + 3 Strip, Full Bleed.
- **8 grades**, including **Poster Ink** (halftone, with an Ink slider) and **Ink Strong** (heavy posterize, contrast 1.6, magenta tint) — the printed-poster look, on by default for the cover.
- **Story captions on every panel** — place + time + one-line hook ("OCEAN DRIVE · 7:44 PM · TWO OUTLAWS. ONE SUNSET."), with a Location tags toggle and per-panel Place / Time / Hook fields.
- **Print furniture**: 5-star press quote ("NEON, SUN AND ONE LAST SCORE — THE LEONIDA LEDGER"), credit line, barcode, "COLLECTOR'S EDITION" ribbon, "WANTED ★★★★★" pill, "NC" seal and a SUMMER 2026 starburst.
- **5 presets**: Sunset Duo, Sunset Chase, Neon Coast, Golden Hour, Vice Nights.
- **20 original photos**, all golden-hour / sunset, made with an image model for this app: the duo in the red convertible, marina, boulevard, chase, lifeguard tower, pier, skyline, neon gas station, bonfire, boardwalk and more. Every face is fictional — no Rockstar art, no GTA characters.
- **Per-panel framing** (zoom / pan), photo shuffle, upload your own photo, undo / redo.
- **PNG export** in 1080×1080, 1080×1350 and 1920×1080.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## License

MIT — see LICENSE. Fonts Anton and Pacifico are under the SIL Open Font License (see `app/fonts/`).
