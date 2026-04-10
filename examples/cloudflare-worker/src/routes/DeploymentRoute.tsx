import { defineComponent } from "vue";
import { edgeDeploymentCards } from "../data/status-board";

export default defineComponent({
  name: "DeploymentRoute",
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
              This page explains the motivation behind the adapter layer: the same status board
              should be able to run in local preview, Node, or a Worker runtime.
            </p>
          </div>
          <a class="edge-link" href="/">
            Back to Edge Overview
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
          {edgeDeploymentCards.map((card) => (
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
