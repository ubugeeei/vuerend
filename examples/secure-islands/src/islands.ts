import { defineIsland, defineIslands } from "@vuerend/core";

export const CounterIsland = defineIsland<{ initial: number; label: string }>("counter-island", {
  load: () => import("./islands/SeatEstimatorIsland.loader"),
  hydrate: "visible",
});

export const SignupIsland = defineIsland<{
  blurb: string;
  buttonLabel: string;
  title: string;
}>("signup-island", {
  load: () => import("./islands/SignupConciergeIsland.loader"),
  hydrate: "idle",
  ssr: false,
});

export default defineIslands([CounterIsland, SignupIsland]);
