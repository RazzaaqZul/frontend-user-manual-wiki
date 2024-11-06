<template>
  <!-- Count results -->
  <div v-if="route.query.search" class="flex flex-col justify-start gap-2">
    <template v-if="actualMatchCount > 0">
      <h1 class="text-dark-blue text-xl font-semibold">{{ actualMatchCount }} results found</h1>
      <h2 class="text-grey-word">
        Create the page <span class="text-soft-blue font-semibold">"{{ query }}"</span> on this
        wiki! See also the search results found.
      </h2>
    </template>
    <template v-else>
      <SearchNotFound />
    </template>
  </div>

  <!-- Container for main content or search results -->
  <div
    v-if="!isLoading"
    :class="{
      'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-fit gap-4 content-center':
        !route.query.search && !props.searchResults.length,
      'flex flex-col gap-5 mt-5 justify-start items-start':
        route.query.search || props.searchResults.length
    }"
  >
    <!-- Display each item -->
    <div
      class="items-center justify-center flex w-full"
      v-for="(item, index) in displayedUserManuals"
      :key="index"
    >
      <MainCard
        v-if="!route.query.search && !props.searchResults.length"
        :user_manual_id="String(item.user_manual_id)"
        :title="item.title"
        :img="item.img"
        :short_desc="item.short_desc"
        class="animate__animated animate__flipInX"
      />
      <SearchMain v-else :user_manual="item" @search-result="handleSearchResult(index, $event)" />
    </div>
  </div>

  <!-- Loading Spinner -->
  <div v-else class="flex justify-center items-center h-[50vh]">
    <ProgressSpinner />
  </div>

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
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import MainCard from './MainCard.vue'
import ProgressSpinner from 'primevue/progressspinner'
import SearchMain from '../Search/SearchMain.vue'
import SearchNotFound from '../Search/SearchNotFound.vue'

const route = useRoute()
const dataUserManual = ref([])
const fetchingUserManuals = ref(false)
const isLoading = computed(() => fetchingUserManuals.value)
const query = ref('')
const searchMatchMap = ref(new Map()) // Track which items actually matched the search
const isEmpty = ref(false)
const props = defineProps({
  selectedCategory: {
    type: String,
    default: ''
  },
  searchResults: {
    type: Array,
    default: () => []
  }
})

// Handle search results from individual SearchMain components
const handleSearchResult = (index, hasMatch) => {
  const newMatchMap = new Map(searchMatchMap.value) // Clone the map to trigger reactivity
  newMatchMap.set(index, hasMatch)
  searchMatchMap.value = newMatchMap
  console.log('Updated searchMatchMap:', Array.from(searchMatchMap.value.entries()))
}

// Count actual matches based on SearchMain results
const actualMatchCount = computed(() => {
  const count = Array.from(searchMatchMap.value.values()).filter(Boolean).length
  console.log('Computed actualMatchCount:', count)
  return count
})

// Filter the user manuals based on selected category or search results
const displayedUserManuals = computed(() => {
  if (props.searchResults.length) {
    return props.searchResults
  }
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
    return error
  } finally {
    fetchingUserManuals.value = false
  }
}

// Watch for route query changes to handle search and reset searchMatchMap
watch(
  () => route.query.search,
  async (newQuery) => {
    query.value = newQuery || ''
    searchMatchMap.value = new Map() // Reset match map when query changes
    if (!newQuery && !props.searchResults.length) {
      // Reset to showing all manuals when search is cleared
      await fetchUserManuals()
    }
  },
  { immediate: true }
)

onMounted(async () => {
  await fetchUserManuals()
})
</script>
