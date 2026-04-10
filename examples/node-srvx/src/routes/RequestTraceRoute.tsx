import { defineComponent } from "vue";
import { supportTraceCards } from "../data/support-desk";

export default defineComponent({
  name: "RequestTraceRoute",
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
      <main class="runtime-shell runtime-shell--middleware">
        <section class="runtime-hero">
          <div>
            <p class="runtime-eyebrow">Request trace</p>
            <h1>Middleware enriches the request before the support route renders.</h1>
            <p class="runtime-lede">
              Vuerend middleware can rewrite requests, short-circuit responses, or attach data to{" "}
              <code>context.state</code>. The route then reads it from <code>getProps()</code>.
            </p>
          </div>
          <a class="runtime-link" href="/">
            Back to Support Overview
          </a>
        </section>

        <section class="runtime-grid">
          <article class="runtime-card">
            <h2>Middleware output</h2>
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
          </article>
          {supportTraceCards.map((card) => (
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
