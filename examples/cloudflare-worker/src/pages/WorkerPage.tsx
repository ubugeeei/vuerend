import { defineComponent } from "vue";

export default defineComponent({
  name: "WorkerPage",
  setup() {
    return () => (
      <main>
        <h1>Cloudflare Worker</h1>
        <p>Fetch-first entrypoint.</p>
      </main>
    );
  },
});
