<template>
  <div
    :class="[
      'scrollbar scrollbar-thumb-white-background w-[100%] sm:w-[50%] md:w-[50%] lg:w-[24%] xl:w-[22%] bg-dark-blue overflow-y-auto h-screen fixed z-50 duration-1000',
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    ]"
  >
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
              :class="['w-2 duration-300', !sidebarOpen ? 'rotate-180' : 'rotate-0']"
            />
          </div>
        </div>

        <!-- Home -->
        <RouterLink to="/" class="flex justify-start items-center gap-3 mt-7 mb-4">
          <img src="../../assets/icon/icon-home.png" class="w-6" />
          <h1
            class="text-[100%] font-bold text-white-background hover:text-yellow-custom duration-300"
          >
            Home
          </h1>
        </RouterLink>

        <!-- Internal Section -->
        <MainSideCategory
          title="Internal"
          :manuals="filteredManuals('internal')"
          :getSubTopics="getSubTopics"
        />

        <!-- Eksternal Section -->
        <MainSideCategory
          title="Eksternal"
          :manuals="filteredManuals('eksternal')"
          :getSubTopics="getSubTopics"
        />
      </section>
    </div>
  </div>
</template>

<script setup>
import { getSubTopics } from '@/helpers/GetSubTopics'
import MainSideCategory from './MainSideBarCategory.vue'
import { indexUserManual } from '@/services/modules/UserManualService'
import { ref, onMounted } from 'vue'

defineProps({
  sidebarOpen: Boolean
})

let dataUserManual = ref([])
const fetchingUserManuals = ref(false)

onMounted(async () => {
  try {
    fetchingUserManuals.value = true
    dataUserManual.value = await indexUserManual()
  } catch (error) {
    console.error('Failed to fetch user manuals:', error)
  } finally {
    fetchingUserManuals.value = false
  }
})

const filteredManuals = (category) => {
  if (!Array.isArray(dataUserManual.value)) {
    return [] // Return an empty array to prevent further errors
  }

  return dataUserManual.value.filter((manual) => manual.category === category)
}
</script>
