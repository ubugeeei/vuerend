import AccentBadge from "./components/AccentBadge";
import ReadingListPanel from "./components/ReadingListPanel";
import { defineIsland, defineIslands } from "@vue-server/core";

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
