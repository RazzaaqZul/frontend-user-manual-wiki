<!-- components/SubTopic.vue -->
<template>
  <li class="flex flex-col">
    <div
      class="flex justify-between items-center cursor-pointer hover:text-yellow-custom duration-300"
      @click="toggleSubtopic"
    >
      <RouterLink :to="`main/user-manuals/${user_manual_id}#${subTopic_id}`">
        <span>{{ title }}</span>
      </RouterLink>
      <img
        v-if="subTopics.length > 0"
        src="../../assets/icon/icon-next-white.png"
        :class="['w-2 duration-300', isOpen ? 'rotate-90' : 'rotate-0']"
      />
    </div>
    <SubSubTopic :user_manual_id="user_manual_id" :subSubTopics="subTopics" :isOpen="isOpen" />
  </li>
</template>

<script setup>
// Import SubSubTopic component
import SubSubTopic from './MainSubSubTopic.vue'

// Props received from the parent component
defineProps({
  title: String,
  subTopics: Array,
  isOpen: Boolean,
  user_manual_id: String,
  subTopic_id: String,
  toggleSubtopic: Function
})
</script>

<style scoped>
/* Add custom styles if needed */
</style>
