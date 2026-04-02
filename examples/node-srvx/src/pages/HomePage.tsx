import { defineComponent } from "vue";

export default defineComponent({
  name: "HomePage",
  setup() {
    return () => (
      <main>
        <h1>srvx/node</h1>
        <p>Manual Node runtime entry.</p>
      </main>
    );
  },
});
