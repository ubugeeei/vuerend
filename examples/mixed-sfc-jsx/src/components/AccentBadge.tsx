import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "AccentBadge",
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
        {active.value ? "interactive now" : props.label}
      </button>
    );
  },
});
