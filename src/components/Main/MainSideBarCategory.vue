<!-- ManualListSection.vue -->
<template>
  <div>
    <!-- Section Header -->
    <div
      class="flex justify-between items-center border-b-2 border-b-grey-background py-2 cursor-pointer duration-200"
      @click="toggleOpen"
    >
      <h1 class="text-xl text-white-background">{{ title }}</h1>
      <img
        src="../../assets/icon/icon-next-white.png"
        :class="['w-2 duration-300', isOpen ? 'rotate-90' : 'rotate-0']"
      />
    </div>

    <!-- Manual List with Transition -->
    <transition name="dropdown">
      <div v-if="isOpen" class="text-white-background">
        <ul>
          <li
            v-for="manual in manuals"
            :key="manual.user_manual_id"
            class="py-2 pl-4 flex flex-col gap-4"
          >
            <div
              class="flex justify-between gap-2 items-center cursor-pointer text-[100%] mt-1"
              @click="toggleSubtopic(manual.user_manual_id, manual.title)"
            >
              <div class="flex gap-3">
                <img src="../../assets/icon/icon-home.png" class="w-6 h-6" />
                <RouterLink :to="`main/user-manuals/${manual.user_manual_id}`">
                  <h1 class="font-semibold hover:text-yellow-custom duration-500">
                    {{ manual.title }}
                  </h1>
                </RouterLink>
              </div>
              <img
                src="../../assets/icon/icon-next-white.png"
                class="w-2"
                :class="[
                  isOpenSubtopic(manual.user_manual_id, manual.title) ? 'rotate-90' : 'rotate-0'
                ]"
              />
            </div>

            <!-- SubTopics -->
            <transition name="dropdown">
              <ul
                v-if="isOpenSubtopic(manual.user_manual_id, manual.title)"
                class="text-[90%] pl-[16%] flex flex-col gap-4 py-1"
              >
                <SubTopic
                  v-for="subTopic in getSubTopics(manual.content)"
                  :key="subTopic.title"
                  :user_manual_id="String(manual.user_manual_id)"
                  :subTopic_id="String(subTopic.id)"
                  :title="subTopic.title"
                  :subTopics="subTopic.subTopics"
                  :isOpen="isOpenSubtopic(manual.user_manual_id, subTopic.title)"
                  :toggleSubtopic="() => toggleSubtopic(manual.user_manual_id, subTopic.title)"
                />
              </ul>
            </transition>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SubTopic from './MainSubTopic.vue'

// Props to receive
defineProps({
  title: String,
  manuals: Array,
  getSubTopics: Function
})

// Local state to handle open/close
const isOpen = ref(false)
const openSubtopics = ref({})

// Toggle open/close section
const toggleOpen = () => {
  isOpen.value = !isOpen.value
}

// Toggle subtopics open/close
const toggleSubtopic = (manualId, subTopic) => {
  if (!openSubtopics.value[manualId]) {
    openSubtopics.value[manualId] = {}
  }

  openSubtopics.value[manualId][subTopic] = !openSubtopics.value[manualId][subTopic]
}

// Check if subtopic is open
const isOpenSubtopic = (manualId, subTopic) => {
  return !!openSubtopics.value[manualId]?.[subTopic]
}
</script>

<style scoped>
/* Dropdown transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
.dropdown-enter-to,
.dropdown-leave-from {
  transform: translateY(0);
  opacity: 1;
}
</style>
