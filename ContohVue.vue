<template>
  <div
    :class="[
      'scrollbar scrollbar-thumb-rounded-full scrollbar-thumb-grey-background w-[22%] bg-dark-blue overflow-y-auto h-screen fixed z-50 duration-1000',
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    ]"
  >
    <!-- Sidebar content -->
    <div class="flex flex-col h-full">
      <section class="p-5">
        <div class="flex justify-center items-center gap-6">
          <img src="../../assets/icon/logo-bpjamsostek-white.png" class="w-40" />
          <div
            class="bg-soft-blue rounded-full w-fit py-2 px-3 cursor-pointer"
            @click="$emit('update:sidebarOpen', !sidebarOpen)"
          >
            <img
              src="../../assets/icon/icon-next-white.png"
              :class="['w-2 duration-300 ', !sidebarOpen ? 'rotate-180' : 'rotate-0']"
            />
          </div>
        </div>

        <div class="flex flex-col justify-start gap-3">
          <RouterLink
            to="/"
            class="flex justify-start items-center text-white-background hover:text-yellow-custom duration-300 gap-3 font-medium mt-10"
          >
            <img src="../../assets/icon/icon-home.png" class="w-6" />
            <h2>Home</h2>
          </RouterLink>

          <div
            class="flex justify-between items-center border-b-2 border-b-grey-background py-2 cursor-pointer"
            @click="toggleInternal"
          >
            <h1 class="text-xl text-white-background">Internal</h1>
            <img
              src="../../assets/icon/icon-next-white.png"
              :class="['w-2 duration-300', isOpenInternal ? 'rotate-90' : 'rotate-0']"
            />
          </div>

          <div v-if="isOpenInternal" class="pl-6 text-white-background">
            <ul>
              <li
                v-for="manual in filteredManuals('internal')"
                :key="manual.id"
                class="py-2 flex flex-col justify-start items-start gap-2 hover:text-yellow-custom duration-300"
              >
                <img src="../../assets/icon/icon-home.png" class="w-6" />
                <h1 class="font-semibold">{{ manual.title }}</h1>
                <ul class="pl-4">
                  <li
                    v-for="subTopic in getSubTopics(manual.content)"
                    :key="subTopic"
                    class="py-1 text-sm"
                  >
                    <span class="text-yellow-custom">▶</span> {{ subTopic }}
                  </li>
                </ul>
              </li>
            </ul>
          </div>

          <div
            class="flex justify-between items-center border-b-2 border-b-grey-background py-2 cursor-pointer"
            @click="toggleEksternal"
          >
            <h1 class="text-xl text-white-background">Eksternal</h1>
            <img
              src="../../assets/icon/icon-next-white.png"
              :class="['w-2 duration-300', isOpenEksternal ? 'rotate-90' : 'rotate-0']"
            />
          </div>

          <div v-if="isOpenEksternal" class="pl-6 text-white-background">
            <ul>
              <li
                v-for="manual in filteredManuals('eksternal')"
                :key="manual.id"
                class="py-2 flex flex-col justify-start items-start gap-2 hover:text-yellow-custom duration-300"
              >
                <img src="../../assets/icon/icon-home.png" class="w-6" />
                <h1 class="font-semibold">{{ manual.title }}</h1>
                <ul class="pl-4">
                  <li
                    v-for="subTopic in getSubTopics(manual.content)"
                    :key="subTopic"
                    class="py-1 text-sm"
                  >
                    <span class="text-yellow-custom">▶</span> {{ subTopic }}
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { indexUserManual } from '@/services/modules/UserManualService'
import { onMounted, ref } from 'vue'

// Props from parent component
defineProps({
  sidebarOpen: Boolean
})

// Local states for internal and external sections
const isOpenInternal = ref(false)
const isOpenEksternal = ref(false)

// Functions to toggle internal and external sections
const toggleInternal = () => {
  isOpenInternal.value = !isOpenInternal.value
}

const toggleEksternal = () => {
  isOpenEksternal.value = !isOpenEksternal.value
}

// Data and fetching logic
let dataUserManual = ref([]) // reactive data
const fetchingUserManuals = ref(false)

// Fetch user manual data on component mount
onMounted(async () => {
  try {
    fetchingUserManuals.value = true
    dataUserManual.value = await indexUserManual()
    console.log(dataUserManual.value)
  } catch (error) {
    console.error('Failed to fetch user manuals:', error)
  } finally {
    fetchingUserManuals.value = false
  }
})

// Filter function for user manuals by category (Internal or Eksternal)
const filteredManuals = (category) => {
  return dataUserManual.value.filter((manual) => manual.category === category)
}

// Function to extract subtopics from long text
const getSubTopics = (longText) => {
  // Regular expression to match <h1> tags and split the content
  const subTopics = longText.split(/<h1>/).filter((section) => section.trim() !== '')
  return subTopics.map((section) => {
    const [title] = section.split(/<\/h1>/)
    return title.trim() // Ambil hanya judul
  })
}
</script>
