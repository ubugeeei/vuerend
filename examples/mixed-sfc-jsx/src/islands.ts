import AccentBadgeIslandComponent from "./islands/AccentBadgeIsland";
import { defineIsland, defineIslands } from "@vuerend/core";
import ReadingListIslandComponent from "./islands/ReadingListIsland";

export const AccentBadgeIsland = defineIsland("accent-badge", {
  component: AccentBadgeIslandComponent,
  load: () => import("./islands/AccentBadgeIsland.loader"),
  hydrate: "load",
});

export const ReadingListIsland = defineIsland("reading-list-panel", {
  component: ReadingListIslandComponent,
  load: () => import("./islands/ReadingListIsland.loader"),
  hydrate: "load",
});

export default defineIslands([AccentBadgeIsland, ReadingListIsland]);
