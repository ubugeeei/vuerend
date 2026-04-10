import { defineComponent, type PropType } from "vue";

interface LandingPost {
  slug: string;
  summary: string;
  title: string;
}

export default defineComponent({
  name: "LandingPage",
  props: {
    now: {
      required: true,
      type: String,
    },
    posts: {
      required: true,
      type: Array as PropType<LandingPost[]>,
    },
  },
  setup(props) {
    return () => (
      <main class="cache-shell">
        <section class="cache-hero">
          <div>
            <p class="cache-kicker">Incremental static regeneration</p>
            <h1>Keep the landing page fresh without turning the whole site into a client app.</h1>
            <p class="cache-lede">
              This route is cached with ISR, so it can serve static HTML quickly and then refresh on
              a schedule. The posts below stay fully prerendered because their content changes less
              often.
            </p>
          </div>
          <aside class="cache-panel">
            <h2>Current ISR snapshot</h2>
            <p>Rendered at {props.now}</p>
          </aside>
        </section>

        <section class="cache-grid">
          <article class="cache-panel">
            <h2>Why this example exists</h2>
            <p>
              A lot of sites want a fresh homepage, static long-tail content, and server-rendered
              metadata without adopting a client router just to simulate freshness.
            </p>
          </article>
          <article class="cache-panel">
            <h2>What changes here</h2>
            <p>
              The landing page timestamp changes as the ISR window revalidates. The linked posts are
              prerendered ahead of time and stay plain static documents.
            </p>
          </article>
        </section>

        <section class="post-grid">
          {props.posts.map((post) => (
            <article class="post-card" key={post.slug}>
              <p class="cache-kicker">Prerendered article</p>
              <h2>{post.title}</h2>
              <p>{post.summary}</p>
              <a class="cache-link" href={`/posts/${post.slug}`}>
                Open {post.slug}
              </a>
            </article>
          ))}
        </section>
      </main>
    );
  },
});
