<template>
  <main class="h-fit">
    <div class="flex justify-center items-center w-full">
      <div class="flex justify-between items-center w-[90%]">
        <NavbarComponent />
      </div>
    </div>
    <div class="relative">
      <img src="../assets/images/detail-background.png" class="w-full" />
      <div class="absolute inset-0 flex items-center justify-center">
        <h1 class="font-bold text-[40px] text-white-background">{{ dataUserManual.title }}</h1>
      </div>
      <!-- button back to main page -->
      <div class="absolute left-[5%] top-[30%] flex justify-center items-center gap-4">
        <RouterLink to="/main">
          <div
            class="bg-white-background rounded-full p-2 hover:scale-110 duration-300 hover:shadow-2xl hover:shadow-dark-blue"
          >
            <img src="../assets/icon/icon-back.png" class="w-8" />
          </div>
        </RouterLink>
        <p class="text-white-background">back to main page</p>
      </div>
    </div>

    <div v-if="fetchingUserManuals">
      <div class="flex justify-center items-center h-[50vh]">
        <ProgressSpinner />
      </div>
    </div>

    <div v-else class="flex sticky top-0">
      <!-- Sidebar sticky position -->
      <DetailSideBar :dataUserManual="dataUserManual" />

      <!-- Main content area -->
      <div class="w-[80%] ml-auto p-20">
        <div class="font-semibold text-lg text-grey-word">
          Last Updated :
          <span class="font-light">{{ formatDate(dataUserManual.updated_at) }}</span>
        </div>
        <div class="flex justify-end items-center gap-2">
          <RouterLink :to="`/main/user-manuals/${dataUserManual.user_manual_id}/edit`">
            <ButtonComponent
              icon="icon-edit.png"
              name="Edit"
              color="white-background"
              border="border-2 border-soft-blue"
              text="text-soft-blue"
            />
          </RouterLink>
          <RouterLink :to="`/main/user-manuals/${dataUserManual.user_manual_id}/histories`">
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
    </div>
  </main>
</template>

<script setup>
import DetailContent from '@/components/Detail/DetailContent.vue'
import DetailSideBar from '@/components/Detail/DetailSideBar.vue'
// import SearchComponent from '@/components/SearchComponent.vue'
import { showUserManual } from '@/services/modules/UserManualService'
import { onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import ButtonComponent from '../components/ButtonComponent.vue'
import ProgressSpinner from 'primevue/progressspinner'
import { formatDate } from '@/helpers/FormatDate'
import NavbarComponent from '@/components/NavbarComponent.vue'

let dataUserManual = ref([]) // reactive data
const fetchingUserManuals = ref(false)

const route = useRoute()

onMounted(async () => {
  try {
    fetchingUserManuals.value = true
    dataUserManual.value = await showUserManual(route.params.id)
  } catch (error) {
    console.error('Failed to fetch user manuals:', error)
  } finally {
    fetchingUserManuals.value = false
  }
})
</script>
