# The Burg

Life in The Burg: a turn-based life sim set in Waitsburg, WA, built as an installable web app (PWA).

You live in Waitsburg and work anywhere from Waitsburg and Dayton to Walla Walla, Kennewick, Richland or Pasco. Each turn is one week: pick a focus, pay the bills, drive Highway 12, and handle whatever life in the Burg throws at you.

## Game lengths

- **6 Months** (26 weeks)
- **2 Years** (104 weeks)
- **5 Years** (260 weeks)
- **Lifetime** (age 18 until the end, with retirement from 62)

Skip buttons (⏩ 4 weeks, ⏩ 13 weeks) play several weeks with the same focus and stop when something happens.

## Scoring

Your Life Score blends average happiness (30%), average health (20%), community standing (20%) and net worth against a target for the game length (30%). The game auto-saves after every turn.

## Running it

It's a static site with no build step. Serve the folder over HTTP (for example with GitHub Pages) and open `index.html`. On a phone, use "Add to Home Screen" to install it. The service worker (`sw.js`) caches the app so it works offline.

## Files

- `index.html`: the whole game (markup, styles and logic)
- `manifest.webmanifest`, `icon*.png`, `icon.svg`: install metadata and icons
- `sw.js`: offline cache
