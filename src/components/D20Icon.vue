<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    :class="props.class"
  >
    <!-- Outer D20 silhouette -->
    <polygon points="12 2 21.5 7.5 21.5 16.5 12 22 2.5 16.5 2.5 7.5" />
    <!-- Upper inner triangle vertex lines -->
    <line x1="12" y1="2" x2="12" y2="8" />
    <line x1="2.5" y1="7.5" x2="7.5" y2="10.5" />
    <line x1="21.5" y1="7.5" x2="16.5" y2="10.5" />
    <!-- Lower inner triangle vertex lines -->
    <line x1="12" y1="22" x2="7.5" y2="16.5" />
    <line x1="12" y1="22" x2="16.5" y2="16.5" />
    <line x1="2.5" y1="16.5" x2="7.5" y2="16.5" />
    <line x1="21.5" y1="16.5" x2="16.5" y2="16.5" />
    <!-- Center triangle -->
    <polygon points="12 8 7.5 16.5 16.5 16.5" />
    <line x1="7.5" y1="10.5" x2="12" y2="8" />
    <line x1="16.5" y1="10.5" x2="12" y2="8" />
    <line x1="7.5" y1="10.5" x2="7.5" y2="16.5" />
    <line x1="16.5" y1="10.5" x2="16.5" y2="16.5" />
  </svg>
</template>

<script setup lang="ts">
const props = defineProps<{
  class?: string;
}>();
</script>
