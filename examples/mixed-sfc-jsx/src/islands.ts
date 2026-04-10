import AccentBadge from "./components/AccentBadge";
import { defineIsland, defineIslands } from "@vuerend/core";
import ReadingListPanel from "./components/ReadingListPanel";

export const AccentBadgeIsland = defineIsland("accent-badge", {
  component: AccentBadge,
  load: () => import("./components/AccentBadge"),
  hydrate: "load",
});

export const ReadingListIsland = defineIsland("reading-list-panel", {
  component: ReadingListPanel,
  load: () => import("./components/ReadingListPanel"),
  hydrate: "load",
});

export default defineIslands([AccentBadgeIsland, ReadingListIsland]);
