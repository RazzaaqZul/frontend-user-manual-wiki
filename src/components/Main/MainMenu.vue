<template>
  <div
    v-if="!isLoading"
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-fit gap-4 content-center"
  >
    <div
      class="items-center justify-center flex"
      v-for="(item, index) in filteredUserManuals"
      :key="index"
    >
      <MainCard
        :user_manual_id="String(item.user_manual_id)"
        :title="item.title"
        :img="item.img"
        :short_desc="item.short_desc"
      />
    </div>
  </div>
  <div v-else class="flex justify-center items-center h-[50vh]">
    <ProgressSpinner />
  </div>
</template>

<script setup>
import { indexUserManual } from '@/services/modules/UserManualService'
import { computed, onMounted, ref } from 'vue'
import MainCard from './MainCard.vue'
import ProgressSpinner from 'primevue/progressspinner'
import { defineProps } from 'vue'

let dataUserManual = ref([])
const fetchingUserManuals = ref(false)
const isLoading = computed(() => fetchingUserManuals.value)
const props = defineProps({
  selectedCategory: {
    type: String,
    default: ''
  }
})

// Filter the user manuals based on selected category
const filteredUserManuals = computed(() => {
  if (!props.selectedCategory) {
    return dataUserManual.value
  }
  return dataUserManual.value.filter((manual) => manual.category === props.selectedCategory)
})

onMounted(async () => {
  fetchingUserManuals.value = true
  try {
    dataUserManual.value = await indexUserManual()
  } catch (error) {
    console.error('Failed to fetch user manuals:', error)
  } finally {
    fetchingUserManuals.value = false
  }
})
</script>
