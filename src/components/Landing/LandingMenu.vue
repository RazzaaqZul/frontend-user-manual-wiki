<template>
  <div class="flex justify-center items-center absolute z-20 top-80 left-0 w-full h-60">
    <div
      class="bg-white-background rounded-xl w-[90%] md:w-[75%] h-80 shadow-2xl p-4 flex justify-center items-center"
    >
      <div
        v-if="dataUserManual.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 grid-rows-3"
      >
        <article
          v-for="(item, index) in dataUserManual.slice(0, 9)"
          :key="index"
          :class="getBorderClasses(index) + ' border-grey-background'"
        >
          <CardMenu :title="item.title" :img="item.img" :short_desc="item.short_desc" />
        </article>
      </div>
      <div v-else><LoadingSpinner /></div>
    </div>
    <!-- Ensure the button is centered at the bottom -->

    <RouterLink to="/main">
      <Button
        text="text-white-background"
        name="See all help topics"
        color="bg-soft-blue"
        icon="button-next.png"
        class="absolute bottom-[-90px] left-1/2 transform -translate-x-1/2 mb-4 z-50"
      >
      </Button>
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

let dataUserManual = ref([]) // reactive data
const fetchingUserManuals = ref(false)

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
</script>
