<template>
  <div
    class="flex justify-center items-center absolute z-20 top-[40vh] sm:top-[17rem] md:top-[18rem] lg:top-[17rem] left-0 w-full"
  >
    <div
      class="bg-white-background rounded-xl h-[49rem] sm:h-[29rem] md:h-[23rem] w-[90%] md:w-[75%] shadow-2xl p-4 flex justify-center items-center"
    >
      <!-- Loading Spinner -->
      <LoadingSpinner v-if="fetchingUserManuals" />

      <!-- Error Message -->
      <div v-if="hasError" class="text-center text-red-500">
        <div
          class="flex flex-col gap-10 justify-center items-center h-[50vh] animate__animated animate__tada"
        >
          <img src="../../assets/images/image-search-not-found.png" class="w-[15%]" />
          <h1 class="font-semibold text-sm text-soft-blue">
            Cobalah membuat halaman Panduan Pengguna di wiki ini untuk membantu orang lain!
          </h1>
        </div>
      </div>

      <!-- User Manuals Grid -->
      <div
        v-else-if="dataUserManual.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 grid-rows-3"
      >
        <article
          v-for="(item, index) in dataUserManual.slice(0, 9)"
          :key="index"
          :class="getBorderClasses(index) + ' border-grey-background'"
        >
          <CardMenu
            :user_manual_id="String(item.user_manual_id)"
            :title="item.title"
            :img="item.img"
            :short_desc="item.short_desc"
            class="animate__animated animate__fadeIn"
          />
        </article>
      </div>

      <!-- Empty Message -->
    </div>

    <!-- See All Topics Button -->
    <RouterLink to="/main">
      <Button
        text="text-white-background"
        name="Lihat semua panduan pengguna"
        color="bg-soft-blue"
        icon="button-next.png"
        class="absolute top-[48rem] sm:top-[28rem] md:top-[22rem] left-1/2 transform -translate-x-1/2 mb-4 z-50"
      />
    </RouterLink>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import CardMenu from './LandingCard.vue'
import Button from './../ButtonComponent.vue'
import { RouterLink } from 'vue-router'
import { indexUserManual } from '@/services/modules/UserManualService'
import { getBorderClasses } from '@/helpers/MenuBorder'
import LoadingSpinner from '../widgets/LoadingSpinner.vue'

const dataUserManual = ref([])
const fetchingUserManuals = ref(false)
const hasError = ref(false)

onMounted(async () => {
  try {
    fetchingUserManuals.value = true
    const response = await indexUserManual()

    if (Array.isArray(response)) {
      dataUserManual.value = response
      hasError.value = false // No error if data is valid
    } else {
      console.error('Expected array, got:', response)
      hasError.value = true
    }
  } catch (error) {
    hasError.value = true // Set error flag on failure
  } finally {
    fetchingUserManuals.value = false
  }
})
</script>
