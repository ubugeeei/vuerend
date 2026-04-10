import { defineComponent } from "vue";
import { supportOverviewCards } from "../data/support-desk";

export default defineComponent({
  name: "SupportOverviewRoute",
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
            <p class="runtime-eyebrow">Internal support desk</p>
            <h1>Drop the same Vuerend app model into a traditional Node process.</h1>
            <p class="runtime-lede">
              This example is for teams that already run Node services and want server-rendered Vue
              pages without adopting a heavyweight framework server. Middleware captures
              request-scoped data, then route hooks render an internal tool with that context.
            </p>
            <div class="runtime-links">
              <a class="runtime-link" href="/middleware">
                Inspect Request Trace
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
          {supportOverviewCards.map((card) => (
            <article class="runtime-card" key={card.title}>
              <h2>{card.title}</h2>
              <p>{card.body}</p>
            </article>
          ))}
        </section>
      </main>
    );
  },
});
