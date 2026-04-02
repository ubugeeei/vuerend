import { defineComponent } from "vue";

export default defineComponent({
  name: "LibraryPage",
  setup() {
    return () => (
      <main>
        <h1>Library</h1>
        <p>JSX route sitting next to an SFC route.</p>
      </main>
    );
  },
});
