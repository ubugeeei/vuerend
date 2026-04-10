import { defineComponent } from "vue";

export default defineComponent({
  name: "HomePage",
  setup() {
    return () => (
      <main class="page-shell">
        <section class="hero-grid">
          <div>
            <p class="eyebrow">No filesystem router. No client router.</p>
            <h1>Model the app as documents and links first.</h1>
            <p class="lede">
              Vue Server starts with an explicit route table because the target is often an MPA,
              not an SPA shell. That makes the server-rendered page the default unit, with routing
              and metadata declared right next to it.
            </p>
            <div class="link-row">
              <a class="link-chip" href="/about">
                Why Explicit Routes?
              </a>
            </div>
          </div>
          <aside class="feature-card feature-card--hero">
            <h2>What this example is trying to say</h2>
            <ul class="feature-list">
              <li>Routing can stay small, visible, and deliberate.</li>
              <li>Page metadata belongs to the route, not to a separate framework layer.</li>
              <li>Shared CSS and document defaults can stay simple and MPA-friendly.</li>
            </ul>
          </aside>
        </section>

        <section class="card-grid">
          <article class="feature-card">
            <h2>Explicit route table</h2>
            <p>
              Every page in the app is listed in one place. That is often easier to reason about
              for docs, content hubs, admin tools, and server-first product pages.
            </p>
          </article>
          <article class="feature-card">
            <h2>Shared document defaults</h2>
            <p>
              The app sets common metadata and CSS once, then each route can layer on its own
              title, Open Graph tags, or route-specific assets.
            </p>
          </article>
          <article class="feature-card">
            <h2>Static by default</h2>
            <p>
              This page is prerendered with <code>strategy: "ssg"</code>. There is no baseline
              client runtime just to navigate to the next page.
            </p>
          </article>
        </section>

        <section class="manifest-panel">
          <p class="eyebrow">A tiny mental model</p>
          <h2>Think in pages, not in route machinery.</h2>
          <p>
            If your app mostly needs server-rendered documents, anchors, metadata, and a little bit
            of opt-in client behavior, an explicit route table is often clearer than a hidden router
            convention.
          </p>
        </section>
      </main>
    );
  },
});
