# secure-islands

Launch site example for teams that want static pages by default and narrowly scoped hydration.

## Why This Exists

- Campaign pages often need one or two live widgets, not a hydrated shell around the entire page.
- Islands are easier to reason about when their boundaries are visible in both the route code and the file layout.
- A companion page in the same app can stay completely server-rendered.

## Structure

- `src/app.ts`: the route table and document defaults
- `src/data/launch-week.ts`: launch-site copy and pricing data
- `src/routes/*`: server-rendered documents
- `src/islands/*`: interactive client boundaries and their loader modules
- `public/styles/*`: shared and route-specific styles

## Routes

- `/`: launch page with a visible island and a client-only island
- `/pricing`: server-only programs page
