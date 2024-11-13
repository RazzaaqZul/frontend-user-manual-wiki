<template>
  <main class="h-fit">
    <div class="flex justify-center items-center w-full">
      <div class="flex justify-between items-center w-[90%]">
        <NavbarComponent />
      </div>
    </div>
    <div class="relative">
      <img
        src="../assets/images/detail-background.png"
        class="w-full h-[6rem] sm:h-[7rem] lg:h-[10rem]"
      />
      <div class="absolute inset-0 flex items-center justify-center">
        <h1
          class="w-[60%] lg:w-[40%] text-center font-bold text-[12px] sm:text-[20px] lg:text-[25px] text-white-background"
        >
          {{ dataUserManual.title }}
        </h1>
      </div>
      <!-- button back to main page -->
      <div class="absolute left-[5%] top-[30%] flex justify-center items-center gap-4">
        <RouterLink to="/main">
          <div
            class="bg-white-background rounded-full p-2 hover:scale-110 duration-300 hover:shadow-2xl hover:shadow-dark-blue"
          >
            <img src="../assets/icon/icon-back.png" class="w-3 lg:w-8" />
          </div>
        </RouterLink>
        <p class="hidden lg:block text-white-background">back to main page</p>
      </div>
    </div>

    <section v-if="fetchingUserManuals">
      <div class="flex justify-center items-center h-[50vh]">
        <ProgressSpinner />
      </div>
    </section>

    <section v-else class="flex sticky">
      <!-- Sidebar sticky position -->
      <nav class="lg:w-[25%] fixed inset-0 lg:relative duration-1000">
        <DetailSideBar
          :dataUserManual="dataUserManual"
          :sidebarOpen="sidebarOpen"
          @update:sidebarOpen="sidebarOpen = $event"
          :class="[sidebarOpen ? '' : 'translate-x-[-100%] ']"
        >
        </DetailSideBar>
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
          Last Updated :
          <span class="font-light">{{ formatDate(dataUserManual.updated_at) }}</span>
        </div>
        <div class="flex justify-end items-center gap-2 my-4">
          <RouterLink
            :to="`/main/user-manuals/${dataUserManual.user_manual_id}/edit`"
            v-if="isDisplay"
          >
            <ButtonComponent
              icon="icon-edit.png"
              name="Edit"
              color="white-background"
              border="border-2 border-soft-blue"
              text="text-soft-blue"
            />
          </RouterLink>
          <RouterLink
            :to="`/main/user-manuals/${dataUserManual.user_manual_id}/histories`"
            v-if="isDisplay"
          >
            <ButtonComponent
              icon="icon-history.png"
              name="History"
              color="white-background"
              border="border-2 border-soft-blue"
              text="text-soft-blue"
            />
          </RouterLink>
        </div>
        <!-- Main content for the page goes here -->
        <DetailContent :content="dataUserManual.content" />
      </div>
    </section>

    <!-- Sidebar sticky position MOBILE -->
  </main>
</template>

<script setup>
import DetailContent from '@/components/Detail/DetailContent.vue'
import DetailSideBar from '@/components/Detail/DetailSideBar.vue'
// import SearchComponent from '@/components/SearchComponent.vue'
import { showUserManual } from '@/services/modules/UserManualService'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import ButtonComponent from '../components/ButtonComponent.vue'
import ProgressSpinner from 'primevue/progressspinner'
import { formatDate } from '@/helpers/FormatDate'
import NavbarComponent from '@/components/NavbarComponent.vue'
import { fetchUserRole } from '@/services/modules/UserService'

let dataUserManual = ref([]) // reactive data
const fetchingUserManuals = ref(false)
const route = useRoute()
const userRole = ref(null) // Placeholder for user role
const sidebarOpen = ref(false)

onMounted(async () => {
  try {
    fetchingUserManuals.value = true
    dataUserManual.value = await showUserManual(route.params.id)

    // Fetch user role
    userRole.value = await fetchUserRole() // Await the fetchUserRole function
  } catch (error) {
    console.error('Failed to fetch user manuals:', error)
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

// Determine if the user has permission to display content
const isDisplay = computed(
  () => userRole.value === 'admin' || userRole.value === 'technical_writer'
)
</script>
