import { defineComponent, type PropType } from "vue";
import type { ReleaseNote } from "../data/release-notes";

export default defineComponent({
  name: "ReleaseNotesHomeRoute",
  props: {
    now: {
      required: true,
      type: String,
    },
    posts: {
      required: true,
      type: Array as PropType<ReleaseNote[]>,
    },
  },
  setup(props) {
    return () => (
      <main class="cache-shell">
        <section class="cache-hero">
          <div>
            <p class="cache-kicker">Release notes homepage</p>
            <h1>
              Keep the front page fresh without turning the whole publication into a client app.
            </h1>
            <p class="cache-lede">
              This route is cached with ISR, so it can serve HTML quickly and then refresh on a
              schedule. The linked notes below stay fully prerendered because older entries rarely
              need to change.
            </p>
          </div>
          <aside class="cache-panel">
            <h2>Current newsroom snapshot</h2>
            <p>Rendered at {props.now}</p>
          </aside>
        </section>

        <section class="cache-grid">
          <article class="cache-panel">
            <h2>Why this example exists</h2>
            <p>
              Changelogs, release notes, and newsroom front pages often want one fresh landing page
              plus a long tail of static entries.
            </p>
          </article>
          <article class="cache-panel">
            <h2>What changes here</h2>
            <p>
              The landing page timestamp changes as the ISR window revalidates. The linked entries
              are prerendered ahead of time and stay plain static documents.
            </p>
          </article>
        </section>

        <section class="post-grid">
          {props.posts.map((post) => (
            <article class="post-card" key={post.slug}>
              <p class="cache-kicker">Prerendered release note</p>
              <h2>{post.title}</h2>
              <p>{post.summary}</p>
              <a class="cache-link" href={`/posts/${post.slug}`}>
                Open entry
              </a>
            </article>
          ))}
        </section>
      </main>
    );
  },
});
