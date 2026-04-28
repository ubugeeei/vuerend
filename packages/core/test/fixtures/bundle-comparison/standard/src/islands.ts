import { defineIsland, defineIslands } from "@vuerend/core";

export const CounterIsland = defineIsland<{ initial: number; label: string }>("counter", {
  hydrate: "load",
  load: () => import("./islands/CounterIsland.vue"),
});

export default defineIslands([CounterIsland]);
