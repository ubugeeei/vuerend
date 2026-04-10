import { defineComponent } from "vue";

export default defineComponent({
  name: "MiddlewarePage",
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
            <p class="runtime-eyebrow">Request-scoped state</p>
            <h1>Middleware enriches the request before route hooks run.</h1>
            <p class="runtime-lede">
              Vue Server middleware can rewrite requests, short-circuit responses, or attach data
              to <code>context.state</code>. The route then reads it from <code>getProps()</code>.
            </p>
          </div>
          <a class="runtime-link" href="/">
            Back Home
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
          <article class="runtime-card">
            <h2>Why this is useful</h2>
            <p>
              Auth, tracing, feature flags, and request-specific headers often belong in middleware.
              This keeps the route definition focused on rendering instead of request plumbing.
            </p>
          </article>
        </section>
      </main>
    );
  },
});
