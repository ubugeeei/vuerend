import { defineComponent } from "vue";

export default defineComponent({
  name: "AccentBadge",
  props: {
    label: {
      required: true,
      type: String,
    },
  },
  render() {
    return <strong>{this.label}</strong>;
  },
});
