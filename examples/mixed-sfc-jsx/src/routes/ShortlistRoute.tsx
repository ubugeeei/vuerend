import { defineComponent } from "vue";
import { AccentBadgeIsland, ReadingListIsland } from "../islands";
import { shortlistCards, shortlistWhyPoints } from "../data/buying-guide";

export default defineComponent({
  name: "ShortlistRoute",
  setup() {
    return () => (
      <main class="mixed-shell mixed-shell--library">
        <section class="mixed-hero">
          <div>
            <p class="mixed-eyebrow">JSX route, shared shortlist</p>
            <h1>The route changed, but the saved shortlist stayed with the tab.</h1>
            <p class="mixed-lede">
              This page is written in JSX instead of an SFC, but it reuses the same browser store
              key as the guide home page. That gives you an MPA-style shortlist without turning the
              whole app into a single hydrated runtime.
            </p>
          </div>
          <aside class="mixed-panel">
            <h2>Why this matters</h2>
            <ul class="mixed-list">
              {shortlistWhyPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </aside>
        </section>

        <section class="mixed-grid">
          <article class="mixed-card">
            <h2>{shortlistCards[0].title}</h2>
            <p>{shortlistCards[0].body}</p>
            <ReadingListIsland page="shortlist" />
          </article>
          <article class="mixed-card">
            <h2>{shortlistCards[1].title}</h2>
            <p>{shortlistCards[1].body}</p>
            <AccentBadgeIsland label="comparison live" />
          </article>
        </section>

        <nav class="mixed-link-row">
          <a class="mixed-link" href="/">
            Back to Guide Home
          </a>
        </nav>
      </main>
    );
  },
});
