<script setup lang="ts">
import { AccentBadgeIsland, ReadingListIsland } from "../islands";
import { guideHomeCards, guideWhyPoints } from "../data/buying-guide";
</script>

<template>
  <main class="mixed-shell">
    <section class="mixed-hero">
      <div>
        <p class="mixed-eyebrow">SFC page, JSX shortlist</p>
        <h1>Run a buying guide as documents, with a saved shortlist that survives page hops.</h1>
        <p class="mixed-lede">
          This route is a Vue SFC guide page. The interactive badge and shortlist live in JSX
          islands, which lets a team mix authoring styles without turning the whole MPA into a
          hydrated client app.
        </p>
        <div class="mixed-link-row">
          <a class="mixed-link" href="/library">Open Shortlist View</a>
        </div>
      </div>
      <aside class="mixed-panel">
        <h2>Why this example exists</h2>
        <ul class="mixed-list">
          <li v-for="point in guideWhyPoints" :key="point">{{ point }}</li>
        </ul>
      </aside>
    </section>

    <section class="mixed-grid">
      <article v-for="card in guideHomeCards" :key="card.title" class="mixed-card">
        <h2>{{ card.title }}</h2>
        <p>{{ card.body }}</p>
        <AccentBadgeIsland v-if="card.title === 'Small interactive signal'" label="editor's pick" />
      </article>
    </section>

    <ReadingListIsland page="guide home" />
  </main>
</template>
