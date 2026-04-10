<template>
  <main class="cards-shell">
    <section class="cards-hero">
      <div>
        <p class="cards-eyebrow">Publisher and marketing workflow</p>
        <h1>Keep story pages and social cards in the same Vue codebase.</h1>
        <p class="cards-lede">
          This example is for editorial and marketing teams that want shareable visuals for every
          launch note, recap, or feature story without bouncing into a separate design pipeline for
          every variant.
        </p>
        <div class="cards-link-row">
          <a class="cards-link" href="/stories/launch-week">Open Example Story</a>
          <a class="cards-link cards-link--ghost" href="/cards/launch-week.png"
            >Open Generated Card</a
          >
        </div>
      </div>
      <aside class="cards-panel">
        <h2>What this example proves</h2>
        <ul class="cards-list">
          <li>The page and the social card can share the same route metadata.</li>
          <li>
            The social card is authored as a Vue SFC, not as a separate image template language.
          </li>
          <li>
            Chromium capture stays an explicit runtime option instead of leaking into every route.
          </li>
        </ul>
      </aside>
    </section>

    <section class="cards-grid">
      <article class="cards-panel">
        <h2>Why a dedicated OG example exists</h2>
        <p>
          Dynamic social cards are a strong fit for server-rendered apps, but they are easy to bury
          inside a generic routing demo. This example makes that workflow the whole point.
        </p>
      </article>
      <article class="cards-panel">
        <h2>One authoring model</h2>
        <p>
          The story page, metadata, and Chromium-backed card all live in the same repo and use the
          same route-first mental model.
        </p>
      </article>
    </section>

    <section class="cards-preview cards-panel">
      <h2>Quick note</h2>
      <p>
        To render the card at runtime you still install Playwright in the app and fetch Chromium
        once. The build stays lightweight because the renderer is only loaded when an image route
        actually runs.
      </p>
    </section>
  </main>
</template>
