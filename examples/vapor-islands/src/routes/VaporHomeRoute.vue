<script setup lang="ts">
import { VaporCounterIsland } from "../islands";
</script>

<template>
  <main class="vapor-shell">
    <section class="vapor-copy">
      <p class="eyebrow">Vapor hydration</p>
      <h1>Small runtime, real island hydration.</h1>
      <p>
        This fixture keeps the route server-rendered and hydrates only the counter island through
        the Vapor runtime.
      </p>
    </section>

    <VaporCounterIsland :initial="3" label="Vapor seats" />
  </main>
</template>
