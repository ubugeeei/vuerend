import { defineComponent } from "vue";
import { handbookFeatureCards, handbookHeroPoints } from "../data/handbook";

export default defineComponent({
  name: "HandbookHomeRoute",
  setup() {
    return () => (
      <main class="page-shell">
        <section class="hero-grid">
          <div>
            <p class="eyebrow">Handbook and policy hub</p>
            <h1>Publish team guidance as documents and links, not as a client shell.</h1>
            <p class="lede">
              This example models a Zero JavaScript-first handbook for onboarding, release rituals,
              and operating policies. The route table keeps every page visible, which is often
              clearer than hidden conventions when the site is mostly SSG documents.
            </p>
            <div class="link-row">
              <a class="link-chip" href="/about">
                Why This Structure Works
              </a>
            </div>
          </div>
          <aside class="feature-card feature-card--hero">
            <h2>Why this example exists</h2>
            <ul class="feature-list">
              {handbookHeroPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </aside>
        </section>

        <section class="card-grid">
          {handbookFeatureCards.map((card) => (
            <article class="feature-card" key={card.title}>
              <h2>{card.title}</h2>
              <p>{card.body}</p>
            </article>
          ))}
        </section>

        <section class="manifest-panel">
          <p class="eyebrow">A better fit for certain teams</p>
          <h2>Think in pages, not in routing machinery.</h2>
          <p>
            If the work is mostly publishing server-rendered documents with anchors, metadata, and a
            little optional enhancement, explicit routes often read more like an editing system than
            a framework puzzle.
          </p>
        </section>
      </main>
    );
  },
});
