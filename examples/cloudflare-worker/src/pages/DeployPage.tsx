import { defineComponent } from "vue";

export default defineComponent({
  name: "DeployPage",
  props: {
    requestHost: {
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
      <main class="edge-shell edge-shell--deploy">
        <section class="edge-hero">
          <div>
            <p class="edge-eyebrow">Fetch-compatible deployment</p>
            <h1>Edge deployment should be a packaging choice, not a rewrite.</h1>
            <p class="edge-lede">
              This page explains the motivation behind the adapter layer: the same app definition
              should be able to run in local preview, Node, or a worker runtime.
            </p>
          </div>
          <a class="edge-link" href="/">
            Back Home
          </a>
        </section>

        <section class="edge-grid">
          <article class="edge-card">
            <h2>Runtime snapshot</h2>
            <dl class="edge-metrics">
              <div>
                <dt>Runtime</dt>
                <dd>{props.runtimeLabel}</dd>
              </div>
              <div>
                <dt>Host</dt>
                <dd>{props.requestHost}</dd>
              </div>
            </dl>
          </article>
          <article class="edge-card">
            <h2>What the adapter buys you</h2>
            <p>
              The Cloudflare package wraps the same request handler shape used elsewhere. That keeps
              the route model, metadata, caching policy, and islands story identical across
              runtimes.
            </p>
          </article>
        </section>
      </main>
    );
  },
});
