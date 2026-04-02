import { defineComponent } from "vue";

export default defineComponent({
  name: "CounterView",
  props: {
    initial: {
      required: true,
      type: Number,
    },
  },
  data() {
    return {
      count: this.initial,
    };
  },
  render() {
    return (
      <button type="button" onClick={() => (this.count += 1)}>
        count: {this.count}
      </button>
    );
  },
});
