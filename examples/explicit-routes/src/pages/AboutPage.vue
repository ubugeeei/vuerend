<template>
  <main class="page-shell page-shell--about">
    <section class="hero-grid">
      <div>
        <p class="eyebrow">Why explicit routes?</p>
        <h1>They make the project motivation easier to see.</h1>
        <p class="lede">
          Vue Server is not trying to hide routing behind conventions. It is trying to make
          server-rendered pages, metadata, and deployment targets feel small and composable.
        </p>
      </div>
      <aside class="about-panel">
        <h2>Good fits</h2>
        <ul class="feature-list">
          <li>Marketing pages and content sites</li>
          <li>Internal tools with server-owned navigation</li>
          <li>Documentation and release notes</li>
          <li>Apps that want links and documents first, islands second</li>
        </ul>
      </aside>
    </section>

    <section class="card-grid">
      <article class="feature-card">
        <h2>Route + metadata together</h2>
        <p>
          The route definition already knows which component renders the page, so it is a natural
          place for the page title, Open Graph tags, cache policy, and prerender settings too.
        </p>
      </article>
      <article class="feature-card">
        <h2>No implicit client shell</h2>
        <p>
          A normal anchor moves between pages. If a page does not render an island, it does not
          hydrate any client code just to exist.
        </p>
      </article>
      <article class="feature-card">
        <h2>Small deployment model</h2>
        <p>
          The same route model can later be paired with caching, middleware, or different runtime
          adapters without changing how pages are authored.
        </p>
      </article>
    </section>

    <nav class="link-row">
      <a class="link-chip" href="/">Back Home</a>
    </nav>
  </main>
</template>
