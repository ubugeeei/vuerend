<script setup lang="ts">
import { computed, ref } from "vue";

const props = defineProps<{
  initial: number;
  label: string;
}>();

const count = ref(props.initial);
const doubled = computed(() => count.value * 2);
</script>

<template>
  <article class="counter-card" data-testid="counter">
    <p class="counter-card__label">{{ label }}</p>
    <p class="counter-card__value" data-testid="counter-count">{{ count }}</p>
    <p class="counter-card__meta">double {{ doubled }}</p>
    <button type="button" data-testid="counter-increment" @click="count += 1">Increment</button>
  </article>
</template>

<style scoped>
.counter-card {
  border: 1px solid #d7dde5;
  border-radius: 8px;
  display: grid;
  font-family: system-ui, sans-serif;
  gap: 10px;
  max-width: 280px;
  padding: 20px;
}

.counter-card__label,
.counter-card__meta {
  color: #51606f;
  margin: 0;
}

.counter-card__value {
  font-size: 36px;
  line-height: 1;
  margin: 0;
}

button {
  background: #12343b;
  border: 0;
  border-radius: 6px;
  color: #fff;
  cursor: pointer;
  font: inherit;
  padding: 10px 12px;
}
</style>
