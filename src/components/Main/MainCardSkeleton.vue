<template>
  <div class="animate-pulse">
    <!-- Skeleton block for text or image placeholders -->
    <div :class="`${sizeClass} bg-grey-input rounded`"></div>
  </div>
</template>

<script setup>
defineProps({
  sizeClass: {
    type: String,
    default: 'w-full h-4' // default size for text placeholders
  }
})
</script>
