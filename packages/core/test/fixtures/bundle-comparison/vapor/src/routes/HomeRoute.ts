import { defineComponent, h } from "vue";
import { CounterIsland } from "../islands";

export default defineComponent({
  name: "BundleComparisonHome",
  setup() {
    return () =>
      h("main", { class: "bundle-page" }, [
        h("h1", "Production hydration fixture"),
        h(CounterIsland, {
          initial: 3,
          label: "Vapor counter",
        }),
      ]);
  },
});
