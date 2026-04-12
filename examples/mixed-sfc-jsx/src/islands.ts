import { defineIsland, defineIslands } from "@vuerend/core";

export const AccentBadgeIsland = defineIsland<{ label: string }>("accent-badge", {
  load: () => import("./islands/AccentBadgeIsland.loader"),
  hydrate: "load",
});

export const ReadingListIsland = defineIsland<{ page: string }>("reading-list-panel", {
  load: () => import("./islands/ReadingListIsland.loader"),
  hydrate: "load",
});

export default defineIslands([AccentBadgeIsland, ReadingListIsland]);
