import { defineComponent } from "vue";
import { edgeOverviewCards } from "../data/status-board";

export default defineComponent({
  name: "EdgeOverviewRoute",
  props: {
    requestHost: {
      required: true,
      type: String,
    },
    requestPath: {
      required: true,
      type: String,
    },
    runtimeLabel: {
      required: true,
      type: String,
    },
  },
  setup(props) {
    return () => (
      <main class="edge-shell">
        <section class="edge-hero">
          <div>
            <p class="edge-eyebrow">Edge status board</p>
            <h1>Ship the same explicit-route Vue app to Cloudflare Workers.</h1>
            <p class="edge-lede">
              This example is for status pages, docs mirrors, and globally read-heavy pages that
              benefit from edge delivery. Vuerend starts from a fetch-compatible handler, so the
              runtime packaging can change without rewriting the app.
            </p>
            <div class="edge-links">
              <a class="edge-link" href="/deploy">
                Deployment Notes
              </a>
            </div>
          </div>
          <aside class="edge-panel">
            <h2>Current request</h2>
            <dl class="edge-metrics">
              <div>
                <dt>Runtime</dt>
                <dd>{props.runtimeLabel}</dd>
              </div>
              <div>
                <dt>Host</dt>
                <dd>{props.requestHost}</dd>
              </div>
              <div>
                <dt>Path</dt>
                <dd>{props.requestPath}</dd>
              </div>
            </dl>
          </aside>
        </section>

        <section class="edge-grid">
          {edgeOverviewCards.map((card) => (
            <article class="edge-card" key={card.title}>
              <h2>{card.title}</h2>
              <p>{card.body}</p>
            </article>
          ))}
        </section>
      </main>
    );
  },
});
