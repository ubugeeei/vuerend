import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "AccentBadgeIsland",
  props: {
    label: {
      required: true,
      type: String,
    },
  },
  setup(props) {
    const active = ref(false);

    return () => (
      <button
        class={["accent-badge", active.value ? "accent-badge--active" : ""]}
        type="button"
        onClick={() => {
          active.value = !active.value;
        }}
      >
        <span class="accent-badge__dot" />
        {active.value ? "saved for comparison" : props.label}
      </button>
    );
  },
});
