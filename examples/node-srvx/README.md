# node-srvx

Node support-desk example for teams that already run traditional Node services.

## Why This Exists

- Some teams want server-rendered Vue pages without adopting a framework-specific server runtime.
- Middleware and request-scoped state are often the missing link for internal tools.
- The example keeps the Node-specific part at the edge of the app: `src/server.ts`.

## Structure

- `src/app.ts`: app definition, routes, and middleware
- `src/data/support-desk.ts`: support-desk copy
- `src/routes/*`: document routes that read request-scoped props
- `src/server.ts`: Node adapter entry

## Routes

- `/`: support overview
- `/middleware`: request trace view
