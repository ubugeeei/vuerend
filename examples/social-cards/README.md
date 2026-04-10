# social-cards

Publisher workflow example for teams that want Vue-authored dynamic social cards.

## Why This Exists

- Story pages often need share images that stay in sync with titles and summaries.
- A dedicated image-route example makes the OG workflow clearer than hiding it inside a generic routing demo.
- The example keeps Chromium rendering explicit and route-owned.

## Structure

- `src/app.ts`: page routes, image route, and request handler options
- `src/data/social-story.ts`: shared story metadata
- `src/routes/*`: overview page, story page, and the Vue SFC image template
- `public/styles/*`: page and OG card styles

## Routes

- `/`: studio overview
- `/stories/launch-week`: story page
- `/cards/launch-week.png`: Chromium-backed social card
