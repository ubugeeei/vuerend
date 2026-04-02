import AccentBadge from "./components/AccentBadge";
import { defineIsland, defineIslands } from "@vue-server/core";

export const AccentBadgeIsland = defineIsland("accent-badge", {
  component: AccentBadge,
  load: () => import("./components/AccentBadge"),
  hydrate: "load",
});

export default defineIslands([AccentBadgeIsland]);
