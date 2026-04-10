import { defineComponent } from "vue";

export default defineComponent({
  name: "HomePage",
  props: {
    requestMethod: {
      required: true,
      type: String,
    },
    requestPath: {
      required: true,
      type: String,
    },
    requestStartedAt: {
      required: true,
      type: String,
    },
  },
  setup(props) {
    return () => (
      <main class="runtime-shell">
        <section class="runtime-hero">
          <div>
            <p class="runtime-eyebrow">Node runtime adapter</p>
            <h1>Use the same Vuerend app model inside a traditional Node process.</h1>
            <p class="runtime-lede">
              This example runs through <code>srvx/node</code>. Middleware captures request-scoped
              data, then route hooks render a normal server page with that context.
            </p>
            <div class="runtime-links">
              <a class="runtime-link" href="/middleware">
                See Middleware Flow
              </a>
            </div>
          </div>
          <aside class="runtime-panel">
            <h2>Current request</h2>
            <dl class="runtime-metrics">
              <div>
                <dt>Method</dt>
                <dd>{props.requestMethod}</dd>
              </div>
              <div>
                <dt>Path</dt>
                <dd>{props.requestPath}</dd>
              </div>
              <div>
                <dt>Started</dt>
                <dd>{props.requestStartedAt}</dd>
              </div>
            </dl>
          </aside>
        </section>

        <section class="runtime-grid">
          <article class="runtime-card">
            <h2>Why a Node example exists</h2>
            <p>
              Some teams do not want an opinionated framework server. They already have deployment,
              observability, and process management around Node and just want a fetch-compatible
              Vue rendering layer.
            </p>
          </article>
          <article class="runtime-card">
            <h2>What stays simple</h2>
            <p>
              Routes are still explicit. Pages are still server components by default. The adapter
              and middleware layer are the only Node-specific pieces.
            </p>
          </article>
        </section>
      </main>
    );
  },
});
