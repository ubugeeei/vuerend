<script setup lang="ts">
import { handbookGoodFits, handbookPrinciples } from "../data/handbook";
</script>

<template>
  <main class="page-shell page-shell--about">
    <section class="hero-grid">
      <div>
        <p class="eyebrow">Why explicit routes fit handbooks</p>
        <h1>They make the publishing model easy to inspect.</h1>
        <p class="lede">
          A handbook often has a small number of durable pages with owned URLs. Vuerend keeps those
          routes visible so a team can reason about content, metadata, and deployment without
          searching through routing magic.
        </p>
      </div>
      <aside class="about-panel">
        <h2>Good fits</h2>
        <ul class="feature-list">
          <li v-for="item in handbookGoodFits" :key="item">{{ item }}</li>
        </ul>
      </aside>
    </section>

    <section class="card-grid">
      <article v-for="principle in handbookPrinciples" :key="principle.title" class="feature-card">
        <h2>{{ principle.title }}</h2>
        <p>{{ principle.body }}</p>
      </article>
    </section>

    <nav class="link-row">
      <a class="link-chip" href="/">Back to Handbook</a>
    </nav>
  </main>
</template>
