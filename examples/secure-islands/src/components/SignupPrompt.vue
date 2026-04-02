<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

<template>
  <aside>
    <h2>{{ title }}</h2>
    <form>
      <input placeholder="email@example.com" type="email" />
      <button type="submit">Join</button>
    </form>
  </aside>
</template>
