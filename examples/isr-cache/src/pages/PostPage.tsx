import { defineComponent } from "vue";

export default defineComponent({
  name: "PostPage",
  props: {
    slug: {
      required: true,
      type: String,
    },
  },
  setup(props) {
    return () => (
      <article>
        <h1>{props.slug}</h1>
        <p>Static prerendered post page.</p>
      </article>
    );
  },
});
