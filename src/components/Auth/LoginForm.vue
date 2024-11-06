<template>
  <form @submit.prevent="handleSubmit" class="w-[35%]">
    <!-- Welcome message -->
    <h2 class="text-2xl font-semibold text-soft-blue mb-6">Welcome Back!</h2>

    <!-- Username field -->
    <div class="mb-4">
      <label>Username <span class="text-red-custom font-extrabold">*</span></label>
      <div class="border-gradient">
        <input
          id="username"
          v-model="input.username"
          type="text"
          placeholder="Enter your username"
          @focus="clearError"
          :class="[inputStyle()]"
        />
      </div>
    </div>
    <p
      v-if="errors?.username?.[0]"
      class="text-red-custom text-md capitalize my-2 animate__animated animate__fadeInDown"
    >
      {{ errors?.username?.[0] }}
    </p>

    <!-- Password field -->
    <div class="mb-4">
      <label>Password <span class="text-red-custom font-extrabold">*</span></label>
      <div class="border-gradient">
        <input
          id="password"
          v-model="input.password"
          type="password"
          placeholder="Enter your password"
          @focus="clearError"
          :class="[inputStyle()]"
        />
      </div>
      <p
        v-if="errors?.password?.[0]"
        class="text-red-custom text-md capitalize my-2 animate__animated animate__fadeInDown"
      >
        {{ errors?.password?.[0] }}
      </p>
      <p
        v-if="errors.message"
        class="text-red-custom text-md capitalize my-6 animate__animated animate__fadeInDown"
      >
        {{ errors.message }}
      </p>
    </div>

    <!-- Login button with loading spinner -->
    <div class="mb-4">
      <button
        type="submit"
        class="w-full bg-dark-blue text-white-background font-bold py-3 px-4 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
        :disabled="loading"
      >
        <template v-if="loading">
          <ProgressSpinner
            style="width: 25px; height: 25px"
            strokeWidth="8"
            fill="transparent"
            animationDuration=".9s"
            aria-label="Custom ProgressSpinner"
          />
        </template>
        <template v-else> LOG IN </template>
      </button>
    </div>

    <!-- Sign Up link -->
    <div class="text-center">
      <p class="text-sm text-gray-600">
        Don’t have an account?
        <RouterLink to="/register"> <span class="text-soft-blue">Sign Up</span> </RouterLink>
      </p>
    </div>
  </form>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import { useRouter } from 'vue-router'
import { userLogin } from '../../services/modules/AuthService'
import ProgressSpinner from 'primevue/progressspinner'

const emit = defineEmits(['success', 'error'])

const input = ref({
  username: '',
  password: ''
})

const errors = ref({
  username: null,
  password: null,
  message: null
})

const router = useRouter()
const loading = ref(false) // Loading state

const handleSubmit = async () => {
  errors.value = { username: '', password: '', general: '' }
  loading.value = true // Start loading

  try {
    const response = await userLogin(input.value)

    if (response.status === 400 && response.data?.errors) {
      errors.value = response.data.errors || ['Unknown error occurred']
      emit('error', errors.value)
    } else if (response.status === 401) {
      errors.value.message = 'Username or Password Wrong'
      emit('error', errors.value)
    } else {
      errors.value = []
      emit('success')
      setTimeout(() => {
        router.push('/main')
      }, 3000)
    }
  } catch (err) {
    console.error('Error while logging in:', err)
  } finally {
    loading.value = false // End loading
  }
}

const inputStyle = () => {
  return 'border-gradient-inner focus:outline-none focus:ring-2 focus:ring-soft-blue focus:border-transparent w-full'
}

const clearError = () => {
  errors.value.message = ''
  errors.value.username = ''
  errors.value.password = ''
}
</script>
