import { defineComponent } from "vue";

export default defineComponent({
  name: "LaunchWeekStoryRoute",
  props: {
    eyebrow: {
      required: true,
      type: String,
    },
    summary: {
      required: true,
      type: String,
    },
    title: {
      required: true,
      type: String,
    },
  },
  setup(props) {
    return () => (
      <main class="cards-shell">
        <article class="cards-story">
          <p class="cards-eyebrow">{props.eyebrow}</p>
          <h1>{props.title}</h1>
          <p class="cards-lede">{props.summary}</p>
          <div class="cards-link-row">
            <a class="cards-link" href="/cards/launch-week.png">
              Open Generated Card
            </a>
            <a class="cards-link cards-link--ghost" href="/">
              Back to Overview
            </a>
          </div>
        </article>

        <section class="cards-grid">
          <article class="cards-panel">
            <h2>Why teams ask for this</h2>
            <p>
              Story pages often need unique share images for every announcement. If the images live
              in the same route model as the page, it is easier to keep titles, summaries, and
              publishing flows in sync.
            </p>
          </article>
          <article class="cards-panel">
            <h2>How Vuerend approaches it</h2>
            <p>
              The HTML for the card is rendered from a Vue component, then passed to an explicit
              Chromium-backed image renderer. That keeps the route authoring model small and
              intentional.
            </p>
          </article>
        </section>
      </main>
    );
  },
});
