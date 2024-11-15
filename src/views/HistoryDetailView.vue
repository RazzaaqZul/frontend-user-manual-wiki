<template>
  <main class="h-fit">
    <div class="flex justify-center items-center w-full px-10">
      <NavbarComponent />
    </div>
    <div class="relative">
      <img
        src="../assets/images/detail-background.png"
        class="w-full h-[6rem] sm:h-[7rem] lg:h-[10rem]"
      />
      <div class="absolute inset-0 flex items-center justify-center">
        <h1
          class="fw-[60%] lg:w-[40%] text-center font-bold text-[12px] sm:text-[20px] lg:text-[25px] text-white-background"
        >
          {{ dataUserManualHistory.title }}
        </h1>
      </div>
      <!-- button back to main page -->
      <div class="absolute left-[5%] top-[30%] flex justify-center items-center gap-4">
        <RouterLink :to="`/main/user-manuals/${dataUserManualHistory.user_manual_id}/histories`">
          <div
            class="bg-white-background rounded-full p-2 hover:scale-110 duration-300 hover:shadow-2xl hover:shadow-dark-blue"
          >
            <img src="../assets/icon/icon-back.png" class="w-8" />
          </div>
        </RouterLink>
        <p class="text-white-background">back to history</p>
      </div>
    </div>

    <div v-if="fetchingUserManuals">
      <div class="flex justify-center items-center h-[50vh]">
        <ProgressSpinner />
      </div>
    </div>

    <!-- Main content area -->
    <section v-else class="flex sticky">
      <!-- Sidebar sticky position -->
      <nav class="lg:w-[25%] fixed inset-0 lg:relative duration-1000">
        <DetailSideBar
          :dataUserManual="dataUserManualHistory"
          :sidebarOpen="sidebarOpen"
          @update:sidebarOpen="sidebarOpen = $event"
          :class="[sidebarOpen ? '' : 'translate-x-[-100%]']"
        />
        <!-- Burger Bar -->
        <div
          class="w-fit h-fit bg-soft-blue p-3 rounded-full shadow-lg drop-shadow-lg fixed cursor-pointer z-10 transition-all duration-500"
          :class="[
            { 'opacity-0': sidebarOpen },
            isScrolledPastViewport
              ? 'bottom-5 left-5 lg:top-10 lg:left-14 lg:bottom-0'
              : 'bottom-5 left-5 lg:top-80 lg:left-14 lg:bottom-0 xl:left-16 2xl:left-20 '
          ]"
          @click="toggleSidebar"
        >
          <img src="../assets/icon/icon-humberger-bar.png" class="w-5" />
        </div>
      </nav>

      <!-- Main content area -->
      <div class="w-[100%] lg:w-[80%] ml-auto p-4 lg:p-20">
        <div class="font-semibold text-sm lg:text-lg text-grey-word">
          Terakhir diperbarui:
          <span class="font-light">{{ formatDate(dataUserManualHistory.updated_at) }}</span>
        </div>

        <!-- Main content for the page goes here -->
        <DetailContent :content="dataUserManualHistory.content" />
      </div>
    </section>
  </main>
</template>

<script setup>
import DetailContent from '@/components/Detail/DetailContent.vue'
import DetailSideBar from '@/components/Detail/DetailSideBar.vue'
import NavbarComponent from '@/components/NavbarComponent.vue'
import { formatDate } from '@/helpers/FormatDate'

import { indexUserManualHistory } from '@/services/modules/UserManualHistoryService'
import ProgressSpinner from 'primevue/progressspinner'
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
let dataUserManualHistory = ref([])
const fetchingUserManuals = ref(false)
const sidebarOpen = ref(false)
console.log(route.params)

onMounted(async () => {
  try {
    fetchingUserManuals.value = true
    const response = await indexUserManualHistory(route.params.id, route.params.historyId)
    if (response.status === 401) {
      router.push('/login')
      return response
    }
    dataUserManualHistory.value = response
  } catch (e) {
    return e
  } finally {
    fetchingUserManuals.value = false
  }
  window.addEventListener('scroll', checkScrollPosition)
  checkScrollPosition()
})

// Clean up
onUnmounted(() => {
  window.removeEventListener('scroll', checkScrollPosition)
})

const isScrolledPastViewport = ref(false)

const checkScrollPosition = () => {
  const viewportHeight = window.innerHeight / 2
  const scrollPosition = window.scrollY || window.pageYOffset
  isScrolledPastViewport.value = scrollPosition > viewportHeight
}

// Toggle sidebar
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}
</script>
