<template>
  <!-- Container for main content -->
  <div
    v-if="!isLoading"
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-fit gap-4 content-center"
  >
    <!-- Display each item -->
    <div
      class="items-center justify-center flex w-full"
      v-for="(item, index) in displayedUserManuals"
      :key="index"
    >
      <MainCard
        :user_manual_id="String(item.user_manual_id)"
        :title="item.title"
        :img="item.img"
        :short_desc="item.short_desc"
        class="animate__animated animate__flipInX"
      />
    </div>
  </div>

  <!-- Loading Spinner -->
  <div v-else class="flex justify-center items-center h-[50vh]">
    <ProgressSpinner />
  </div>

  <!-- Empty State -->
  <div
    v-if="isEmpty"
    class="flex flex-col gap-10 justify-center items-center h-[50vh] animate__animated animate__tada"
  >
    <img src="../../assets/images/image-search-not-found.png" class="w-[20%]" />
    <h1 class="font-semibold text-soft-blue">
      Try creating the page of User Manual on this wiki to help others!
    </h1>
  </div>
</template>

<script setup>
import { indexUserManual } from '@/services/modules/UserManualService'
import { computed, onMounted, ref } from 'vue'
import MainCard from './MainCard.vue'
import ProgressSpinner from 'primevue/progressspinner'

const dataUserManual = ref([])
const fetchingUserManuals = ref(false)
const isLoading = computed(() => fetchingUserManuals.value)
const isEmpty = ref(false)

const props = defineProps({
  selectedCategory: {
    type: String,
    default: ''
  }
})

// Filter the user manuals based on selected category
const displayedUserManuals = computed(() => {
  if (!props.selectedCategory) {
    return dataUserManual.value
  }
  return dataUserManual.value.filter((manual) => manual.category === props.selectedCategory)
})

const fetchUserManuals = async () => {
  fetchingUserManuals.value = true
  try {
    const response = await indexUserManual()
    if (response.status === 404) {
      return (isEmpty.value = true)
    }
    dataUserManual.value = response || []
  } catch (error) {
    console.error('Error fetching user manuals:', error)
    return error
  } finally {
    fetchingUserManuals.value = false
  }
}

onMounted(async () => {
  await fetchUserManuals()
})
</script>
