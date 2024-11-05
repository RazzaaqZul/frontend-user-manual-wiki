<!-- SearchBar.vue -->
<template>
  <div class="flex flex-col w-20">
    <div class="flex items-center bg-white rounded-full shadow-lg px-6 py-3 w-full">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari Petunjuk"
        class="flex-grow outline-none text-gray-500"
        @input="handleSearch"
      />
      <img src="@/assets/icon/icon-search.png" alt="Search" class="w-5 h-5" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { userManualSeacrh } from '@/services/modules/UserManualService'

const router = useRouter()
const route = useRoute()
const emit = defineEmits(['update:searchResults'])

const searchQuery = ref('')
let debounceTimeout = null

// Initialize search query from URL on component mount
onMounted(() => {
  const queryFromUrl = route.query.search
  if (queryFromUrl) {
    searchQuery.value = queryFromUrl
    performSearch(queryFromUrl)
  }
})

// Handle search with debouncing
const handleSearch = () => {
  if (debounceTimeout) clearTimeout(debounceTimeout)

  debounceTimeout = setTimeout(() => {
    updateUrlAndSearch()
  }, 300) // Wait 300ms after last keystroke before searching
}

// Update URL and perform search
const updateUrlAndSearch = async () => {
  // Update URL with search query
  await router.push({
    query: {
      ...route.query,
      search: searchQuery.value || undefined // Remove search param if empty
    }
  })

  performSearch(searchQuery.value)
}

// Perform the actual search
const performSearch = async (query) => {
  if (!query) {
    emit('update:searchResults', [])
    return
  }

  try {
    const response = await userManualSeacrh(query)
    emit('update:searchResults', response)
  } catch (error) {
    console.error('Failed to fetch search results:', error)
    emit('update:searchResults', [])
  }
}
</script>
