# cloudflare-worker

Edge status-board example for teams that want the same app model on Cloudflare Workers.

## Why This Exists

- Runtime portability is easier to trust when the adapter swap is visible and small.
- Status pages, docs mirrors, and read-heavy pages are strong fits for edge delivery.
- The example keeps the app code identical in spirit to the Node example while changing only the outer packaging.

## Structure

- `src/app.ts`: route table and request metadata middleware
- `src/data/status-board.ts`: copy for the edge example
- `src/routes/*`: edge overview and deployment routes
- `src/worker.ts`: Cloudflare adapter entry

## Routes

- `/`: edge overview
- `/deploy`: deployment notes
