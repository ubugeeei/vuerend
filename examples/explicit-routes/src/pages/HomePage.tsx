import { defineComponent } from "vue";

export default defineComponent({
  name: "HomePage",
  setup() {
    return () => (
      <main>
        <h1>Explicit Routes</h1>
        <p>No filesystem router and no client router.</p>
        <a href="/about">About</a>
      </main>
    );
  },
});
