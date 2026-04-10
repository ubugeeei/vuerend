# explicit-routes

Zero JavaScript-first handbook example for teams that want a small, inspectable MPA.

## Why This Exists

- Team handbooks, onboarding guides, and policy hubs usually want stable URLs and normal links.
- Shared metadata, route-specific titles, and social cards are easier to reason about when the route table is explicit.
- Most pages are a good fit for `ssg`, but the same structure can still grow into SSR or image routes later.

## Structure

- `src/app.ts`: the app contract and route table
- `src/data/handbook.ts`: handbook copy and card data
- `src/routes/*`: document routes and the OG image template
- `public/styles/*`: shared document and route-specific styles

## Routes

- `/`: handbook home
- `/about`: why this route model works for handbooks
- `/og/explicit-routes-home.png`: Chromium-backed social card authored as a Vue SFC
