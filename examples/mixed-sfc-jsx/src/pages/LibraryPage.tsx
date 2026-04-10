import { defineComponent } from "vue";
import { AccentBadgeIsland, ReadingListIsland } from "../islands";

export default defineComponent({
  name: "LibraryPage",
  setup() {
    return () => (
      <main class="mixed-shell mixed-shell--library">
        <section class="mixed-hero">
          <div>
            <p class="mixed-eyebrow">JSX route, shared state</p>
            <h1>The route changed, but the reading list state stayed with the tab.</h1>
            <p class="mixed-lede">
              This page is written in JSX instead of an SFC, but it reuses the same browser store
              key as the home page. That gives you a light MPA-style shared store without turning
              the whole app into a single hydrated client runtime.
            </p>
          </div>
          <aside class="mixed-panel">
            <h2>Why this matters</h2>
            <ul class="mixed-list">
              <li>Teams can mix SFC-heavy pages with JSX-heavy component work.</li>
              <li>The global store is scoped to client islands, not to every route component.</li>
              <li>You still navigate between regular documents.</li>
            </ul>
          </aside>
        </section>

        <section class="mixed-grid">
          <article class="mixed-card">
            <h2>Shared browser state</h2>
            <p>
              The reading list island below uses <code>useClientState()</code>. Add a few items
              here, go back home, and the value stays in sync for the tab.
            </p>
            <ReadingListIsland page="library" />
          </article>
          <article class="mixed-card">
            <h2>Another tiny island</h2>
            <p>
              The badge is still a separate JSX island. You can compose a page out of multiple
              targeted client boundaries instead of hydrating the route wholesale.
            </p>
            <AccentBadgeIsland label="jsx route active" />
          </article>
        </section>

        <nav class="mixed-link-row">
          <a class="mixed-link" href="/">
            Back to SFC route
          </a>
        </nav>
      </main>
    );
  },
});
