<script setup lang="ts">
import { AccentBadgeIsland, ReadingListIsland } from "../islands";
</script>

<template>
  <main class="mixed-shell">
    <section class="mixed-hero">
      <div>
        <p class="mixed-eyebrow">SFC route, JSX islands</p>
        <h1>Keep server-rendered pages simple, then opt into browser state only where it matters.</h1>
        <p class="mixed-lede">
          This route is a Vue SFC page. The interactive badge and reading list live in JSX islands,
          which lets a team mix authoring styles without changing the server-first mental model.
        </p>
        <div class="mixed-link-row">
          <a class="mixed-link" href="/library">Open JSX route</a>
        </div>
      </div>
      <aside class="mixed-panel">
        <h2>What this example proves</h2>
        <ul class="mixed-list">
          <li>Pages can be SFCs while islands are JSX.</li>
          <li>`useClientState()` survives full page navigations in the same tab.</li>
          <li>The shared browser state is still opt-in and local to hydrated islands.</li>
        </ul>
      </aside>
    </section>

    <section class="mixed-grid">
      <article class="mixed-card">
        <h2>Server-first page shell</h2>
        <p>
          The hero copy, layout, and navigation are plain server-rendered markup. Vuerend does
          not assume a client router or a hydrated shell before anything can happen.
        </p>
      </article>
      <article class="mixed-card">
        <h2>Small interactive badge</h2>
        <p>
          The badge below is a tiny JSX island. It is here to show that interactive pieces can stay
          intentionally small and framework-agnostic inside a server page.
        </p>
        <AccentBadgeIsland label="hydrated on demand" />
      </article>
    </section>

    <ReadingListIsland page="home" />
  </main>
</template>
