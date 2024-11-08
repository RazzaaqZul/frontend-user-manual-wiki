<template>
  <UserMain :users="dataUsers"></UserMain>
</template>

<script setup>
import UserMain from '@/components/Auth/User/UserMain.vue'
import { showUsers } from '@/services/modules/UserService'
import { onMounted, ref } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'

const router = useRouter()
let dataUsers = ref([])
onMounted(async () => {
  const response = await showUsers()

  if (response.status === 401 || response.status === 403) {
    router.push('/login')
  }
  dataUsers.value = response
})

onBeforeRouteLeave((to, from, next) => {
  // Show a confirmation dialog
  const answer = confirm('Perubahan anda tidak akan disimpan')

  if (answer) {
    // Allow navigation
    next()
  } else {
    // Cancel navigation
    next(false)
  }
})
</script>
