<script setup lang="ts">
defineProps<{
  description: string;
  eyebrow: string;
  title: string;
}>();
</script>

<template>
  <main class="social-card">
    <section class="social-frame">
      <div class="social-copy">
        <p class="social-eyebrow">{{ eyebrow }}</p>
        <h1 class="social-title">{{ title }}</h1>
        <p class="social-description">{{ description }}</p>
      </div>

      <aside class="social-meta">
        <span class="social-badge">Vue SFC</span>
        <ul class="social-points">
          <li>Explicit image route</li>
          <li>Chromium-backed capture</li>
          <li>Metadata stays with the story page</li>
        </ul>
      </aside>
    </section>
  </main>
</template>
