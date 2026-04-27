<script setup vapor lang="ts">
import { computed, ref } from "vue";

const props = defineProps<{
  initial: number;
  label: string;
}>();

const count = ref(props.initial);
const status = computed(() => `${props.label}: ${count.value}`);
</script>

<template>
  <article class="vapor-counter" data-testid="vapor-counter">
    <p class="eyebrow">Hydrated island</p>
    <h2>{{ status }}</h2>
    <p class="count" data-testid="vapor-count">{{ count }}</p>
    <button type="button" data-testid="increment" @click="count += 1">Add seat</button>
  </article>
</template>
