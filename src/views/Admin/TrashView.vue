<template>
  <TrashMain :userManualTrash="userManualTrash" />
</template>

<script setup>
import TrashMain from '@/components/Trash/TrashMain.vue'
import { trashUserManual } from '@/services/modules/TrashUserManualService'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
let userManualTrash = ref([])

// Flag to handle fetching state
const isFetching = ref(true)

onMounted(async () => {
  const response = await trashUserManual()
  console.log(response)
  if (response.status === 401 || response.status === 403) {
    console.log('Unauthorized')
    router.push(`/unauthenticated`)
  }
  console.log(response)
  userManualTrash.value = response
  isFetching.value = false // Set fetching to false after data is fetched
})
</script>
