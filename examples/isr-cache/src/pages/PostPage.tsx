import { defineComponent } from "vue";

export default defineComponent({
  name: "PostPage",
  props: {
    slug: {
      required: true,
      type: String,
    },
    summary: {
      required: true,
      type: String,
    },
    title: {
      required: true,
      type: String,
    },
  },
  setup(props) {
    return () => (
      <article class="cache-shell post-shell">
        <p class="cache-kicker">Static prerendered route</p>
        <h1>{props.title}</h1>
        <p class="cache-lede">{props.summary}</p>

        <section class="cache-grid">
          <article class="cache-panel">
            <h2>Why prerender this page?</h2>
            <p>
              It changes less frequently than the landing page, so it is a good fit for build-time
              output. You still keep route-level metadata and styling without adding a client app
              runtime.
            </p>
          </article>
          <article class="cache-panel">
            <h2>Slug</h2>
            <p>{props.slug}</p>
          </article>
        </section>

        <a class="cache-link" href="/">
          Back to ISR landing page
        </a>
      </article>
    );
  },
});
