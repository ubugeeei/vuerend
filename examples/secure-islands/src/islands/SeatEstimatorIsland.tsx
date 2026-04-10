import { defineComponent } from "vue";

export default defineComponent({
  name: "SeatEstimatorIsland",
  props: {
    initial: {
      required: true,
      type: Number,
    },
    label: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      count: this.initial,
    };
  },
  render() {
    return (
      <article class="island-card">
        <p class="island-kicker">Visible Island</p>
        <h3>{this.label}</h3>
        <p class="island-count">{this.count}</p>
        <p class="island-copy">
          This panel is server-rendered first, then hydrated only when it becomes visible.
        </p>
        <div class="island-actions">
          <button
            class="island-button"
            type="button"
            onClick={() => (this.count = Math.max(0, this.count - 1))}
          >
            Reserve Seat
          </button>
          <button
            class="island-button island-button--ghost"
            type="button"
            onClick={() => (this.count += 1)}
          >
            Release Seat
          </button>
        </div>
      </article>
    );
  },
});
