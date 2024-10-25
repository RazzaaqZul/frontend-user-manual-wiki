<!-- components/SubSubTopic.vue -->
<template>
  <ul v-if="isOpen" class="pl-[10%] text-[87%] flex flex-col">
    <li
      v-for="subSubTopic in subSubTopics"
      :key="subSubTopic"
      class="mt-3 hover:text-yellow-custom duration-300"
    >
      <RouterLink :to="`main/user-manuals/${user_manual_id}#${subSubTopic.id}`">
        {{ subSubTopic.title }}
      </RouterLink>
    </li>
  </ul>
</template>

<script setup>
// Props received from the parent component
defineProps({
  subSubTopics: Array,
  user_manual_id: String,
  isOpen: Boolean
})
</script>

<style scoped>
/* Add custom styles if needed */
</style>
