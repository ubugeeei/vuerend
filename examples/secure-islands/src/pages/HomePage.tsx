import { defineComponent } from "vue";
import { CounterIsland, SignupIsland } from "../islands";

export default defineComponent({
  name: "HomePage",
  setup() {
    return () => (
      <main>
        <h1>Secure Islands</h1>
        <p>Only explicit islands hydrate on the client.</p>
        <CounterIsland initial={2} />
        <SignupIsland title="Weekly updates" />
      </main>
    );
  },
});
