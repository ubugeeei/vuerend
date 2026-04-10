import { defineComponent } from "vue";

export default defineComponent({
  name: "WorkerPage",
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
            <p class="edge-eyebrow">Edge runtime adapter</p>
            <h1>Run the same fetch-first Vue app model on Cloudflare Workers.</h1>
            <p class="edge-lede">
              Vuerend does not start from a Node-only server abstraction. The app compiles down
              to a fetch-compatible handler, which maps naturally onto edge runtimes.
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
          <article class="edge-card">
            <h2>Why a Worker example matters</h2>
            <p>
              If your rendering model assumes a process-bound Node server, edge deployment becomes
              a separate architecture. Vuerend keeps the app contract fetch-native from the
              beginning.
            </p>
          </article>
          <article class="edge-card">
            <h2>What stays consistent</h2>
            <p>
              You still define the app with explicit routes, server components, middleware, and
              optional islands. Only the outer adapter changes.
            </p>
          </article>
        </section>
      </main>
    );
  },
});
