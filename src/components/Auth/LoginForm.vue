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
      <!-- Error message for password -->
      <p v-if="errors.message" class="text-red-custom text-md capitalize my-6">
        {{ errors.message }}
      </p>
    </div>

    <!-- Login button -->
    <div class="mb-4">
      <button
        type="submit"
        class="w-full bg-dark-blue text-white-background font-bold py-3 px-4 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
      >
        LOG IN
      </button>
    </div>

    <!-- General error message (like 401 unauthorized) -->
    <!-- <p v-if="errors.general" class="text-red-custom text-center mt-3">{{ errors.general }}</p> -->

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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { userLogin } from '../../services/modules/AuthService'

// Define the input state
const input = ref({
  username: '',
  password: ''
})

// Error state
const errors = ref({
  message: ''
})

// Get the router instance
const router = useRouter()

// Method to handle form submission
const handleSubmit = async () => {
  // Reset errors
  errors.value = { username: '', password: '', general: '' }

  const response = await userLogin(input.value)

  console.log(!response.data)
  // If login is successful, navigate to "/main"
  if (response.data) {
    router.push('/main')
  } else if (response.errors) {
    console.log(response.errors[0])
    errors.value.message = response.errors[0]
  }
}

const inputStyle = () => {
  return 'border-gradient-inner focus:outline-none focus:ring-2 focus:ring-soft-blue focus:border-transparent w-full'
}

// Clear error when user focuses on input field
const clearError = () => {
  errors.value.message = ''
}
</script>
