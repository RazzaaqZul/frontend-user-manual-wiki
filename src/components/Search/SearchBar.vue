<template>
  <div class="flex flex-col w-20">
    <div class="flex items-center bg-white rounded-full shadow-lg px-6 py-3 w-full">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari Petunjuk"
        class="flex-grow outline-none text-gray-500"
        @input="handleSearch"
        @keyup.enter="performSearch"
      />
      <img
        src="@/assets/icon/icon-search.png"
        alt="Search"
        class="w-5 h-5 cursor-pointer"
        @click="performSearch"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { userManualSeacrh } from '@/services/modules/UserManualService'

const router = useRouter()
const route = useRoute()
const emit = defineEmits(['update:searchResults', 'search-loading'])

const searchQuery = ref('')
let debounceTimeout = null

// Initialize search query from URL on component mount
onMounted(() => {
  const queryFromUrl = route.query.search
  if (queryFromUrl) {
    searchQuery.value = queryFromUrl
    performSearch()
  }
})

// Handle input with debouncing
const handleSearch = () => {
  if (debounceTimeout) clearTimeout(debounceTimeout)

  if (!searchQuery.value) {
    updateUrlAndSearch()
    return
  }

  debounceTimeout = setTimeout(() => {
    // Don't auto-search, just update URL
    router.push({
      query: {
        ...route.query,
        search: searchQuery.value || undefined
      }
    })
  }, 300)
}

// Update URL and perform search
const updateUrlAndSearch = async () => {
  await router.push({
    query: {
      ...route.query,
      search: searchQuery.value || undefined
    }
  })

  await performSearch()
}

// Perform the actual search
const performSearch = async () => {
  if (!searchQuery.value) {
    emit('update:searchResults', [])
    return
  }

  emit('search-loading', true)

  try {
    const response = await userManualSeacrh(searchQuery.value)
    emit('update:searchResults', response)
  } catch (error) {
    console.error('Failed to fetch search results:', error)
    emit('update:searchResults', [])
  } finally {
    emit('search-loading', false)
  }
}
</script>
