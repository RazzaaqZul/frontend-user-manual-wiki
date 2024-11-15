<template>
  <div
    class="w-[70%] sm:w-[80%] md:w-[70%] lg:w-[35%] relative h-full animate__animated animate__fadeIn"
  >
    <div
      class="text-soft-blue text-2xl mb-2 font-semibold w-fit flex flex-col justify-center gap-4"
    >
      <h1>Daftar Akun</h1>
    </div>

    <form @submit.prevent="handleSubmit" class="flex flex-col gap-2">
      <!-- Name Field -->
      <div class="name min-h-[6rem]">
        <label>Nama Lengkap <span class="text-red-custom font-extrabold">*</span></label>
        <div class="border-gradient">
          <input
            id="name"
            v-model="input.name"
            type="text"
            placeholder="Masukkan nama lengkap"
            :class="[inputStyle()]"
          />
        </div>
        <p v-if="errors?.name?.[0]" :class="[errorStyle()]">{{ errors.name[0] }}</p>
      </div>

      <!-- Email Field -->
      <div class="email min-h-[6rem]">
        <label>Alamat Email <span class="text-red-custom font-extrabold">*</span></label>
        <div class="border-gradient">
          <input
            id="email"
            v-model="input.email"
            type="email"
            placeholder="Masukkan alamat Email"
            :class="[inputStyle()]"
          />
        </div>
        <p v-if="errors?.email?.[0]" :class="[errorStyle()]">{{ errors.email[0] }}</p>
      </div>

      <!-- Password Field with Toggle Visibility -->
      <div class="password min-h-[6rem] flex flex-col">
        <label>Kata Sandi <span class="text-red-custom font-extrabold">*</span></label>
        <div class="border-gradient relative">
          <input
            id="password"
            v-model="input.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Masukkan kata sandi"
            oncopy="return false"
            onpaste="return false"
            oncut="return false"
            @focus="clearError"
            :class="[inputStyle()]"
          />
          <div class="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
            <img
              :src="showPassword ? eyesOpenIcon : eyesCloseIcon"
              alt="Toggle Password Visibility"
              class="cursor-pointer w-6 h-6"
              @click="togglePasswordVisibility('password')"
            />
          </div>
        </div>
        <label class="text-grey-word italic">
          Kata sandi harus terdiri dari 1 huruf kapital dan 1 angka
        </label>
        <p v-if="errors?.password?.[0]" :class="[errorStyle()]">{{ errors.password[0] }}</p>
      </div>

      <!-- Confirm Password Field with Toggle Visibility -->
      <div class="confirm password min-h-[6rem]">
        <label>Konfirmasi Kata Sandi <span class="text-red-custom font-extrabold">*</span></label>
        <div class="border-gradient relative">
          <input
            id="confirmPassword"
            v-model="input.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="Konfirmasi kata sandi"
            @focus="clearError"
            oncopy="return false"
            onpaste="return false"
            oncut="return false"
            :class="[inputStyle()]"
          />
          <div class="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
            <img
              :src="showConfirmPassword ? eyesOpenIcon : eyesCloseIcon"
              alt="Toggle Confirm Password Visibility"
              class="cursor-pointer w-6 h-6"
              @click="togglePasswordVisibility('confirmPassword')"
            />
          </div>
        </div>
        <p v-if="errors?.confirmPassword?.[0]" :class="[errorStyle()]">
          {{ errors.confirmPassword[0] }}
        </p>
      </div>

      <!-- Submit Button with Loading Spinner -->
      <button
        type="submit"
        class="bg-dark-blue text-white-background p-3 rounded-xl w-full"
        :disabled="loading"
      >
        <template v-if="loading">
          <ProgressSpinner
            style="width: 20px; height: 20px"
            strokeWidth="8"
            fill="transparent"
            animationDuration=".9s"
            aria-label="Custom ProgressSpinner"
          />
        </template>
        <template v-else> Buat Akun </template>
      </button>
    </form>
  </div>
</template>

<script setup>
import { userRegister } from '@/services/modules/AuthService'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import ProgressSpinner from 'primevue/progressspinner'

// Icons for eye toggle
import eyesOpenIcon from './../../assets/icon/icon-eyes-open.png'
import eyesCloseIcon from './../../assets/icon/icon-eyes-close.png'

const input = ref({
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  name: ''
})

const errors = ref({})
const loading = ref(false)

// States to toggle visibility for password fields
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const inputStyle = () =>
  'border-gradient-inner focus:outline-none focus:ring-2 focus:ring-soft-blue focus:border-transparent w-full '
const errorStyle = () => 'text-red-custom animate__animated animate__fadeInDown mx-[1rem] text-sm'

const router = useRouter()
const emit = defineEmits(['success', 'error'])

// Handle form submission
const handleSubmit = async () => {
  errors.value = {}
  if (input.value.password !== input.value.confirmPassword) {
    errors.value.confirmPassword = ['Kata sandi tidak cocok']
    emit('error', errors.value)
    return
  }

  loading.value = true
  try {
    const response = await userRegister(input.value)
    if (response.status === 400 && response.data?.errors) {
      errors.value = response.data.errors
      emit('error', errors.value)
    } else {
      errors.value = {}
      emit('success')
      setTimeout(() => router.push('/login'), 3000)
    }
  } catch (err) {
    console.error('Error while registering:', err)
  } finally {
    loading.value = false
  }
}

// Clear errors when focusing on input
const clearError = () => (errors.value = {})

// Toggle password visibility for each field
const togglePasswordVisibility = (field) => {
  if (field === 'password') showPassword.value = !showPassword.value
  else if (field === 'confirmPassword') showConfirmPassword.value = !showConfirmPassword.value
}
</script>

<style scoped>
/* Ensure container styles */
.border-gradient {
  position: relative;
  width: 100%;
}

.border-gradient-inner {
  padding: 0.75rem 3rem 0.75rem 1rem;
}
</style>
