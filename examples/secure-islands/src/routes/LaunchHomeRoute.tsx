import { defineComponent } from "vue";
import { CounterIsland, SignupIsland } from "../islands";
import {
  launchFaq,
  launchHighlights,
  launchProofStrip,
  launchStoryCards,
} from "../data/launch-week";

export default defineComponent({
  name: "LaunchHomeRoute",
  setup() {
    return () => (
      <main class="secure-shell">
        <section class="hero-grid">
          <div>
            <p class="eyebrow">Launch week microsite</p>
            <h1>
              Run a campaign page that stays mostly static, even when it needs a little
              interactivity.
            </h1>
            <p class="lede">
              This example is for product launches, conferences, and waitlist pages. The hero, proof
              points, and FAQ stay as server-rendered HTML, while the seat estimator and signup flow
              hydrate as isolated islands.
            </p>
            <div class="cta-row">
              <a class="primary-link" href="/pricing">
                View Programs
              </a>
              <a class="secondary-link" href="#interactive-spots">
                See Live Spots
              </a>
            </div>
          </div>
          <aside class="hero-card">
            <h2>What hydrates here?</h2>
            <ul class="feature-list">
              {launchHighlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </aside>
        </section>

        <section class="story-grid">
          {launchStoryCards.map((card) => (
            <article class="story-card" key={card.title}>
              <h2>{card.title}</h2>
              <p>{card.body}</p>
            </article>
          ))}
        </section>

        <section class="proof-strip">
          {launchProofStrip.map((item) => (
            <div key={item.label}>
              <strong>{item.label}</strong>
              <span>{item.body}</span>
            </div>
          ))}
        </section>

        <section class="interactive-grid" id="interactive-spots">
          <div class="section-copy">
            <p class="eyebrow">Visible hydration</p>
            <h2>Interactive spot one: workshop seat estimator</h2>
            <p>
              This island is SSR-rendered so it appears in the initial HTML, then hydrates only when
              it becomes visible. That keeps interactivity narrow without hiding useful capacity
              information behind JavaScript.
            </p>
          </div>
          <CounterIsland initial={14} label="Workshop seats remaining" />
        </section>

        <section class="interactive-grid interactive-grid--signup">
          <div class="section-copy">
            <p class="eyebrow">Idle hydration</p>
            <h2>Interactive spot two: concierge signup</h2>
            <p>
              This widget is intentionally client-only. It does not contribute HTML on the server,
              but the surrounding section still explains what is happening and why it is isolated.
            </p>
          </div>
          <div class="client-only-frame">
            <p class="client-only-note">
              Client-only island mounts after the main content is ready.
            </p>
            <SignupIsland
              title="Book a concierge demo"
              blurb="Leave a work email and the launch team will follow up with tailored rollout slots."
              buttonLabel="Request Demo"
            />
          </div>
        </section>

        <section class="faq-grid">
          {launchFaq.map((item) => (
            <article class="faq-card" key={item.title}>
              <h2>{item.title}</h2>
              <p>{item.body}</p>
            </article>
          ))}
        </section>
      </main>
    );
  },
});
