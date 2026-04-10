<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  blurb: string;
  buttonLabel: string;
  title: string;
}>();

const email = ref("");
const submitted = ref(false);

function submitForm() {
  submitted.value = true;
}
</script>

<template>
  <aside class="signup-card">
    <template v-if="submitted">
      <p class="island-kicker">Client-Only Island</p>
      <h3>{{ title }}</h3>
      <p class="signup-copy">
        Thanks. We would follow up with <strong>{{ email || "your team" }}</strong> after the next
        server-first release candidate.
      </p>
      <button class="island-button" type="button" @click="submitted = false">Edit Request</button>
    </template>
    <template v-else>
      <p class="island-kicker">Client-Only Island</p>
      <h3>{{ title }}</h3>
      <p class="signup-copy">{{ props.blurb }}</p>
      <form class="signup-form" @submit.prevent="submitForm">
        <label class="signup-label" for="pilot-email">Work Email</label>
        <input id="pilot-email" v-model="email" class="signup-input" placeholder="team@example.com" type="email" />
        <button class="island-button" type="submit">{{ buttonLabel }}</button>
      </form>
    </template>
  </aside>
</template>
