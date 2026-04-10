import CounterView from "./components/CounterView";
import SignupPrompt from "./components/SignupPrompt.vue";
import { defineIsland, defineIslands } from "@vuerend/core";

export const CounterIsland = defineIsland<{ initial: number; label: string }>("counter-island", {
  component: CounterView,
  load: () => import("./components/CounterView"),
  hydrate: "visible",
});

export const SignupIsland = defineIsland<{
  blurb: string;
  buttonLabel: string;
  title: string;
}>("signup-island", {
  component: SignupPrompt,
  load: () => import("./components/SignupPrompt.vue"),
  hydrate: "idle",
  ssr: false,
});

export default defineIslands([CounterIsland, SignupIsland]);
