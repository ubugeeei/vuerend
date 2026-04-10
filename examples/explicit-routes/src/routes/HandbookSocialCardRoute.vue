<script setup lang="ts">
defineProps<{
  description: string;
  eyebrow: string;
  title: string;
}>();
</script>

<template>
  <main class="og-shell">
    <section class="og-card">
      <div class="og-copy">
        <p class="og-eyebrow">{{ eyebrow }}</p>
        <h1 class="og-title">{{ title }}</h1>
        <p class="og-description">{{ description }}</p>
      </div>

      <aside class="og-panel">
        <span class="og-badge">Vue SFC</span>
        <ul class="og-list">
          <li>Explicit image route</li>
          <li>Handbook-ready social preview</li>
          <li>Headless Chromium capture</li>
        </ul>
      </aside>
    </section>
  </main>
</template>
