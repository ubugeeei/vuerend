# mixed-sfc-jsx

Buying-guide example for teams that want server-rendered pages, JSX islands, and small shared browser state.

## Why This Exists

- Some teams prefer Vue SFCs for page authoring but JSX for interactive widgets.
- A shortlist or saved state can survive full document navigations without turning the whole app into a hydrated shell.
- The example shows that mixed authoring styles still fit a Zero JavaScript-first MPA.

## Structure

- `src/app.ts`: document defaults and route table
- `src/data/buying-guide.ts`: buying-guide copy
- `src/routes/*`: the SFC home route and JSX shortlist route
- `src/islands/*`: JSX islands plus explicit loader modules
- `src/islands.ts`: island registry

## Routes

- `/`: SFC guide page with small JSX islands
- `/library`: JSX route reusing the same shortlist state
