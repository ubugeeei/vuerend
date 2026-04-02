import { defineComponent } from "vue";

export default defineComponent({
  name: "LandingPage",
  props: {
    now: {
      required: true,
      type: String,
    },
  },
  setup(props) {
    return () => (
      <main>
        <h1>ISR Cache</h1>
        <p>Rendered at {props.now}</p>
        <a href="/posts/hello">Open prerendered post</a>
      </main>
    );
  },
});
