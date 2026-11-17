# The Burg

Life in The Burg: a turn-based life sim set in Waitsburg, WA, built as an installable web app (PWA).

You live in Waitsburg and work anywhere from Waitsburg and Dayton to Walla Walla, Kennewick, Richland or Pasco. Each turn is one week: pick a focus, pay the bills, drive Highway 12, and handle whatever life in the Burg throws at you.

## Game lengths

- **6 Months** (26 weeks)
- **2 Years** (104 weeks)
- **5 Years** (260 weeks)
- **Lifetime** (age 18 until the end, with retirement from 62)

Skip buttons (⏩ 4 weeks, ⏩ 13 weeks) play several weeks with the same focus and stop when something happens.

## Maps

Home and Jobs each have a **📋 List / 🗺️ Map** toggle, and the game remembers your choice.

- **🏡 Waitsburg:** a stylized town map. Tap a place to spend your week there: home to rest, Main Street to show up for town, the library for classes, the Touchet River to get outside, the bulletin board for odd jobs, and your workplace (or Highway 12) to work extra hours.
- **🛣️ The region:** the six towns at their real coordinates, with the Columbia, Snake, Yakima, Walla Walla and Touchet rivers and US-12. Tap a town to see the drive, your gas cost and its jobs (you can apply right there). After each week your 🛻 drives your commute.

## Scoring

Your Life Score blends average happiness (30%), average health (20%), community standing (20%) and net worth against a target for the game length (30%). The game auto-saves after every turn.

## Running it

It's a static site with no build step. Serve the folder over HTTP (for example with GitHub Pages) and open `index.html`. On a phone, use "Add to Home Screen" to install it. The service worker (`sw.js`) caches the app so it works offline.

## Files

- `index.html`: the whole game (markup, styles and logic)
- `manifest.webmanifest`, `icon*.png`, `icon.svg`: install metadata and icons
- `sw.js`: offline cache
