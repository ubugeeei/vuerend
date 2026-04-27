import { defineIsland, defineIslands } from "@vuerend/core";

export const VaporCounterIsland = defineIsland<{ initial: number; label: string }>(
  "vapor-counter",
  {
    load: () => import("./islands/VaporCounterIsland.vue"),
    hydrate: "load",
  },
);

export default defineIslands([VaporCounterIsland]);
