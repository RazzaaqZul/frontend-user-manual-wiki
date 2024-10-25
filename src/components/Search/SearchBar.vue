<template>
  <div class="flex flex-col w-20">
    <div class="flex items-center bg-white rounded-full shadow-lg px-6 py-3 w-full">
      <input
        v-model="input"
        type="text"
        placeholder="Cari Petunjuk"
        class="flex-grow outline-none text-gray-500"
      />
      <img src="@/assets/icon/icon-search.png" alt="Search" class="w-5 h-5" />
    </div>

    <!-- <section v-for="(content, index) in contents" :key="index" class="mt-4">
      <SearchItem :data="content" />
    </section> -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// import SearchItem from './SearchItem.vue'
import { parseContent } from '../../helpers/GetParseContent'
import { indexUserManual } from '../../services/modules/UserManualService'

// Declare contents as a reactive reference
let input = ref('')
let contents = ref([]) // Use ref for reactivity
const fetchingUserManuals = ref(false)

onMounted(async () => {
  fetchingUserManuals.value = true
  try {
    const dataUserManual = await indexUserManual() // Get data from the service
    contents.value = dataUserManual.map((item) => {
      // Assign the mapped data to contents
      const contentParsed = parseContent(item.content) // Call parseContent to clean content
      return {
        user_manual_id: item.user_manual_id,
        title: item.title,
        content: contentParsed
      }
    })
    console.log(contents.value) // Log the contents
  } catch (error) {
    console.error('Failed to fetch user manuals:', error)
  } finally {
    fetchingUserManuals.value = false
  }
})
</script>

<style scoped></style>
