/** Client-side island hydration entrypoint. */
export { hydrateIslands } from "./client/hydrate.js";
/** Browser-only shared state for hydrated islands. */
export { useClientState } from "./client/state.js";
export type { UseClientStateOptions } from "./client/state.js";
