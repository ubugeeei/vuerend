import AccentBadge from "./components/AccentBadge";
import { defineIsland, defineIslands } from "@vuerend/core";

export const AccentBadgeIsland = defineIsland("accent-badge", {
  component: AccentBadge,
  load: () => import("./components/AccentBadge"),
  hydrate: "load",
});

export default defineIslands([AccentBadgeIsland]);
