import { defineComponent } from "vue";
import { useClientState } from "@vuerend/core/client";

export default defineComponent({
  name: "ReadingListIsland",
  props: {
    page: {
      required: true,
      type: String,
    },
  },
  setup(props) {
    const count = useClientState<number>("reading-list", 2);

    return () => (
      <section class="reading-panel">
        <p class="mixed-eyebrow">Shared client state</p>
        <h2>Saved Shortlist</h2>
        <p class="reading-copy">
          This count lives in <code>sessionStorage</code>, so it survives full document navigations
          in the same tab.
        </p>
        <p class="reading-source">
          Editing from: <strong>{props.page}</strong>
        </p>
        <p class="reading-total">{count.value} saved picks</p>
        <div class="reading-actions">
          <button class="mixed-button" type="button" onClick={() => (count.value += 1)}>
            Save Another
          </button>
          <button
            class="mixed-button mixed-button--ghost"
            type="button"
            onClick={() => (count.value = Math.max(0, count.value - 1))}
          >
            Remove One
          </button>
          <button
            class="mixed-button mixed-button--ghost"
            type="button"
            onClick={() => (count.value = 0)}
          >
            Clear
          </button>
        </div>
      </section>
    );
  },
});
