import { defineComponent } from "vue";
import { CounterIsland, SignupIsland } from "../islands";

export default defineComponent({
  name: "HomePage",
  setup() {
    return () => (
      <main class="secure-shell">
        <section class="hero-grid">
          <div>
            <p class="eyebrow">Static-first launch page</p>
            <h1>Ship a rich product page without shipping the whole page as JavaScript.</h1>
            <p class="lede">
              Vue Server keeps route components on the server by default. This page is mostly plain
              HTML and CSS, then opts into two small islands where interactivity actually matters.
            </p>
            <div class="cta-row">
              <a class="primary-link" href="/pricing">
                View Pricing
              </a>
              <a class="secondary-link" href="#interactive-spots">
                See Interactive Spots
              </a>
            </div>
          </div>
          <aside class="hero-card">
            <h2>What hydrates here?</h2>
            <ul class="feature-list">
              <li>The seat estimator hydrates only when scrolled into view.</li>
              <li>The waitlist widget mounts on idle as a client-only island.</li>
              <li>The rest of the page stays server-rendered and navigation stays MPA-style.</li>
            </ul>
          </aside>
        </section>

        <section class="story-grid">
          <article class="story-card">
            <h2>Why explicit islands?</h2>
            <p>
              Marketing pages often need a pricing calculator, demo scheduler, or signup box, not a
              client router and a hydrated page shell.
            </p>
          </article>
          <article class="story-card">
            <h2>Why this project?</h2>
            <p>
              Vue Server is for teams who want Vue as the templating and component model for
              server-first pages, then add islands only where the browser truly helps.
            </p>
          </article>
          <article class="story-card">
            <h2>What remains static?</h2>
            <p>
              The hero, proof points, pricing teaser, and FAQ below are all plain server-rendered
              markup. The islands are the exception, not the baseline.
            </p>
          </article>
        </section>

        <section class="proof-strip">
          <div>
            <strong>0 client router</strong>
            <span>Pages are linked with regular anchors.</span>
          </div>
          <div>
            <strong>2 explicit islands</strong>
            <span>Each one has its own hydration strategy.</span>
          </div>
          <div>
            <strong>1 app model</strong>
            <span>The same runtime model works across examples and adapters.</span>
          </div>
        </section>

        <section class="interactive-grid" id="interactive-spots">
          <div class="section-copy">
            <p class="eyebrow">Visible hydration</p>
            <h2>Interactive spot one: seat estimator</h2>
            <p>
              This island is SSR-rendered so it appears in the initial HTML, then hydrates only
              when it becomes visible. That keeps interactivity narrow without hiding useful content
              behind JavaScript.
            </p>
          </div>
          <CounterIsland initial={14} label="Pilot seats remaining" />
        </section>

        <section class="interactive-grid interactive-grid--signup">
          <div class="section-copy">
            <p class="eyebrow">Idle hydration</p>
            <h2>Interactive spot two: waitlist widget</h2>
            <p>
              This widget is intentionally client-only. It does not contribute HTML on the server,
              but the surrounding section still explains what is happening and why it is isolated.
            </p>
          </div>
          <div class="client-only-frame">
            <p class="client-only-note">Client-only island mounts after the main content is ready.</p>
            <SignupIsland
              title="Join the pilot"
              blurb="Reserve a spot for the next batch of teams testing server-first Vue workflows."
              buttonLabel="Request Access"
            />
          </div>
        </section>

        <section class="faq-grid">
          <article class="faq-card">
            <h2>Do I lose Vue ergonomics?</h2>
            <p>
              No. Pages and islands are still Vue components. The difference is where they run and
              whether they hydrate.
            </p>
          </article>
          <article class="faq-card">
            <h2>Can another page stay fully static?</h2>
            <p>
              Yes. The pricing route in this example renders no islands at all, so it stays a pure
              server page even though the app supports interactive sections elsewhere.
            </p>
          </article>
        </section>
      </main>
    );
  },
});
