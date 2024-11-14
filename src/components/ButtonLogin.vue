<template>
  <button
    @click="toggle"
    class="xl:bg-white-background xl:shadow-lg drop-shadow-lg w-fit flex justify-center items-center gap-3 rounded-3xl py-2 px-6 hover:scale-110 duration-150"
  >
    <div class="bg-gradient-color w-fit rounded-full p-2">
      <img src="../assets/icon/icon-user.png" :alt="'logo_user'" class="w-5" />
    </div>
    <h1 class="font-normal text-grey-word hidden xl:block">
      {{ userRole || 'Log In' }}
    </h1>
    <img src="../assets/icon/icon-arrow-right.png" :alt="'logo_user'" class="w-4 hidden xl:block" />
  </button>

  <Popover ref="popoverRef" class="ml-[30px]">
    <div class="flex flex-col gap-4">
      <div>
        <span class="font-semibold block mb-2 text-dark-blue">Opsi Akun</span>
        <ul class="list-none p-0 m-0 flex flex-col">
          <li
            v-for="option in filteredOptions"
            :key="option.name"
            class="flex items-center gap-2 px-2 py-2 hover:bg-emphasis cursor-pointer rounded-border"
            @click="selectOption(option)"
          >
            <div>
              <span class="font-medium text-soft-blue">{{ option.name }}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </Popover>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Popover from 'primevue/popover'
import { userLogout } from '@/services/modules/AuthService'

const router = useRouter()
const popoverRef = ref()
const selectedOption = ref(null)

// Get user data from localStorage with error handling
const getUserData = () => {
  try {
    const userData = localStorage.getItem('user')
    return userData ? JSON.parse(userData) : null
  } catch (error) {
    console.error('Error parsing user data:', error)
    return null
  }
}

// Computed property for user role
const userRole = computed(() => {
  const userData = getUserData()
  if (userData?.role === 'technical_writer') {
    return 'Technical Writer'
  } else if (userData?.role === 'admin') {
    return 'Admin'
  }
  return null
})

// Computed property for filtered options based on auth state
const filteredOptions = computed(() => {
  const isAuthenticated = !!getUserData()
  return isAuthenticated ? [{ name: 'Keluar' }] : [{ name: 'Masuk' }]
})

// Handle option selection
const selectOption = async (option) => {
  selectedOption.value = option
  popoverRef.value?.hide()

  if (option.name === 'Masuk') {
    router.push('/login')
  } else if (option.name === 'Keluar') {
    try {
      const response = await userLogout()
      console.log(response.status)
      if (response.status === 200 || response.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.go('/')
      }
    } catch (err) {
      return err
    }
  }
}

// Toggle popover
const toggle = (event) => {
  popoverRef.value?.toggle(event)
}
</script>
