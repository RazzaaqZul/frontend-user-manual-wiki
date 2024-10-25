<template>
  <main class="h-fit">
    <div class="flex justify-center items-center w-full my-4">
      <NavbarComponent />
    </div>
    <div class="relative">
      <img src="../assets/images/detail-background.png" class="w-full" />
      <div class="absolute inset-0 flex items-center justify-center">
        <h1 class="font-bold text-[40px] text-white-background">
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

    <div v-else class="flex sticky top-0">
      <!-- Sidebar sticky position -->
      <DetailSideBar :dataUserManual="dataUserManualHistory" />

      <!-- Main content area -->
      <div class="w-[80%] ml-auto p-20">
        <div class="font-semibold text-lg text-grey-word">
          Created at :
          <span class="font-light">{{ formatDateTime(dataUserManualHistory.updated_at) }}</span>
        </div>
        <div class="font-semibold text-lg text-grey-word">
          Version :
          <span class="font-light">{{ dataUserManualHistory.version }}</span>
        </div>
        <!-- Main content for the page goes here -->
        <DetailContent :content="dataUserManualHistory.content" />
      </div>
    </div>
  </main>
</template>

<script setup>
import DetailContent from '@/components/Detail/DetailContent.vue'
import DetailSideBar from '@/components/Detail/DetailSideBar.vue'
import NavbarComponent from '@/components/NavbarComponent.vue'

import { formatDateTime } from '@/helpers/FormatDate'
import { indexUserManualHistory } from '@/services/modules/UserManualHistoryService'
import ProgressSpinner from 'primevue/progressspinner'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
let dataUserManualHistory = ref([])
const fetchingUserManuals = ref(false)

console.log(route.params)
onMounted(async () => {
  try {
    fetchingUserManuals.value = true
    const response = await indexUserManualHistory(route.params.id, route.params.historyId)
    if (response.status === 401) {
      router.push('/login')
      return response
    }
    return (dataUserManualHistory.value = response)
  } catch (e) {
    return e
  } finally {
    fetchingUserManuals.value = false
  }
})
</script>
