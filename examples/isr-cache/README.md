# isr-cache

Release-notes example for teams that need one fresh landing page and a long tail of static entries.

## Why This Exists

- A newsroom, changelog, or release-notes site often has one route that should refresh on a cadence.
- Older entries are usually a better fit for prerendered output.
- The example keeps cache strategy explicit at the route level instead of hiding it behind global behavior.

## Structure

- `src/app.ts`: route table and cache strategy
- `src/data/release-notes.ts`: release-note content and slugs
- `src/routes/*`: ISR landing route and static entry route

## Routes

- `/`: ISR landing page
- `/posts/:slug`: prerendered release-note entries
